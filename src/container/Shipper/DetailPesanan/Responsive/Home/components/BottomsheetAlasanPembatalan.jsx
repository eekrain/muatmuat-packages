import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import { ExpandableTextArea } from "@/components/Form/ExpandableTextArea";
import RadioButton from "@/components/Radio/RadioButton";
import { useGetCancellationReasons } from "@/services/Shipper/api-az/getCancellationReasons";

const cancellationReasons = [
  "Keadaan Darurat / Perubahan Rencana",
  "Ingin Mengganti Armada / Carrier",
  "Perubahan Kebutuhan Pengiriman",
  "Pencarian Armada Terlalu Lama",
  "Alasan Pribadi atau Tidak Dijelaskan",
  "Perubahan Rencana Mendadak",
  "Ketidakpastian atau Perubahan Kondisi",
];

/**
 * A bottom sheet component for selecting a reason for cancellation.
 * It is intended to be used within a modal or bottom sheet trigger.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.open - Controls the visibility of the bottom sheet.
 * @param {function} props.onOpenChange - Callback function when the open state changes.
 * @param {function} props.onConfirm - Callback function when the confirm button is clicked, passing the selected reason.
 * @returns {JSX.Element} The rendered ModalAlasanPembatalan component.
 */
export const BottomsheetAlasanPembatalan = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  const { data: cancellationReasons } = useGetCancellationReasons(
    "v1/orders/cancellation-reasons"
  );
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReasonText, setOtherReasonText] = useState("");

  const handleSelectReason = (reason) => {
    setSelectedReason(reason);
  };

  const handleConfirm = () => {
    const reason =
      selectedReason === "Lainnya" ? otherReasonText : selectedReason;
    if (onConfirm) {
      onConfirm(reason);
    }
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        {/* Header */}
        <BottomSheetHeader>Alasan Pembatalan</BottomSheetHeader>

        {/* Reasons List */}
        <div className="mt-6 flex-1 space-y-4 overflow-y-auto px-4 pb-4">
          {cancellationReasons?.map((reason) => (
            <div
              key={reason}
              className="flex cursor-pointer items-center justify-between border-b border-neutral-300 pb-4"
              onClick={() => handleSelectReason(reason)}
            >
              <span className="text-sm font-semibold text-neutral-900">
                {reason}
              </span>
              <RadioButton
                name="cancellationReason"
                value={reason}
                checked={selectedReason === reason}
                readOnly
              />
            </div>
          ))}

          {/* Other Reason */}
          <div>
            <div
              className="flex cursor-pointer items-center justify-between"
              onClick={() => handleSelectReason("Lainnya")}
            >
              <span className="text-sm font-semibold text-neutral-900">
                Lainnya
              </span>
              <RadioButton
                name="cancellationReason"
                value="Lainnya"
                checked={selectedReason === "Lainnya"}
                readOnly
              />
            </div>
            {selectedReason === "Lainnya" && (
              <div className="mt-3">
                <ExpandableTextArea
                  value={otherReasonText}
                  onChange={(e) => setOtherReasonText(e.target.value)}
                  placeholder="Masukkan Alasan Pembatalan"
                  maxLength={200}
                  appearance={{
                    inputClassName: "resize-none h-8",
                  }}
                  withCharCount
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4">
          <Button
            className="w-full"
            variant="muatparts-primary"
            onClick={handleConfirm}
          >
            Batalkan Pesanan
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};
