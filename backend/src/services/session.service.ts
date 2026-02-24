import * as guestSessionRepository from "../repositories/guest_session.repository";
import env from "../config/env";

export async function createGuestSession() {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + env.guestSessionTtlHours);
    return guestSessionRepository.create(expiresAt);
}

export async function validateGuestSession(sessionId: string) {
    const session = await guestSessionRepository.findById(sessionId);
    if (!session) return null;
    if (new Date(session.expires_at) < new Date()) {
        await guestSessionRepository.deleteById(sessionId);
        return null;
    }
    return session;
}
