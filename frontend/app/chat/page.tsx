"use client";

import ChatWindow from "@/components/chat/ChatWindow";
import Sidebar from "@/components/layout/Sidebar";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

function ChatPageInner() {
    const params = useSearchParams();
    const conversationId = params.get("id") ?? undefined;
    const [chatKey, setChatKey] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);

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
        setChatKey((k) => k + 1);
    }

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={handleToggle}
                onNewChat={handleNewChat}
            />
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <ChatWindow key={chatKey} conversationId={conversationId} />
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
