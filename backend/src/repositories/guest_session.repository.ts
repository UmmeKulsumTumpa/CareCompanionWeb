import db from "../config/db";
import { randomUUID } from "crypto";
import { GuestSession, GuestMessage } from "../types";

export async function create(expiresAt: Date): Promise<GuestSession> {
    const [session] = await db("guest_sessions")
        .insert({ id: randomUUID(), created_at: new Date(), expires_at: expiresAt, messages: JSON.stringify([]) })
        .returning("*");
    return session as GuestSession;
}

export async function findById(id: string): Promise<GuestSession | undefined> {
    return db("guest_sessions").where({ id }).first() as Promise<GuestSession | undefined>;
}

export async function appendMessage(id: string, message: Omit<GuestMessage, "timestamp"> & { timestamp: string; related_experiences?: unknown }): Promise<void> {
    const session = await findById(id);
    if (!session) return;

    const messages: GuestMessage[] = Array.isArray(session.messages) ? session.messages : [];
    messages.push(message as GuestMessage);

    await db("guest_sessions").where({ id }).update({ messages: JSON.stringify(messages) });
}

export async function deleteById(id: string): Promise<void> {
    await db("guest_sessions").where({ id }).delete();
}

export async function deleteExpired(): Promise<void> {
    await db("guest_sessions").where("expires_at", "<", new Date()).delete();
}
