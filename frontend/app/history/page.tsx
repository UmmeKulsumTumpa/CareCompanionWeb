"use client";

import { useEffect, useState } from "react";
import { List, Button, Empty } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getConversations } from "@/lib/api/chat";
import { Conversation } from "@/types";
import useAuthStore from "@/store/authStore";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function HistoryPage() {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        getConversations()
            .then(setConversations)
            .finally(() => setLoading(false));
    }, [isAuthenticated, router]);

    if (loading) return <LoadingSpinner fullPage />;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Chat History</h1>
                <Link href="/chat">
                    <Button type="primary">New Chat</Button>
                </Link>
            </div>

            {conversations.length === 0 ? (
                <Empty description="No conversations yet" />
            ) : (
                <List
                    dataSource={conversations}
                    renderItem={(conv) => (
                        <List.Item
                            key={conv.id}
                            className="cursor-pointer hover:bg-gray-50 rounded-xl px-4 transition-colors"
                            onClick={() => router.push(`/chat?id=${conv.id}`)}
                        >
                            <List.Item.Meta
                                avatar={<MessageOutlined className="text-blue-500 text-lg mt-1" />}
                                title={<span className="font-medium text-gray-800">{conv.title ?? "Conversation"}</span>}
                                description={new Date(conv.updated_at).toLocaleDateString()}
                            />
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
}
