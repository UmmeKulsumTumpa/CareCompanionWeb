import db from "../config/db";
import { randomUUID } from "crypto";
import { Message, RelatedExperience } from "../types";

interface CreateMessageParams {
    conversationId: string;
    role: "user" | "assistant";
    content: string;
    relatedExperiences?: RelatedExperience[] | null;
}

export async function create(params: CreateMessageParams): Promise<Message> {
    const [message] = await db("messages")
        .insert({
            id: randomUUID(),
            conversation_id: params.conversationId,
            role: params.role,
            content: params.content,
            related_experiences: params.relatedExperiences ? JSON.stringify(params.relatedExperiences) : null,
            created_at: new Date(),
        })
        .returning("*");
    return message as Message;
}

export async function findByConversationId(conversationId: string): Promise<Message[]> {
    return db("messages").where({ conversation_id: conversationId }).orderBy("created_at", "asc") as Promise<Message[]>;
}

export async function getRecentMessages(conversationId: string, limit = 10): Promise<Message[]> {
    const messages = await db("messages")
        .where({ conversation_id: conversationId })
        .orderBy("created_at", "desc")
        .limit(limit) as unknown as Message[];
    return messages.reverse();
}
