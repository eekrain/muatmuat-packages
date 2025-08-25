"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { useVerifyEmailVerification } from "@/services/Transporter/auth/verifyEmailVerification";
import { useRequestOtpProfilActions } from "@/store/Transporter/forms/requestOtpProfilStore";

const SetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  // Get email and token from URL params
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  // SWR mutation hook for API call
  const {
    trigger: verifyEmail,
    isMutating,
    error,
  } = useVerifyEmailVerification();

  // Store actions for saving OTP data
  const { setField } = useRequestOtpProfilActions();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  useEffect(() => {
    trigger("confirmPassword");
  }, [passwordValue, trigger]);

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible((prev) => !prev);

  const onSubmit = async (data) => {
    try {
      // Prepare request body according to API contract
      const requestBody = {
        email: email,
        token: token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      // Call API
      const response = await verifyEmail(requestBody);
      console.log(response, "verifyemail");
      const { phoneNumber, token: otpToken, expiresIn } = response.data.Data;

      // Save response data to store
      setField("target", phoneNumber);
      setField("token", otpToken);
      setField("expiresIn", expiresIn);
      setField("otpType", "WHATSAPP");
      setField("purpose", "EMAIL_VERIFICATION");
      setField("step", "VERIFY_OTP");

      // Redirect to OTP page without parameters
      router.push("/otp");
      if (response.data.Message.Code === 201) {
        // Extract phoneNumber and token from response
      }
    } catch (error) {
      console.error("Email verification failed:", error);
    }
    console.log("tes");
  };

  const getErrorMessage = () => {
    if (errors.password) return errors.password.message;
    if (errors.confirmPassword) return errors.confirmPassword.message;
    return null;
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="relative flex min-h-screen items-start justify-center bg-primary-700 p-4">
      <div className="absolute left-0 top-0 hidden md:block">
        <Image
          src="/img/meteor1.png"
          alt={t(
            "SetPasswordPage.altDecorationTopLeft",
            null,
            "Dekorasi Kiri Atas"
          )}
          width={160}
          height={160}
        />
      </div>
      <div className="absolute bottom-0 right-0 hidden md:block">
        <Image
          src="/img/meteor2.png"
          alt={t(
            "SetPasswordPage.altDecorationBottomRight",
            null,
            "Dekorasi Kanan Bawah"
          )}
          width={160}
          height={160}
        />
      </div>

      <div className="absolute top-12 mb-10 flex flex-col items-center">
        <Image
          src="/img/otp-transporter/muatmuat.svg"
          alt={t("SetPasswordPage.altLogoMuatMuat", null, "Logo MuatMuat")}
          width={200}
          height={56}
        />
        <p className="mt-2 text-xs font-bold text-white">
          {t("SetPasswordPage.tagline", null, "Jalan Mudah Bersama")}
        </p>
      </div>

      <div className="z-10 flex w-full max-w-lg flex-col items-center pt-32 text-center">
        <div className="mb-6">
          <Image
            src="/icons/set-password.svg"
            alt={t(
              "SetPasswordPage.altEmailVerification",
              null,
              "Verifikasi Email Berhasil"
            )}
            width={200}
            height={221}
          />
        </div>

        {isDirty && errorMessage && (
          <div className="mb-5 flex w-full max-w-md items-center justify-center gap-2.5 rounded-md border border-error-500 bg-error-50 px-3 py-4">
            <IconComponent
              src="/icons/info16.svg"
              className="text-error-500"
              width={24}
              height={24}
            />
            <span className="max-w-xs text-xs font-semibold text-neutral-900">
              {errorMessage}
            </span>
          </div>
        )}

        <h1 className="mb-6 text-2xl font-bold text-white">
          {t(
            "SetPasswordPage.titleEmailVerificationSuccess",
            null,
            "Verifikasi Email Berhasil"
          )}
        </h1>
        <p className="mb-6 max-w-md font-medium text-white">
          {t(
            "SetPasswordPage.descriptionSetPassword",
            null,
            "Email kamu berhasil didaftarkan, mohon buat password untuk akun kamu dibawah"
          )}
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[440px]"
        >
          <div className="flex flex-col gap-4">
            <Input
              {...register("password", {
                required: t(
                  "SetPasswordPage.errorPasswordRequired",
                  null,
                  "Password wajib diisi."
                ),
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                  message: t(
                    "SetPasswordPage.errorPasswordInvalid",
                    null,
                    "Password harus terdapat huruf besar, kecil dan angka. Minimal 8 karakter"
                  ),
                },
              })}
              type={isPasswordVisible ? "text" : "password"}
              placeholder={t(
                "SetPasswordPage.placeholderPassword",
                null,
                "Password"
              )}
              appearance={{
                iconClassName: "!size-5",
                containerClassName: "!h-11",
              }}
              icon={{
                left: "/icons/password-login.svg",
                right: (
                  <button type="button" onClick={togglePasswordVisibility}>
                    <IconComponent
                      src={
                        isPasswordVisible
                          ? "/icons/eye.svg"
                          : "/icons/eye-off.svg"
                      }
                      alt={t(
                        "SetPasswordPage.altToggleVisibility",
                        null,
                        "Toggle visibility"
                      )}
                      width={20}
                      height={20}
                    />
                  </button>
                ),
              }}
            />

            <Input
              {...register("confirmPassword", {
                required: t(
                  "SetPasswordPage.errorConfirmPasswordRequired",
                  null,
                  "Konfirmasi Password wajib diisi."
                ),
                validate: (value) =>
                  value === passwordValue ||
                  t(
                    "SetPasswordPage.errorPasswordMismatch",
                    null,
                    "Password tidak sama"
                  ),
              })}
              type={isConfirmPasswordVisible ? "text" : "password"}
              appearance={{
                iconClassName: "!size-5",
                containerClassName: "!h-11",
              }}
              placeholder={t(
                "SetPasswordPage.placeholderConfirmPassword",
                null,
                "Konfirmasi Password"
              )}
              icon={{
                left: "/icons/password-login.svg",
                right: (
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    <IconComponent
                      src={
                        isConfirmPasswordVisible
                          ? "/icons/eye.svg"
                          : "/icons/eye-off.svg"
                      }
                      alt={t(
                        "SetPasswordPage.altToggleVisibility",
                        null,
                        "Toggle visibility"
                      )}
                      width={20}
                      height={20}
                    />
                  </button>
                ),
              }}
            />
          </div>

          <Button
            type="submit"
            disabled={!isValid}
            className="mx-auto mt-4 !h-10 w-[200px] text-buyer-seller-900 disabled:text-[#868686]"
            variant={isValid ? "muattrans-primary" : "default"}
          >
            {t("SetPasswordPage.buttonContinue", null, "Lanjutkan")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordPage;
