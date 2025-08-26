import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { fetcherMuatrans } from "@/lib/axios";
import { fetcherMuatransCS } from "@/lib/fetcherBasicAuth";
import { zustandDevtools } from "@/lib/utils";

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return phoneNumber;
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  if (cleanNumber.startsWith("0")) {
    return `62${cleanNumber.substring(1)}`;
  }
  if (cleanNumber.startsWith("62")) {
    return cleanNumber;
  }
  if (cleanNumber.startsWith("8")) {
    return `62${cleanNumber}`;
  }
  return cleanNumber;
};

const defaultValues = {
  verificationMethod: null,
  verificationData: null,
  hasVerified: false,
  expiresIn: null,
  target: null,
  maskedTarget: null,
  token: null,
  otpType: null,
  purpose: null,
  step: null,
  newTarget: null,
};

export const useRequestOtpProfilStore = create(
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
          initializeFromUrlParams: (params) => {
            const expiresIn = params.get("expiresIn")
              ? new Date(decodeURIComponent(params.get("expiresIn")))
              : null;
            set((state) => ({
              formValues: {
                ...state.formValues,
                token: params.get("token"),
                target: params.get("whatsapp"),
                purpose: "FORGOT_PASSWORD",
                otpType: "WHATSAPP",
                expiresIn,
              },
            }));
          },
          reset: () =>
            set({
              formValues: defaultValues,
              params: null,
            }),
          setParams: (params) =>
            set(() => ({
              params,
            })),
          sendRequestOtp: async (
            target,
            otpType,
            purpose,
            step,
            newTarget = null
          ) => {
            const formValues = get().formValues;
            try {
              const formattedTarget =
                purpose === "CHANGE_EMAIL" ? target : formatPhoneNumber(target);
              const formattedNewTarget =
                purpose === "CHANGE_EMAIL" && newTarget
                  ? newTarget
                  : formatPhoneNumber(newTarget);
              const requestData = {
                target: formattedTarget,
                otpType,
                purpose,
                step,
                ...(formattedNewTarget && { newTarget: formattedNewTarget }),
              };
              const response = await fetcherMuatrans
                .post("/v1/transporter/auth/otp/generate", requestData)
                .catch((error) => {
                  throw new Error(
                    error?.response?.data?.Message?.Text || "Failed to send OTP"
                  );
                });
              const data = response.data;
              if (
                data?.Message?.Code === 200 ||
                data?.Data.Message?.Code === 200
              ) {
                const otpData = data.Data;
                const expiresIn = otpData?.expiresIn
                  ? new Date(otpData.expiresIn)
                  : null;
                set({
                  formValues: {
                    ...formValues,
                    target: otpData.target,
                    maskedTarget: otpData.maskedTarget,
                    token: otpData.token,
                    otpType: otpData.otpType,
                    purpose: otpData.purpose,
                    step: otpData.step,
                    newTarget: otpData.newTarget,
                    expiresIn,
                  },
                });
              }
            } catch (error) {
              throw new Error(error.message || "Failed to send OTP");
            }
          },
          verifyOtp: async (otp) => {
            const formValues = get().formValues;
            const { token, target, otpType, purpose } = formValues;
            if (!token || !target) {
              throw new Error("Missing required OTP data");
            }
            if (purpose === "FORGOT_PASSWORD") {
              const response = await fetcherMuatrans
                .post("/v1/transporter/auth/forgot-password/verify", {
                  token,
                  otpCode: otp,
                })
                .catch((error) => {
                  const resMessage = error.response?.data?.Message?.Text;
                  let errorMessage = "Gagal melakukan verifikasi OTP";
                  if (resMessage?.includes("salah"))
                    errorMessage = "messageIncorrectOtp";
                  if (resMessage?.includes("expired"))
                    errorMessage = "messageOtpCodeExpired";
                  if (resMessage?.includes("berakhir"))
                    errorMessage = "messageOtpVerifEndedNeedResend";
                  throw new Error(errorMessage);
                });
              const data = response.data;
              if (data?.Message?.Code === 200) {
                set({
                  formValues: {
                    ...formValues,
                    hasVerified: true,
                    token: response.data.Data.verificationToken,
                  },
                });
                return;
              }
              return;
            }
            const isEmailVerification = purpose === "EMAIL_VERIFICATION";
            let response;
            if (isEmailVerification) {
              response = await fetcherMuatransCS
                .post("/v1/transporter/auth/verify-otp", {
                  phoneNumber: target,
                  otpCode: otp,
                  token: token,
                })
                .catch((error) => {
                  const resMessage = error.response?.data?.Message?.Text;
                  let errorMessage = "Gagal melakukan verifikasi OTP";
                  if (resMessage?.includes("salah"))
                    errorMessage = "messageIncorrectOtp";
                  if (resMessage?.includes("expired"))
                    errorMessage = "messageOtpCodeExpired";
                  if (resMessage?.includes("berakhir"))
                    errorMessage = "messageOtpVerifEndedNeedResend";
                  throw new Error(errorMessage);
                });
            } else {
              if (!otpType) {
                throw new Error("Missing required OTP data");
              }
              response = await fetcherMuatrans
                .post("/v1/transporter/auth/otp/verify", {
                  token,
                  otpCode: otp,
                  target,
                  otpType,
                })
                .catch((error) => {
                  const resMessage = error.response?.data?.Message?.Text;
                  let errorMessage = "Gagal melakukan verifikasi OTP";
                  if (resMessage?.includes("salah"))
                    errorMessage = "messageIncorrectOtp";
                  if (resMessage?.includes("expired"))
                    errorMessage = "messageOtpCodeExpired";
                  if (resMessage?.includes("berakhir"))
                    errorMessage = "messageOtpVerifEndedNeedResend";
                  throw new Error(errorMessage);
                });
            }
            const data = response.data;
            if (
              data?.Message?.Code === 200 ||
              data?.Data.Message?.Code === 200
            ) {
              set({
                formValues: {
                  ...formValues,
                  hasVerified: true,
                  token: response.data.Data.verificationToken,
                },
              });
            }
          },
          updateWhatsAppNumber: async (phoneNumber = null) => {
            const formValues = get().formValues;
            const { token, target, purpose } = formValues;
            const isEmailVerification = purpose === "EMAIL_VERIFICATION";
            let response;
            if (isEmailVerification) {
              response = await fetcherMuatransCS
                .put("/v1/transporter/auth/change-phone-number", {
                  phoneNumber: phoneNumber,
                  token: token,
                })
                .catch((error) => {
                  throw new Error(
                    error?.response?.data?.Data?.errors?.[0]?.message ||
                      error?.response?.data?.Message?.Text ||
                      "Gagal mengupdate nomor WhatsApp"
                  );
                });
            } else {
              const formattedPhoneNumber = formatPhoneNumber(target);
              response = await fetcherMuatrans
                .put("/v1/transporter/profile/whatsapp", {
                  phoneNumber: formattedPhoneNumber,
                  verificationToken: token,
                })
                .catch((error) => {
                  throw new Error(
                    error?.response?.data?.Data?.errors?.[0]?.message ||
                      error?.response?.data?.Message?.Text ||
                      "Gagal mengupdate nomor WhatsApp"
                  );
                });
            }
            const data = response.data;
            if (data?.Data?.phoneNumber) {
              set({
                formValues: {
                  ...formValues,
                  target: data.Data.phoneNumber,
                },
              });
            }
            return data;
          },
          updateEmailAddress: async () => {
            const formValues = get().formValues;
            const { token, target } = formValues;
            const response = await fetcherMuatrans
              .put("/v1/transporter/profile/email", {
                email: target,
                verificationToken: token,
              })
              .catch((error) => {
                throw new Error(
                  error?.response?.data?.Data?.errors?.[0]?.message ||
                    error?.response?.data?.Message?.Text ||
                    "Gagal mengupdate email"
                );
              });
            return response.data;
          },
          resendOtp: async () => {
            const formValues = get().formValues;
            const { token, target, otpType, purpose } = formValues;

            try {
              const isEmailVerification = purpose === "EMAIL_VERIFICATION";
              let response;

              if (isEmailVerification) {
                response = await fetcherMuatransCS
                  .post("v1/transporter/auth/resend-otp", {
                    phoneNumber: target,
                    token: token,
                  })
                  .catch((error) => {
                    const resMessage = error.response?.data?.Message?.Text;
                    let errorMessage = "Gagal mengirim ulang OTP";
                    if (
                      resMessage?.includes("rate limit") ||
                      resMessage?.includes("Tunggu")
                    ) {
                      errorMessage = "Tunggu 30 detik sebelum kirim ulang";
                    }
                    throw new Error(errorMessage);
                  });
              } else {
                if (!otpType) {
                  throw new Error("Missing required OTP data");
                }
                const formattedTarget = formatPhoneNumber(target);
                const requestData = {
                  otpId: token,
                  target: formattedTarget,
                  otpType,
                };
                response = await fetcherMuatrans
                  .post("/v1/transporter/auth/otp/resend", requestData)
                  .catch((error) => {
                    const resMessage = error.response?.data?.Message?.Text;
                    let errorMessage = "Gagal mengirim ulang OTP";
                    if (
                      resMessage?.includes("rate limit") ||
                      resMessage?.includes("Tunggu")
                    ) {
                      errorMessage = "Tunggu 30 detik sebelum kirim ulang";
                    }
                    throw new Error(errorMessage);
                  });
              }

              const data = response.data;
              if (data?.Message?.Code === 201) {
                const otpData = data.Data;
                const expiresIn = otpData?.expiresIn
                  ? new Date(otpData.expiresIn)
                  : null;
                const nextResendAt = otpData.nextResendAt
                  ? new Date(otpData.nextResendAt)
                  : null;

                set({
                  formValues: {
                    ...formValues,
                    target: otpData.target || otpData.phoneNumber,
                    maskedTarget: otpData.maskedTarget,
                    token: otpData.newOtpId || otpData.token,
                    otpType: otpData.otpType,
                    expiresIn,
                    nextResendAt,
                  },
                });
                return data;
              } else {
                throw new Error(
                  data?.Message?.Text || "Gagal mengirim ulang OTP"
                );
              }
            } catch (error) {
              throw new Error(error.message || "Gagal mengirim ulang OTP");
            }
          },
        },
      }),
      {
        name: "t-otptransporter",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          formValues: state.formValues,
          params: state.params,
        }),
      }
    ),
    {
      name: "request-otp-profil-store",
    }
  )
);

export const useRequestOtpProfilActions = () =>
  useRequestOtpProfilStore((state) => state.actions);

export const useRequestOtpProfilExpiresIn = () =>
  useRequestOtpProfilStore((state) => state.formValues.expiresIn);

export const useRequestOtpProfilFormValues = () =>
  useRequestOtpProfilStore((state) => state.formValues);

export const useRequestOtpActions = () =>
  useRequestOtpProfilStore((state) => state.actions);

export const useRequestOtpStore = () =>
  useRequestOtpProfilStore((state) => state.formValues);

export const useRequestOtpProfilData = () =>
  useRequestOtpProfilStore(
    (state) => {
      const { formValues } = state;
      return {
        otpId: formValues.otpId,
        target: formValues.target,
        maskedTarget: formValues.maskedTarget,
        otpType: formValues.otpType,
        purpose: formValues.purpose,
        step: formValues.step,
        newTarget: formValues.newTarget,
        message: formValues.message,
        instructions: formValues.instructions,
        deliveryStatus: formValues.deliveryStatus,
        token: formValues.token,
        expiresIn: formValues.expiresIn,
        expiresAt: formValues.expiresAt,
        nextResendAt: formValues.nextResendAt,
      };
    },
    (a, b) =>
      a.otpId === b.otpId &&
      a.target === b.target &&
      a.maskedTarget === b.maskedTarget &&
      a.otpType === b.otpType &&
      a.purpose === b.purpose &&
      a.step === b.step &&
      a.newTarget === b.newTarget &&
      a.message === b.message &&
      a.instructions === b.instructions &&
      a.deliveryStatus === b.deliveryStatus &&
      a.token === b.token &&
      a.expiresIn === b.expiresIn &&
      a.expiresAt === b.expiresAt &&
      a.nextResendAt === b.nextResendAt
  );

export const useRequestOtpProfilStatus = () =>
  useRequestOtpProfilStore(
    (state) => {
      const { formValues } = state;
      return {
        isLoading: state.isLoading,
        error: state.error,
        remainingAttempts: formValues.remainingAttempts,
        nextStepRequired: formValues.nextStepRequired,
        verificationToken: formValues.verificationToken,
        isVerified: formValues.isVerified,
      };
    },
    (a, b) =>
      a.isLoading === b.isLoading &&
      a.error === b.error &&
      a.remainingAttempts === b.remainingAttempts &&
      a.nextStepRequired === b.nextStepRequired &&
      a.verificationToken === b.verificationToken &&
      a.isVerified === b.isVerified
  );

export const useRequestOtpProfilRateLimit = () =>
  useRequestOtpProfilStore(
    (state) => {
      return {
        retryAfter: state.retryAfter,
        requestCount: state.requestCount,
        resetTime: state.resetTime,
      };
    },
    (a, b) =>
      a.retryAfter === b.retryAfter &&
      a.requestCount === b.requestCount &&
      a.resetTime === b.resetTime
  );
