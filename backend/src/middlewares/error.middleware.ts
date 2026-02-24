import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
    status?: number;
}

function errorMiddleware(err: AppError, _req: Request, res: Response, _next: NextFunction): void {
    const status = err.status ?? 500;
    const message = err.message ?? "Internal server error";
    res.status(status).json({ message });
}

export default errorMiddleware;
