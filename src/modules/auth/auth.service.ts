import { randomUUID } from "crypto";
import { hashOTP } from "../../utils/bcrypt.ts";
import { signJwt } from "../../utils/jwt.ts";
import { deleteOtp, getOtp, saveOtp } from "../../store/otp.store.ts";
import { createUser, findUserByPhone } from "../../store/user.store.ts";

export async function requestOtp(phone: string) {
  if (!phone) throw new Error("Invalid phone number");

  const otp = "123456"; // fake OTP

  const { generatedHash, uniqueSalt } = await hashOTP(otp);

  const record = {
    phone,
    otpHash: generatedHash,
    uniqueSalt,
    expiresAt: Date.now() + 2 * 60 * 1000, // 2 mints
    attempts: 0,
  };

  console.log(record);

  saveOtp(record);
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

  const record = getOtp(phone);

  if (!record) throw new Error("OTP not found");

  const { otpHash, uniqueSalt, attempts, expiresAt } = record;

  if (Date.now() > expiresAt) throw new Error("OTP expired");

  record.attempts++;

  if (attempts > 5) throw new Error("Too many attempts");

  const { generatedHash } = await hashOTP(otp, uniqueSalt);

  if (generatedHash !== otpHash) throw new Error("Invalid OTP");

  deleteOtp(phone);

  let userDetails = findUserByPhone(phone);

  if (!userDetails) {
    userDetails = createUser({
      userId: randomUUID(),
      phone,
      createdAt: Date.now(),
    });
  }

  const accessToken = signJwt({ sub: userDetails.userId });

  return { accessToken, userDetails };
}
