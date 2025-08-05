import { useEffect, useRef, useState } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";
import Button from "@/components/Button/Button";
import { ExpandableTextArea } from "@/components/Form/ExpandableTextArea";
import RadioButton from "@/components/Radio/RadioButton";
import { fetcherMuatrans } from "@/lib/axios";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useGetBankAccounts } from "@/services/Shipper/detailpesanan/batalkan-pesanan/getBankAccounts";
import { useGetCancellationReasons } from "@/services/Shipper/detailpesanan/batalkan-pesanan/getCancellationReasons";
import {
  useRequestOtpActions,
  useRequestOtpStore,
} from "@/store/Shipper/forms/requestOtpStore";

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
  const { params: otpParams, formValues: otpValues } = useRequestOtpStore();
  const { setParams, reset: resetOtp } = useRequestOtpActions();
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

    const cancelData = {
      orderId: orderId,
      reasonId: selectedReason.value,
      additionalInfo:
        selectedReason?.value ===
        cancellationReasons?.[cancellationReasons.length - 1]?.value
          ? customReason
          : "",
    };
    console.log(cancelData, "cancelDat");
    // Check if user has bank accounts
    if (!bankAccounts || bankAccounts.length === 0) {
      // Set OTP parameters for bank account creation during cancel flow
      setParams({
        mode: "add-rekening-for-cancel",
        data: {
          cancelData: cancelData,
        },
        redirectUrl: window.location.pathname,
      });

      // Navigate to bank account form
      navigation.push("/FormRekeningBank");
    } else {
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
    }
  };

  // Handle saving bank account data after OTP verification
  const handleSaveBankAccountAfterOtp = async () => {
    try {
      const { bankAccountData } = otpParams.data;
      await fetcherMuatrans.post("v1/muatrans/bankAccount", {
        bankId: bankAccountData.selectedBank,
        accountNumber: bankAccountData.accountNumber,
        accountHolderName: bankAccountData.accountHolderName,
        isPrimary: bankAccountData.isPrimary,
      });

      toast.success("Berhasil menambahkan rekening bank");
    } catch (error) {
      toast.error(error.response.data?.Data?.Message);
    }
  };

  // Handle cancel order after OTP verification
  const handleCancelOrderAfterOtp = async () => {
    try {
      const { cancelData } = otpParams.data;
      await fetcherMuatrans.post(`v1/orders/${cancelData.orderId}/cancel`, {
        reasonId: cancelData.reasonId,
        additionalInfo: cancelData.additionalInfo,
      });

      toast.success("Berhasil membatalkan pesanan");
      onConfirm?.();
      onOpenChange(false);
      resetOtp();
    } catch (error) {
      console.error(
        "Error in handleCancelOrderAfterOtp:",
        error.response?.data?.Data?.Message
      );
    }
  };

  // Handle OTP verification completion for cancel flow
  const hasProcessedCancel = useRef(false);
  useEffect(() => {
    const processAfterOtp = async () => {
      if (
        otpParams?.mode === "add-rekening-for-cancel" &&
        otpParams.data?.cancelData &&
        otpValues?.hasVerified
      ) {
        if (hasProcessedCancel.current) return;

        try {
          // First save bank account if bankAccountData exists
          if (otpParams.data?.bankAccountData) {
            await handleSaveBankAccountAfterOtp();
          }

          // Only proceed with order cancellation if bank account save was successful
          await handleCancelOrderAfterOtp();
        } catch (error) {
          // If bank account save fails, don't proceed with cancellation
          console.error("Error in processAfterOtp:", error);
          // Error toast is already shown in individual functions
        } finally {
          hasProcessedCancel.current = true;
        }
      }
    };

    processAfterOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpParams?.mode, otpValues?.hasVerified]);

  useEffect(() => {
    if (!open) {
      setSelectedReason(null);
      setCustomReason("");
      setCustomReasonError(null);
      setGlobalError(null);
      hasProcessedCancel.current = false;
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
