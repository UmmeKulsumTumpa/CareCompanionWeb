import db from "../config/db";
import { randomUUID } from "crypto";
import { Conversation } from "../types";

export async function create(userId: string, title: string): Promise<Conversation> {
    const [conversation] = await db<Conversation>("conversations")
        .insert({ id: randomUUID(), user_id: userId, title, created_at: new Date(), updated_at: new Date() })
        .returning("*");
    return conversation;
}

export async function findById(id: string): Promise<Conversation | undefined> {
    return db<Conversation>("conversations").where({ id }).first();
}

export async function findByUserId(userId: string): Promise<Conversation[]> {
    return db<Conversation>("conversations").where({ user_id: userId }).orderBy("updated_at", "desc");
}

export async function updateTimestamp(id: string): Promise<void> {
    await db<Conversation>("conversations").where({ id }).update({ updated_at: new Date() });
}

export async function updateTitle(id: string, title: string): Promise<void> {
    await db<Conversation>("conversations").where({ id }).update({ title, updated_at: new Date() });
}

export async function deleteById(id: string): Promise<void> {
    await db<Conversation>("conversations").where({ id }).delete();
}
