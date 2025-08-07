"use client";

import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const TransportRequestCard = ({
  request,
  isSuspended = false,
  onBookmarkToggle,
  isBookmarked,
  onUnderstand,
}) => {
  // Use the prop if provided, otherwise fall back to request.isSaved
  const [isSaved, setIsSaved] = useState(
    isBookmarked !== undefined ? isBookmarked : request.isSaved
  );

  // Update local state when prop changes
  useEffect(() => {
    if (isBookmarked !== undefined) {
      setIsSaved(isBookmarked);
    }
  }, [isBookmarked]);

  const handleSave = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    // Call the parent callback if provided
    if (onBookmarkToggle) {
      onBookmarkToggle(request.id, newSavedState);
    }

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

  const handleUnderstand = () => {
    // Show success toast with order code
    toast.success(`Permintaan ${request.orderCode} berhasil ditutup`);

    // Call parent callback to remove the card from list
    if (onUnderstand) {
      onUnderstand(request.id);
    }

    // TODO: Implement additional understand functionality if needed
    console.log("Understand clicked for:", request.orderCode);
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
    <div className="relative">
      <div
        className={cn(
          "overflow-hidden rounded-[8px] border border-[#C4C4C4] bg-white shadow-sm",
          request.isNew && "border-warning-400",
          request.isTaken && "brightness-95 grayscale"
        )}
      >
        {/* New Request Header */}
        {request.isNew && (
          <>
            <div className="flex h-[42px] items-center justify-between bg-muat-trans-primary-50 px-3 py-2">
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
                className={cn(
                  "flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold",
                  request.isTaken
                    ? "text-neutral-700"
                    : request.timeLabel?.color === "green"
                      ? "bg-success-50 text-success-700"
                      : request.timeLabel?.color === "blue"
                        ? "bg-primary-50 text-primary-700"
                        : request.orderType === "INSTANT"
                          ? "bg-success-50 text-success-700"
                          : "bg-primary-50 text-primary-700"
                )}
              >
                {request.orderType === "INSTANT" ? "Instan" : "Terjadwal"}
              </span>

              {/* Load Time Label */}
              <span
                className={cn(
                  "flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold",
                  request.isTaken
                    ? "text-neutral-700"
                    : request.loadTimeText?.includes("Hari Ini") ||
                        request.loadTimeText?.includes("Besok")
                      ? "bg-success-50 text-success-700"
                      : request.loadTimeText?.includes("2 Hari") ||
                          request.loadTimeText?.includes("3 Hari") ||
                          request.loadTimeText?.includes("4 Hari") ||
                          request.loadTimeText?.includes("5 Hari")
                        ? "bg-warning-50 text-warning-700"
                        : "bg-primary-50 text-primary-700"
                )}
              >
                {request.loadTimeText || "Muat 7 Hari Lagi"}
              </span>

              {/* Overload Badge */}
              {request.hasOverload && (
                <span
                  className={cn(
                    "flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold",
                    request.isTaken
                      ? "text-neutral-700"
                      : "bg-error-50 text-error-700"
                  )}
                >
                  Potensi Overload
                </span>
              )}

              {/* Halal Certification Required Badge */}
              {request.isHalalLogistics && (
                <InfoTooltip
                  side="left"
                  align="center"
                  sideOffset={8}
                  trigger={
                    <div
                      className={cn(
                        "flex h-6 w-6 cursor-pointer items-center justify-center rounded-md px-1 py-2",
                        request.isTaken ? "" : "bg-[#F7EAFD]"
                      )}
                    >
                      <IconComponent
                        src="/icons/halal.svg"
                        className={cn(
                          "h-4 w-3",
                          request.isTaken ? "text-neutral-700" : ""
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
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full hover:opacity-75",
                  isSaved ? "bg-[#FFE9ED]" : "border border-[#C4C4C4] bg-white"
                )}
              >
                <IconComponent
                  src={
                    isSaved
                      ? "/icons/bookmark-filled.svg"
                      : "/icons/bookmark.svg"
                  }
                  className={cn("h-5 w-5", isSaved && "text-error-600")}
                />
              </button>
            </div>
          </div>

          {/* Divider after status tags */}
          <div className="mb-3 border-b border-[#C4C4C4]"></div>

          {/* Location Info */}
          <div className="mb-3 flex w-full justify-between">
            <div className="w-[279px]">
              <TimelineContainer>
                {[
                  {
                    fullAddress:
                      request.pickupLocations?.[0]?.fullAddress ||
                      "Lokasi Muat",
                    type: "pickup",
                  },
                  {
                    fullAddress:
                      request.dropoffLocations?.[0]?.fullAddress ||
                      "Lokasi Bongkar",
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
                      titleClassname: cn(
                        "line-clamp-1 break-all text-xs font-bold",
                        request.isTaken ? "text-[#7B7B7B]" : "text-neutral-900"
                      ),
                    }}
                  />
                ))}
              </TimelineContainer>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-medium text-neutral-600">
                Estimasi Jarak
              </div>
              <div
                className={cn(
                  "text-[12px]",
                  request.isTaken
                    ? "font-medium text-neutral-600"
                    : "font-semibold text-neutral-900"
                )}
              >
                {request.estimatedDistance} km
              </div>
            </div>
          </div>

          {/* Divider after location */}
          <div className="mb-3 border-b border-[#C4C4C4]"></div>

          {/* Cargo Info and Order Code Row */}
          <div className="mb-4 flex w-full items-start justify-between">
            <div className="flex flex-1 items-start gap-3">
              <IconComponent
                src="/icons/box16.svg"
                className="mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-600"
              />
              <div className="flex-1">
                <div className="text-xs font-medium text-neutral-600">
                  Informasi Muatan (Total :{" "}
                  {formatWeight(
                    request.cargos?.[0]?.weight || 0,
                    request.cargos?.[0]?.weightUnit || "kg"
                  )}
                  )
                </div>
                <div
                  className={cn(
                    "text-xs font-semibold",
                    request.isTaken ? "text-[#7B7B7B]" : "text-neutral-900"
                  )}
                >
                  {request.cargos.length > 1 ? (
                    <>
                      {request.cargos[0].name},{" "}
                      <InfoTooltip
                        side="bottom"
                        align="start"
                        sideOffset={8}
                        trigger={
                          <span
                            style={{
                              color: request.isTaken ? "#7B7B7B" : "#176CF7",
                              cursor: "pointer",
                            }}
                          >
                            +{request.cargos.length - 1} lainnya
                          </span>
                        }
                      >
                        <div className="text-sm">
                          <div className="mb-2 font-medium">
                            Informasi Muatan
                          </div>
                          <div className="space-y-1">
                            {request.cargos.slice(1).map((cargo, index) => (
                              <div key={index} className="text-sm">
                                {index + 1}. {cargo.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </InfoTooltip>
                    </>
                  ) : (
                    request.cargos[0].name
                  )}
                </div>
              </div>
            </div>
            <div className="ml-4">
              <span className="rounded-[6px] border border-[#7A360D] bg-white px-3 py-1 text-xs font-semibold text-[#7A360D]">
                {request.orderCode}
              </span>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="mb-4 flex items-start gap-3">
            <IconComponent
              src="/icons/truk16.svg"
              className="mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-600"
            />
            <div className="flex-1">
              <div className="text-xs font-medium text-neutral-600">
                Kebutuhan Armada
              </div>
              <div
                className={cn(
                  "text-xs font-semibold",
                  request.isTaken ? "text-[#7B7B7B]" : "text-neutral-900"
                )}
              >
                {request.truckCount} Unit ({request.truckTypeName} -{" "}
                {request.carrierName})
              </div>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="mb-4 flex items-start gap-3">
            <IconComponent
              src="/icons/calendar16.svg"
              className="mt-0.5 h-6 w-6 flex-shrink-0 text-neutral-600"
            />
            <div className="flex-1">
              <div className="text-xs font-medium text-neutral-600">
                Waktu Muat
              </div>
              <div
                className={cn(
                  "text-xs font-semibold",
                  request.isTaken ? "text-[#7B7B7B]" : "text-neutral-900"
                )}
              >
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
          <div
            className={cn(
              "border-b border-[#C4C4C4]",
              request.isTaken ? "mb-10" : "mb-3"
            )}
          ></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {request.isTaken ? (
              // Show placeholder space and price info when request is taken
              <>
                <div className="flex-1">
                  <div className="h-6"></div>{" "}
                  {/* 12px + 12px spacing for message area */}
                  <div className="h-8 w-[80px]"></div>{" "}
                  {/* Placeholder space for button */}
                  <div className="h-3"></div> {/* 12px bottom spacing */}
                </div>
                <div className="ml-auto text-right">
                  {/* Empty space to align with button position */}
                  <div className="h-6"></div> {/* Match message area spacing */}
                  <div className="flex h-8 flex-col justify-center">
                    <div className="text-[10px] font-normal text-neutral-600">
                      Potensi Pendapatan
                    </div>
                    <div className="text-[12px] font-bold text-neutral-900">
                      {request.potentialEarnings ||
                        formatCurrency(request.totalPrice)}
                    </div>
                  </div>
                  <div className="h-3"></div> {/* 12px bottom spacing */}
                </div>
              </>
            ) : (
              // Show normal buttons when request is not taken
              <>
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
                    {request.potentialEarnings ||
                      formatCurrency(request.totalPrice)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Render "Mengerti" button and message outside grayscale container but positioned correctly */}
      {request.isTaken && (
        <>
          {/* Message positioned with 12px from divider line */}
          <div
            className="absolute bottom-[72px] left-3 z-10 w-[368px] rounded-md px-2 py-2 text-[10px] font-semibold"
            style={{
              backgroundColor: "#FFE9ED",
              color: "#EE4343",
            }}
          >
            Permintaan sudah diambil transporter lain
          </div>

          {/* Button positioned with 12px from message */}
          <div
            className="absolute bottom-6 left-3 z-10 flex h-8 w-[270px] cursor-pointer items-center justify-center rounded-[24px] bg-[#FFC217] px-4 text-[14px] font-semibold hover:bg-[#F9A307]"
            style={{
              color: "#461B02",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            onClick={handleUnderstand}
          >
            Mengerti
          </div>
        </>
      )}
    </div>
  );
};

export default TransportRequestCard;
