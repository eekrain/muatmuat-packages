"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { cn } from "@/lib/utils";

/**
 * A modal for changing or updating email address.
 * Follows the same design pattern as ChangeWhatsappNumberModal.
 *
 * @param {object} props
 * @param {boolean} props.open - Controls if the modal is open.
 * @param {function} props.onOpenChange - Function to change the modal's open state.
 * @param {function} props.onSubmit - Callback triggered with the new email on successful submission.
 */
const ModalEmailBaru = ({
  open,
  onOpenChange,
  onSubmit,
  currentEmail = "public.relation.mrsby@midtownight.com",
}) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // daftar lokal email yang dianggap sudah ada
  const localRegisteredEmails = ["test@example.com", "admin@muatmuat.id"];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async () => {
    setErrorMessage("");
    const trimmedEmail = (email || "").trim().toLowerCase();

    if (!trimmedEmail) {
      setErrorMessage("Email wajib diisi.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setErrorMessage("Penulisan email salah");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Format email tidak valid.");
      return;
    }

    if (trimmedEmail.includes("..")) {
      setErrorMessage("Format email tidak valid.");
      return;
    }

    const domain = trimmedEmail.split("@")[1];
    if (!domain || domain.length < 3 || !domain.includes(".")) {
      setErrorMessage("Domain email tidak valid.");
      return;
    }

    if (trimmedEmail.length < 5) {
      setErrorMessage("Email terlalu pendek.");
      return;
    }
    if (trimmedEmail.length > 254) {
      setErrorMessage("Email terlalu panjang.");
      return;
    }

    // cek sama dengan email aktif
    if (currentEmail && trimmedEmail === currentEmail.trim().toLowerCase()) {
      setErrorMessage("Email baru tidak boleh sama dengan email saat ini.");
      return;
    }

    // cek email sudah ada di list lokal
    if (localRegisteredEmails.includes(trimmedEmail)) {
      setErrorMessage("Email sudah terdaftar. Gunakan email lain.");
      return;
    }

    // lolos semua validasi
    if (typeof onSubmit === "function") {
      onSubmit(trimmedEmail);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (errorMessage) setErrorMessage("");

    const trimmedValue = value.trim().toLowerCase();

    if (!trimmedValue) return;

    // if (!trimmedValue.includes("@")) {
    //   setErrorMessage("Alamat email harus mengandung '@'.");
    //   return;
    // }

    // if (trimmedValue.includes("..")) {
    //   setErrorMessage("Format email tidak valid.");
    //   return;
    // }

    // if (currentEmail && trimmedValue === currentEmail.trim().toLowerCase()) {
    //   setErrorMessage("Email baru tidak boleh sama dengan email saat ini.");
    //   return;
    // }

    // if (localRegisteredEmails.includes(trimmedValue)) {
    //   setErrorMessage("Email sudah terdaftar. Gunakan email lain.");
    //   return;
    // }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="small" className="w-[550px] p-0" type="muattrans">
        <ModalHeader isChangeEmail={true} />

        <div className="flex flex-col items-center gap-6 p-8">
          <h3 className="text-center text-[14px] text-lg font-bold text-neutral-900">
            Masukkan email baru
          </h3>
          <p className="max-w-xs text-center text-[12px] text-neutral-900">
            Pastikan email kamu aktif karena kami <br /> akan mengirim kode
            verifikasi ke email ini
          </p>

          <div className="w-full px-4">
            <Input
              icon={{ left: "/icons/verify-email.svg" }}
              value={email}
              onChange={handleInputChange}
              leftIcon={
                <IconComponent
                  src="/icons/verify-email.svg"
                  alt="email"
                  width={24}
                  height={24}
                />
              }
              placeholder="Masukkan Email"
              className="w-full"
              type="email"
              errorMessage={errorMessage}
              hideErrorMessage={true}
              appearance={{
                containerClassName: errorMessage ? "!border-[#F71717]" : "",
              }}
            />
          </div>

          <Button
            onClick={handleSubmit}
            variant="muattrans-primary"
            className={cn(
              "h-8 w-[147px] bg-[#FDB913] text-black hover:bg-yellow-500"
            )}
            disabled={!!errorMessage || isLoading}
          >
            {isLoading ? "Mengirim..." : "Verifikasi Email"}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

// Modal Header component matching ChangeWhatsappNumberModal
const ModalHeader = ({ className, isChangeEmail }) => (
  <div
    className={cn(
      `relative flex h-[70px] justify-between overflow-hidden rounded-t-xl`,
      isChangeEmail ? "bg-muat-trans-primary-400" : "bg-buyer-seller-900",
      className
    )}
  >
    {isChangeEmail ? (
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

export default ModalEmailBaru;
