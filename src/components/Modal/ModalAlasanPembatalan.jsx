import { useEffect, useState } from "react";

import Button from "../Button/Button";
import { ExpandableTextArea } from "../Form/ExpandableTextArea";
import RadioButton from "../Radio/RadioButton";
import { Modal, ModalContent, ModalHeader } from "./Modal";

export const ModalAlasanPembatalan = ({
  open,
  onOpenChange,
  labelTitle = "Alasan Pembatalan",
  cancelReasons,
  errors,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState(null);

  const isOtherReason =
    selectedReason === cancelReasons[cancelReasons.length - 1]?.value;
  const [customReason, setCustomReason] = useState("");

  useEffect(() => {
    if (!isOtherReason) {
      setCustomReason("");
    }
  }, [isOtherReason]);

  return (
    <Modal open={open} onOpenChange={onOpenChange} closeOnOutsideClick>
      <ModalContent className="w-modal-small">
        <ModalHeader type="muattrans" size="small" />
        <div className="flex flex-col items-center justify-center gap-6 px-6 py-9">
          {/* Title */}
          <h2 className="max- w-full text-center text-base font-bold leading-[19.2px] text-black">
            {labelTitle}
          </h2>

          {/* Radio Button Options */}
          <div className="flex w-full flex-col items-start gap-6">
            {cancelReasons.map((reason, index) => (
              <div
                key={reason.value}
                className="flex w-full flex-col items-start gap-1"
              >
                <RadioButton
                  name="cancel_reason"
                  value={reason.value}
                  checked={selectedReason === reason.value}
                  onClick={() => {
                    console.log("reason.value", reason.value);
                    setSelectedReason(reason.value);
                  }}
                  label={reason.label}
                />

                {index === cancelReasons.length - 1 &&
                  selectedReason ===
                    cancelReasons[cancelReasons.length - 1]?.value && (
                    <ExpandableTextArea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Masukkan Alasan Pembatalan"
                      maxLength={200}
                      errorMessage={errors?.customReason}
                      appearance={{
                        inputClassName: "resize-none h-8",
                      }}
                      className="mt-1 pl-[24px]"
                      withCharCount
                    />
                  )}
              </div>
            ))}
          </div>

          {/* Action Button */}
          <Button
            variant="muatparts-primary"
            onClick={() =>
              onSubmit({ selectedReason, isOtherReason, customReason })
            }
            className={"h-8 min-w-[112px]"}
          >
            Batalkan Pesanan
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};
