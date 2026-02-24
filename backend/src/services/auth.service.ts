import * as userRepository from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt";
import env from "../config/env";

export async function register(body: { name: string; email: string; password: string }) {
    const existing = await userRepository.findByEmail(body.email);
    if (existing) {
        const err = Object.assign(new Error("Email already in use"), { status: 409 });
        throw err;
    }

    const hashed = await hashPassword(body.password);
    const user = await userRepository.create({ name: body.name, email: body.email, password: hashed });

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    return { user: { id: user.id, name: user.name, email: user.email }, accessToken, refreshToken };
}

export async function login(body: { email: string; password: string }) {
    const user = await userRepository.findByEmail(body.email);
    if (!user) {
        throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }

    const valid = await comparePassword(body.password, user.password);
    if (!valid) {
        throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

    return { user: { id: user.id, name: user.name, email: user.email }, accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
        throw Object.assign(new Error("Refresh token required"), { status: 400 });
    }

    const payload = verifyToken(refreshToken, env.jwt.refreshSecret);
    if (!payload) {
        throw Object.assign(new Error("Invalid or expired refresh token"), { status: 401 });
    }

    const accessToken = generateAccessToken({ id: payload.id, email: payload.email });
    return { accessToken };
}
