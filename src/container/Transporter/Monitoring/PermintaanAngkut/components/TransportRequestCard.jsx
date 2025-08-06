"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";

const TransportRequestCard = ({ request }) => {
  const [isSaved, setIsSaved] = useState(request.isSaved);

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save/unsave functionality
  };

  const handleDetail = () => {
    // TODO: Navigate to detail page
    console.log("Detail clicked for:", request.orderCode);
  };

  const handleReject = () => {
    // TODO: Implement reject functionality
    console.log("Reject clicked for:", request.orderCode);
  };

  const handleAccept = () => {
    // TODO: Implement accept functionality
    console.log("Accept clicked for:", request.orderCode);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("IDR", "Rp");
  };

  const formatWeight = (weight, unit) => {
    return `${weight.toLocaleString("id-ID")} ${unit}`;
  };

  return (
    <div
      className={`rounded-[8px] border bg-white p-4 shadow-sm ${
        request.isNew ? "border-warning-400 bg-warning-50" : "border-[#C4C4C4]"
      }`}
    >
      {/* Status Tags and Save Button Row */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex flex-wrap items-center gap-1">
          {/* New Request Badge */}
          {request.isNew && (
            <span className="animate-pulse rounded-[12px] bg-error-500 px-2 py-1 text-[10px] font-medium text-white">
              BARU
            </span>
          )}

          {/* Time Label */}
          <span
            className={`rounded-[12px] px-2 py-1 text-[10px] font-medium ${
              request.timeLabel?.color === "green"
                ? "bg-success-50 text-success-700"
                : request.timeLabel?.color === "blue"
                  ? "bg-primary-50 text-primary-700"
                  : request.orderType === "INSTANT"
                    ? "bg-success-50 text-success-700"
                    : "bg-primary-50 text-primary-700"
            }`}
          >
            {request.orderType === "INSTANT"
              ? "Instan"
              : request.timeLabel?.text || "Terjadwal"}
          </span>

          {/* Load Time Label */}
          <span
            className={`rounded-[12px] px-2 py-1 text-[10px] font-medium ${
              request.loadTimeText?.includes("Hari Ini") ||
              request.loadTimeText?.includes("Besok")
                ? "bg-warning-50 text-warning-700"
                : "bg-primary-50 text-primary-700"
            }`}
          >
            {request.loadTimeText || "Muat 7 Hari Lagi"}
          </span>

          {/* Overload Badge */}
          {request.hasOverload && (
            <span className="rounded-[12px] bg-error-50 px-2 py-1 text-[10px] font-medium text-error-700">
              Potensi Overload
            </span>
          )}

          {/* Halal Certification Required Badge */}
          {request.isHalalLogistics && (
            <span className="rounded-[12px] bg-success-50 px-2 py-1 text-[10px] font-medium text-success-700">
              Perlu Sertifikasi Halal
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {request.isHalalLogistics && (
            <IconComponent src="/icons/halal.svg" className="h-4 w-4" />
          )}
          <button onClick={handleSave}>
            <IconComponent
              src={
                isSaved ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"
              }
              className="h-5 w-5 text-neutral-400 hover:text-primary-700"
            />
          </button>
        </div>
      </div>

      {/* Divider after status tags */}
      <div className="mb-3 border-b border-[#C4C4C4]"></div>

      {/* Location Info */}
      <div className="mb-3 flex">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <IconComponent
              src="/icons/marker-lokasi-muat.svg"
              className="h-4 w-4 text-success-500"
            />
            <span className="text-xs font-normal text-neutral-900">
              {request.pickupLocations?.[0]?.fullAddress}
            </span>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <IconComponent
              src="/icons/marker-lokasi-bongkar.svg"
              className="h-4 w-4 text-error-500"
            />
            <span className="text-xs font-normal text-neutral-900">
              {request.dropoffLocations?.[0]?.fullAddress}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-normal text-neutral-600">
            Estimasi Jarak
          </div>
          <div className="text-sm font-semibold text-neutral-900">
            {request.estimatedDistance} km
          </div>
        </div>
      </div>

      {/* Divider after location */}
      <div className="mb-3 border-b border-[#C4C4C4]"></div>

      {/* Cargo Info and Order Code Row */}
      <div className="mb-2 flex items-start justify-between">
        <div className="flex flex-1 items-start gap-2">
          <IconComponent
            src="/icons/box16.svg"
            className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-600"
          />
          <div className="flex-1">
            <div className="text-[10px] font-normal text-neutral-600">
              Informasi Muatan (Total :{" "}
              {formatWeight(
                request.cargos?.[0]?.weight || 0,
                request.cargos?.[0]?.weightUnit || "kg"
              )}
              )
            </div>
            <div className="text-xs font-medium text-neutral-900">
              {request.cargos?.[0]?.name || "Besi Baja"}
            </div>
          </div>
        </div>
        <div className="ml-4">
          <span className="rounded-[12px] border border-[#7A360D] bg-white px-3 py-1 text-xs font-medium text-[#7A360D]">
            {request.orderCode}
          </span>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="mb-2 flex items-start gap-2">
        <IconComponent
          src="/icons/truck16.svg"
          className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-600"
        />
        <div className="flex-1">
          <div className="text-[10px] font-normal text-neutral-600">
            Kebutuhan Armada
          </div>
          <div className="text-xs font-medium text-neutral-900">
            {request.truckCount} Unit ({request.truckTypeName} -{" "}
            {request.carrierName})
          </div>
        </div>
      </div>

      {/* Schedule Info */}
      <div className="mb-3 flex items-start gap-2">
        <IconComponent
          src="/icons/calendar16.svg"
          className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-600"
        />
        <div className="flex-1">
          <div className="text-[10px] font-normal text-neutral-600">
            Waktu Muat
          </div>
          <div className="text-xs font-medium text-neutral-900">
            {request.loadDateTime || "03 Jan 2025 09:00 WIB s/d 11:00 WIB"}
          </div>
        </div>
      </div>

      {/* Additional Services */}
      {request.hasAdditionalService &&
        request.additionalServices?.length > 0 && (
          <div className="mb-3 rounded-[4px] bg-warning-50 px-3 py-2">
            <div className="text-[10px] font-medium text-warning-800">
              + {request.additionalServices[0].serviceName}
            </div>
          </div>
        )}

      {/* Divider before action buttons */}
      <div className="mb-3 border-b border-[#C4C4C4]"></div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="muattrans-primary-secondary"
          className="h-8 rounded-[20px] px-4 text-[10px] font-medium"
          onClick={handleDetail}
        >
          Detail
        </Button>
        <Button
          variant="muattrans-error-secondary"
          className="h-8 rounded-[20px] px-4 text-[10px] font-medium"
          onClick={handleReject}
        >
          Tolak
        </Button>
        <Button
          variant="muattrans-warning"
          className="h-8 rounded-[20px] px-4 text-[10px] font-medium"
          onClick={handleAccept}
        >
          Terima
        </Button>
        <div className="ml-auto text-right">
          <div className="text-[10px] font-normal text-neutral-600">
            Potensi Pendapatan
          </div>
          <div className="text-sm font-bold text-primary-700">
            {request.potentialEarnings || formatCurrency(request.totalPrice)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportRequestCard;
