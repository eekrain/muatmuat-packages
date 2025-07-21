"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { isAfter } from "date-fns";
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

const RequestOtp = ({ dontRedirect = false, onVerifySuccess = () => {} }) => {
  const router = useRouter();
  const { t, isTranslationsReady } = useTranslation();
  const [otp, setOtp] = useState("");

  const { formValues, params } = useRequestOtpStore();
  const { sendRequestOtp, verifyOtp } = useRequestOtpActions();

  const { countdown, isCountdownFinished } = useCountdown({
    endingDate: formValues?.expiresIn,
    isNeedCountdown: Boolean(formValues?.expiresIn),
  });

  const { setIsGlobalLoading } = useLoadingAction();
  useEffect(() => {
    if (isTranslationsReady) setIsGlobalLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTranslationsReady]);

  const [isReady, setIsReady] = useState(false);
  useShallowCompareEffect(() => {
    // This is to prevent the page to be accessed if there are no correct data
    const timer = setTimeout(() => {
      if (
        (!formValues?.verificationMethod || !formValues?.verificationData) &&
        !dontRedirect
      ) {
        router.push("/");
        return;
      }
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [formValues]);

  const handleRequestOtp = (formValues) => {
    if (!formValues?.expiresIn || isAfter(Date.now(), formValues?.expiresIn)) {
      sendRequestOtp().catch((error) => {
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
          router.push(params?.redirectUrl || "/daftarpesanan");
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
      <div className="absolute left-[48px] top-[25px] z-[2]">
        <button
          onClick={() => router.push("/pengaturanmerchant/rekeningpencairan")}
        >
          <img
            src="/img/arrow_left.png"
            alt="arrow-left"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full max-w-[444px] flex-col items-center gap-y-5">
          {/* Section 1: Logo and Tagline */}
          <div className="flex w-full flex-col items-center text-center text-neutral-50">
            <div className="relative w-[200px]">
              <img
                src="/img/muatmuat.png"
                alt="Brand banner"
                width={200}
                height={40}
                className="object-contain"
                loading="eager"
              />
            </div>
            <div className="leading-[14.4px] mt-[6px] text-xs font-bold">
              {t("labelEasyWayTogether")}
            </div>
          </div>

          {/* Section 2: Verification Image */}
          {formValues?.verificationMethod === "whatsapp" ? (
            <img
              src="/img/security.png"
              alt="security"
              width={108}
              height={108}
              className="object-contain"
              loading="eager"
            />
          ) : (
            <img
              src="/img/email.png"
              alt="email"
              width={100}
              height={100}
              className="object-contain"
              loading="eager"
            />
          )}

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
              <span className="leading-[14.4px] text-xs font-semibold">
                {t(notification.message)}
              </span>
            </div>
          ) : null}

          {/* Section 3: Main Form Content */}
          <div className="flex w-full flex-col items-center">
            {/* Email verification message */}
            {formValues?.verificationMethod === "whatsapp" ? (
              <div className="leading-[19.2px] max-w-[444px] text-center text-base font-medium text-neutral-50">
                {t("descWhatsAppOTP")}
              </div>
            ) : (
              <div className="leading-[19.2px] max-w-[240px] text-center text-base font-medium text-neutral-50">
                {t("labelCheckEmail")}
              </div>
            )}

            {/* OTP input section */}
            <div className="mt-6 flex w-full flex-col items-center">
              <div className="flex w-full flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="leading-[16.8px] text-sm font-bold text-neutral-50">
                    {`${formValues?.verificationMethod === "whatsapp" ? t("labelOTPPhoneNumber") : t("labelOtpIsSendToEmail")}`}
                  </div>
                  <div className="leading-[16.8px] max-w-[176px] truncate text-sm font-semibold text-[#EBEBEB]">
                    {formValues?.verificationMethod === "whatsapp"
                      ? formValues?.verificationData.replace(/-/g, "")
                      : formValues?.verificationData}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-3">
                <label className="leading-[16.8px] w-[102px] text-sm font-bold text-neutral-50">
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
              <div className="leading-[14.4px] mt-6 max-w-[319px] rounded-md bg-[#FFF1A5] px-4 py-3 text-center text-xs font-medium text-neutral-900">
                {`${t("labelIfOtpNotFound")} `}
                <span className="font-bold">{t("labelSpam")}</span>,{" "}
                <span className="font-bold">{t("labelSosial")}</span>,{" "}
                {`${t("labelOr")} `}
                <span className="font-bold">{t("labelPromosi")}</span>{" "}
                {t("labelInYourEmail")}
              </div>
            ) : null}

            {/* Timer message */}
            <div className="leading-[19.2px] mt-6 text-center text-base font-medium text-neutral-50">
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
              "mt-[10px] flex h-8 w-full max-w-[319px] items-center !bg-[#EBEBEB] !text-[#868686]",
              isCountdownFinished && "!bg-[#FFC217] !text-primary-700"
            )}
          >
            {t("btnResend")}
          </Button>
        </div>
      </div>

      {/* Right meteor */}
      <div className="absolute bottom-[118px] right-[7px]">
        <img src="/img/meteor2.png" alt="meteor2" width={160} height={160} />
      </div>
    </div>
  );
};

export default RequestOtp;
