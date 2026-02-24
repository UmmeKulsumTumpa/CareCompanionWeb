"use client";

import { useState, useEffect, useRef } from "react";
import { SourceReference } from "@/types";
import { LinkOutlined } from "@ant-design/icons";
import { SparklesIcon, CopyIcon, CheckIcon, Volume2Icon, VolumeXIcon } from "lucide-react";

interface MessageBubbleProps {
    role: "user" | "assistant";
    content: string;
    sources?: SourceReference[];
    children?: React.ReactNode;
}

function ActionBar({ content }: { content: string }) {
    const [copied, setCopied] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    // Stop speech if component unmounts
    useEffect(() => {
        return () => {
            if (utteranceRef.current) window.speechSynthesis?.cancel();
        };
    }, []);

    function handleCopy() {
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    function handleSpeak() {
        if (!window.speechSynthesis) return;

        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(content);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setSpeaking(true);
    }

    return (
        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
                onClick={handleCopy}
                title={copied ? "Copied!" : "Copy"}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
                {copied
                    ? <CheckIcon size={14} className="text-[#10a37f]" />
                    : <CopyIcon size={14} />
                }
            </button>
            <button
                onClick={handleSpeak}
                title={speaking ? "Stop reading" : "Read aloud"}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
                {speaking
                    ? <VolumeXIcon size={14} className="text-[#10a37f]" />
                    : <Volume2Icon size={14} />
                }
            </button>
        </div>
    );
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
        <div className="flex gap-3 mb-6 items-start group">
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

                <ActionBar content={content} />
            </div>
        </div>
    );
}
