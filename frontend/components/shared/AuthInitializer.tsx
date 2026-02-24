"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * Silently verifies the stored access token on every page mount.
 * - If the token is valid → refreshes the user object in the store.
 * - If the token is expired but a refresh token exists, the apiClient
 *   interceptor will handle the silent refresh automatically.
 * - If both tokens are invalid → clears stale auth state so the user
 *   is properly shown as logged out.
 *
 * This component renders nothing. Place it once in the root layout.
 */
export default function AuthInitializer() {
    const { initializeAuth } = useAuth();

    useEffect(() => {
        initializeAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}
