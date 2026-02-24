import { Request, Response, NextFunction } from "express";
import * as chatService from "../services/chat.service";

export async function sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { query, conversationId } = req.body;
        const userId = req.user?.id ?? null;
        const guestSessionId = req.guestSessionId ?? null;

        const result = await chatService.sendMessage({ query, conversationId, userId, guestSessionId });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

export async function getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const conversations = await chatService.getUserConversations(req.user!.id);
        res.status(200).json({ conversations });
    } catch (err) {
        next(err);
    }
}

export async function getConversationMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const conversationId = req.params.conversationId as string;
        const messages = await chatService.getConversationMessages(conversationId, req.user!.id);
        res.status(200).json({ messages });
    } catch (err) {
        next(err);
    }
}

export async function getGuestHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const messages = await chatService.getGuestSessionMessages(req.guestSessionId!);
        res.status(200).json({ messages });
    } catch (err) {
        next(err);
    }
}
