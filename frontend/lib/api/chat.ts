import apiClient from "../utils/apiClient";
import { SendMessageResponse, Conversation, Message } from "@/types";

interface ChatHistoryItem {
    role: string;
    content: string;
}

export async function sendMessage(
    query: string,
    conversationId?: string,
    guestChatHistory?: ChatHistoryItem[],
): Promise<SendMessageResponse> {
    const { data } = await apiClient.post<SendMessageResponse>("/chat", {
        query,
        conversationId,
        guestChatHistory,
    });
    return data;
}

export async function getConversations(): Promise<Conversation[]> {
    const { data } = await apiClient.get<{ conversations: Conversation[] }>("/chat/history");
    return data.conversations;
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
    const { data } = await apiClient.get<{ messages: Message[] }>(
        `/chat/history/conversations/${conversationId}`
    );
    return data.messages;
}

export async function deleteConversation(conversationId: string): Promise<void> {
    await apiClient.delete(`/chat/history/conversations/${conversationId}`);
}

export async function renameConversation(conversationId: string, title: string): Promise<void> {
    await apiClient.patch(`/chat/history/conversations/${conversationId}`, { title });
}
