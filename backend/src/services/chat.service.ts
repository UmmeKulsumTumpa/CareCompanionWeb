import * as conversationRepository from "../repositories/conversation.repository";
import * as messageRepository from "../repositories/message.repository";
import mlClient from "../utils/httpClient";
import env from "../config/env";
import { MLChatResponse } from "../types";

interface SendMessageParams {
    query: string;
    conversationId?: string;
    userId: string | null;
    guestSessionId: string | null;
    guestChatHistory?: { role: string; content: string }[];
}

export async function sendMessage({ query, conversationId, userId, guestSessionId, guestChatHistory }: SendMessageParams) {
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
    } else if (guestSessionId && guestChatHistory) {
        // Guests have no DB history — use history forwarded from the browser.
        // Limit to last N turns to match the authenticated user behaviour.
        chatHistory = guestChatHistory.slice(-env.chatHistoryLimit);
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

    // Guest chats are intentionally not persisted to the database.
    // The guest session exists only for middleware authentication purposes.

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

export async function deleteConversation(conversationId: string, userId: string): Promise<void> {
    const conversation = await conversationRepository.findById(conversationId);
    if (!conversation || conversation.user_id !== userId) {
        throw Object.assign(new Error("Conversation not found"), { status: 404 });
    }
    // Messages are deleted automatically via ON DELETE CASCADE on the DB
    await conversationRepository.deleteById(conversationId);
}

export async function renameConversation(conversationId: string, userId: string, title: string): Promise<void> {
    const conversation = await conversationRepository.findById(conversationId);
    if (!conversation || conversation.user_id !== userId) {
        throw Object.assign(new Error("Conversation not found"), { status: 404 });
    }
    await conversationRepository.updateTitle(conversationId, title.trim().slice(0, 100));
}
