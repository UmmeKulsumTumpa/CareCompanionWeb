"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { ArrowUpIcon } from "lucide-react";

interface MessageInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    function handleSend() {
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setValue("");
        // Reset height
        if (textareaRef.current) textareaRef.current.style.height = "auto";
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    function handleInput() {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }

    const canSend = !!value.trim() && !disabled;

    return (
        <div className="sticky bottom-0 bg-white pb-4 pt-2">
            <div className="w-full max-w-3xl mx-auto px-4">
                <div className="relative flex items-end bg-white border border-gray-300 rounded-2xl shadow-sm hover:border-gray-400 focus-within:border-gray-400 transition-colors">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onInput={handleInput}
                        placeholder="Ask anything about caregiving…"
                        rows={1}
                        disabled={disabled}
                        className="flex-1 resize-none bg-transparent px-4 py-4 text-sm text-gray-900 placeholder-gray-400 outline-none leading-6 max-h-[200px] overflow-y-auto disabled:opacity-60"
                        style={{ height: "auto" }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!canSend}
                        title="Send message"
                        className={`m-2 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150 ${
                            canSend
                                ? "bg-gray-900 hover:bg-gray-700 text-white"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                    >
                        <ArrowUpIcon size={16} strokeWidth={2.5} />
                    </button>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">
                    CareCompanion can make mistakes. Verify important medical information.
                </p>
            </div>
        </div>
    );
}
