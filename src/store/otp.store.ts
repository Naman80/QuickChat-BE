interface OtpRecord {
  phone: string;
  otpHash: string;
  uniqueSalt: string;
  expiresAt: number;
  attempts: number;
}

const otpStore = new Map<string, OtpRecord>();

export const OtpStore = {
  saveOtp(record: OtpRecord) {
    otpStore.set(record.phone, record);
  },
  getOtp(phone: string) {
    return otpStore.get(phone);
  },

  deleteOtp(phone: string) {
    console.log(otpStore);
    otpStore.delete(phone);
  },
};
