"use client";

import { SourceReference } from "@/types";
import { LinkOutlined } from "@ant-design/icons";

interface MessageBubbleProps {
    role: "user" | "assistant";
    content: string;
    sources?: SourceReference[];
    children?: React.ReactNode;
}

export default function MessageBubble({ role, content, sources, children }: MessageBubbleProps) {
    const isUser = role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
            <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                    isUser
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                }`}
            >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>

                {!isUser && sources && sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-1">
                        {sources.map((s, i) => (
                            <a
                                key={i}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
                            >
                                <LinkOutlined />
                                {s.name}
                            </a>
                        ))}
                    </div>
                )}

                {!isUser && children}
            </div>
        </div>
    );
}
