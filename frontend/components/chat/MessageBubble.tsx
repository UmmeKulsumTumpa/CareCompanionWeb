"use client";

import { SourceReference } from "@/types";
import { LinkOutlined } from "@ant-design/icons";
import { SparklesIcon } from "lucide-react";

interface MessageBubbleProps {
    role: "user" | "assistant";
    content: string;
    sources?: SourceReference[];
    children?: React.ReactNode;
}

export default function MessageBubble({ role, content, sources, children }: MessageBubbleProps) {
    const isUser = role === "user";

    if (isUser) {
        return (
            <div className="flex justify-end mb-4">
                <div className="max-w-[75%] bg-[#f4f4f4] text-gray-900 rounded-3xl px-5 py-3">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-3 mb-6 items-start">
            {/* AI avatar */}
            <div className="w-7 h-7 rounded-full bg-[#10a37f] flex items-center justify-center shrink-0 mt-0.5">
                <SparklesIcon size={13} className="text-white" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm leading-7 text-gray-900 whitespace-pre-wrap">{content}</p>

                {sources && sources.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {sources.map((s, i) => (
                            <a
                                key={i}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-[#10a37f] border border-[#10a37f]/30 rounded-full px-3 py-1 hover:bg-[#10a37f]/5 transition-colors"
                            >
                                <LinkOutlined className="text-[10px]" />
                                {s.name}
                            </a>
                        ))}
                    </div>
                )}

                {children}
            </div>
        </div>
    );
}
