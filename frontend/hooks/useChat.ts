"use client";

import { useState, useCallback } from "react";
import * as chatApi from "@/lib/api/chat";
import { Message, GuestMessage, RelatedExperience, SourceReference } from "@/types";
import useAuthStore from "@/store/authStore";

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: SourceReference[];
    related_experiences?: RelatedExperience[];
    timestamp: string;
}

export function useChat(conversationId?: string) {
    const { isAuthenticated } = useAuthStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);

    const sendMessage = useCallback(async (query: string) => {
        const userMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: query,
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);

        try {
            const response = await chatApi.sendMessage(query, currentConversationId);
            const assistantMsg: ChatMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: response.answer,
                sources: response.sources,
                related_experiences: response.related_experiences,
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
            if (response.conversationId) {
                setCurrentConversationId(response.conversationId);
            }
        } finally {
            setLoading(false);
        }
    }, [currentConversationId]);

    const loadHistory = useCallback(async (convId: string) => {
        if (!isAuthenticated) return;
        const msgs: Message[] = await chatApi.getConversationMessages(convId);
        const mapped: ChatMessage[] = msgs.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            related_experiences: m.related_experiences ?? [],
            timestamp: m.created_at,
        }));
        setMessages(mapped);
        setCurrentConversationId(convId);
    }, [isAuthenticated]);

    const loadGuestHistory = useCallback(async () => {
        const msgs: GuestMessage[] = await chatApi.getGuestHistory();
        const mapped: ChatMessage[] = msgs.map((m, i) => ({
            id: String(i),
            role: m.role,
            content: m.content,
            related_experiences: m.related_experiences,
            timestamp: m.timestamp,
        }));
        setMessages(mapped);
    }, []);

    return { messages, loading, currentConversationId, sendMessage, loadHistory, loadGuestHistory };
}
