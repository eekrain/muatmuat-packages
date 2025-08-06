"use client";

import { useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";

const TransportRequestCard = ({ request, isSuspended = false }) => {
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
      className={`rounded-[8px] border bg-white shadow-sm ${
        request.isNew ? "border-warning-400 bg-warning-50" : "border-[#C4C4C4]"
      }`}
    >
      {/* New Request Header */}
      {request.isNew && (
        <>
          <div className="flex h-[42px] items-center justify-between px-3 py-2">
            <span className="text-sm font-semibold text-neutral-900">
              Permintaan Baru
            </span>
            <span className="text-[12px] font-normal text-neutral-600">
              {request.newRequestDuration}
            </span>
          </div>
          <div className="border-b border-warning-400"></div>
        </>
      )}

      <div className="p-3">
        {/* Status Tags and Save Button Row */}
        <div className="mb-3 flex h-6 w-full items-start justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Time Label */}
            <span
              className={`rounded-[6px] px-2 py-1 text-xs font-semibold ${
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
              className={`rounded-[6px] px-2 py-1 text-xs font-medium ${
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
              <span className="rounded-[6px] bg-error-50 px-2 py-1 text-xs font-medium text-error-700">
                Potensi Overload
              </span>
            )}

            {/* Halal Certification Required Badge */}
            {request.isHalalLogistics && (
              <IconComponent
                src="/icons/Halal-badges.svg"
                className="h-6 w-6"
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            {request.isHalalLogistics && (
              <IconComponent src="/icons/Halal-badge.svg" className="h-6 w-6" />
            )}
            <button onClick={handleSave}>
              <IconComponent
                src={
                  isSaved
                    ? "/icons/bookmark-filled.svg"
                    : "/icons/Disimpan-badges.svg"
                }
                className={`h-6 w-6 hover:opacity-75 ${
                  isSaved ? "text-error-600" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Divider after status tags */}
        <div className="mb-3 border-b border-[#C4C4C4]"></div>

        {/* Location Info */}
        <div className="mb-3 flex w-full justify-between">
          <div className="w-[279px]">
            <div className="mb-1 flex items-center gap-2">
              <div className="relative flex h-4 w-4 flex-shrink-0 items-center justify-center">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FFC217]">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#461B02]"></div>
                </div>
              </div>
              <span className="text-xs font-bold text-neutral-900">
                {request.pickupLocations?.[0]?.fullAddress?.length > 38
                  ? `${request.pickupLocations[0].fullAddress.substring(0, 38)}...`
                  : request.pickupLocations?.[0]?.fullAddress}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#461B02]">
                <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
              </div>
              <span className="text-xs font-bold text-neutral-900">
                {request.dropoffLocations?.[0]?.fullAddress?.length > 38
                  ? `${request.dropoffLocations[0].fullAddress.substring(0, 38)}...`
                  : request.dropoffLocations?.[0]?.fullAddress}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[12px] font-medium text-neutral-600">
              Estimasi Jarak
            </div>
            <div className="text-[12px] font-semibold text-neutral-900">
              {request.estimatedDistance} km
            </div>
          </div>
        </div>

        {/* Divider after location */}
        <div className="mb-3 border-b border-[#C4C4C4]"></div>

        {/* Cargo Info and Order Code Row */}
        <div className="mb-4 flex w-full items-start justify-between">
          <div className="flex flex-1 items-start gap-2">
            <IconComponent
              src="/icons/box16.svg"
              className="mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-600"
            />
            <div className="flex-1">
              <div className="text-xs font-normal text-neutral-600">
                Informasi Muatan (Total :{" "}
                {formatWeight(
                  request.cargos?.[0]?.weight || 0,
                  request.cargos?.[0]?.weightUnit || "kg"
                )}
                )
              </div>
              <div className="text-xs font-semibold text-neutral-900">
                {request.cargos?.[0]?.name || "Besi Baja"}
              </div>
            </div>
          </div>
          <div className="ml-4">
            <span className="rounded-[6px] border border-[#7A360D] bg-white px-3 py-1 text-xs font-medium text-[#7A360D]">
              {request.orderCode}
            </span>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="mb-4 flex items-start gap-2">
          <IconComponent
            src="/icons/truk16.svg"
            className="mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-600"
          />
          <div className="flex-1">
            <div className="text-xs font-normal text-neutral-600">
              Kebutuhan Armada
            </div>
            <div className="text-xs font-semibold text-neutral-900">
              {request.truckCount} Unit ({request.truckTypeName} -{" "}
              {request.carrierName})
            </div>
          </div>
        </div>

        {/* Schedule Info */}
        <div className="mb-4 flex items-start gap-2">
          <IconComponent
            src="/icons/calendar16.svg"
            className="mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-600"
          />
          <div className="flex-1">
            <div className="text-xs font-normal text-neutral-600">
              Waktu Muat
            </div>
            <div className="text-xs font-semibold text-neutral-900">
              {request.loadDateTime || "03 Jan 2025 09:00 WIB s/d 11:00 WIB"}
            </div>
          </div>
        </div>

        {/* Additional Services */}
        {request.hasAdditionalService &&
          request.additionalServices?.length > 0 && (
            <div className="mb-3 rounded-[4px] bg-warning-50 px-3 py-2">
              <div className="text-[12px] font-medium text-warning-800">
                + {request.additionalServices[0].serviceName}
              </div>
            </div>
          )}

        {/* Divider before action buttons */}
        <div className="mb-3 border-b border-[#C4C4C4]"></div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="muattrans-primary-secondary"
            className="h-8 w-[87px] rounded-[24px] px-4 text-[14px] font-medium"
            onClick={handleDetail}
          >
            Detail
          </Button>
          {!isSuspended && (
            <>
              <Button
                variant="muattrans-error-secondary"
                className="h-8 w-[83px] rounded-[24px] px-4 text-[14px] font-semibold"
                onClick={handleReject}
              >
                Tolak
              </Button>
              <Button
                variant="muattrans-warning"
                className="h-8 w-[92px] rounded-[24px] px-4 text-[14px] font-semibold text-[#461B02]"
                onClick={handleAccept}
              >
                Terima
              </Button>
            </>
          )}
          <div className="ml-auto text-right">
            <div className="text-[10px] font-normal text-neutral-600">
              Potensi Pendapatan
            </div>
            <div className="text-[12px] font-bold text-primary-700">
              {request.potentialEarnings || formatCurrency(request.totalPrice)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportRequestCard;
