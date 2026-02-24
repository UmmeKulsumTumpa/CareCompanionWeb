import * as conversationRepository from "../repositories/conversation.repository";
import * as messageRepository from "../repositories/message.repository";
import * as guestSessionRepository from "../repositories/guest_session.repository";
import mlClient from "../utils/httpClient";
import env from "../config/env";
import { MLChatResponse } from "../types";

interface SendMessageParams {
    query: string;
    conversationId?: string;
    userId: string | null;
    guestSessionId: string | null;
}

export async function sendMessage({ query, conversationId, userId, guestSessionId }: SendMessageParams) {
    let chatHistory: { role: string; content: string }[] = [];
    let resolvedConversationId = conversationId;

    if (userId) {
        if (!resolvedConversationId) {
            const conversation = await conversationRepository.create(userId, query.slice(0, 60));
            resolvedConversationId = conversation.id;
        }

        const recentMessages = await messageRepository.getRecentMessages(
            resolvedConversationId!,
            env.chatHistoryLimit
        );
        chatHistory = recentMessages.map((m) => ({ role: m.role, content: m.content }));
    }

    const mlResponse = await mlClient.post<MLChatResponse>("/api/v1/chat", {
        query,
        chat_history: chatHistory,
        include_related_experiences: true,
    });

    const { answer, sources, related_experiences } = mlResponse.data;

    if (userId && resolvedConversationId) {
        await messageRepository.create({ conversationId: resolvedConversationId, role: "user", content: query });
        await messageRepository.create({
            conversationId: resolvedConversationId,
            role: "assistant",
            content: answer,
            relatedExperiences: related_experiences,
        });
        await conversationRepository.updateTimestamp(resolvedConversationId);
    }

    if (guestSessionId && !userId) {
        await guestSessionRepository.appendMessage(guestSessionId, { role: "user", content: query, timestamp: new Date().toISOString() });
        await guestSessionRepository.appendMessage(guestSessionId, {
            role: "assistant",
            content: answer,
            related_experiences,
            timestamp: new Date().toISOString(),
        });
    }

    return { answer, sources, related_experiences, conversationId: resolvedConversationId };
}

export async function getUserConversations(userId: string) {
    return conversationRepository.findByUserId(userId);
}

export async function getConversationMessages(conversationId: string, userId: string) {
    const conversation = await conversationRepository.findById(conversationId);
    if (!conversation || conversation.user_id !== userId) {
        throw Object.assign(new Error("Conversation not found"), { status: 404 });
    }
    return messageRepository.findByConversationId(conversationId);
}

export async function getGuestSessionMessages(guestSessionId: string) {
    const session = await guestSessionRepository.findById(guestSessionId);
    if (!session) {
        throw Object.assign(new Error("Session not found or expired"), { status: 404 });
    }
    return session.messages ?? [];
}
