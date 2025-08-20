import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const ChangeEmailModal = ({
  size = "small",
  _variant = "primary",
  isOpen,
  setIsOpen,
  title = { text: "", className: "" },
  description = { text: "", className: "" },
  originalEmail = "user@example.com",
  cancel = { classname: "", text: "", onClick: () => setIsOpen(false) },
  confirm = { classname: "", text: "", onClick: () => setIsOpen(false) },
  isChangeEmail2,
}) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { text: titleText = "", className: titleClassName = "" } = title;
  const { text: _descriptionText, className: _descriptionClassName } =
    description;
  const {
    classname: _cancelClassname,
    text: _cancelText,
    onClick: _onCancel,
  } = cancel;
  const {
    classname: confirmClassname = "",
    text: confirmText = "",
    onClick: onConfirm = () => setIsOpen(false),
  } = confirm;

  const validateEmail = (value) => {
    // Reset error message
    setErrorMessage("");

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setErrorMessage("Penulisan email salah");
      return false;
    }

    // Check if email is same as previous
    if (value === originalEmail) {
      setErrorMessage("Email tidak boleh sama dengan sebelumnya");
      return false;
    }

    // Mock check for already registered email (for demo purposes)
    // In a real app, this would be an API call
    const registeredEmails = ["test@example.com", "admin@muatmuat.com"];
    if (registeredEmails.includes(value)) {
      setErrorMessage("Email telah terdaftar");
      return false;
    }

    return true;
  };

  const modalClassnames = {
    small: "w-modal-small",
    big: "w-modal-big",
  };
  const modalClassname = modalClassnames[size] || modalClassnames.small;

  return (
    <Modal closeOnOutsideClick={false} open={isOpen} onOpenChange={setIsOpen}>
      <ModalContent
        className={`${isChangeEmail2 ? "w-[550px]" : "w-[496px]"}`}
        type="muattrans"
      >
        <ModalHeader size={size} isChangeEmail2={isChangeEmail2} />
        <div className="flex flex-col items-center gap-y-6 px-6 py-9">
          {titleText ? (
            <h1
              className={cn(
                "text-base font-bold leading-[19.2px] text-neutral-900",
                titleClassName
              )}
            >
              {titleText}
            </h1>
          ) : null}
          {!isChangeEmail2 && errorMessage ? (
            <div
              className={`flex w-full flex-row items-center justify-center gap-x-2.5 rounded-md border border-[#F71717] bg-[#FFE5E5] px-3 py-[15px]`}
            >
              <IconComponent src="/icons/Message-yellow.svg" alt="email" />
              <span className="text-xs font-semibold leading-[14.4px]">
                {errorMessage}
              </span>
            </div>
          ) : null}
          <Input
            icon={{ left: "/icons/Message-yellow.svg" }}
            placeholder={isChangeEmail2 ? "Masukan Email" : "Email"}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              // Clear error when typing
              if (errorMessage) setErrorMessage("");
            }}
            errorMessage={errorMessage}
            hideErrorMessage={isChangeEmail2 ? false : true}
            appearance={{
              containerClassName: errorMessage
                ? "!h-12 border-[#F71717]"
                : "!h-12",
              iconClassName: "size-6",
              inputClassName: "text-sm md:text-base",
            }}
          />
          <div className="flex items-center gap-x-2">
            <Button
              variant={isChangeEmail2 ? "" : "muatparts-primary"}
              className={cn("h-8 w-28", confirmClassname)}
              onClick={() => {
                if (validateEmail(email)) {
                  onConfirm(email);
                }
              }}
              type="button"
              disabled={!email || errorMessage}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ChangeEmailModal;

export const ModalHeader = ({ className, isChangeEmail2 }) => (
  <div
    className={cn(
      `relative flex h-[70px] justify-between overflow-hidden rounded-t-xl ${isChangeEmail2 ? "bg-[#FDB913]" : "bg-buyer-seller-900"} `,
      className
    )}
  >
    {isChangeEmail2 ? (
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
            alt="svg header modal kanan "
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
            alt="svg header modal kanan "
            src="/img/otp-transporter/comet-kana.png"
            className="h-full w-full object-cover"
          />
        </div>
      </>
    )}
  </div>
);
