import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";

export default function ModalAddOption({
  title,
  placeholder,
  isOpen,
  onClose,
  onAdd,
  errorMessage,
}) {
  const [value, setValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const handleClose = () => {
    setValue("");
    onClose();
  };

  const handleSubmit = () => {
    if (value === "") {
      setHasError(true);
      return;
    }
    onAdd({ id: new Date().toISOString(), name: value });
    setValue("");
    onClose();
  };
  return (
    <Modal open={isOpen} onOpenChange={handleClose} closeOnOutsideClick={true}>
      {/* Modal content goes here */}

      <ModalContent className="w-full max-w-[386px]">
        <ModalHeader />
        <div className="flex flex-col items-center gap-6 px-6 py-9 text-center">
          {/* Add your form or content for adding a new vehicle brand here */}
          <h2 className="text-base font-semibold">{title}</h2>
          {/* Form or input fields can be added here */}
          <Input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setHasError(false);
            }}
            appearance={{
              containerClassName: hasError ? "border-error-400" : "",
            }}
            placeholder={placeholder}
            errorMessage={hasError ? errorMessage : ""}
          />

          {/* Button */}
          <div className="flex w-full items-center justify-center gap-2">
            <Button
              onClick={handleClose}
              variant="muattrans-primary-secondary"
              className="w-fit"
            >
              Batal
            </Button>
            <Button
              onClick={() => {
                handleSubmit();
              }}
              variant="muattrans-primary"
              className="w-fit"
            >
              Simpan
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
