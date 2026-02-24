import * as userRepository from "../repositories/user.repository";

export async function getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
        throw Object.assign(new Error("User not found"), { status: 404 });
    }
    return { id: user.id, name: user.name, email: user.email, createdAt: user.created_at };
}

export async function updateProfile(userId: string, fields: { name?: string }) {
    const updated = await userRepository.update(userId, fields);
    return { id: updated.id, name: updated.name, email: updated.email };
}
