import { create } from "zustand";

export const otpInputZustand = create((set) => ({
  isEmailModalOpen: false,
  isTimerActive: false,
  otp: new Array(6).fill(""),
  timeLeft: 0,

  setIsEmailModalOpen: (isEmailModalOpen) => set({ isEmailModalOpen }),
  setIsTimerActive: (isTimerActive) => set({ isTimerActive }),
  setOtpAtIndex: (index, value) =>
    set((state) => {
      const newOtp = [...state.otp];
      newOtp[index] = value;
      return { otp: newOtp };
    }),
  setTimeLeft: (timeLeft) => set({ timeLeft }),
  resetOtp: () => set({ otp: new Array(6).fill("") }),
}));
