import { Request, Response, NextFunction } from "express";
import * as chatService from "../services/chat.service";

export async function sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { query, conversationId, guestChatHistory } = req.body;
        const userId = req.user?.id ?? null;
        const guestSessionId = req.guestSessionId ?? null;

        const result = await chatService.sendMessage({ query, conversationId, userId, guestSessionId, guestChatHistory });
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

export async function deleteConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        await chatService.deleteConversation(req.params.conversationId, req.user!.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

export async function renameConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { title } = req.body;
        if (!title || typeof title !== "string" || !title.trim()) {
            res.status(400).json({ message: "Title is required" });
            return;
        }
        await chatService.renameConversation(req.params.conversationId, req.user!.id, title);
        res.status(200).json({ message: "Renamed" });
    } catch (err) {
        next(err);
    }
}
