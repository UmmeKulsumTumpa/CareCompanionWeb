"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import RelatedExperiences from "./RelatedExperiences";
import { useChat } from "@/hooks/useChat";
import { SparklesIcon } from "lucide-react";

interface ChatWindowProps {
    conversationId?: string;
}

const SUGGESTIONS = [
    "What are the best ways to manage sundowning behavior?",
    "How do I talk to someone with Alzheimer's who is confused?",
    "Tips for reducing caregiver burnout",
    "How to handle aggressive behavior in dementia",
];

export default function ChatWindow({ conversationId }: ChatWindowProps) {
    const { messages, loading, error, sendMessage, loadHistory } = useChat(conversationId);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (conversationId) loadHistory(conversationId);
    }, [conversationId, loadHistory]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const isEmpty = messages.length === 0 && !loading;

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4 pb-32">
                        <div className="w-12 h-12 rounded-2xl bg-[#10a37f] flex items-center justify-center mb-5 shadow-sm">
                            <SparklesIcon size={22} className="text-white" suppressHydrationWarning />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">How can I help you today?</h2>
                        <p className="text-sm text-gray-500 mb-8 max-w-sm">
                            Ask anything about caring for someone with Alzheimer&apos;s or dementia.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                            {SUGGESTIONS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => sendMessage(s)}
                                    disabled={loading}
                                    className="text-left px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-0">
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} role={msg.role} content={msg.content} sources={msg.sources}>
                                {msg.related_experiences && msg.related_experiences.length > 0 && (
                                    <RelatedExperiences experiences={msg.related_experiences} />
                                )}
                            </MessageBubble>
                        ))}
                        {loading && <TypingIndicator />}
                        {error && (
                            <div className="flex gap-3 mb-4 items-start">
                                <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-red-500 text-xs font-bold">!</span>
                                </div>
                                <div className="flex-1 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                )}

                {!isEmpty && <div ref={bottomRef} />}
            </div>

            {/* Input pinned to bottom */}
            <MessageInput onSend={sendMessage} disabled={loading} />
        </div>
    );
}
