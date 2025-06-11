import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const otpRekeningZustand = create(
  persist(
    (set) => ({
      dataToast: {},
      email: "",
      isSuccessRekeningPencairan: false,
      telpon: "",
      formData: {},
      setDataToast: (dataToast) => set({ dataToast }),
      setIsSuccessRekeningPencairan: (isSuccessRekeningPencairan) =>
        set({ isSuccessRekeningPencairan }),
      setEmail: (val) =>
        set({
          email: val,
          telpon: "",
        }),
      setTelpon: (val) =>
        set({
          email: "",
          telpon: val,
        }),
      setFormData: (formData) => set({ formData }),
      resetOtpRekening: () =>
        set({
          dataToast: {},
          email: "",
          isSuccessRekeningPencairan: false,
          telpon: "",
          formData: {},
        }),
    }),
    {
      name: "t-otprek",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
