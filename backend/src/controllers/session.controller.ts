import { Request, Response, NextFunction } from "express";
import * as sessionService from "../services/session.service";

export async function createGuestSession(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const session = await sessionService.createGuestSession();
        res.status(201).json({ sessionId: session.id, expiresAt: session.expires_at });
    } catch (err) {
        next(err);
    }
}
