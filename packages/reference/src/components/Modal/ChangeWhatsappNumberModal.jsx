"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";

import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

/**
 * A versatile modal for changing or verifying a WhatsApp number.
 * The behavior is controlled by the `type` prop.
 *
 * @param {object} props
 * @param {boolean} props.open - Controls if the modal is open.
 * @param {function} props.onOpenChange - Function to change the modal's open state.
 * @param {function} props.onSubmit - Callback triggered with the new number on successful submission.
 * @param {'verification' | 'profile'} [props.type='verification'] - Determines the modal's behavior.
 * - 'verification': Simple numeric validation, uses toast for errors.
 * - 'profile': Advanced validation (length, patterns, uniqueness), displays errors inside the modal.
 * @param {string} [props.originalWhatsapp=''] - The original WhatsApp number, required for validation in 'profile' mode.
 */
const ChangeWhatsappNumberModal = ({
  open,
  onOpenChange,
  onSubmit,
  type = "verification", // 'verification' or 'profile'
  originalWhatsapp = "",
}) => {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  console.log("OLD WA:", originalWhatsapp);

  // Advanced validation logic for 'profile' type
  const validateWhatsappForProfile = (value) => {
    setErrorMessage("");
    if (!value) {
      setErrorMessage("Nomor Whatsapp wajib diisi.");
      return false;
    }
    if (value.length < 8) {
      setErrorMessage("No. Whatsapp minimal 8 digit");
      return false;
    }
    if (value === originalWhatsapp) {
      setErrorMessage("No. Whatsapp tidak boleh sama dengan sebelumnya");
      return false;
    }
    const repeatedDigitPattern = /^(\d)\1{7,}$/;
    const repeatedDigit5TimesPattern = /(\d)\1{4,}/;
    const sequentialPattern =
      /012345|123456|234567|345678|456789|987654|876543|765432|654321|543210/;

    if (
      repeatedDigitPattern.test(value) ||
      sequentialPattern.test(value) ||
      repeatedDigit5TimesPattern.test(value)
    ) {
      setErrorMessage("Format No. Whatsapp salah");
      return false;
    }

    const registeredNumbers = ["081234567890", "085157579161"];
    if (registeredNumbers.includes(value)) {
      setErrorMessage("No. Whatsapp telah terdaftar");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (type === "profile") {
      if (validateWhatsappForProfile(whatsappNumber)) {
        onSubmit(whatsappNumber);
      }
    } else {
      if (!/^\d+$/.test(whatsappNumber)) {
        toast.error("Mohon masukkan nomor Whatsapp yang valid.");
        return;
      }
      onSubmit(whatsappNumber);
    }
  };

  const handleInputChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setWhatsappNumber(numericValue);
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const isProfileMode = type === "profile";
  const modalTitle = isProfileMode
    ? "Masukkan nomor Whatsapp baru"
    : "Ubah Nomor Whatsapp";
  const modalDescription = isProfileMode
    ? "Pastikan nomor Whatsapp kamu aktif karena kami akan mengirim kode verifikasi ke nomor ini"
    : "Nomor Whatsapp baru akan digunakan untuk akun Anda.";
  const buttonText = isProfileMode ? "Verifikasi No. Whatsapp" : "Simpan";

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="small" className="w-[550px] p-0" type="muattrans">
        <ModalHeader isChangeNumber={true} />

        <div className="flex flex-col items-center gap-6 p-8">
          <h3 className="text-center text-lg font-bold text-neutral-900">
            {modalTitle}
          </h3>
          <p className="max-w-xs text-center text-xs text-neutral-900">
            {modalDescription}
          </p>

          {/* {isProfileMode && errorMessage && (
            <div className="flex w-full flex-row items-center justify-center gap-x-2.5 rounded-md border border-[#F71717] bg-[#FFE5E5] px-3 py-3.5">
              <IconComponent className="text-[#F71717]" src="/icons/info16.svg" />
              <span className="text-xs font-semibold leading-[14.4px] text-neutral-800">
                {errorMessage}
              </span>
            </div>
          )} */}

          <div className="w-full">
            <Input
              icon={{ left: "/icons/whatsapp.svg" }}
              value={whatsappNumber}
              onChange={handleInputChange}
              leftIcon={
                <IconComponent
                  src="/icons/whatsapp-icon.svg"
                  alt="whatsapp"
                  width={24}
                  height={24}
                />
              }
              placeholder="Masukkan No. Whatsapp"
              className="w-full"
              type="tel"
              errorMessage={isProfileMode ? errorMessage : ""}
              hideErrorMessage={true}
              appearance={{
                containerClassName:
                  isProfileMode && errorMessage ? "!border-[#F71717]" : "",
              }}
            />
          </div>

          <Button
            onClick={handleSubmit}
            variant="muattrans-primary"
            className={cn("bg-[#FDB913] text-black hover:bg-yellow-500", {
              "w-full": !isProfileMode, // w-full jika BUKAN profile mode
              "w-52": isProfileMode, // w-40 jika profile mode
            })}
            disabled={isProfileMode && !!errorMessage}
          >
            {buttonText}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

// Consolidated ModalHeader
const ModalHeader = ({ className, isChangeNumber }) => (
  <div
    className={cn(
      `relative flex h-[70px] justify-between overflow-hidden rounded-t-xl`,
      isChangeNumber ? "bg-muat-trans-primary-400" : "bg-buyer-seller-900",
      className
    )}
  >
    {isChangeNumber ? (
      <>
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
            alt="svg header modal kanan"
            src="/img/header-modal/header-kanan.svg"
            className="h-full w-full object-cover"
          />
        </div>
      </>
    ) : (
      <>
        <div>
          <img
            alt="svg header modal kiri"
            src="/img/otp-transporter/comet-kiri.png"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="my-auto">
          <img
            alt="logo muatmuat header coklat"
            src="/img/otp-transporter/muatmuat.png"
          />
        </div>
        <div>
          <img
            alt="svg header modal kanan"
            src="/img/otp-transporter/comet-kana.png"
            className="h-full w-full object-cover"
          />
        </div>
      </>
    )}
  </div>
);

export default ChangeWhatsappNumberModal;
