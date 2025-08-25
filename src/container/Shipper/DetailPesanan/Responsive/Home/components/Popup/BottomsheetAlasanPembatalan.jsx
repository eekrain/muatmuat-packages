import { useParams } from "next/navigation";
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
import { useTranslation } from "@/hooks/use-translation";
import { fetcherMuatparts, fetcherMuatrans } from "@/lib/axios";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useGetBankAccounts } from "@/services/Shipper/detailpesanan/batalkan-pesanan/getBankAccounts";
import { useGetCancellationReasons } from "@/services/Shipper/detailpesanan/batalkan-pesanan/getCancellationReasons";
import { useGetDetailPesananData } from "@/services/Shipper/detailpesanan/getDetailPesananData";
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
  const { t } = useTranslation();
  const { data: cancellationReasons } = useGetCancellationReasons();
  const { data: bankAccounts } = useGetBankAccounts();
  const navigation = useResponsiveNavigation();
  const params = useParams();
  const { params: otpParams, formValues: otpValues } = useRequestOtpStore();
  const { setParams, reset: resetOtp } = useRequestOtpActions();
  const [selectedReason, setSelectedReason] = useState(null);
  const [customReason, setCustomReason] = useState("");
  const [customReasonError, setCustomReasonError] = useState(null);
  const [globalError, setGlobalError] = useState(null);
  const { mutate } = useGetDetailPesananData(params.orderId);
  console.log(params.orderId, "tes");
  const handleConfirm = async () => {
    setCustomReasonError(null);
    setGlobalError(null);

    if (!selectedReason) {
      setGlobalError(
        t(
          "BottomsheetAlasanPembatalan.errorCancellationReasonRequired",
          {},
          "Alasan pembatalan wajib dipilih"
        )
      );
      return;
    }

    if (
      selectedReason?.value ===
        cancellationReasons?.[cancellationReasons.length - 1]?.value &&
      !customReason
    ) {
      setCustomReasonError(
        t(
          "BottomsheetAlasanPembatalan.errorCancellationReasonRequired",
          {},
          "Alasan pembatalan wajib diisi"
        )
      );
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
        mode: "add-rekening-cancel",
        data: {
          // Data bank (will be filled when user submits bank form)
          bankAccount: null,
          // Data cancel
          cancelData: cancelData,
        },
        redirectUrl: window.location.pathname,
      });
      console.log(window.location.href, "location");

      // Navigate to bank account form
      navigation.push("/FormRekeningBank");
    } else {
      try {
        await fetcherMuatrans.post(`v1/orders/${orderId}/cancel`, cancelData);

        toast.success(
          t(
            "BottomsheetAlasanPembatalan.successCancelOrder",
            {},
            "Berhasil membatalkan pesanan"
          )
        );
        mutate();
        onConfirm?.();
        onOpenChange(false);
      } catch (error) {
        toast.error(
          error.response?.data?.Data?.Message ||
            t(
              "BottomsheetAlasanPembatalan.errorCancelOrder",
              {},
              "Gagal membatalkan pesanan"
            )
        );
      }
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

      toast.success(
        t(
          "BottomsheetAlasanPembatalan.successCancelOrder",
          {},
          "Berhasil membatalkan pesanan"
        )
      );
      onConfirm?.();
      onOpenChange(false);
      resetOtp();
    } catch (error) {
      console.error(
        "Error in handleCancelOrderAfterOtp:",
        error.response?.data?.Data?.Message
      );
      resetOtp();
    }
  };
  const handleAddNewRekeningPencairan = async () => {
    // Extract bankAccount data from otpParams.data
    const bankAccountData = otpParams.data?.bankAccount;

    await fetcherMuatparts
      .post("v1/muatparts/bankAccount", bankAccountData)
      .then((response) => {
        toast.success(response.data?.Data?.Message);
        handleCancelOrderAfterOtp();
      })
      .catch((error) => {
        toast.error(error.response.data?.Data?.Message);
        resetOtp(); // Reset even on error
      });
  };
  // Handle OTP verification completion for cancel flow
  const hasProcessedCancel = useRef(false);
  console.log(hasProcessedCancel, "hasProcessedCancel");
  useEffect(() => {
    if (
      otpParams?.mode === "add-rekening-cancel" &&
      otpParams?.data &&
      otpValues?.hasVerified
    ) {
      if (hasProcessedCancel.current) return;
      console.log("otpmdakd");
      handleAddNewRekeningPencairan();
      hasProcessedCancel.current = true;
    }
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
          <BottomSheetTitle>
            {t("BottomsheetAlasanPembatalan.title", {}, "Alasan Pembatalan")}
          </BottomSheetTitle>
        </BottomSheetHeader>

        {/* Reasons List */}
        <div className="flex flex-col gap-y-4 overflow-y-auto px-4">
          {cancellationReasons?.map((reason, index) => (
            <div
              key={reason?.value || index}
              className={cn(
                "flex cursor-pointer items-center justify-between border-b border-transparent",
                index !== cancellationReasons.length - 1 &&
                  "border-neutral-300 pb-4"
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
              placeholder={t(
                "BottomsheetAlasanPembatalan.placeholderCancellationReason",
                {},
                "Masukkan Alasan Pembatalan"
              )}
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
            {t(
              "BottomsheetAlasanPembatalan.buttonCancelOrder",
              {},
              "Batalkan Pesanan"
            )}
          </Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
};
