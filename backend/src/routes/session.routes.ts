import { Router } from "express";
import * as sessionController from "../controllers/session.controller";

const router = Router();

router.post("/guest", sessionController.createGuestSession);

export default router;
