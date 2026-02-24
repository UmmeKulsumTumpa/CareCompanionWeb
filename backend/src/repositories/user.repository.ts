import db from "../config/db";
import { randomUUID } from "crypto";
import { User } from "../types";

export async function findByEmail(email: string): Promise<User | undefined> {
    return db<User>("users").where({ email }).first();
}

export async function findById(id: string): Promise<User | undefined> {
    return db<User>("users").where({ id }).first();
}

export async function create(data: { name: string; email: string; password: string }): Promise<User> {
    const [user] = await db("users")
        .insert({ id: randomUUID(), ...data, created_at: new Date() })
        .returning(["id", "name", "email", "created_at"]);
    return user as User;
}

export async function update(id: string, fields: Partial<Pick<User, "name">>): Promise<User> {
    const [user] = await db("users").where({ id }).update(fields).returning(["id", "name", "email"]);
    return user as User;
}
