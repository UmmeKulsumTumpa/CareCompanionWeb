import { Request, Response, NextFunction } from "express";
import * as sessionService from "../services/session.service";
import { verifyToken } from "../utils/jwt";
import env from "../config/env";

async function guestMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const payload = verifyToken(token, env.jwt.accessSecret);
        if (payload) {
            req.user = payload;
            next();
            return;
        }
    }

    const guestSessionId = req.headers["x-guest-session-id"] as string | undefined;
    if (guestSessionId) {
        const session = await sessionService.validateGuestSession(guestSessionId);
        if (session) {
            req.guestSessionId = guestSessionId;
            next();
            return;
        }
        res.status(401).json({ message: "Guest session expired or invalid" });
        return;
    }

    res.status(401).json({ message: "Authentication or guest session required" });
}

export default guestMiddleware;
