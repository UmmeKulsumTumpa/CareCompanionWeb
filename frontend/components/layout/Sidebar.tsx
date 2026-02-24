"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getConversations } from "@/lib/api/chat";
import { Conversation } from "@/types";
import {
    PlusIcon,
    MessageSquareIcon,
    LogOutIcon,
    UserIcon,
    ChevronDownIcon,
    PanelLeftIcon,
} from "lucide-react";

interface SidebarProps {
    onNewChat?: () => void;
    isOpen: boolean;
    onToggle: () => void;
}

function groupConversations(convs: Conversation[]) {
    const now = new Date();
    const today: Conversation[] = [];
    const yesterday: Conversation[] = [];
    const last7: Conversation[] = [];
    const older: Conversation[] = [];

    convs.forEach((c) => {
        const d = new Date(c.updated_at);
        const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) today.push(c);
        else if (diffDays === 1) yesterday.push(c);
        else if (diffDays <= 7) last7.push(c);
        else older.push(c);
    });

    return { today, yesterday, last7, older };
}

export default function Sidebar({ onNewChat, isOpen, onToggle }: SidebarProps) {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const params = useSearchParams();
    const activeId = params.get("id");

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loadingConvs, setLoadingConvs] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const fetchConversations = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoadingConvs(true);
        try {
            const data = await getConversations();
            setConversations(data);
        } finally {
            setLoadingConvs(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    function handleNewChat() {
        onNewChat?.();
        router.push("/chat");
    }

    function handleSelectConv(id: string) {
        router.push(`/chat?id=${id}`);
    }

    async function handleLogout() {
        setUserMenuOpen(false);
        await logout();
    }

    const grouped = groupConversations(conversations);

    const ConvGroup = ({ label, items }: { label: string; items: Conversation[] }) => {
        if (items.length === 0) return null;
        return (
            <div className="mb-2">
                <p className="px-3 py-1 text-xs font-medium text-gray-500">{label}</p>
                {items.map((conv) => (
                    <button
                        key={conv.id}
                        onClick={() => handleSelectConv(conv.id)}
                        title={conv.title ?? "Conversation"}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors duration-150 flex items-center gap-2 group ${
                            activeId === conv.id
                                ? "bg-gray-200 text-gray-900 font-medium"
                                : "text-gray-700 hover:bg-(--sidebar-hover)"
                        }`}
                    >
                        <MessageSquareIcon size={14} className="shrink-0 text-gray-400 group-hover:text-gray-600" suppressHydrationWarning />
                        <span className="truncate">{conv.title ?? "Conversation"}</span>
                    </button>
                ))}
            </div>
        );
    };

    /* ── Collapsed strip (icon-only) ── */
    if (!isOpen) {
        return (
            <aside className="flex flex-col h-screen w-14 shrink-0 bg-[#f9f9f9] border-r border-(--border-color) items-center py-3 gap-2 select-none transition-all duration-200">
                {/* Toggle open */}
                <button
                    onClick={onToggle}
                    title="Open sidebar"
                    className="p-2 rounded-lg hover:bg-(--sidebar-hover) text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <PanelLeftIcon size={18} suppressHydrationWarning />
                </button>

                {/* New chat */}
                <button
                    onClick={handleNewChat}
                    title="New chat"
                    className="p-2 rounded-lg hover:bg-(--sidebar-hover) text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <PlusIcon size={18} suppressHydrationWarning />
                </button>

                {/* Spacer + avatar at bottom */}
                <div className="flex-1" />
                {isAuthenticated && user ? (
                    <div
                        title={user.name ?? user.email}
                        className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mb-1 cursor-default"
                    >
                        <span className="text-white text-xs font-bold uppercase">
                            {(user.name ?? user.email ?? "U")[0]}
                        </span>
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mb-1">
                        <UserIcon size={14} className="text-gray-600" suppressHydrationWarning />
                    </div>
                )}
            </aside>
        );
    }

    /* ── Expanded sidebar ── */
    return (
        <aside className="flex flex-col h-screen w-65 shrink-0 bg-[#f9f9f9] border-r border-(--border-color) select-none transition-all duration-200">
            {/* Top: toggle + logo + new chat */}
            <div className="flex items-center justify-between px-3 pt-3 pb-2">
                <div className="flex items-center gap-1">
                    {/* Toggle closed */}
                    <button
                        onClick={onToggle}
                        title="Close sidebar"
                        className="p-2 rounded-lg hover:bg-(--sidebar-hover) text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <PanelLeftIcon size={18} suppressHydrationWarning />
                    </button>
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 px-1 py-1 rounded-lg hover:bg-(--sidebar-hover) transition-colors"
                    >
                        <div className="w-6 h-6 rounded-full bg-[#10a37f] flex items-center justify-center shrink-0">
                            <span className="text-white text-[10px] font-bold">C</span>
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">CareCompanion</span>
                    </Link>
                </div>
                <button
                    onClick={handleNewChat}
                    title="New chat"
                    className="p-2 rounded-lg hover:bg-(--sidebar-hover) text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <PlusIcon size={18} suppressHydrationWarning />
                </button>
            </div>

            {/* History */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
                {!isAuthenticated ? (
                    <div className="px-3 py-4 text-center">
                        <p className="text-xs text-gray-500 mb-3">Sign in to save your chat history</p>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/login"
                                className="block w-full text-center py-2 px-4 rounded-lg text-sm font-medium bg-[#10a37f] text-white hover:bg-[#0d8f6e] transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="block w-full text-center py-2 px-4 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-(--sidebar-hover) transition-colors"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                ) : loadingConvs ? (
                    <div className="flex justify-center py-8">
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    </div>
                ) : conversations.length === 0 ? (
                    <p className="px-3 py-4 text-xs text-gray-400 text-center">No conversations yet</p>
                ) : (
                    <>
                        <ConvGroup label="Today" items={grouped.today} />
                        <ConvGroup label="Yesterday" items={grouped.yesterday} />
                        <ConvGroup label="Previous 7 Days" items={grouped.last7} />
                        <ConvGroup label="Older" items={grouped.older} />
                    </>
                )}
            </div>

            {/* Bottom: user info */}
            {isAuthenticated && user && (
                <div className="px-2 pb-3 border-t border-(--border-color) pt-2 relative">
                    <button
                        onClick={() => setUserMenuOpen((v) => !v)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-(--sidebar-hover) transition-colors text-left"
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                            <span className="text-white text-xs font-bold uppercase">
                                {(user.name ?? user.email ?? "U")[0]}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{user.name ?? user.email}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <ChevronDownIcon
                            size={14}
                            className={`shrink-0 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                            suppressHydrationWarning
                        />
                    </button>

                    {userMenuOpen && (
                        <div className="absolute bottom-full left-2 right-2 mb-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOutIcon size={15} suppressHydrationWarning />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            )}

            {!isAuthenticated && (
                <div className="px-2 pb-3 border-t border-(--border-color) pt-2">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                            <UserIcon size={14} className="text-gray-600" suppressHydrationWarning />
                        </div>
                        <p className="text-sm text-gray-500">Guest</p>
                    </div>
                </div>
            )}
        </aside>
    );
}
