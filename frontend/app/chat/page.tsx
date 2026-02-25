"use client";

import ChatWindow from "@/components/chat/ChatWindow";
import Sidebar from "@/components/layout/Sidebar";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

function ChatPageInner() {
    const params = useSearchParams();
    const router = useRouter();

    // Track the active conversation in local state so we can reset it
    // immediately when the user starts a new chat — without waiting for the
    // URL to update (router.push is async and would cause a second render
    // with the stale conversationId, preventing ChatWindow from remounting).
    const [activeConversationId, setActiveConversationId] = useState<string | undefined>(
        params.get("id") ?? undefined
    );
    const [chatKey, setChatKey] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Keep local state in sync when the URL changes (e.g. clicking a history item)
    useEffect(() => {
        setActiveConversationId(params.get("id") ?? undefined);
    }, [params]);

    // Persist sidebar state to localStorage
    useEffect(() => {
        const saved = localStorage.getItem("sidebarOpen");
        if (saved !== null) setSidebarOpen(saved === "true");
    }, []);

    function handleToggle() {
        setSidebarOpen((prev) => {
            const next = !prev;
            localStorage.setItem("sidebarOpen", String(next));
            return next;
        });
    }

    function handleNewChat() {
        // Clear the conversation immediately so ChatWindow unmounts/remounts
        // in the same render cycle — avoids the "2 clicks needed" bug where
        // the key changed but the conversationId prop was still the stale URL value.
        setActiveConversationId(undefined);
        setChatKey((k) => k + 1);
        router.push("/chat");
    }

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={handleToggle}
                onNewChat={handleNewChat}
            />
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <ChatWindow key={chatKey} conversationId={activeConversationId} />
            </main>
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
