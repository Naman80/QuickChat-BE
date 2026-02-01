export type TOtpRecord = {
  otpHash: string;
  uniqueSalt: string;
  expiresAt: number;
  attempts: number;
};

const otpStore = new Map<string, TOtpRecord>();

export const OtpStore = {
  saveOtp(phone: string, record: TOtpRecord) {
    otpStore.set(phone, record);
  },

  getOtp(phone: string) {
    return otpStore.get(phone);
  },

  deleteOtp(phone: string) {
    console.log(otpStore);
    otpStore.delete(phone);
  },
};
