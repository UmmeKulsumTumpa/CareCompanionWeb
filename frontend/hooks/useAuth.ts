"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setAuth, setUser, clearAuth } from "@/store/slices/authSlice";
import * as authApi from "@/lib/api/auth";
import apiClient from "@/lib/utils/apiClient";
import { saveTokens, clearTokens } from "@/lib/utils/token";
import { clearGuestSession } from "@/lib/utils/guestSession";
import { User } from "@/types";

export function useAuth() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function login(email: string, password: string) {
        setLoading(true);
        setError(null);
        try {
            const data = await authApi.login(email, password);
            saveTokens(data.accessToken, data.refreshToken);
            clearGuestSession();
            dispatch(setAuth({ user: data.user }));
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
            saveTokens(data.accessToken, data.refreshToken);
            clearGuestSession();
            dispatch(setAuth({ user: data.user }));
            router.push("/chat");
        } catch {
            setError("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        await authApi.logout();
        clearTokens();
        dispatch(clearAuth());
        router.push("/");
    }

    /**
     * Called once on mount (via AuthInitializer).
     * Verifies the stored access token by calling /user/profile.
     * - Success → refreshes user object in store.
     * - 401     → tokens are truly invalid; clear auth state.
     * - Any other error (network, 5xx, etc.) → leave auth state untouched
     *   so a temporary backend hiccup doesn't log the user out.
     */
    async function initializeAuth() {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
        if (!token) return;

        try {
            const { data } = await apiClient.get<{ user: User }>("/user/profile");
            dispatch(setUser(data.user));
        } catch (err: unknown) {
            // Only treat a genuine 401 as "logged out". Network errors, 5xx,
            // etc. keep the existing auth state so the user isn't kicked out.
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status === 401) {
                clearTokens();
                dispatch(clearAuth());
            }
            // Otherwise: silently ignore — persisted user data remains valid.
        }
    }

    return { user, isAuthenticated, loading, error, login, register, logout, initializeAuth };
}
