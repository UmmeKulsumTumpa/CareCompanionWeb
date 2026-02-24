"use client";

import { create } from "zustand";
import { User } from "@/types";
import { saveTokens, clearTokens } from "@/lib/utils/token";
import { clearGuestSession } from "@/lib/utils/guestSession";

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    clearAuth: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,

    setAuth: (user, accessToken, refreshToken) => {
        saveTokens(accessToken, refreshToken);
        clearGuestSession();
        set({ user, isAuthenticated: true });
    },

    clearAuth: () => {
        clearTokens();
        set({ user: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
