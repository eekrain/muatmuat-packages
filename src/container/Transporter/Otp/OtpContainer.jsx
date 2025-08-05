"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { addMinutes, isAfter } from "date-fns";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import Button from "@/components/Button/Button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/Form/OtpInput";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useCountdown } from "@/hooks/use-countdown";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useLoadingAction } from "@/store/Shared/loadingStore";
import {
  useRequestOtpActions,
  useRequestOtpStore,
} from "@/store/Shipper/forms/requestOtpStore";

import ChangeWhatsappModal from "./ChangeWhatsappModal";

const OtpContainer = ({
  _dontRedirect = false,
  onVerifySuccess = () => {},
}) => {
  const router = useRouter();
  const { t, isTranslationsReady } = useTranslation();
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isChangeNumberModalOpen, setIsChangeNumberModalOpen] = useState(false);

  const { formValues } = useRequestOtpStore();
  const { sendRequestOtp, verifyOtp } = useRequestOtpActions();

  // Create a default expiry date (2 minutes from now) if no expiry is provided
  const defaultExpiryDate = useMemo(() => {
    return formValues?.expiresIn
      ? formValues.expiresIn
      : addMinutes(new Date(), 2);
  }, [formValues?.expiresIn]);

  const { countdown, isCountdownFinished } = useCountdown({
    endingDate: defaultExpiryDate,
    isNeedCountdown: true, // Always need countdown with default value
    withHours: false, // Only show minutes:seconds format (xx:xx)
  });

  const { setIsGlobalLoading } = useLoadingAction();
  useEffect(() => {
    if (isTranslationsReady) setIsGlobalLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTranslationsReady]);

  const [isReady] = useState(false);
  //   useShallowCompareEffect(() => {
  //     // This is to prevent the page to be accessed if there are no correct data
  //     const timer = setTimeout(() => {
  //       if (
  //         (!formValues?.verificationMethod || !formValues?.verificationData) &&
  //         !dontRedirect
  //       ) {
  //         router.push("/");
  //         return;
  //       }
  //       setIsReady(true);
  //     }, 100);

  //     return () => clearTimeout(timer);
  //   }, [formValues]);

  const handleRequestOtp = (formValues) => {
    if (!formValues?.expiresIn || isAfter(Date.now(), formValues?.expiresIn)) {
      sendRequestOtp().catch((_error) => {
        toast.error("Gagal meminta request OTP");
      });
    }
  };

  const hasFetchedOtp = useRef(false);
  useShallowCompareEffect(() => {
    if (!isReady) return;
    if (hasFetchedOtp.current) return;
    handleRequestOtp(formValues);
    hasFetchedOtp.current = true;
  }, [isReady, formValues]);

  const [notification, setNotification] = useState(null);
  useEffect(() => {
    // Verify OTP if the OTP is 6 digits
    if (otp.length === 6) {
      setNotification(null);

      verifyOtp(otp)
        .then(() => {
          // Set verification success state
          setIsVerified(true);
          onVerifySuccess();
          // Don't redirect immediately - show success UI instead
        })
        .catch((error) => {
          setNotification({
            status: "error",
            message: error?.message,
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  return (
    <div className="relative flex min-h-screen bg-primary-700">
      {/* Left meteor */}
      <div className="absolute left-0 top-0">
        <img src="/img/meteor1.png" alt="meteor1" width={160} height={160} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center">
        <div
          className={`flex w-full ${isVerified ? "max-w-[441px]" : "max-w-[452px]"} flex-col items-center gap-y-5`}
        >
          {/* Section 1: Logo and Tagline */}
          <div className="mb-6 flex w-full flex-col items-center text-center text-neutral-50">
            <div className="relative w-[200px]">
              <img
                src="/img/muatmuat.png"
                alt="Brand banner"
                width={200}
                height={56}
                className="object-contain"
                loading="eager"
              />
            </div>
            <div className="mt-[6px] text-xs font-bold leading-[14.4px]">
              {t("labelEasyWayTogether")}
            </div>
          </div>

          {/* Section 2: Verification Image or Success Icon */}
          {isVerified ? (
            <div className="relative">
              <img
                src="/img/otp-transporter/logo.png"
                alt="success"
                width={200}
                height={221}
                className="object-contain"
                loading="eager"
              />
            </div>
          ) : (
            <img
              src="/img/otp-transporter/otp.png"
              alt="security"
              width={201.08}
              height={221}
              className="object-contain"
              loading="eager"
            />
          )}
          {/* ) : (
            <img
              src="/img/email.png"
              alt="email"
              width={100}
              height={100}
              className="object-contain"
              loading="eager"
            />
          )} */}

          {!isVerified ? (
            <>
              {/* ERROR OR SUCCESS MESSAGE */}
              {notification ? (
                <div
                  className={`flex w-[440px] flex-row items-center justify-center gap-x-2.5 rounded-md border px-3 py-[15px] ${
                    notification.status === "error"
                      ? "border-[#F71717] bg-[#FFE5E5]"
                      : "border-[#3ECD00] bg-[#F1FFEB]"
                  } `}
                >
                  <IconComponent
                    className={
                      notification.status === "error" ? "text-[#F71717]" : ""
                    }
                    src={
                      notification.status === "error"
                        ? "/icons/info16.svg"
                        : "/icons/success-toast.svg"
                    }
                  />
                  <span className="text-xs font-semibold leading-[14.4px]">
                    {t(notification.message)}
                  </span>
                </div>
              ) : null}

              {/* Section 3: OTP Form Content */}
              <div className="flex w-full flex-col items-center">
                {/* Email verification message */}
                <div className="max-w-[452px] text-center text-base font-medium leading-[19.2px] text-neutral-50">
                  Email dan password kamu berhasil dibuat. Mohon cek pesan
                  Whatsapp di perangkat kamu untuk melanjutkan pendaftaran
                </div>

                {/* OTP input section */}
                <div className="mt-6 flex w-full flex-col items-center">
                  <div className="flex w-full flex-wrap items-center justify-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-bold leading-[16.8px] text-neutral-50">
                        No. Whatsapp Kamu
                      </div>
                      <div className="max-w-[176px] truncate text-sm font-semibold leading-[16.8px] text-[#EBEBEB]">
                        0893435352125
                      </div>
                      <Button
                        name="change"
                        onClick={() => setIsChangeNumberModalOpen(true)}
                        className={cn(
                          "flex w-[50px] items-center !bg-[#EBEBEB] py-0 text-xxs !text-[#868686] md:h-5"
                        )}
                      >
                        Ganti
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-3">
                    <label className="w-[102px] text-sm font-bold leading-[16.8px] text-neutral-50">
                      {t("labelEnterOTP")}
                    </label>
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      pattern={REGEXP_ONLY_DIGITS}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                {/* Warning message */}
                {formValues?.verificationMethod === "email" ? (
                  <div className="mt-6 max-w-[319px] rounded-md bg-[#FFF1A5] px-4 py-3 text-center text-xs font-medium leading-[14.4px] text-neutral-900">
                    {`${t("labelIfOtpNotFound")} `}
                    <span className="font-bold">{t("labelSpam")}</span>,{" "}
                    <span className="font-bold">{t("labelSosial")}</span>,{" "}
                    {`${t("labelOr")} `}
                    <span className="font-bold">{t("labelPromosi")}</span>{" "}
                    {t("labelInYourEmail")}
                  </div>
                ) : null}

                {/* Timer message */}
                <div className="mt-6 text-center text-base font-medium leading-[19.2px] text-neutral-50">
                  {`${t("labelOtpCodeExpiredIn")} `}
                  <span className="font-bold">{countdown}</span>
                </div>
              </div>

              {/* Resend button */}
              <Button
                variant={
                  isCountdownFinished
                    ? "muattrans-primary"
                    : "muatparts-primary-secondary"
                }
                name="resend"
                onClick={() => handleRequestOtp(formValues)}
                disabled={!isCountdownFinished}
                className={cn(
                  "mt-[10px] flex h-10 w-52 max-w-[319px] items-center !bg-[#EBEBEB] !text-[#868686] md:h-10",
                  isCountdownFinished && "!bg-[#FFC217] !text-primary-700"
                )}
              >
                {/* {t("btnResend")} */} Kirim Ulang OTP
              </Button>
            </>
          ) : (
            <>
              {/* Success UI Content */}
              <div className="flex w-full flex-col items-center gap-3">
                {/* Success Title and Message */}
                <div className="flex w-full max-w-[414px] flex-col items-center gap-3">
                  <h1 className="text-center text-2xl font-bold leading-[29px] text-white">
                    Selamat Pendaftaran Kamu Berhasil
                  </h1>
                  <p className="text-center text-base font-medium leading-[19px] text-white">
                    Akun Transporter Muatrans Kamu berhasil terdaftar dan
                    terverifikasi
                  </p>
                </div>

                {/* Login button */}
                <div className="mt-6">
                  <Button
                    variant="muattrans-primary"
                    onClick={() => router.push("/login")}
                    className="mt-10 flex w-[200px] items-center justify-center rounded-3xl bg-[#FFC217] text-primary-700 md:h-10"
                  >
                    <span className="font-semibold text-primary-700">
                      Masuk ke Muatrans
                    </span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right meteor */}
      <div
        className={`absolute ${isVerified ? "bottom-[80px]" : "bottom-[118px]"} right-[7px]`}
      >
        <img src="/img/meteor2.png" alt="meteor2" width={160} height={160} />
      </div>

      {/* Change Number Confirmation Modal */}
      <ChangeWhatsappModal
        isOpen={isChangeNumberModalOpen}
        size="big"
        setIsOpen={setIsChangeNumberModalOpen}
        title={{
          text: "Ubah No. Whatsapp",
          className: "text-center",
        }}
        confirm={{
          text: "Ubah",
          onClick: () => {
            setIsChangeNumberModalOpen(false);
            handleRequestOtp(formValues);
          },
        }}
      />
    </div>
  );
};

export default OtpContainer;
