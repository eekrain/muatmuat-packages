"use client";

import { useState } from "react";

import Button from "../Button/Button";
import Input from "../Form/Input";
import { Modal, ModalContent, ModalHeader } from "./Modal";

const ModalEmailBaru = ({ open, onOpenChange, onSubmit, currentEmail }) => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Daftar lokal email yang dianggap sudah ada
  const localRegisteredEmails = ["test@example.com", "admin@muatmuat.id"];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Function to clear specific error when user starts typing
  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const err = {};
    const trimmedEmail = (email || "").trim().toLowerCase();

    if (!trimmedEmail) {
      err.email = "Email wajib diisi";
    } else if (!trimmedEmail.includes("@")) {
      err.email = "Penulisan email salah";
    } else if (!emailRegex.test(trimmedEmail)) {
      err.email = "Format email tidak valid";
    } else if (trimmedEmail.includes("..")) {
      err.email = "Format email tidak valid";
    } else {
      const domain = trimmedEmail.split("@")[1];
      if (!domain || domain.length < 3 || !domain.includes(".")) {
        err.email = "Domain email tidak valid";
      } else if (
        currentEmail &&
        trimmedEmail === currentEmail.trim().toLowerCase()
      ) {
        err.email = "Email baru tidak boleh sama dengan sebelumnya";
      } else if (localRegisteredEmails.includes(trimmedEmail)) {
        err.email = "Email sudah terdaftar";
      }
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsLoading(true);
      try {
        const trimmedEmail = email.trim().toLowerCase();
        if (typeof onSubmit === "function") {
          await onSubmit(trimmedEmail);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="small" className="h-[350px] w-[550px]">
        <ModalHeader />
        <div className="flex flex-col items-center gap-6 px-8 py-6">
          <h3 className="text-center text-lg font-bold text-neutral-900">
            Masukkan Email Baru
          </h3>
          <p className="max-w-xs text-center text-xs text-neutral-700">
            Pastikan email kamu aktif karena kami akan mengirim kode verifikasi
            ke email ini
          </p>

          <div className="w-full">
            <div className="relative h-[50px] px-6">
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                placeholder="Masukkan Email Baru"
                name="email"
                errorMessage={errors.email}
                icon={{
                  left: "/icons/Message-yellow.svg",
                }}
                appearance={{
                  containerClassName:
                    "rounded-[6px] border bg-white px-3 py-2 w-full h-[40px]",
                  inputClassName: "text-base",
                }}
              />
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-center">
          <Button
            onClick={handleSubmit}
            variant="muattrans-primary"
            className="!h-8 !w-auto rounded-full bg-muat-trans-primary-400 text-base font-[600px] text-muat-trans-secondary-900 hover:bg-muat-trans-primary-500"
            disabled={isLoading}
          >
            Verifikasi Email
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalEmailBaru;
