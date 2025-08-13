"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

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

const RequestOtpResponsive = ({
  dontRedirect = false,
  onVerifySuccess = () => {},
}) => {
  const router = useRouter();
  const { t, isTranslationsReady } = useTranslation();
  const [otp, setOtp] = useState("");

  const { formValues, params } = useRequestOtpStore();
  const { sendRequestOtp, verifyOtp } = useRequestOtpActions();

  const { countdown, isCountdownFinished } = useCountdown({
    endingDate: formValues?.expiresIn,
    isNeedCountdown: Boolean(formValues?.expiresIn),
    withHours: false,
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
    <div className="relative flex min-h-screen w-full bg-primary-700">
      {/* Left meteor */}
      <div className="absolute left-0 top-0 z-[1]">
        <Image
          src="/img/meteor-reponsive.png"
          alt="meteor"
          width={91}
          height={91}
        />
      </div>
      <div className="absolute left-[18px] top-6 z-[2]">
        <button
          className="flex size-8 items-center justify-center rounded-[90px] bg-neutral-50"
          onClick={() => router.push("/pengaturanmerchant/rekeningpencairan")}
        >
          <IconComponent
            className="text-primary-700"
            src="/icons/chevron-left24.svg"
            size="medium"
          />
        </button>
      </div>

      {/* Main content */}
      <div className="flex w-full flex-col items-center">
        {/* Section 1: Logo and Tagline */}
        <Image
          src="/img/muatmuat.png"
          alt="Brand banner"
          width={120}
          height={21}
          className="mt-[30px] object-contain"
          loading="eager"
        />

        {/* Section 2: Verification Image */}
        <div className="mt-[58px]">
          {formValues?.verificationMethod === "whatsapp" ? (
            <Image
              src="/img/security-responsive.png"
              alt="security"
              width={120}
              height={120}
              className="object-contain"
              loading="eager"
            />
          ) : (
            <Image
              src="/img/email.png"
              alt="email"
              width={112}
              height={112}
              className="object-contain"
              loading="eager"
            />
          )}
        </div>

        {/* Section 3: Main Form Content */}
        <div className="mt-5 flex w-full flex-col items-center gap-y-[18px] text-neutral-50">
          {/* Email verification message */}
          <div className="max-w-[301px] text-center text-sm font-semibold leading-none">
            {formValues?.verificationMethod === "whatsapp"
              ? t("descWhatsAppOTP")
              : "Mohon cek pesan email diperangkat Anda untuk melanjutkan pendaftaran"}
          </div>

          {/* OTP input section */}
          <div className="flex flex-col items-center gap-y-2 text-sm leading-none">
            <span className="font-semibold">
              {`${formValues?.verificationMethod === "whatsapp" ? t("labelOTPPhoneNumber") : t("labelOtpIsSendToEmail")}`}
            </span>
            <span className="font-bold">
              {formValues?.verificationMethod === "whatsapp"
                ? formValues?.verificationData.replace(/-/g, "")
                : formValues?.verificationData}
            </span>
          </div>

          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, index) => (
                <Fragment key={index}>
                  <InputOTPSlot
                    className="size-[42px] rounded border-none text-xl leading-none text-neutral-900"
                    index={index}
                  />
                </Fragment>
              ))}
            </InputOTPGroup>
          </InputOTP>

          {/* Warning message */}
          {formValues?.verificationMethod === "email" ? (
            <div className="flex h-[44px] max-w-[328px] items-center rounded-md bg-muat-trans-primary-400 px-2 text-xs font-medium leading-none text-neutral-900">
              <div className="text-center">
                {`${t("labelIfOtpNotFound")} `}
                <span className="font-bold">{t("labelSpam")}</span>,{" "}
                <span className="font-bold">{t("labelSosial")}</span>,{" "}
                {`${t("labelOr")} `}
                <span className="font-bold">{t("labelPromosi")}</span>{" "}
                {t("labelInYourEmail")}
              </div>
            </div>
          ) : null}

          {/* Timer message */}
          <span className="text-xs font-medium leading-none">
            {`Kode OTP akan berakhir dalam`}
            <span className="font-semibold">{` ${countdown}`}</span>
          </span>

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
              "h-8 !bg-[#EBEBEB] px-6 !text-[#868686]",
              isCountdownFinished && "!bg-[#FFC217] !text-primary-700"
            )}
          >
            {t("btnResend")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestOtpResponsive;
