import { Router } from "express";
import { requestOtpHandler, verifyOtpHandler } from "./auth.controller.ts";

const router = Router();

router.post("/auth/request-otp", requestOtpHandler);
router.post("/auth/verify-otp", verifyOtpHandler);

export default router;
