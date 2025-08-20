"use client";

import { useState } from "react";

import Button from "../Button/Button";
import { FormContainer, FormLabel } from "../Form/Form";
import { InfoTooltip } from "../Form/InfoTooltip";
import Input from "../Form/Input";
import IconComponent from "../IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "./Modal";

const ModalGantiPassword = ({ open, onOpenChange, onSubmit }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

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
    if (!oldPassword) err.oldPassword = "Password Lama wajib diisi";
    if (!newPassword) err.newPassword = "Password Baru wajib diisi";
    if (!confirmPassword) err.confirmPassword = "Ulangi Password wajib diisi";
    if (newPassword && newPassword.length < 8) {
      err.newPassword =
        "Password harus terdapat huruf besar, kecil dan angka. Minimal 8 Karakter";
    }
    if (oldPassword && oldPassword.length < 8) {
      err.oldPassword =
        "Password harus terdapat huruf besar, kecil dan angka. Minimal 8 Karakter";
    }
    if (oldPassword !== "12345678") {
      err.oldPassword = "Password lama salah";
    }
    if (confirmPassword && confirmPassword.length < 8) {
      err.confirmPassword =
        "Password harus terdapat huruf besar, kecil dan angka. Minimal 8 Karakter";
    }
    if (newPassword && oldPassword && newPassword === oldPassword) {
      err.newPassword = "Password Baru tidak dapat sama dengan password lama";
    }
    if (confirmPassword && newPassword && confirmPassword !== newPassword) {
      err.confirmPassword = "Password tidak sama";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit?.({ oldPassword, newPassword, confirmPassword });
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="small" className="h-[446px] w-[695px]">
        <ModalHeader />
        <div className="flex flex-col items-center gap-6 px-8 py-6">
          <h3 className="text-center text-lg font-bold text-neutral-900">
            Ubah Password
          </h3>

          <FormContainer className="w-full md:!gap-4">
            <FormLabel required>Password Lama</FormLabel>
            <div className="relative h-[40px]">
              <Input
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                  clearError("oldPassword");
                }}
                placeholder="Masukkan Password Lama"
                name="oldPassword"
                errorMessage={errors.oldPassword}
                icon={{
                  left: "/icons/lock-orange.svg",
                  right: (
                    <button
                      type="button"
                      onClick={() => setShowOld((v) => !v)}
                      className="flex items-center"
                    >
                      <IconComponent
                        src={showOld ? "/icons/eye.svg" : "/icons/eye-off.svg"}
                        height={24}
                        width={24}
                      />
                    </button>
                  ),
                }}
                appearance={{
                  containerClassName:
                    "rounded-[6px] border bg-white px-3 py-2 w-[440px] h-[40px]",

                  inputClassName: "text-base",
                }}
              />
            </div>

            <FormLabel className={"mt-9"} required>
              Password Baru
            </FormLabel>
            <div className="relative h-[86px]">
              <div className="col-span-full flex justify-end pb-2 pr-6 pt-3 text-xs font-medium text-primary-700">
                <a href="#" className="hover:text-primary-800">
                  Lupa Password?
                </a>
              </div>
              <div className="flex items-center">
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    clearError("newPassword");
                  }}
                  placeholder="Masukkan Password Baru"
                  name="newPassword"
                  errorMessage={errors.newPassword}
                  icon={{
                    left: "/icons/lock-orange.svg",
                    right: (
                      <button
                        type="button"
                        onClick={() => setShowNew((v) => !v)}
                        className="flex items-center"
                        aria-label={
                          showNew
                            ? "Sembunyikan password"
                            : "Tampilkan password"
                        }
                      >
                        <IconComponent
                          src={
                            showNew ? "/icons/eye.svg" : "/icons/eye-off.svg"
                          }
                          height={24}
                          width={24}
                        />
                      </button>
                    ),
                  }}
                  appearance={{
                    containerClassName:
                      "rounded-[6px] border bg-white px-3 py-2 w-[440px] h-[40px]",
                    inputClassName: "text-base",
                  }}
                />

                {/* Tooltip info di kanan input */}
                <div className="flex h-[22px] w-auto items-center justify-center">
                  <InfoTooltip
                    className="mr-2 max-w-[260px]"
                    side="right"
                    align="center"
                    sideOffset={8}
                    trigger={
                      <button type="button" aria-label="Info kriteria password">
                        <IconComponent
                          src="/icons/info16.svg"
                          height={18}
                          width={18}
                          className="text-primary-700"
                        />
                      </button>
                    }
                  >
                    <div className="text-xs">
                      <ul className="space-y-1 text-neutral-700">
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-neutral-700"></span>
                          <span>Password minimal 8 karakter</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-neutral-700"></span>
                          <span>Terdapat min. 1 huruf besar</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-neutral-700"></span>
                          <span>Terdapat min. 1 huruf kecil</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-neutral-700"></span>
                          <span>Terdapat angka</span>
                        </li>
                      </ul>
                    </div>
                  </InfoTooltip>
                </div>
              </div>
            </div>

            <FormLabel required>Konfirmasi Password Baru</FormLabel>
            <div className="relative h-[52px]">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError("confirmPassword");
                }}
                placeholder="Ulangi Password Baru"
                name="confirmPassword"
                errorMessage={errors.confirmPassword}
                icon={{
                  left: "/icons/lock-orange.svg",
                  right: (
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="flex items-center"
                    >
                      <IconComponent
                        src={
                          showConfirm ? "/icons/eye.svg" : "/icons/eye-off.svg"
                        }
                        height={24}
                        width={24}
                      />
                    </button>
                  ),
                }}
                appearance={{
                  containerClassName:
                    "rounded-[6px] border bg-white px-3 py-2 w-[440px] h-[40px]",
                  inputClassName: "text-base",
                }}
              />
            </div>
          </FormContainer>
        </div>
        <div className="mt-2 flex justify-center">
          <Button
            onClick={handleSubmit}
            variant="muattrans-primary"
            className="!h-8 !w-auto rounded-full bg-muat-trans-primary-400 text-base font-[600px] text-muat-trans-secondary-900 hover:bg-muat-trans-primary-500"
          >
            Ubah Password
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalGantiPassword;
