"use client";

import ChatWindow from "@/components/chat/ChatWindow";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ChatPageInner() {
    const params = useSearchParams();
    const conversationId = params.get("id") ?? undefined;
    return (
        <div className="flex flex-col h-[calc(100vh-64px)]">
            <ChatWindow conversationId={conversationId} />
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense>
            <ChatPageInner />
        </Suspense>
    );
}
