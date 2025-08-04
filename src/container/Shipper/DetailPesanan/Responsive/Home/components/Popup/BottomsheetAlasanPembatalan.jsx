import { useEffect, useState } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/Bottomsheet/BottomSheet";
import Button from "@/components/Button/Button";
import { ExpandableTextArea } from "@/components/Form/ExpandableTextArea";
import RadioButton from "@/components/Radio/RadioButton";
import { fetcherMuatrans } from "@/lib/axios";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useGetBankAccounts } from "@/services/Shipper/detailpesanan/batalkan-pesanan/getBankAccounts";
import { useGetCancellationReasons } from "@/services/Shipper/detailpesanan/batalkan-pesanan/getCancellationReasons";

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
  onConfirm = () => alert("onConfirm not implemented"),
  orderId,
}) => {
  const { data: cancellationReasons } = useGetCancellationReasons();
  const { data: bankAccounts } = useGetBankAccounts();
  const navigation = useResponsiveNavigation();
  const [selectedReason, setSelectedReason] = useState(null);
  const [customReason, setCustomReason] = useState("");
  const [customReasonError, setCustomReasonError] = useState(null);
  const [globalError, setGlobalError] = useState(null);

  const handleConfirm = async () => {
    setCustomReasonError(null);
    setGlobalError(null);

    if (!selectedReason) {
      setGlobalError("Alasan pembatalan wajib diisi");
      return;
    }

    if (
      selectedReason?.value ===
        cancellationReasons?.[cancellationReasons.length - 1]?.value &&
      !customReason
    ) {
      setCustomReasonError("Alasan pembatalan wajib diisi");
      return;
    }

    // Check if user has bank accounts
    // if (!bankAccounts || bankAccounts.length !== 0) {
    //   // User doesn't have bank accounts, navigate to FormRekeningBankScreen
    onOpenChange(false);
    navigation.push("/FormRekeningBank");
    //   return;
    // }
    // User has bank accounts, proceed with cancellation
    const cancelData = {
      reasonId: selectedReason.value,
      additionalInfo:
        selectedReason?.value ===
        cancellationReasons?.[cancellationReasons.length - 1]?.value
          ? customReason
          : "",
    };
    try {
      await fetcherMuatrans.post(`v1/orders/${orderId}/cancel`, cancelData);

      toast.success("Berhasil membatalkan pesanan");
      onConfirm?.();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error.response?.data?.Data?.Message || "Gagal membatalkan pesanan"
      );
    }
  };

  useEffect(() => {
    if (!open) {
      setSelectedReason(null);
      setCustomReason("");
      setCustomReasonError(null);
      setGlobalError(null);
    }
  }, [open]);

  if (!cancellationReasons) return null;

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        {/* Header */}
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>Alasan Pembatalan</BottomSheetTitle>
        </BottomSheetHeader>

        {/* Reasons List */}
        <div className="flex flex-col gap-y-4 overflow-y-auto px-4">
          {cancellationReasons?.map((reason, index) => (
            <div
              key={reason?.value || index}
              className={cn(
                "flex cursor-pointer items-center justify-between border-b border-transparent pb-4",
                index !== cancellationReasons.length - 1 && "border-neutral-300"
              )}
              onClick={() => setSelectedReason(reason)}
            >
              <span className="text-sm font-semibold text-neutral-900">
                {reason?.label}
              </span>
              <RadioButton
                name="cancellationReason"
                value={reason?.value}
                checked={selectedReason?.value === reason?.value}
                readOnly
              />
            </div>
          ))}
          <div className="flex flex-col gap-y-3">
            <ExpandableTextArea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Masukkan Alasan Pembatalan"
              disabled={
                selectedReason?.value !==
                cancellationReasons?.[cancellationReasons.length - 1]?.value
              }
              errorMessage={customReasonError}
              maxLength={200}
              appearance={{
                inputClassName: "resize-none h-8",
              }}
              withCharCount
            />

            {globalError && (
              <span className="text-xs font-medium text-error-400">
                {globalError}
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <BottomSheetFooter>
          <Button
            className="w-full"
            variant="muatparts-primary"
            onClick={handleConfirm}
          >
            Batalkan Pesanan
          </Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
};
