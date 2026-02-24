import { configureStore } from "@reduxjs/toolkit";
import authReducer, { AuthState } from "./slices/authSlice";

// ── Persistence helpers ───────────────────────────────────────────────────────
// We only persist auth state (user + isAuthenticated). Tokens are kept in
// localStorage by saveTokens/clearTokens in lib/utils/token.ts.

const AUTH_STORAGE_KEY = "auth-storage";

function loadAuthState(): { auth: AuthState } | undefined {
    // Guard: localStorage is unavailable during SSR. The store/index module
    // can be evaluated on the server (as part of client-component SSR in
    // Next.js), so we must not touch window/localStorage there.
    if (typeof window === "undefined") return undefined;
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return undefined;
        return { auth: JSON.parse(raw) as AuthState };
    } catch {
        return undefined;
    }
}

function saveAuthState(state: AuthState): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    } catch {
        // ignore write errors (e.g. private browsing quota)
    }
}

// ── Store ─────────────────────────────────────────────────────────────────────
// preloadedState is loaded here when the module is first evaluated on the
// client. On the server this returns undefined so the store starts empty,
// which is correct — the Sidebar uses a `mounted` guard to avoid using
// auth state before client hydration.

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    preloadedState: loadAuthState(),
});

// Subscribe to persist auth state on every dispatch
store.subscribe(() => {
    saveAuthState(store.getState().auth);
});

// ── Types ─────────────────────────────────────────────────────────────────────

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
