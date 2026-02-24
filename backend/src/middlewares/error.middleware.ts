import { Request, Response, NextFunction } from "express";
import { isAxiosError } from "axios";

interface AppError extends Error {
    status?: number;
}

function errorMiddleware(err: AppError, _req: Request, res: Response, _next: NextFunction): void {
    // Unwrap errors that came from an upstream Axios call (e.g. ML backend)
    if (isAxiosError(err)) {
        if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
            res.status(503).json({ message: "AI service is currently unavailable. Please try again shortly." });
            return;
        }
        if (err.code === "ECONNABORTED") {
            res.status(504).json({ message: "AI service took too long to respond. Please try again." });
            return;
        }
        const upstreamStatus = err.response?.status ?? 500;
        const upstreamMessage = (err.response?.data as any)?.detail
            ?? (err.response?.data as any)?.message
            ?? err.message
            ?? "AI service error";
        res.status(upstreamStatus >= 500 ? 502 : upstreamStatus).json({ message: upstreamMessage });
        return;
    }

    const status = err.status ?? 500;
    const message = err.message ?? "Internal server error";
    res.status(status).json({ message });
}

export default errorMiddleware;
