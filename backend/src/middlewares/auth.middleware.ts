import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import env from "../config/env";

function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Authentication required" });
        return;
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token, env.jwt.accessSecret);

    if (!payload) {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
    }

    req.user = payload;
    next();
}

export default authMiddleware;
