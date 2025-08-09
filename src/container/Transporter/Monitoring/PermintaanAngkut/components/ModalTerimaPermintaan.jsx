import { useState } from "react";

import Button from "@/components/Button/Button";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";
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
  const [selectedOption, setSelectedOption] = useState("");
  const [partialCount, setPartialCount] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showTermsAlert, setShowTermsAlert] = useState(false);
  const [showPartialAlert, setShowPartialAlert] = useState(false);

  // Ambil detail data berdasarkan request.id
  const {
    data: detailData,
    isLoading,
    error,
  } = useGetTransportRequestDetail(request?.id);
  const detail = detailData || {};

  if (!isOpen) return null;

  const handleAccept = () => {
    // Validasi kebutuhan armada
    if (!selectedOption) {
      setShowAlert(true);
      return;
    }

    // Validasi jumlah armada jika memilih "partial"
    if (selectedOption === "partial" && (!partialCount || partialCount < 1)) {
      setShowPartialAlert(true);
      return;
    }

    // Validasi syarat dan ketentuan
    if (!acceptTerms) {
      setShowTermsAlert(true);
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
                    onChange={(e) => {
                      setSelectedOption(e.target.value);
                      setShowAlert(false);
                    }}
                    className="mr-3 h-4 w-4 text-primary-600"
                  />
                  <span className="text-xs font-medium text-gray-900">
                    Terima semua kebutuhan armada
                  </span>
                </label>
                <label className="flex cursor-pointer items-center">
                  <input
                    type="radio"
                    name="acceptOption"
                    value="partial"
                    checked={selectedOption === "partial"}
                    onChange={(e) => {
                      setSelectedOption(e.target.value);
                      setShowAlert(false);
                      setShowPartialAlert(false);
                    }}
                    className="mr-3 h-4 w-4 text-primary-600"
                  />
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
                          setShowPartialAlert(false);
                        }
                      }}
                      disabled={selectedOption !== "partial"}
                      className={cn(
                        "h-8 w-[65px] rounded p-3 text-center text-xs font-medium text-neutral-600",
                        showPartialAlert && selectedOption === "partial"
                          ? "border border-error-400"
                          : "border border-neutral-600"
                      )}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      unit armada
                    </span>
                  </div>
                </label>
              </div>
              {/* Alert for armada validation */}
              {showAlert && (
                <p className="mt-3 px-7 text-xs font-medium text-error-400">
                  Kebutuhan armada wajib diisi
                </p>
              )}
              {/* Alert for partial count validation */}
              {showPartialAlert && (
                <p className="mt-3 px-7 text-xs font-medium text-error-400">
                  Jumlah armada wajib diisi
                </p>
              )}
            </div>

            {/* Content */}
            {/* Scrollable content only for info box */}
            <div className="mb-3 h-[175px] overflow-y-auto rounded-lg border border-neutral-400 p-4">
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
              <div className="mb-4 border-b border-[#C4C4C4]"></div>

              {/* Location Info */}
              <div className="mb-4 flex justify-between">
                <div className="w-auto">
                  <TimelineContainer>
                    {[
                      {
                        fullAddress:
                          detail.pickupLocations?.[0]?.fullAddress ||
                          "Kota Surabaya, Kec. Tegalsari",
                        type: "pickup",
                      },
                      {
                        fullAddress:
                          detail.dropoffLocations?.[0]?.fullAddress ||
                          "Kab. Pasuruan, Kec. Klojen",
                        type: "dropoff",
                      },
                    ].map((location, index) => (
                      <NewTimelineItem
                        key={index}
                        variant="bullet"
                        index={index}
                        activeIndex={0}
                        isLast={index === 1}
                        title={
                          location.fullAddress?.length > 38
                            ? `${location.fullAddress.substring(0, 38)}...`
                            : location.fullAddress
                        }
                        className="pb-2"
                        appearance={{
                          titleClassname:
                            "line-clamp-1 break-all text-xs font-bold text-neutral-900",
                        }}
                      />
                    ))}
                  </TimelineContainer>
                </div>
                <div className="text-right">
                  <div className="text-[12px] font-medium text-neutral-600">
                    Estimasi Jarak
                  </div>
                  <div className="text-[12px] font-semibold text-neutral-900">
                    {detail.estimatedDistance || 121} km
                  </div>
                </div>
              </div>
              <div className="mb-4 border-b border-[#C4C4C4]"></div>

              {/* cargo info */}
              <div className="mb-4 flex w-full items-start justify-between">
                <div className="flex flex-1 items-start gap-3">
                  <IconComponent
                    src="/icons/box16.svg"
                    className="mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-600"
                  />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-neutral-600">
                      Informasi Muatan (Total :{" "}
                      {detail.cargos
                        ?.reduce((sum, cargo) => sum + (cargo.weight || 0), 0)
                        ?.toLocaleString("id-ID") || "2.500"}{" "}
                      kg)
                    </div>
                    <div className="text-xs font-semibold text-neutral-900">
                      {detail.cargos?.length > 1 ? (
                        <>
                          {detail.cargos[0]?.name || "Peralatan Tangga"},{" "}
                          <InfoTooltip
                            side="bottom"
                            align="start"
                            sideOffset={8}
                            trigger={
                              <span
                                style={{
                                  color: "#176CF7",
                                  cursor: "pointer",
                                }}
                              >
                                +{detail.cargos.length - 1} lainnya
                              </span>
                            }
                          >
                            <div className="text-sm">
                              <div className="mb-2 font-medium">
                                Informasi Muatan
                              </div>
                              <div className="space-y-1">
                                {detail.cargos.slice(1).map((cargo, index) => (
                                  <div key={index} className="text-sm">
                                    {index + 1}. {cargo.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </InfoTooltip>
                        </>
                      ) : (
                        detail.cargos?.[0]?.name || "Peralatan Tangga"
                      )}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <span className="rounded-[6px] border border-[#7A360D] bg-white px-2 py-2 text-xs font-semibold text-[#7A360D]">
                    {detail.orderCode || "MT25A001A"}
                  </span>
                </div>
              </div>

              {/* Fleet Requirements Section */}
              <div className="mb-4 flex items-start gap-3">
                <IconComponent
                  src="/icons/truk16.svg"
                  className="mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-600"
                />
                <div className="flex-1">
                  <div className="text-xs font-medium text-neutral-600">
                    Kebutuhan Armada
                  </div>
                  <div className="text-xs font-semibold text-neutral-900">
                    {detail.truckCount || request?.truckCount || 3} Unit (
                    {detail.truckTypeName ||
                      request?.truckTypeName ||
                      "Colt Diesel Engkel"}{" "}
                    - {detail.carrierName || request?.carrierName || "Box"})
                  </div>
                </div>
              </div>

              {/* Loading Time Section */}
              <div className="mb-4 flex items-start gap-3">
                <IconComponent
                  src="/icons/calendar16.svg"
                  className="mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-600"
                />
                <div className="flex-1">
                  <div className="text-xs font-medium text-neutral-600">
                    Waktu Muat
                  </div>
                  <div className="text-xs font-semibold text-neutral-900">
                    {detail.loadDateTime ||
                      request?.loadDateTime ||
                      "03 Jan 2025 09:00 WIB s/d 04 Jan 2025 11:00 WIB"}
                  </div>
                </div>
              </div>

              {/* Additional Services Section */}
              {(detail.additionalServices?.length > 0 ||
                request?.hasAdditionalService) && (
                <div className="rounded-[4px] bg-warning-50 px-3 py-2">
                  <div className="text-[12px] font-medium text-warning-800">
                    +{" "}
                    {detail.additionalServices?.[0]?.serviceName ||
                      request?.additionalServices?.[0]?.serviceName ||
                      "Bantuan Tambahan, Kirim Berkas"}
                  </div>
                </div>
              )}
            </div>

            {/* Syarat & Ketentuan (not scrollable) */}
            <div className="mb-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    setShowTermsAlert(false);
                  }}
                  className="h-4 w-4 text-primary-600"
                />
                <span className="flex justify-center text-xs font-medium text-neutral-900">
                  Saya menyetujui{" "}
                  <span className="ml-1 font-medium text-primary-700">
                    Syarat dan Ketentuan Muatrans
                  </span>
                </span>
              </label>
              {/* Alert for terms validation */}
              {showTermsAlert && (
                <p className="mt-2 px-7 text-xs font-medium text-error-400">
                  Setujui syarat dan ketentuan untuk menerima jasa angkut
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="muattrans-primary-secondary"
                className="h-[34] w-[112px] rounded-[24px] py-3 text-[14px] font-semibold"
                onClick={onClose}
              >
                Batal
              </Button>
              <Button
                variant="muattrans-primary"
                className="h-[34] w-[112px] py-3 text-sm font-semibold"
                onClick={handleAccept}
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
