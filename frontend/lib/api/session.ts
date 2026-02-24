import apiClient from "../utils/apiClient";

interface GuestSessionResponse {
    sessionId: string;
    expiresAt: string;
}

export async function createGuestSession(): Promise<GuestSessionResponse> {
    const { data } = await apiClient.post<GuestSessionResponse>("/sessions/guest");
    return data;
}
