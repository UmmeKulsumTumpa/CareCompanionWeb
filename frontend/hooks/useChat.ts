"use client";

import { useState, useCallback } from "react";
import * as chatApi from "@/lib/api/chat";
import { Message, RelatedExperience, SourceReference } from "@/types";
import { useAppSelector } from "@/store/hooks";
import { useGuestSession } from "@/hooks/useGuestSession";
import { getGuestSessionId } from "@/lib/utils/guestSession";

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: SourceReference[];
    related_experiences?: RelatedExperience[];
    timestamp: string;
}

export function useChat(conversationId?: string) {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const { startGuestSession } = useGuestSession();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);

    const sendMessage = useCallback(async (query: string) => {
        // Ensure a guest session exists before sending if the user is not logged in
        if (!isAuthenticated && !getGuestSessionId()) {
            await startGuestSession();
        }

        // Snapshot current history BEFORE adding the new user message.
        // For guests this is forwarded to the backend so the ML model has context.
        const historySnapshot = messages.map((m) => ({ role: m.role, content: m.content }));

        const userMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: query,
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);
        setError(null);

        try {
            const response = await chatApi.sendMessage(query, currentConversationId, historySnapshot);
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
                // If this is a brand-new conversation, notify the sidebar to refresh its list
                if (!currentConversationId) {
                    window.dispatchEvent(
                        new CustomEvent("conversation-created", { detail: { id: response.conversationId } })
                    );
                }
                setCurrentConversationId(response.conversationId);
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message ?? err?.message ?? "Something went wrong. Please try again.";
            setError(msg);
            // Remove the optimistic user message so the user can retry
            setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        } finally {
            setLoading(false);
        }
    }, [messages, currentConversationId, isAuthenticated, startGuestSession]);

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
        // Guest messages are not persisted — nothing to load
    }, []);

    return { messages, loading, error, currentConversationId, sendMessage, loadHistory, loadGuestHistory };
}
