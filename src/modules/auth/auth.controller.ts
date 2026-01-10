import type { Request, Response } from "express";
import { requestOtp, verifyOtp } from "./auth.service.ts";

export async function requestOtpHandler(req: Request, res: Response) {
  try {
    const { phone } = req.body;
    await requestOtp(phone);
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ success: false, error: e.message });
  }
}

export async function verifyOtpHandler(req: Request, res: Response) {
  try {
    const { phone, otp } = req.body;

    const result = await verifyOtp({
      phone,
      otp,
    });

    res.json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error?.message ?? "" });
  }
}
