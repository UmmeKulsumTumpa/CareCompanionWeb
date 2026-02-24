"use client";

import { useState, useEffect } from "react";
import * as sessionApi from "@/lib/api/session";
import { saveGuestSessionId, getGuestSessionId } from "@/lib/utils/guestSession";

export function useGuestSession() {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const existing = getGuestSessionId();
        if (existing) setSessionId(existing);
    }, []);

    async function startGuestSession() {
        setLoading(true);
        try {
            const { sessionId: id } = await sessionApi.createGuestSession();
            saveGuestSessionId(id);
            setSessionId(id);
            return id;
        } finally {
            setLoading(false);
        }
    }

    return { sessionId, loading, startGuestSession };
}
