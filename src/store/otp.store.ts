interface OtpRecord {
  phone: string;
  otpHash: string;
  uniqueSalt: string;
  expiresAt: number;
  attempts: number;
}

const otpStore = new Map<string, OtpRecord>();

export function saveOtp(record: OtpRecord) {
  otpStore.set(record.phone, record);
}

export function getOtp(phone: string) {
  return otpStore.get(phone);
}

export function deleteOtp(phone: string) {
  console.log(otpStore);
  otpStore.delete(phone);
}
