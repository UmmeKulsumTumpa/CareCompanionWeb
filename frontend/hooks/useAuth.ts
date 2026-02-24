"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import * as authApi from "@/lib/api/auth";

export function useAuth() {
    const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function login(email: string, password: string) {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.login(email, password);
            setAuth(data.user, data.accessToken, data.refreshToken);
            router.push("/chat");
        } catch {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    }

    async function register(name: string, email: string, password: string) {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.register(name, email, password);
            setAuth(data.user, data.accessToken, data.refreshToken);
            router.push("/chat");
        } catch {
            setError("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        await authApi.logout();
        clearAuth();
        router.push("/");
    }

    return { user, isAuthenticated, loading, error, login, register, logout };
}
