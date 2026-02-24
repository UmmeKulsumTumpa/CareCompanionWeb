import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        /** Called after a successful login or register. */
        setAuth(state, action: PayloadAction<{ user: User }>) {
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        /** Called by AuthInitializer to restore a validated user on reload. */
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        /** Called on logout or when token validation fails. */
        clearAuth(state) {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setAuth, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
