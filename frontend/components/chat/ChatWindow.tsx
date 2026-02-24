"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import RelatedExperiences from "./RelatedExperiences";
import { useChat } from "@/hooks/useChat";
import { MessageSquare } from "lucide-react";

interface ChatWindowProps {
    conversationId?: string;
}

export default function ChatWindow({ conversationId }: ChatWindowProps) {
    const { messages, loading, sendMessage, loadHistory } = useChat(conversationId);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (conversationId) loadHistory(conversationId);
    }, [conversationId, loadHistory]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto px-4 pt-4">
                {messages.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-3">
                        <MessageSquare size={48} strokeWidth={1} />
                        <p className="text-lg font-medium">How can I help you today?</p>
                        <p className="text-sm max-w-sm">
                            Ask me anything about caring for someone with Alzheimer&apos;s or dementia.
                        </p>
                    </div>
                )}

                {messages.map((msg) => (
                    <MessageBubble key={msg.id} role={msg.role} content={msg.content} sources={msg.sources}>
                        {msg.related_experiences && msg.related_experiences.length > 0 && (
                            <RelatedExperiences experiences={msg.related_experiences} />
                        )}
                    </MessageBubble>
                ))}

                {loading && <TypingIndicator />}
                <div ref={bottomRef} />
            </div>

            <MessageInput onSend={sendMessage} disabled={loading} />
        </div>
    );
}
