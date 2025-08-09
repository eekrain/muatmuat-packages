import { useState } from "react";

import Button from "@/components/Button/Button";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useGetTransportRequestDetail } from "@/services/Transporter/monitoring/getTransportRequestListDetail";

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
  const [selectedOption, setSelectedOption] = useState("all");
  const [partialCount, setPartialCount] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Ambil detail data berdasarkan request.id
  const {
    data: detailData,
    isLoading,
    error,
  } = useGetTransportRequestDetail(request?.id);
  const detail = detailData || {};

  if (!isOpen) return null;

  const handleAccept = () => {
    if (selectedOption === "partial" && partialCount < 1) {
      toast.error("Jumlah armada minimal 1 unit");
      return;
    }
    if (!acceptTerms) {
      toast.error("Harap setujui Syarat dan Ketentuan Muatrans");
      return;
    }
    onAccept({
      requestId: detail.id,
      type: selectedOption,
      truckCount: selectedOption === "all" ? detail.truckCount : partialCount,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="flex h-[460px] w-[600px] flex-col rounded-xl bg-white p-6">
        {isLoading && <div className="py-8 text-center">Loading...</div>}
        {error && (
          <div className="py-8 text-center text-red-500">
            Gagal memuat detail
          </div>
        )}
        {!isLoading && !error && (
          <>
            {/* Header */}
            <div className="relative mb-4 flex flex-shrink-0 items-center justify-center">
              <h3 className="mx-auto text-base font-bold text-gray-900">
                Terima Permintaan Jasa Angkut
              </h3>
              <button
                onClick={onClose}
                className="absolute -right-4 -top-4 text-gray-400 hover:text-gray-600"
              >
                <IconComponent src="/icons/close24.svg" className="h-5 w-5" />
              </button>
            </div>

            {/* Armada Selection */}
            <div className="mb-3 rounded-lg border border-neutral-400 p-4">
              <span className="mb-3 text-xs font-medium text-gray-600">
                Kebutuhan Armada :
                <span className="ml-1 text-xs font-semibold text-gray-900">
                  {detail.truckCount || 2} Unit
                </span>
              </span>

              <div className="mt-3 space-y-3">
                <label className="flex cursor-pointer items-center">
                  <input
                    type="radio"
                    name="acceptOption"
                    value="all"
                    checked={selectedOption === "all"}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="mr-3 h-4 w-4 text-primary-600"
                  />
                  <span className="text-xs font-medium text-gray-900">
                    Terima semua kebutuhan armada
                  </span>
                </label>
                <label className="flex cursor-pointer items-start">
                  <input
                    type="radio"
                    name="acceptOption"
                    value="partial"
                    checked={selectedOption === "partial"}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="mr-3 mt-0.5 h-4 w-4 text-primary-600"
                  />
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-900">
                        Terima dengan
                      </span>
                      <input
                        type="number"
                        min="1"
                        placeholder="Jumlah"
                        max={detail.truckCount || 2}
                        value={
                          selectedOption === "partial" && partialCount !== null
                            ? partialCount
                            : ""
                        }
                        onChange={(e) => {
                          if (selectedOption === "partial") {
                            const val = e.target.value;
                            setPartialCount(val === "" ? null : val);
                          }
                        }}
                        disabled={selectedOption !== "partial"}
                        className="h-8 w-[65px] rounded border border-neutral-600 p-3 text-center text-xs font-medium text-neutral-600"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        unit armada
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Scrollable content */}
              <div className="mb-3 rounded-lg border border-neutral-400 p-4">
                <div className="mb-4 flex justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    Informasi Pesanan
                  </span>
                  <span className="text-xs font-medium text-gray-600">
                    Potensi Pendapatan
                  </span>
                </div>
                <div className="mb-4 flex justify-between">
                  <div className="flex gap-2">
                    {detail?.orderType && (
                      <span className="flex h-6 items-center rounded-[6px] bg-blue-100 px-2 py-2 text-xs font-semibold text-blue-700">
                        {detail.orderType === "INSTANT"
                          ? "Instan"
                          : detail.orderType === "SCHEDULED"
                            ? "Terjadwal"
                            : detail.orderType}
                      </span>
                    )}
                    {detail?.timeLabel && (
                      <span className="flex h-6 items-center rounded-[6px] bg-green-100 px-2 py-2 text-xs font-semibold text-green-700">
                        {typeof detail.timeLabel === "object"
                          ? detail.timeLabel.text
                          : detail.timeLabel}
                      </span>
                    )}
                    {(detail?.hasOverload ||
                      detail?.overloadInfo?.hasOverload) && (
                      <span className="flex h-6 items-center rounded-[6px] bg-red-100 px-2 py-2 text-xs font-semibold text-red-700">
                        Potensi Overload
                      </span>
                    )}
                    {detail?.isHalalLogistics && (
                      <InfoTooltip
                        side="left"
                        align="center"
                        sideOffset={8}
                        trigger={
                          <div
                            className={cn(
                              "flex h-6 w-6 cursor-pointer items-center justify-center rounded-md px-1 py-2",
                              detail.isTaken ? "" : "bg-[#F7EAFD]"
                            )}
                          >
                            <IconComponent
                              src="/icons/halal.svg"
                              className={cn(
                                "h-4 w-3",
                                detail.isTaken ? "text-neutral-700" : ""
                              )}
                            />
                          </div>
                        }
                      >
                        Memerlukan pengiriman
                        <br />
                        dengan sertifikasi halal logistik
                      </InfoTooltip>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-bold text-blue-700">
                      {formatCurrency(detail?.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Syarat & Ketentuan */}
              <div className="mb-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-600"
                  />
                  <span className="text-sm text-gray-600">
                    Saya menyetujui{" "}
                    <span className="font-medium text-primary-600 underline">
                      Syarat dan Ketentuan Muatrans
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-shrink-0 gap-3 pt-3">
              <Button
                variant="muattrans-error-secondary"
                className="flex-1 py-2 text-sm font-semibold"
                onClick={onClose}
              >
                Batal
              </Button>
              <Button
                variant="muattrans-primary"
                className="flex-1 py-2 text-sm font-semibold"
                onClick={handleAccept}
                disabled={!acceptTerms}
              >
                Terima
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalTerimaPermintaan;
