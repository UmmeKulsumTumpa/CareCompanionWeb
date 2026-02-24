import apiClient from "../utils/apiClient";
import { SendMessageResponse, Conversation, Message, GuestMessage } from "@/types";

export async function sendMessage(query: string, conversationId?: string): Promise<SendMessageResponse> {
    const { data } = await apiClient.post<SendMessageResponse>("/chat", { query, conversationId });
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

export async function getGuestHistory(): Promise<GuestMessage[]> {
    const { data } = await apiClient.get<{ messages: GuestMessage[] }>("/chat/guest-history");
    return data.messages;
}
