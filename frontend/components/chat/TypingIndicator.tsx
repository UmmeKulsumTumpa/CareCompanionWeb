"use client";

import { SparklesIcon } from "lucide-react";

export default function TypingIndicator() {
    return (
        <div className="flex gap-3 mb-6 items-start">
            <div className="w-7 h-7 rounded-full bg-[#10a37f] flex items-center justify-center shrink-0 mt-0.5">
                <SparklesIcon size={13} className="text-white" />
            </div>
            <div className="flex items-center gap-1 pt-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            </div>
        </div>
    );
}
