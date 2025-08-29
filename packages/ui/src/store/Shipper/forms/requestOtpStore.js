import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { fetcherMuatparts } from "@/lib/axios";
import { zustandDevtools } from "@/lib/utils";

const defaultValues = {
  verificationMethod: null,
  verificationData: null,
  hasVerified: false,
  expiresIn: null,
};

export const useRequestOtpStore = create(
  zustandDevtools(
    persist(
      (set, get) => ({
        formValues: defaultValues,
        params: null,
        actions: {
          setField: (field, value) =>
            set((state) => ({
              formValues: {
                ...state.formValues,
                [field]: value,
              },
            })),
          reset: () =>
            set({
              formValues: defaultValues,
              params: null,
            }),
          setParams: (params) =>
            set(() => ({
              params,
            })),
          sendRequestOtp: async () => {
            const formValues = get().formValues;

            if (!formValues.verificationMethod) {
              throw new Error("Verification method is required");
            }

            const response = await fetcherMuatparts
              .post(
                formValues.verificationMethod === "email"
                  ? "v1/send_otp_email"
                  : "v1/send_otp_wa",
                {
                  type: formValues.verificationMethod === "email" ? 19 : 20,
                }
              )
              .catch((error) => {
                throw new Error(error?.response?.data?.Data?.Message);
              });
            const expiresInSeconds = response.data?.Data?.expiresIn;
            const expiresIn = new Date(Date.now() + expiresInSeconds * 1000);

            set({
              formValues: {
                ...formValues,
                expiresIn,
              },
            });
          },
          verifyOtp: async (otp) => {
            const formValues = get().formValues;
            const response = await fetcherMuatparts
              .post(
                formValues.verificationMethod === "email"
                  ? "v1/verify_otp_email"
                  : "v1/verify_otp_wa",
                {
                  otp,
                  type: formValues.verificationMethod === "email" ? 19 : 20,
                }
              )
              .catch((error) => {
                const resMessage = error.response.data?.Data?.Message;
                let errorMessage = "Gagal melakukan verifikasi OTP";
                if (resMessage === "OTP yang anda masukkan salah")
                  errorMessage = "messageIncorrectOtp";
                if (resMessage === "OTP yang Anda masukkan telah expired!")
                  errorMessage = "messageOtpCodeExpired";
                if (
                  resMessage ===
                  "Waktu verifikasi telah berakhir, silahkan kirim verifikasi ulang"
                )
                  errorMessage = "messageOtpVerifEndedNeedResend";
                throw new Error(errorMessage);
              });

            set({
              formValues: {
                ...formValues,
                hasVerified: true,
              },
            });
          },
        },
      }),
      {
        name: "t-otprek",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          formValues: state.formValues,
          params: state.params,
        }),
      }
    ),
    {
      name: "request-otp-store",
    }
  )
);

export const useRequestOtpActions = () => {
  const { setField, reset, setParams, sendRequestOtp, verifyOtp } =
    useRequestOtpStore((state) => state.actions);

  return {
    setField,
    reset,
    setParams,
    sendRequestOtp,
    verifyOtp,
  };
};
