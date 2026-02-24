import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await userService.getProfile(req.user!.id);
        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const user = await userService.updateProfile(req.user!.id, req.body);
        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
}
