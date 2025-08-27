import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useGetTransportRequestList } from "@/services/Transporter/monitoring/permintaan-angkut/getTransportRequestList";
import { useAcceptInstantTransport } from "@/services/Transporter/monitoring/permintaan-angkut/postAcceptInstantTransport";

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

const ModalTerimaPermintaan = ({ isOpen, onClose, request, onAccept }) => {
  const { t } = useTranslation();
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showTermsAlert, setShowTermsAlert] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "taken", "unit-change", "suspended"
  const [modalData, setModalData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // API hooks
  const { acceptTransport, isAccepting } = useAcceptInstantTransport();

  // Ambil detail data berdasarkan request.id
  const {
    data: listData,
    isLoading,
    error,
  } = useGetTransportRequestList({ id });
  const detail = listData?.requests?.find((r) => r.id === id) || {};

  // Check if order is already taken and show modal
  useEffect(() => {
    if (detail && detail.isTaken && isOpen) {
      setModalType("taken");
      setModalData({
        title: t(
          "ModalTerimaPermintaan.titleOrderTaken",
          {},
          "Pesanan Sudah Diambil"
        ),
        message: t(
          "ModalTerimaPermintaan.messageErrorOrderTaken",
          {},
          "Maaf, pesanan ini telah diambil oleh transporter lain. Silahkan pilih pesanan lainnya yang tersedia."
        ),
      });
      setShowConfirmModal(true);
    }
  }, [detail, isOpen, t]);

  if (!isOpen) return null;

  const handleAccept = async () => {
    // Validasi kendaraan
    if (!selectedVehicle) {
      setShowAlert(true);
      return;
    }

    // Validasi syarat dan ketentuan
    if (!acceptTerms) {
      setShowTermsAlert(true);
      return;
    }

    try {
      setIsSubmitting(true);

      // Call the API to accept the instant transport request
      const response = await acceptTransport({
        id: detail.id || request?.id,
        payload: {
          vehicleId: selectedVehicle,
          acceptTerms,
        },
      });

      // Show success toast
      const message =
        response.Data?.toast?.message ||
        t(
          "ModalTerimaPermintaan.toastSuccessRequestAccepted",
          { orderCode: response.Data?.orderCode || "berhasil" },
          `Permintaan ${response.Data?.orderCode || "berhasil"} diterima`
        );
      toast.success(message);

      // Close modal
      onClose();

      // Call parent callback if needed
      if (onAccept) {
        onAccept({
          id: detail.id || request?.id,
          vehicleId: selectedVehicle,
          acceptTerms,
        });
      }
    } catch (error) {
      // Handle error response
      if (error.response?.status === 409) {
        // Handle conflict errors
        const errors = error.response?.data?.Data?.errors || [];

        // Case 1: Pesanan sudah diambil
        const orderStatusError = errors.find(
          (err) => err.field === "orderStatus"
        );
        if (orderStatusError) {
          setModalType("taken");
          setModalData({
            title: t(
              "ModalTerimaPermintaan.titleOrderTaken",
              {},
              "Pesanan Sudah Diambil"
            ),
            message: t(
              "ModalTerimaPermintaan.messageErrorOrderTaken",
              {},
              "Maaf, pesanan ini telah diambil oleh transporter lain. Silahkan pilih pesanan lainnya yang tersedia."
            ),
          });
          setShowConfirmModal(true);
          return;
        }

        // Case 2: Kendaraan tidak tersedia
        const vehicleError = errors.find((err) => err.field === "vehicleId");
        if (vehicleError) {
          toast.error(
            t(
              "ModalTerimaPermintaan.toastErrorVehicleUnavailable",
              {},
              "Kendaraan yang dipilih tidak tersedia"
            )
          );
          return;
        }
      } else {
        const errorMessage =
          error.response?.data?.Message?.Text ||
          t(
            "ModalTerimaPermintaan.toastErrorFailedToAccept",
            {},
            "Gagal menerima permintaan. Silakan coba lagi."
          );
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock vehicle data for demonstration
  const mockVehicles = [
    {
      id: "vehicle-1",
      licensePlate: "B 1234 XYZ",
      truckTypeName: "Fuso 6 Roda",
      carrierName: "Box",
      driverName: "John Driver",
    },
    {
      id: "vehicle-2",
      licensePlate: "B 5678 ABC",
      truckTypeName: "Colt Diesel Engkel",
      carrierName: "Box",
      driverName: "Jane Driver",
    },
    {
      id: "vehicle-3",
      licensePlate: "B 9012 DEF",
      truckTypeName: "Hino 6 Roda",
      carrierName: "Box",
      driverName: "Bob Smith",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="flex h-[500px] w-[600px] flex-col rounded-xl bg-white p-6">
        {isLoading && (
          <div className="py-8 text-center">
            {t("ModalTerimaPermintaan.textLoading", {}, "Loading...")}
          </div>
        )}
        {error && (
          <div className="py-8 text-center text-red-500">
            {t(
              "ModalTerimaPermintaan.textFailedToLoad",
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
                  "ModalTerimaPermintaan.titleAcceptRequest",
                  {},
                  "Terima Permintaan"
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
                  "ModalTerimaPermintaan.textEstimatedEarnings",
                  {},
                  "Estimasi Pendapatan:"
                )}{" "}
                <span className="font-semibold">
                  {formatCurrency(detail.totalPrice || request?.totalPrice)}
                </span>
              </div>
            </div>

            {/* Vehicle Selection */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-neutral-900">
                {t(
                  "ModalTerimaPermintaan.labelSelectVehicle",
                  {},
                  "Pilih Kendaraan"
                )}
                <span className="text-error-600">*</span>
              </label>
              <div className="space-y-2">
                {mockVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={cn(
                      "flex cursor-pointer items-center rounded-lg border p-3",
                      selectedVehicle === vehicle.id
                        ? "border-primary-500 bg-primary-50"
                        : "border-neutral-300 hover:border-neutral-400"
                    )}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                  >
                    <input
                      type="radio"
                      id={vehicle.id}
                      name="vehicle"
                      value={vehicle.id}
                      checked={selectedVehicle === vehicle.id}
                      onChange={() => setSelectedVehicle(vehicle.id)}
                      className="h-4 w-4 text-primary-600"
                    />
                    <label
                      htmlFor={vehicle.id}
                      className="ml-3 flex-1 cursor-pointer"
                    >
                      <div className="font-semibold text-neutral-900">
                        {vehicle.licensePlate}
                      </div>
                      <div className="text-xs text-neutral-600">
                        {vehicle.truckTypeName} - {vehicle.carrierName}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {vehicle.driverName}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              {showAlert && !selectedVehicle && (
                <div className="mt-1 text-xs text-error-600">
                  {t(
                    "ModalTerimaPermintaan.errorVehicleRequired",
                    {},
                    "Kendaraan wajib dipilih"
                  )}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary-600"
                />
                <label
                  htmlFor="acceptTerms"
                  className="ml-2 text-sm text-neutral-700"
                >
                  {t(
                    "ModalTerimaPermintaan.labelAcceptTerms",
                    {},
                    "Saya menyetujui syarat dan ketentuan yang berlaku"
                  )}
                  <span className="text-error-600">*</span>
                </label>
              </div>
              {showTermsAlert && !acceptTerms && (
                <div className="mt-1 text-xs text-error-600">
                  {t(
                    "ModalTerimaPermintaan.errorTermsRequired",
                    {},
                    "Syarat dan ketentuan harus disetujui"
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex justify-end gap-3">
              <Button
                variant="muattrans-primary-secondary"
                onClick={onClose}
                className="h-10 w-[120px] rounded-[24px] px-4 text-[14px] font-semibold"
              >
                {t("ModalTerimaPermintaan.buttonCancel", {}, "Batal")}
              </Button>
              <Button
                variant="muattrans-warning"
                onClick={handleAccept}
                disabled={isSubmitting || isAccepting}
                className="h-10 w-[120px] rounded-[24px] px-4 text-[14px] font-semibold text-[#461B02]"
              >
                {isSubmitting || isAccepting
                  ? t(
                      "ModalTerimaPermintaan.buttonAccepting",
                      {},
                      "Menerima..."
                    )
                  : t("ModalTerimaPermintaan.buttonAccept", {}, "Terima")}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={modalData.title}
        message={modalData.message}
        onConfirm={() => {
          setShowConfirmModal(false);
          if (modalType === "taken") {
            onClose();
          }
        }}
        confirmText={t("ModalTerimaPermintaan.buttonOK", {}, "OK")}
        showCancel={false}
      />
    </div>
  );
};

export default ModalTerimaPermintaan;
