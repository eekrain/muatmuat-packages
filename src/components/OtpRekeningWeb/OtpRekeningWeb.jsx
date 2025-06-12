import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { useTranslation } from "@/hooks/use-translation";
import { useCustomRouter } from "@/lib/utils/custom-route";
import { formatTime } from "@/lib/utils/timeUtils";
import { otpInputZustand } from "@/store/zustand/otpInput";
import { otpRekeningZustand } from "@/store/zustand/otpRekening";

import { OtpInput } from "./OtpInput";
import styles from "./OtpRekeningWeb.module.scss";

const OtpRekeningWeb = ({ notification, onResendCode }) => {
  const router = useCustomRouter();
  const { email, telpon } = otpRekeningZustand();
  const { isTimerActive, timeLeft } = otpInputZustand();
  const { t } = useTranslation();

  return (
    <div className="relative mt-[-80px] flex min-h-screen bg-primary-700">
      {/* Left meteor */}
      <div className="absolute left-0 top-0">
        <ImageComponent
          src="/img/meteor1.png"
          alt="meteor1"
          width={160}
          height={160}
        />
      </div>
      <div className="absolute left-[48px] top-[25px] z-[2]">
        <button
          onClick={() => router.push("/pengaturanmerchant/rekeningpencairan")}
        >
          <ImageComponent
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
              <ImageComponent
                src="/img/muatmuat.png"
                alt="Brand banner"
                width={200}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-[6px] text-[12px] font-bold leading-[14.4px]">
              {t("labelEasyWayTogether")}
            </div>
          </div>

          {/* Section 2: Verification Image */}
          {telpon ? (
            <ImageComponent
              src="/img/security.png"
              alt="security"
              width={108}
              height={108}
              className="object-contain"
              priority
            />
          ) : (
            <ImageComponent
              src="/img/email.png"
              alt="email"
              width={100}
              height={100}
              className="object-contain"
              priority
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
                  notification.status === "error" ? styles.icon_error : ""
                }
                src={
                  notification.status === "error"
                    ? "/icons/Info.svg"
                    : "/icons/success-toast.svg"
                }
              />
              <span className="text-[12px] font-semibold leading-[14.4px]">
                {notification.message}
              </span>
            </div>
          ) : null}

          {/* Section 3: Main Form Content */}
          <div className="flex w-full flex-col items-center">
            {/* Email verification message */}
            {telpon ? (
              <div className="max-w-[444px] text-center text-[16px] font-medium leading-[19.2px] text-neutral-50">
                {t("descWhatsAppOTP")}
              </div>
            ) : (
              <div className="max-w-[240px] text-center text-[16px] font-medium leading-[19.2px] text-neutral-50">
                {t("labelCheckEmail")}
              </div>
            )}

            {/* OTP input section */}
            <div className="mt-6 flex w-full flex-col items-center">
              <div className="flex w-full flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="text-[14px] font-bold leading-[16.8px] text-neutral-50">
                    {`${telpon ? t("labelOTPPhoneNumber") : t("labelOtpIsSendToEmail")}`}
                  </div>
                  <div className="max-w-[176px] truncate text-[14px] font-semibold leading-[16.8px] text-[#EBEBEB]">
                    {telpon ? telpon.replace(/-/g, "") : email}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-3">
                <label className="w-[102px] text-[14px] font-bold leading-[16.8px] text-neutral-50">
                  {t("labelEnterOTP")}
                </label>
                <OtpInput />
              </div>
            </div>

            {/* Warning message */}
            {email ? (
              <div className="mt-6 max-w-[319px] rounded-md bg-[#FFF1A5] px-4 py-3 text-center text-[12px] font-medium leading-[14.4px] text-neutral-900">
                {`${t("labelIfOtpNotFound")} `}
                <span className="font-bold">{t("labelSpam")}</span>,{" "}
                <span className="font-bold">{t("labelSosial")}</span>,{" "}
                {`${t("labelOr")} `}
                <span className="font-bold">{t("labelPromosi")}</span>{" "}
                {t("labelInYourEmail")}
              </div>
            ) : null}

            {/* Timer message */}
            <div className="mt-6 text-center text-[16px] font-medium leading-[19.2px] text-neutral-50">
              {`${t("labelOtpCodeExpiredIn")} `}
              <span className="font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Resend button */}
          <Button
            variant={isTimerActive ? "secondary" : "muattrans-primary"}
            name="resend"
            onClick={onResendCode}
            disabled={isTimerActive}
            className={`mt-[10px] flex h-8 w-full max-w-[319px] items-center ${isTimerActive ? "!bg-[#EBEBEB] !text-[#868686]" : "!bg-[#FFC217] !text-primary-700"} `}
          >
            {t("btnResend")}
          </Button>
        </div>
      </div>

      {/* Right meteor */}
      <div className="absolute bottom-[118px] right-[7px]">
        <ImageComponent
          src="/img/meteor2.png"
          alt="meteor2"
          width={160}
          height={160}
        />
      </div>
    </div>
  );
};

export default OtpRekeningWeb;
