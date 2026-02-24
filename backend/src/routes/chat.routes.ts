import { Router } from "express";
import * as chatController from "../controllers/chat.controller";
import authMiddleware from "../middlewares/auth.middleware";
import guestMiddleware from "../middlewares/guest.middleware";
import validate from "../middlewares/validate.middleware";
import { chatMessageSchema } from "../validators/chat.validator";

const router = Router();

router.post("/", validate(chatMessageSchema), guestMiddleware, chatController.sendMessage);
router.get("/history", authMiddleware, chatController.getHistory);
router.get("/history/conversations/:conversationId", authMiddleware, chatController.getConversationMessages);
router.get("/guest-history", guestMiddleware, chatController.getGuestHistory);

export default router;
