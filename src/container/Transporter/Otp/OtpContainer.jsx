"use client";

import { useRouter, useSearchParams } from "next/navigation";
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
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { useCountdown } from "@/hooks/use-countdown";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useLoadingAction } from "@/store/Shared/loadingStore";
import {
  useRequestOtpActions,
  useRequestOtpStore,
} from "@/store/Transporter/forms/requestOtpProfilStore";

import ChangeEmailModal from "./ChangeEmailModal";
import ChangeWhatsappModal from "./ChangeWhatsappModal";

// Configuration object for different OTP types
const OTP_TYPE_CONFIG = {
  whatsapp: {
    showEmailMessage: false,
    mainMessage:
      "Mohon masukkan OTP yang dikirim melalui pesan Whatsapp diperangkat kamu untuk melanjutkan perubahan",
    labelMessage: "Kode OTP dikirim ke nomor",
    inputLabel: "Masukkan OTP",
    imageSrc: "/img/otp-transporter/security-amico.png",
    imageSize: { width: 120, height: 108 },
    buttonText: "Kirim Ulang",
    buttonSize: "w-[125px] text-sm md:h-8",
    textColor: "text-white",
    labelColor: "text-white",
    otpInputClass: "!bg-white !text-black",
    activeResendButtonClass: "bg-muat-trans-primary-400 text-blue-600",
    resendButtonClass:
      "bg-[#F0F0F0] text-neutral-400 hover:bg-[#F0F0F0] cursor-not-allowed",
    showMeteors: true,
  },
  "change-number": {
    showEmailMessage: false,
    mainMessage:
      "Mohon cek pesan Whatsapp diperangkat kamu untuk melanjutkan pendaftaran",
    labelMessage: "Kode OTP dikirim ke nomor",
    imageSrc: "/img/otp-transporter/otp.png",
    imageSize: { width: 92, height: 100 },
    buttonText: "Kirim Ulang",
    buttonSize: "w-[125px] text-sm md:h-8",
    logoMargin: "",
    showMeteors: true,
  },
  "forgot-password": {
    showEmailMessage: false,
    mainMessage:
      "Mohon cek pesan Whatsapp di perangkat kamu untuk melanjutkan pendaftaran",
    labelMessage: "No. Whatsapp Kamu",
    imageSrc: "/img/otp-transporter/otp.png",
    imageSize: { width: 201.08, height: 221 },
    buttonText: "Kirim Ulang OTP",
    buttonSize: "w-52 md:h-10",
    logoMargin: "mb-6",
    showMeteors: true,
  },
  "change-email": {
    showEmailMessage: false,
    mainMessage:
      "Mohon masukkan OTP yang dikirim melalui pesan Whatsapp diperangkat kamu untuk melanjutkan perubahan",
    labelMessage: "Kode OTP dikirim ke nomor",
    inputLabel: "Masukkan OTP",
    imageSrc: "/img/otp-transporter/security-amico.png",
    imageSize: { width: 120, height: 108 },
    buttonText: "Kirim Ulang",
    buttonSize: "w-[125px] text-sm md:h-8",
    textColor: "text-white",
    labelColor: "text-white",
    otpInputClass: "!bg-white !text-black",
    activeResendButtonClass: "bg-muat-trans-primary-400 text-blue-600",
    resendButtonClass:
      "bg-[#F0F0F0] text-neutral-400 hover:bg-[#F0F0F0] cursor-not-allowed",
    showMeteors: true,
  },
  "change-email2": {
    showEmailMessage: false,
    mainMessage:
      "Mohon cek pesan email di perangkat kamu untuk melanjutkan perubahan",
    labelMessage: "Kode OTP dikirim ke email",
    inputLabel: "Masukkan OTP",
    imageSrc: "/img/otp-transporter/otp.png",
    imageSize: { width: 120, height: 108 },
    buttonText: "Kirim Ulang",
    buttonSize: "w-[125px] text-sm md:h-8",
    textColor: "text-white",
    labelColor: "text-white",
    otpInputClass: "!bg-white !text-black",
    activeResendButtonClass: "bg-muat-trans-primary-400 text-blue-600",
    resendButtonClass:
      "bg-[#F0F0F0] text-neutral-400 hover:bg-[#F0F0F0] cursor-not-allowed",
    showMeteors: true,
  },
  default: {
    showEmailMessage: true,
    mainMessage:
      "Mohon cek pesan Whatsapp di perangkat kamu untuk melanjutkan pendaftaran",
    labelMessage: "No. Whatsapp Kamu",
    imageSrc: "/img/otp-transporter/otp.png",
    imageSize: { width: 201.08, height: 221 },
    buttonText: "Kirim Ulang OTP",
    buttonSize: "w-52 md:h-10",
    logoMargin: "mb-6",
    showMeteors: true,
  },
};

const OtpContainer = ({
  _dontRedirect = false,
  onVerifySuccess = () => {},
}) => {
  const router = useRouter();
  const { t, isTranslationsReady } = useTranslation();
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isChangeNumberModalOpen, setIsChangeNumberModalOpen] = useState(false);
  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSuccessEmailModalOpen, setIsSuccessEmailModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const formValues = useRequestOtpStore();
  const {
    verifyOtp,
    resendOtp,
    sendRequestOtp,
    updateWhatsAppNumber,
    updateEmailAddress,
  } = useRequestOtpActions();

  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const number = searchParams.get("whatsapp");

  // Get configuration based on type, fallback to default
  const config = OTP_TYPE_CONFIG[type] || OTP_TYPE_CONFIG.default;
  const { countdown, isCountdownFinished } = useCountdown({
    endingDate: formValues?.expiresIn,
    isNeedCountdown: Boolean(formValues?.expiresIn),
    withHours: false,
  });

  const { setIsGlobalLoading } = useLoadingAction();

  useEffect(() => {
    if (isTranslationsReady) setIsGlobalLoading(false);
  }, [isTranslationsReady, setIsGlobalLoading]);

  const [isReady, setIsReady] = useState(false);

  // Initialize isReady state similar to RequestOtpWeb pattern
  useShallowCompareEffect(() => {
    const timer = setTimeout(() => {
      if (
        (!formValues?.token || !formValues?.target || !formValues?.otpType) &&
        !_dontRedirect
      ) {
        // Could redirect or handle missing data here if needed
        return;
      }
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [formValues, _dontRedirect]);

  const handleRequestOtp = (formValues) => {
    if (!formValues?.token || !formValues?.target) {
      return;
    }
    console.log(formValues, "otp");

    if (!formValues?.expiresIn || isAfter(Date.now(), formValues?.expiresIn)) {
      resendOtp().catch((error) => {
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
  }, [isReady, formValues?.token, formValues?.target, formValues?.otpType]);

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

  const renderMainMessage = () => {
    return (
      <div
        className={cn(
          "text-center text-base font-medium leading-[19.2px]",
          type === "forgot-password" || type === "whatsapp"
            ? ""
            : "max-w-[452px]",

          config.textColor || "text-neutral-50"
        )}
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
            : type === "whatsapp"
              ? "OtpContainer.textCheckWhatsappForWhatsapp" // Key baru untuk tipe whatsapp
              : type === "change-email2"
                ? "OtpContainer.textCheckEmailChangeEmail2"
                : "OtpContainer.textCheckWhatsapp",
          {},
          config.mainMessage
        )}
      </div>
    );
  };

  const renderWhatsAppSection = () => {
    return (
      <div className="flex w-full flex-wrap items-center justify-center gap-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "text-sm font-bold leading-[16.8px]",
              config.textColor || "text-neutral-50"
            )}
          >
            {t(
              type === "change-number"
                ? "OtpContainer.textOtpSentToNumber"
                : type === "change-email" || type === "change-email2"
                  ? "OtpContainer.labelEmailAddress"
                  : "OtpContainer.labelWhatsappNumber",
              {},
              config.labelMessage
            )}
          </div>
          <div
            className={cn(
              "max-w-[176px] truncate text-sm font-semibold leading-[16.8px]",
              config.labelColor || "text-[#EBEBEB]"
            )}
          >
            {type === "change-email"
              ? formValues?.target || "0872517235"
              : type === "change-email2"
                ? formValues?.newTarget || "user@example.com"
                : type === "change-number"
                  ? formValues?.newTarget || "user@example.com"
                  : number || formValues?.target}
          </div>
          {type !== "forgot-password" &&
            type !== "whatsapp" &&
            type !== "change-email" && (
              <Button
                variant="muatparts-primary"
                name="change"
                onClick={() =>
                  type === "change-email2"
                    ? setIsChangeEmailModalOpen(true)
                    : setIsChangeNumberModalOpen(true)
                }
                className={cn(
                  "ml-3 flex w-[50px] items-center py-0 text-xxs md:h-5",
                  "!bg-[#EBEBEB] !text-[#868686]",
                  isCountdownFinished && "!bg-[#EBEBEB] !text-primary-700"
                )}
                disabled={!isCountdownFinished}
              >
                {t("OtpContainer.buttonChange", {}, "Ganti")}
              </Button>
            )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (otp.length === 6) {
      setNotification(null);

      const handleSuccess = () => {
        // If the type is 'whatsapp', redirect to profile to open the change number modal.
        if (type === "whatsapp") {
          router.push("/profil?hasVerified=true");
          return;
        }
        // If the type is 'change-email' or 'change-email2', redirect to profile to open the email modal.
        if (type === "change-email") {
          router.push("/profil?hasVerifiedEmail=true");
          return;
        }
        if (type === "change-email2") {
          setIsSuccessEmailModalOpen(true);
          return;
        }
        if (type === "change-number") {
          setIsSuccessModalOpen(true);
        } else {
          setIsVerified(true);
          onVerifySuccess();
        }
      };

      verifyOtp(otp)
        .then(handleSuccess)
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
    <div
      className={cn(
        "relative flex min-h-screen",
        config.backgroundColor || "bg-primary-700"
      )}
    >
      {config.showMeteors && (
        <>
          <div className="absolute left-0 top-0">
            <img
              src="/img/meteor1.png"
              alt="meteor1"
              width={160}
              height={160}
            />
          </div>
          <div
            className={`absolute ${isVerified ? "bottom-[80px]" : "bottom-[118px]"} right-[7px]`}
          >
            <img
              src="/img/meteor2.png"
              alt="meteor2"
              width={160}
              height={160}
            />
          </div>
        </>
      )}

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
          <div
            className={cn(
              `${config.logoMargin} flex w-full flex-col items-center text-center`,
              config.textColor || "text-neutral-50"
            )}
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

          <img
            src={isVerified ? "/img/otp-transporter/logo.png" : config.imageSrc}
            alt={isVerified ? "success" : "security"}
            width={isVerified ? 200 : config.imageSize.width}
            height={isVerified ? 221 : config.imageSize.height}
            className="object-contain"
            loading="eager"
          />

          {!isVerified ? (
            <>
              {renderNotification()}
              <div className="flex w-full flex-col items-center">
                {renderMainMessage()}
                <div className="mt-6 flex w-full flex-col items-center">
                  {renderWhatsAppSection()}
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <label
                      className={cn(
                        "text-sm font-bold leading-[16.8px]",
                        config.textColor || "text-neutral-50",
                        type === "whatsapp" ? "w-auto" : "w-[102px]"
                      )}
                    >
                      {config.inputLabel || t("labelEnterOTP")}
                    </label>
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                      pattern={REGEXP_ONLY_DIGITS}
                      aria-invalid={notification?.status === "error"}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className={cn(
                            notification?.status === "error" &&
                              "!border-red-500",
                            "focus:!border-blue-500 focus:!ring-blue-500/20"
                          )}
                        />
                        <InputOTPSlot
                          index={1}
                          className={cn(
                            notification?.status === "error" &&
                              "!border-red-500",
                            "focus:!border-blue-500 focus:!ring-blue-500/20"
                          )}
                        />
                        <InputOTPSlot
                          index={2}
                          className={cn(
                            notification?.status === "error" &&
                              "!border-red-500",
                            "focus:!border-blue-500 focus:!ring-blue-500/20"
                          )}
                        />
                        <InputOTPSlot
                          index={3}
                          className={cn(
                            notification?.status === "error" &&
                              "!border-red-500",
                            "focus:!border-blue-500 focus:!ring-blue-500/20"
                          )}
                        />
                        <InputOTPSlot
                          index={4}
                          className={cn(
                            notification?.status === "error" &&
                              "!border-red-500",
                            "focus:!border-blue-500 focus:!ring-blue-500/20"
                          )}
                        />
                        <InputOTPSlot
                          index={5}
                          className={cn(
                            notification?.status === "error" &&
                              "!border-red-500",
                            "focus:!border-blue-500 focus:!ring-blue-500/20"
                          )}
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                {(formValues?.verificationMethod === "email" ||
                  type === "change-email2") && (
                  <div className="mt-6 max-w-[319px] rounded-md bg-[#FFF1A5] px-4 py-3 text-center text-xs font-medium leading-[14.4px] text-neutral-900">
                    {`${t("labelIfOtpNotFound")} `}
                    <span className="font-bold">{t("labelSpam")}</span>,{" "}
                    <span className="font-bold">{t("labelSosial")}</span>,{" "}
                    {`${t("labelOr")} `}
                    <span className="font-bold">{t("labelPromosi")}</span>{" "}
                    {t("labelInYourEmail")}
                  </div>
                )}

                <div
                  className={cn(
                    "mt-6 text-center text-base font-medium leading-[19.2px]",
                    config.textColor || "text-neutral-50"
                  )}
                >
                  {`${t("labelOtpCodeExpiredIn")} `}
                  <span className="font-bold">{countdown}</span>
                </div>
              </div>

              <Button
                name="resend"
                onClick={() => {
                  if (isCountdownFinished) {
                    handleRequestOtp(formValues);
                  }
                }}
                disabled={!isCountdownFinished}
                className={cn(
                  `mt-[10px] flex h-10 max-w-[319px] items-center justify-center text-nowrap text-[14px] font-bold transition-colors duration-300`,
                  config.buttonSize,
                  isCountdownFinished
                    ? config.activeResendButtonClass ||
                        "!bg-muat-trans-primary-400 !text-primary-700"
                    : config.resendButtonClass ||
                        "!bg-[#EBEBEB] !text-[#868686]"
                )}
              >
                {type === "change-number" ||
                type === "whatsapp" ||
                type === "change-email" ||
                type === "change-email2"
                  ? config.buttonText
                  : t("OtpContainer.buttonResendOtp", {}, config.buttonText)}
              </Button>
            </>
          ) : (
            <>
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

      {type === "change-email2" ? (
        <ChangeEmailModal
          isOpen={isChangeEmailModalOpen}
          size="big"
          setIsOpen={setIsChangeEmailModalOpen}
          title={{
            text: t("OtpContainer.titleChangeEmail", {}, "Ubah Email"),
            className: "text-center",
          }}
          isChangeEmail2={true}
          confirm={{
            text: "Ubah",
            onClick: (_newEmail) => {
              sendRequestOtp(
                formValues.target,
                "EMAIL",
                "CHANGE_EMAIL",
                "VERIFY_NEW",
                _newEmail
              )
                .then((response) => {
                  console.log(response, "tes");
                  setIsChangeEmailModalOpen(false);
                  setNotification({
                    status: "success",
                    message: t(
                      "OtpContainer.messageChangeEmailSuccess",
                      {},
                      "Berhasil mengubah Email Kamu"
                    ),
                  });
                })
                .catch((error) => {
                  console.error("Error sending OTP:", error);
                  setNotification({
                    status: "error",
                    message: error.message || "Gagal mengirim OTP",
                  });
                });
            },
          }}
        />
      ) : (
        <ChangeWhatsappModal
          isOpen={isChangeNumberModalOpen}
          size="big"
          setIsOpen={setIsChangeNumberModalOpen}
          title={{
            text: t(
              "OtpContainer.titleChangeWhatsapp",
              {},
              "Ubah No. Whatsapp"
            ),
            className: "text-center",
          }}
          isChangeNumber={type === "change-number"}
          confirm={{
            text: "Ubah",
            onClick: (_newWhatsappNumber) => {
              // Check if purpose is EMAIL_VERIFICATION to call updateWhatsAppNumber directly
              if (formValues.purpose === "EMAIL_VERIFICATION") {
                updateWhatsAppNumber(_newWhatsappNumber)
                  .then((response) => {
                    console.log(response, "tes");
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
                    handleRequestOtp(formValues);
                  })
                  .catch((error) => {
                    console.error("Error updating WhatsApp number:", error);
                    setNotification({
                      status: "error",
                      message: error.message || "Gagal mengubah nomor WhatsApp",
                    });
                  });
              } else {
                sendRequestOtp(
                  formValues.target,
                  "WHATSAPP",
                  "CHANGE_PHONE",
                  "VERIFY_NEW",
                  _newWhatsappNumber
                )
                  .then((response) => {
                    console.log(response, "tes");
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
                  })
                  .catch((error) => {
                    console.error("Error sending OTP:", error);
                    setNotification({
                      status: "error",
                      message: error.message || "Gagal mengirim OTP",
                    });
                  });
              }
            },
          }}
        />
      )}

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
                updateWhatsAppNumber().then(() => {
                  router.push("/login");
                });
              }}
              type="button"
            >
              {t("OtpContainer.buttonOk", {}, "OK")}
            </Button>
          </div>
        </ModalContent>
      </Modal>

      <Modal
        closeOnOutsideClick={false}
        open={isSuccessEmailModalOpen}
        onOpenChange={setIsSuccessEmailModalOpen}
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
                  Email Berhasil Diubah
                </h1>
              </div>
              <img
                alt=""
                src="/img/otp-transporter/success.png"
                className="h-[110px] w-[110px] object-cover"
              />
              <div className="px-4 text-center text-sm font-medium leading-[16.8px] text-neutral-900">
                Kamu sekarang bisa masuk menggunakan email baru
              </div>
            </div>
            <Button
              variant="muattrans-primary"
              className="h-8 w-28"
              onClick={() => {
                setIsSuccessEmailModalOpen(false);
                updateEmailAddress().then(() => {
                  router.push("/login");
                });
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
