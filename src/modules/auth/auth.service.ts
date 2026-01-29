import { hashOTP } from "../../utils/bcrypt.ts";
import { signJwt } from "../../utils/jwt.ts";
import { UserService } from "../user/user.service.ts";
import { type TOtpRecord, OtpStore } from "../../store/otp.store.ts";

export async function requestOtp(phone: string) {
  if (!phone) throw new Error("Invalid phone number");

  const otp = "123456"; // fake OTP

  const { generatedHash, uniqueSalt } = await hashOTP(otp);

  const record: TOtpRecord = {
    otpHash: generatedHash,
    uniqueSalt,
    expiresAt: Date.now() + 2 * 60 * 1000, // 2 mints
    attempts: 0,
  };

  console.log(record);

  OtpStore.saveOtp(phone, record);
}

export async function verifyOtp({
  phone,
  otp,
}: {
  phone: string;
  otp: string;
}) {
  if (!phone) throw new Error("Invalid phone number");
  if (!otp) throw new Error("Please provide otp");

  const record = OtpStore.getOtp(phone);

  if (!record) throw new Error("OTP not found");

  const { otpHash, uniqueSalt, attempts, expiresAt } = record;

  if (Date.now() > expiresAt) {
    OtpStore.deleteOtp(phone);
    throw new Error("OTP expired");
  }

  record.attempts++;

  if (attempts > 5) {
    OtpStore.deleteOtp(phone);
    throw new Error("Too many attempts");
  }

  const { generatedHash } = await hashOTP(otp, uniqueSalt);

  if (generatedHash !== otpHash) throw new Error("Invalid OTP");

  // delete the otp record
  OtpStore.deleteOtp(phone);

  let user = await UserService.getUserByPhone(phone);

  let isNewUser = false;

  if (!user) {
    user = await UserService.createUser({ phone });
    isNewUser = true;
  }

  const accessToken = signJwt({
    sub: user.id,
  });

  return {
    user,
    isNewUser,
    accessToken,
  };
}
