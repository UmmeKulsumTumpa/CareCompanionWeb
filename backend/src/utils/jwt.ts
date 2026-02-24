import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";
import env from "../config/env";

export function generateAccessToken(payload: Pick<JwtPayload, "id" | "email">): string {
    return jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpiresIn } as jwt.SignOptions);
}

export function generateRefreshToken(payload: Pick<JwtPayload, "id" | "email">): string {
    return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string, secret: string): JwtPayload | null {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch {
        return null;
    }
}
