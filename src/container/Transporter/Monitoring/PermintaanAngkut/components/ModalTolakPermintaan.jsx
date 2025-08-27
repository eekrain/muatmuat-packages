import { useSearchParams } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { useGetTransportRequestList } from "@/services/Transporter/monitoring/permintaan-angkut/getTransportRequestList";
import { usePostRejectTransport } from "@/services/Transporter/monitoring/permintaan-angkut/postRejectTransport";

// Utility function for currency formatting
const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("IDR", "Rp");
};

const ModalTolakPermintaan = ({ isOpen, onClose, request, onReject }) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // API hooks
  const { rejectRequest, isRejecting } = usePostRejectTransport();

  // Ambil detail data berdasarkan request.id
  const {
    data: listData,
    isLoading,
    error,
  } = useGetTransportRequestList({ id });
  const detail = listData?.requests?.find((r) => r.id === id) || {};

  if (!isOpen) return null;

  const handleReject = async () => {
    // Validasi alasan penolakan
    if (!reason) {
      setShowAlert(true);
      return;
    }

    try {
      setIsSubmitting(true);

      // Call the API to reject the transport request
      const response = await rejectRequest({
        id: detail.id || request?.id,
        payload: {
          reason,
          notes,
        },
      });

      // Show success toast
      const message =
        response.Data?.toast?.message ||
        t(
          "ModalTolakPermintaan.toastSuccessRequestRejected",
          { orderCode: response.Data?.orderCode || "berhasil" },
          `Permintaan ${response.Data?.orderCode || "berhasil"} ditolak`
        );
      toast.success(message);

      // Close modal
      onClose();

      // Call parent callback if needed
      if (onReject) {
        onReject({
          id: detail.id || request?.id,
          reason,
          notes,
        });
      }
    } catch (error) {
      // Handle error response
      if (error.response?.status === 404) {
        toast.error(
          t(
            "ModalTolakPermintaan.toastErrorRequestNotFound",
            {},
            "Permintaan tidak ditemukan"
          )
        );
      } else {
        const errorMessage =
          error.response?.data?.Message?.Text ||
          t(
            "ModalTolakPermintaan.toastErrorFailedToReject",
            {},
            "Gagal menolak permintaan. Silakan coba lagi."
          );
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const rejectReasons = [
    {
      value: "CAPACITY_UNAVAILABLE",
      label: t(
        "ModalTolakPermintaan.reasonCapacityUnavailable",
        {},
        "Kapasitas armada tidak tersedia"
      ),
    },
    {
      value: "ROUTE_UNAVAILABLE",
      label: t(
        "ModalTolakPermintaan.reasonRouteUnavailable",
        {},
        "Rute tidak dapat dilayani"
      ),
    },
    {
      value: "PRICE_MISMATCH",
      label: t(
        "ModalTolakPermintaan.reasonPriceMismatch",
        {},
        "Tidak sesuai dengan harga yang diharapkan"
      ),
    },
    {
      value: "OTHER",
      label: t("ModalTolakPermintaan.reasonOther", {}, "Lainnya"),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="flex h-[460px] w-[600px] flex-col rounded-xl bg-white p-6">
        {isLoading && (
          <div className="py-8 text-center">
            {t("ModalTolakPermintaan.textLoading", {}, "Loading...")}
          </div>
        )}
        {error && (
          <div className="py-8 text-center text-red-500">
            {t(
              "ModalTolakPermintaan.textFailedToLoad",
              {},
              "Gagal memuat detail"
            )}
          </div>
        )}
        {!isLoading && !error && (
          <>
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">
                {t(
                  "ModalTolakPermintaan.titleRejectRequest",
                  {},
                  "Tolak Permintaan"
                )}
              </h2>
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <IconComponent src="/icons/close.svg" className="h-6 w-6" />
              </button>
            </div>

            {/* Order Info */}
            <div className="mb-4 rounded-lg bg-[#FFF9E6] p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#7A360D]">
                  {detail.orderCode || request?.orderCode}
                </span>
                <span className="rounded-[6px] bg-[#7A360D] px-2 py-1 text-xs font-semibold text-white">
                  {detail.truckCount || request?.truckCount} Unit
                </span>
              </div>
              <div className="mt-2 text-xs text-[#7A360D]">
                {t(
                  "ModalTolakPermintaan.textEstimatedEarnings",
                  {},
                  "Estimasi Pendapatan:"
                )}{" "}
                <span className="font-semibold">
                  {formatCurrency(detail.totalPrice || request?.totalPrice)}
                </span>
              </div>
            </div>

            {/* Reason Selection */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-neutral-900">
                {t(
                  "ModalTolakPermintaan.labelReasonForRejection",
                  {},
                  "Alasan Penolakan"
                )}
                <span className="text-error-600">*</span>
              </label>
              <div className="space-y-2">
                {rejectReasons.map((item) => (
                  <div key={item.value} className="flex items-center">
                    <input
                      type="radio"
                      id={item.value}
                      name="rejectReason"
                      value={item.value}
                      checked={reason === item.value}
                      onChange={(e) => setReason(e.target.value)}
                      className="h-4 w-4 text-primary-600"
                    />
                    <label
                      htmlFor={item.value}
                      className="ml-2 text-sm text-neutral-700"
                    >
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
              {showAlert && !reason && (
                <div className="mt-1 text-xs text-error-600">
                  {t(
                    "ModalTolakPermintaan.errorReasonRequired",
                    {},
                    "Alasan penolakan wajib dipilih"
                  )}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-neutral-900">
                {t(
                  "ModalTolakPermintaan.labelAdditionalNotes",
                  {},
                  "Catatan Tambahan"
                )}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t(
                  "ModalTolakPermintaan.placeholderAdditionalNotes",
                  {},
                  "Tambahkan catatan tambahan (opsional)"
                )}
                className="w-full rounded-lg border border-neutral-300 p-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                rows="3"
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex justify-end gap-3">
              <Button
                variant="muattrans-primary-secondary"
                onClick={onClose}
                className="h-10 w-[120px] rounded-[24px] px-4 text-[14px] font-semibold"
              >
                {t("ModalTolakPermintaan.buttonCancel", {}, "Batal")}
              </Button>
              <Button
                variant="muattrans-error"
                onClick={handleReject}
                disabled={isSubmitting || isRejecting}
                className="h-10 w-[120px] rounded-[24px] px-4 text-[14px] font-semibold"
              >
                {isSubmitting || isRejecting
                  ? t("ModalTolakPermintaan.buttonRejecting", {}, "Menolak...")
                  : t("ModalTolakPermintaan.buttonReject", {}, "Tolak")}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalTolakPermintaan;
