import bcrypt from "bcrypt";

const OTP_SECRET = process.env.OTP_SECRET ?? "randomotpsecret";

export async function hashOTP(OTP: string, salt?: string) {
  const uniqueSalt = salt ? salt : await bcrypt.genSalt(11);

  const saltUsedForHash = uniqueSalt + OTP_SECRET;

  const generatedHash = await bcrypt.hash(OTP, saltUsedForHash);

  return {
    generatedHash,
    uniqueSalt,
  };
}
