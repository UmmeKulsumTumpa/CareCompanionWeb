import { Router } from "express";
import authRoutes from "./auth.routes";
import chatRoutes from "./chat.routes";
import userRoutes from "./user.routes";
import sessionRoutes from "./session.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/chat", chatRoutes);
router.use("/user", userRoutes);
router.use("/sessions", sessionRoutes);

export default router;
