import { Router } from "express";
import { requestOtpHandler, verifyOtpHandler } from "./auth.controller.ts";
const router = Router();

router.post("/request-otp", requestOtpHandler);
router.post("/verify-otp", verifyOtpHandler);

export default router;
