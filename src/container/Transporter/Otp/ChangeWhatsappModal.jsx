import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const ChangeWhatsappModal = ({
  size = "small",
  _variant = "primary",
  isOpen,
  setIsOpen,
  title = { text: "", className: "" }, // Added default value here
  description = { text: "", className: "" },
  originalWhatsapp = "",
  // 25. 18 - Web - LB - 0275
  cancel = { classname: "", text: "", onClick: () => setIsOpen(false) }, // Added default for cancel
  confirm = { classname: "", text: "", onClick: () => setIsOpen(false) }, // Added default for confirm
}) => {
  const { t } = useTranslation();
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { text: titleText = "", className: titleClassName = "" } = title;
  // Destructuring with unused variables prefixed with underscore
  const { text: _descriptionText, className: _descriptionClassName } =
    description;
  // 25. 18 - Web - LB - 0275
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

  const validateWhatsapp = (value) => {
    // Reset error message
    setErrorMessage("");

    // Check if number is too short (less than 8 digits)
    if (value.length < 8) {
      setErrorMessage("No. Whatsapp PIC minimal 8 digit");
      return false;
    }

    // Check for invalid formats (repeated digits or nonsensical patterns)
    const repeatedDigitPattern = /^(\d)\1+$/; // Checks if all digits are the same
    const repeatedDigit5TimesPattern = /(\d)\1{4,}/; // Checks if any digit repeats 5 or more times
    const sequentialPattern =
      /^(?:0123456789|1234567890|9876543210|0987654321)$/; // Common sequential patterns

    if (
      repeatedDigitPattern.test(value) ||
      sequentialPattern.test(value) ||
      repeatedDigit5TimesPattern.test(value)
    ) {
      setErrorMessage("Format No. Whatsapp salah");
      return false;
    }

    // Check if number is same as previous
    if (value === originalWhatsapp) {
      setErrorMessage("No. Whatsapp tidak boleh sama dengan sebelumnya");
      return false;
    }

    // Mock check for already registered number (for demo purposes)
    // In a real app, this would be an API call
    const registeredNumbers = ["081234567890", "089876543210"];
    if (registeredNumbers.includes(value)) {
      setErrorMessage("No. Whatsapp telah terdaftar");
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
      <ModalContent className="w-[496px]" type="muattrans">
        <ModalHeader size={size} />
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
          {errorMessage ? (
            <div
              className={`flex w-full flex-row items-center justify-center gap-x-2.5 rounded-md border border-[#F71717] bg-[#FFE5E5] px-3 py-[15px]`}
            >
              <IconComponent
                className="text-[#F71717]"
                src="/icons/info16.svg"
              />
              <span className="text-xs font-semibold leading-[14.4px]">
                {errorMessage}
              </span>
            </div>
          ) : null}
          <Input
            icon={{ left: "/icons/whatsapp.svg" }}
            placeholder={t("No. Whatsapp")}
            value={whatsappNumber}
            onChange={(e) => {
              // Only allow numeric input
              const numericValue = e.target.value.replace(/\D/g, "");
              setWhatsappNumber(numericValue);
              // Clear error when typing
              if (errorMessage) setErrorMessage("");
            }}
            hideErrorMessage={true}
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
              variant="muatparts-primary"
              // 25. 18 - Web - LB - 0275
              className={cn("h-8 w-28", confirmClassname)}
              onClick={() => {
                if (validateWhatsapp(whatsappNumber)) {
                  onConfirm(whatsappNumber);
                }
              }}
              type="button"
              disabled={!whatsappNumber || errorMessage}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ChangeWhatsappModal;

export const ModalHeader = ({ className }) => (
  <div
    className={cn(
      "relative flex h-[70px] justify-between overflow-hidden rounded-t-xl bg-buyer-seller-900",
      className
    )}
  >
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
  </div>
);
