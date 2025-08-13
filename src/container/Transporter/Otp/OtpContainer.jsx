"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { addMinutes } from "date-fns";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import Button from "@/components/Button/Button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/Form/OtpInput";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { useCountdown } from "@/hooks/use-countdown";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { useLoadingAction } from "@/store/Shared/loadingStore";
import {
  useRequestOtpActions,
  useRequestOtpStore,
} from "@/store/Shipper/forms/requestOtpStore";

import ChangeWhatsappModal from "./ChangeWhatsappModal";

// Configuration object for different OTP types
const OTP_TYPE_CONFIG = {
  "change-number": {
    showEmailMessage: false,
    mainMessage:
      "Mohon cek pesan Whatsapp diperangkat kamu untuk melanjutkan pendaftaran",
    labelMessage: "Kode OTP dikirim ke nomor",
    imageSize: { width: 92, height: 100 },
    buttonText: "Kirim Ulang",
    buttonSize: "w-[125px] text-sm md:h-8",
    logoMargin: "",
  },
  "forgot-password": {
    showEmailMessage: false,
    mainMessage:
      "Mohon cek pesan Whatsapp di perangkat kamu untuk melanjutkan pendaftaran",
    labelMessage: "No. Whatsapp Kamu",
    imageSize: { width: 201.08, height: 221 },
    buttonText: "Kirim Ulang OTP",
    buttonSize: "w-52 md:h-10",
    logoMargin: "mb-6",
  },
  default: {
    showEmailMessage: true,
    mainMessage:
      "Mohon cek pesan Whatsapp di perangkat kamu untuk melanjutkan pendaftaran",
    labelMessage: "No. Whatsapp Kamu",
    imageSize: { width: 201.08, height: 221 },
    buttonText: "Kirim Ulang OTP",
    buttonSize: "w-52 md:h-10",
    logoMargin: "mb-6",
  },
};

// Constants
const HARDCODED_SUCCESS_OTP = "654321";
const DEFAULT_COUNTDOWN_MINUTES = 0.1;

const OtpContainer = ({
  _dontRedirect = false,
  onVerifySuccess = () => {},
}) => {
  const router = useRouter();
  const { t, isTranslationsReady } = useTranslation();
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isChangeNumberModalOpen, setIsChangeNumberModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const { formValues } = useRequestOtpStore();
  const { verifyOtp } = useRequestOtpActions();

  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const number = searchParams.get("whatsapp");

  // Get configuration based on type
  const config = OTP_TYPE_CONFIG[type] || OTP_TYPE_CONFIG.default;

  // Create a default expiry date (2 minutes from now) if no expiry is provided
  // State for expiry date to control countdown
  const [expiryDate, setExpiryDate] = useState(() => {
    return formValues?.expiresIn
      ? formValues.expiresIn
      : addMinutes(new Date(), 0.1);
  });

  // Update expiryDate if formValues.expiresIn changes
  useEffect(() => {
    if (formValues?.expiresIn) {
      setExpiryDate(formValues.expiresIn);
    }
  }, [formValues?.expiresIn]);

  const { countdown } = useCountdown({
    endingDate: expiryDate,
    isNeedCountdown: true,
    withHours: false,
  });

  const { setIsGlobalLoading } = useLoadingAction();

  useEffect(() => {
    if (isTranslationsReady) setIsGlobalLoading(false);
  }, [isTranslationsReady, setIsGlobalLoading]);

  const [isReady] = useState(false);

  const handleRequestOtp = (_formValues, isPhoneChange = false) => {
    // Prevent execution if countdown is still active and it's not a phone change
    if (!isPhoneChange && countdown !== "00:00" && countdown !== "") {
      return;
    }

    // Reset countdown by setting a new expiry date (2 minutes from now)
    const newExpiry = addMinutes(new Date(), 0.1);
    setExpiryDate(newExpiry);

    // Set notification only if it's not a phone change (phone change sets its own notification)
    if (!isPhoneChange) {
      setNotification({
        status: "success",
        message: t(
          "OtpContainer.messageResendSuccess",
          {},
          "Berhasil mengirim ulang OTP"
        ),
      });
    }

    // ...existing logic to actually request OTP if needed...
  };

  const hasFetchedOtp = useRef(false);
  useShallowCompareEffect(() => {
    if (!isReady) return;
    if (hasFetchedOtp.current) return;
    handleRequestOtp(formValues);
    hasFetchedOtp.current = true;
  }, [isReady, formValues]);

  // Helper function to render notification
  const renderNotification = () => {
    if (!notification) return null;

    return (
      <div
        className={`flex w-[440px] flex-row items-center justify-center gap-x-2.5 rounded-md border px-3 py-[15px] ${
          notification.status === "error"
            ? "border-[#F71717] bg-[#FFE5E5]"
            : "border-[#3ECD00] bg-[#F1FFEB]"
        }`}
      >
        <IconComponent
          className={notification.status === "error" ? "text-[#F71717]" : ""}
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
    );
  };

  // Helper function to render main message
  const renderMainMessage = () => {
    return (
      <div
        className={`${type === "forgot-password" ? "" : "max-w-[452px]"} text-center text-base font-medium leading-[19.2px] text-neutral-50`}
      >
        {config.showEmailMessage &&
          t(
            "OtpContainer.textEmailPasswordCreated",
            {},
            "Email dan password kamu berhasil dibuat."
          )}{" "}
        {t(
          type === "change-number"
            ? "OtpContainer.textCheckWhatsappChangeNumber"
            : "OtpContainer.textCheckWhatsapp",
          {},
          config.mainMessage
        )}
      </div>
    );
  };

  // Helper function to render WhatsApp number section
  const renderWhatsAppSection = () => {
    return (
      <div className="flex w-full flex-wrap items-center justify-center gap-6">
        <div className="flex items-center gap-3">
          <div className="text-sm font-bold leading-[16.8px] text-neutral-50">
            {t(
              type === "change-number"
                ? "OtpContainer.textOtpSentToNumber"
                : "OtpContainer.labelWhatsappNumber",
              {},
              config.labelMessage
            )}
          </div>
          <div className="max-w-[176px] truncate text-sm font-semibold leading-[16.8px] text-[#EBEBEB]">
            {number || "0893435352125"}
          </div>
          {type !== "forgot-password" && (
            <Button
              variant="muatparts-primary"
              name="change"
              onClick={() => setIsChangeNumberModalOpen(true)}
              className={cn(
                "ml-3 flex w-[50px] items-center !bg-[#EBEBEB] py-0 text-xxs !text-[#868686] md:h-5",
                (countdown === "00:00" || countdown === "") &&
                  "!bg-[#EBEBEB] !text-primary-700"
              )}
              disabled={countdown !== "00:00" && countdown !== ""}
            >
              {t("OtpContainer.buttonChange", {}, "Ganti")}
            </Button>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Verify OTP if the OTP is 6 digits
    if (otp.length === 6) {
      setNotification(null);

      // Check for hardcoded success OTP
      if (otp === "654321") {
        // Set verification success state

        // Show modal for change-number type, otherwise call onVerifySuccess
        if (type === "change-number") {
          setIsSuccessModalOpen(true);
        } else {
          setIsVerified(true);
          onVerifySuccess();
        }
        return;
      }

      verifyOtp(otp)
        .then(() => {
          // Set verification success state

          // Show modal for change-number type, otherwise call onVerifySuccess
          if (type === "change-number") {
            setIsSuccessModalOpen(true);
          } else {
            setIsVerified(true);
            onVerifySuccess();
          }
          // Don't redirect immediately - show success UI instead
        })
        .catch((error) => {
          // Check specific error types and set appropriate messages
          if (
            error?.code === "EXPIRED_OTP" ||
            error?.message?.includes("expired")
          ) {
            setNotification({
              status: "error",
              message: t(
                "OtpContainer.messageOtpExpired",
                {},
                "OTP yang kamu masukan telah expired"
              ),
            });
          } else {
            setNotification({
              status: "error",
              message: t(
                "OtpContainer.messageOtpIncorrect",
                {},
                "OTP yang kamu masukan salah"
              ),
            });
          }
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
          className={`flex w-full ${
            isVerified
              ? "max-w-[441px]"
              : type !== "forgot-password"
                ? "max-w-[452px]"
                : ""
          } flex-col items-center gap-y-5`}
        >
          {/* Logo and Tagline */}
          <div
            className={`${config.logoMargin} flex w-full flex-col items-center text-center text-neutral-50`}
          >
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

          {/* Verification Image or Success Icon */}
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
              width={config.imageSize.width}
              height={config.imageSize.height}
              className="object-contain"
              loading="eager"
            />
          )}

          {!isVerified ? (
            <>
              {/* Notification */}
              {renderNotification()}

              {/* OTP Form Content */}
              <div className="flex w-full flex-col items-center">
                {/* Main message */}
                {renderMainMessage()}

                {/* OTP input section */}
                <div className="mt-6 flex w-full flex-col items-center">
                  {renderWhatsAppSection()}

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

                {/* Warning message for email verification */}
                {formValues?.verificationMethod === "email" && (
                  <div className="mt-6 max-w-[319px] rounded-md bg-[#FFF1A5] px-4 py-3 text-center text-xs font-medium leading-[14.4px] text-neutral-900">
                    {`${t("labelIfOtpNotFound")} `}
                    <span className="font-bold">{t("labelSpam")}</span>,{" "}
                    <span className="font-bold">{t("labelSosial")}</span>,{" "}
                    {`${t("labelOr")} `}
                    <span className="font-bold">{t("labelPromosi")}</span>{" "}
                    {t("labelInYourEmail")}
                  </div>
                )}

                {/* Timer message */}
                <div className="mt-6 text-center text-base font-medium leading-[19.2px] text-neutral-50">
                  {`${t("labelOtpCodeExpiredIn")} `}
                  <span className="font-bold">{countdown}</span>
                </div>
              </div>

              {/* Resend button */}
              <Button
                variant={
                  countdown === "00:00" || countdown === ""
                    ? "muattrans-primary"
                    : "muatparts-primary-secondary"
                }
                name="resend"
                onClick={() => {
                  if (countdown === "00:00" || countdown === "") {
                    handleRequestOtp(formValues);
                  }
                }}
                disabled={countdown !== "00:00" && countdown !== ""}
                className={cn(
                  `mt-[10px] flex h-10 text-nowrap ${config.buttonSize} max-w-[319px] items-center !bg-[#EBEBEB] !text-[#868686]`,
                  (countdown === "00:00" || countdown === "") &&
                    "!bg-[#FFC217] !text-primary-700"
                )}
              >
                {type === "change-number"
                  ? config.buttonText
                  : t("OtpContainer.buttonResendOtp", {}, config.buttonText)}
              </Button>
            </>
          ) : (
            <>
              {/* Success UI Content */}
              <div className="flex w-full flex-col items-center gap-3">
                <div className="flex w-full max-w-[414px] flex-col items-center gap-3">
                  <h1 className="text-center text-2xl font-bold leading-[29px] text-white">
                    {t(
                      "OtpContainer.titleRegistrationSuccess",
                      {},
                      "Selamat Pendaftaran Kamu Berhasil"
                    )}
                  </h1>
                  <p className="max-w-[370px] text-center text-base font-medium leading-[19px] text-white">
                    {t(
                      "OtpContainer.textAccountVerified",
                      {},
                      "Akun Transporter Muatrans Kamu berhasil terdaftar dan terverifikasi"
                    )}
                  </p>
                </div>

                <div className="mt-6">
                  <Button
                    variant="muattrans-primary"
                    onClick={() => router.push("/login")}
                    className="mt-16 flex w-[200px] items-center justify-center rounded-3xl bg-[#FFC217] text-primary-700 md:h-10"
                  >
                    <span className="font-semibold text-primary-700">
                      {t(
                        "OtpContainer.buttonLoginToMuatrans",
                        {},
                        "Masuk ke Muatrans"
                      )}
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
          text: t("OtpContainer.titleChangeWhatsapp", {}, "Ubah No. Whatsapp"),
          className: "text-center",
        }}
        isChangeNumber={type === "change-number"}
        confirm={{
          text: "Ubah",
          onClick: (_newWhatsappNumber) => {
            setIsChangeNumberModalOpen(false);
            setNotification({
              status: "success",
              message:
                type === "change-number"
                  ? "Berhasil mengubah No. Whatsapp"
                  : t(
                      "OtpContainer.messageChangeWhatsappSuccess",
                      {},
                      "Berhasil mengubah No. Whatsapp Kamu"
                    ),
            });
            handleRequestOtp(formValues, true); // Pass true for isPhoneChange
          },
        }}
      />

      {/* Success Modal for change-number type */}
      <Modal
        closeOnOutsideClick={false}
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        withCloseButton={false}
      >
        <ModalContent className="h-[413px] w-[385px]" type="muattrans">
          <div className="relative flex h-[70px] justify-between overflow-hidden rounded-t-xl bg-muat-trans-primary-400">
            <div>
              <img
                alt="svg header modal kiri"
                src="/img/header-modal/header-kiri.svg"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="my-auto">
              <img
                alt="logo muatmuat header coklat"
                src="/img/header-modal/muatmuat-brown.svg"
              />
            </div>
            <div>
              <img
                alt="svg header modal kanan "
                src="/img/header-modal/header-kanan.svg"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-y-6 px-6 py-9">
            <div className="flex flex-col items-center gap-y-4">
              <div>
                <h1 className="text-center text-base font-bold leading-[19.2px] text-neutral-900">
                  Selamat!
                </h1>
                <h1 className="text-center text-base font-bold leading-[19.2px] text-neutral-900">
                  No. Whatsapp Berhasil Diubah
                </h1>
              </div>
              <img
                alt=""
                src="/img/otp-transporter/success.png"
                className="h-[110px] w-[110px] object-cover"
              />
              <div className="px-4 text-center text-sm font-medium leading-[16.8px] text-neutral-900">
                Kamu sekarang bisa masuk menggunakan nomor baru
              </div>
            </div>
            <Button
              variant="muattrans-primary"
              className="h-8 w-28"
              onClick={() => {
                setIsSuccessModalOpen(false);
                onVerifySuccess();
              }}
              type="button"
            >
              {t("OtpContainer.buttonOk", {}, "OK")}
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default OtpContainer;
