"use client";

import { Button, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined, HistoryOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
    const { user, isAuthenticated, logout } = useAuth();

    const menuItems = [
        {
            key: "history",
            label: <Link href="/history">Chat History</Link>,
            icon: <HistoryOutlined />,
        },
        {
            key: "logout",
            label: "Sign Out",
            icon: <LogoutOutlined />,
            danger: true,
            onClick: logout,
        },
    ];

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
            <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-semibold text-blue-700">CareCompanion</span>
                <span className="text-xs text-gray-400 hidden sm:block">Alzheimer &amp; Dementia Support</span>
            </Link>

            <div className="flex items-center gap-3">
                {isAuthenticated && user ? (
                    <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
                        <Button icon={<UserOutlined />} type="text" className="flex items-center gap-1">
                            {user.name ?? user.email}
                        </Button>
                    </Dropdown>
                ) : (
                    <div className="flex gap-2">
                        <Link href="/login">
                            <Button type="text">Sign In</Button>
                        </Link>
                        <Link href="/register">
                            <Button type="primary">Register</Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
