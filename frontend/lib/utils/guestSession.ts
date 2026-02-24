export function saveGuestSessionId(sessionId: string): void {
    sessionStorage.setItem("guestSessionId", sessionId);
}

export function getGuestSessionId(): string | null {
    return sessionStorage.getItem("guestSessionId");
}

export function clearGuestSession(): void {
    sessionStorage.removeItem("guestSessionId");
}
