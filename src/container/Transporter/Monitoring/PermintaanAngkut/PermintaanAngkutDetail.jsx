import { useMemo, useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useGetTransportRequestDetail } from "@/services/Transporter/monitoring/getTransportRequestListDetail";

const PermintaanAngkutDetail = ({ request, onBack, onUnderstand }) => {
  // Get detailed data using the request ID
  const { data: detailData, isLoading } = useGetTransportRequestDetail(
    request?.id
  );

  // Use detailed data if available, fallback to basic request data
  const displayData = detailData || request;

  // Local state for bookmark toggle
  const [isSaved, setIsSaved] = useState(displayData?.isSaved || false);

  // Handle bookmark toggle
  const handleSave = () => {
    setIsSaved((prev) => !prev);
    console.log(
      "Bookmark toggled for:",
      displayData?.orderCode,
      "New state:",
      !isSaved
    );
    // TODO: Implement API call to save/unsave bookmark
  };

  // Handle understand button click
  const handleUnderstand = () => {
    // Show success toast with order code
    toast.success(`Permintaan ${request.orderCode} berhasil ditutup`);

    // Call parent callback to remove the card from list
    if (onUnderstand) {
      onUnderstand(request.id);
    }

    // Close the detail view
    onBack();

    // TODO: Implement additional understand functionality if needed
    console.log("Understand clicked for:", request.orderCode);
  };

  // Helper functions for status tag colors
  const getOrderTypeStyle = (orderType) => {
    if (orderType === "INSTANT") {
      return "bg-green-50 text-green-700";
    } else if (orderType === "SCHEDULED") {
      return "bg-blue-50 text-blue-700";
    }
    return "bg-primary-50 text-primary-700"; // fallback
  };

  const getTimeLabelStyle = (timeLabelText) => {
    if (!timeLabelText) return "bg-primary-50 text-primary-700";

    const lowerText = timeLabelText.toLowerCase();

    // Green: Muat Hari Ini, Muat Besok
    if (lowerText.includes("hari ini") || lowerText.includes("besok")) {
      return "bg-green-50 text-green-700";
    }

    // Yellow: Muat 2-5 Hari
    const dayMatch = lowerText.match(/muat (\d+) hari/);
    if (dayMatch) {
      const days = parseInt(dayMatch[1]);
      if (days >= 2 && days <= 5) {
        return "bg-yellow-50 text-yellow-700";
      } else if (days > 5) {
        return "bg-blue-50 text-blue-700";
      }
    }

    return "bg-primary-50 text-primary-700"; // fallback
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Rp0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatWeight = (weight, unit) => {
    if (!weight) return "-";
    return `${weight.toLocaleString("id-ID")} ${unit || "kg"}`;
  };

  const formatDateTime = (startTime, endTime) => {
    if (!startTime || !endTime) return "-";

    const start = new Date(startTime);
    const end = new Date(endTime);

    const dateFormat = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    };

    const timeFormat = {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    };

    const dateStr = start.toLocaleDateString("id-ID", dateFormat);
    const startTimeStr = start.toLocaleTimeString("id-ID", timeFormat);
    const endTimeStr = end.toLocaleTimeString("id-ID", timeFormat);

    return `${dateStr} ${startTimeStr} WIB s/d ${endTimeStr} WIB`;
  };

  // Combine all cargo into one description
  const combinedCargoDescription = useMemo(() => {
    if (!displayData?.cargos?.length)
      return displayData?.cargoDescription || "-";

    return displayData.cargos
      .map((cargo) => {
        const parts = [cargo.name];
        if (cargo.weight && cargo.weightUnit) {
          parts.push(`(${formatWeight(cargo.weight, cargo.weightUnit)})`);
        }
        return parts.join(" ");
      })
      .join(", ");
  }, [displayData?.cargos, displayData?.cargoDescription]);

  // Get route description
  const routeDescription = useMemo(() => {
    const pickup = displayData?.pickupLocations?.[0];
    const dropoff = displayData?.dropoffLocations?.[0];

    if (!pickup || !dropoff) return "Route tidak tersedia";

    return `${pickup.city}, ${pickup.province} → ${dropoff.city}, ${dropoff.province}`;
  }, [displayData?.pickupLocations, displayData?.dropoffLocations]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-92px-48px)] flex-col bg-white">
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-2 text-neutral-500">
            <IconComponent
              src="/icons/loader-truck-spinner.svg"
              className="h-6 w-6 animate-spin"
            />
            <span className="text-sm font-medium">Memuat detail...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex h-[calc(100vh-92px-48px)] flex-col bg-white",
        displayData?.isTaken
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex flex-shrink-0 justify-between bg-white px-4",
          displayData?.isTaken && "grayscale"
        )}
      >
        <h1
          className={cn(
            "py-6 text-base font-bold",
            displayData?.isTaken && "grayscale"
              ? "text-neutral-600"
              : "text-neutral-900"
          )}
        >
          Detail Permintaan Jasa Angkut
        </h1>

        {/* Close Button */}
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full pt-2 hover:bg-neutral-100"
        >
          <IconComponent
            src="/icons/close24.svg"
            className={cn(
              "h-5 w-5",
              displayData?.isTaken ? "text-neutral-600" : "text-neutral-700"
            )}
          />
        </button>
      </div>

      {/* Scrollable Content - Starting from Status Tags */}
      <div
        className={cn(
          "flex-1 overflow-y-auto",
          displayData?.isTaken && "grayscale"
        )}
      >
        {/* Suspended Account Notice */}
        {displayData?.isSuspended && (
          <div className="flex-shrink-0 px-4 pb-4">
            <div
              className={cn(
                "flex items-center gap-1 rounded-xl px-4 py-2",
                displayData?.isTaken ? "" : "bg-error-50"
              )}
            >
              <IconComponent src="/icons/warning-red.svg" className="h-4 w-4" />
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-xs font-semibold",
                    displayData?.isTaken ? "text-neutral-600" : "text-error-400"
                  )}
                >
                  Akun Kamu Ditangguhkan
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    displayData?.isTaken
                      ? "text-neutral-600"
                      : "text-neutral-900"
                  )}
                >
                  Hubungi dukungan pelanggan untuk aktivasi kembali
                  <span
                    className={cn(
                      displayData?.isTaken
                        ? "text-neutral-600"
                        : "text-primary-700"
                    )}
                  >
                    {" "}
                    disini
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Halal Certification Notice - Above Status Tags */}
        {displayData?.isHalalLogistics && (
          <div className="flex-shrink-0 px-4 pb-4">
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2",
                displayData?.isTaken ? "" : "bg-[#F7EAFD]"
              )}
            >
              <IconComponent src="/icons/halal.svg" className="h-6 w-[18px]" />
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-xs font-semibold",
                    displayData?.isTaken ? "text-neutral-600" : "text-[#652672]"
                  )}
                >
                  Memerlukan pengiriman dengan sertifikasi halal logistik
                </span>
                {!displayData?.userHalalCertification?.isHalalCertified && (
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      displayData?.isTaken
                        ? "text-neutral-600"
                        : "text-neutral-600"
                    )}
                  >
                    Tambahkan sertifikasi halal dengan menghubungi kami
                    <span
                      className={cn(
                        displayData?.isTaken
                          ? "text-neutral-600"
                          : "text-primary-700"
                      )}
                    >
                      {" "}
                      disini
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Status Tags Row */}
        <div className="flex-shrink-0 bg-white px-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Order Type Tag */}
            {displayData?.orderType && (
              <span
                className={cn(
                  "flex h-6 items-center rounded-[6px] px-2 py-2 text-xs font-semibold",
                  displayData?.isTaken
                    ? "text-neutral-600"
                    : getOrderTypeStyle(displayData.orderType)
                )}
              >
                {displayData.orderType === "INSTANT"
                  ? "Instan"
                  : displayData.orderType === "SCHEDULED"
                    ? "Terjadwal"
                    : displayData.orderType}
              </span>
            )}

            {/* Load Time Text Tag */}
            {displayData?.timeLabel?.text && (
              <span
                className={cn(
                  "flex h-6 items-center rounded-[6px] px-2 py-2 text-xs font-semibold",
                  displayData?.isTaken
                    ? "text-neutral-600"
                    : getTimeLabelStyle(displayData.timeLabel.text)
                )}
              >
                {displayData.timeLabel.text}
              </span>
            )}

            {/* Overload Badge if applicable */}
            {displayData?.overloadInfo?.hasOverload && (
              <span
                className={cn(
                  "flex h-6 items-center rounded-[6px] px-2 py-2 text-xs font-semibold",
                  displayData?.isTaken
                    ? "text-neutral-600"
                    : "bg-error-50 text-error-700"
                )}
              >
                Potensi Overload
              </span>
            )}

            {/* Bookmark icon */}
            <div className="ml-auto">
              <button
                onClick={handleSave}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full",
                  displayData?.isTaken
                    ? "border border-[#C4C4C4]"
                    : isSaved
                      ? "bg-[#FFE9ED]"
                      : "border border-[#C4C4C4] bg-white"
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
          <div className="mt-4 border-b border-[#C4C4C4]"></div>
        </div>

        {/* Content - Main content area inside scrollable container */}
        <div className="p-4">
          {/* Informasi Armada */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3
                className={cn(
                  "text-[12px] font-semibold",
                  displayData?.isTaken ? "text-neutral-600" : "text-neutral-600"
                )}
              >
                Informasi Armada
              </h3>
              <h3
                className={cn(
                  "text-[12px] font-semibold",
                  displayData?.isTaken ? "text-neutral-600" : "text-neutral-500"
                )}
              >
                Potensi Pendapatan
              </h3>
            </div>

            <div className="mb-3 flex justify-between">
              <p
                className={cn(
                  "w-[251px] text-sm font-bold",
                  displayData?.isTaken ? "text-neutral-600" : "text-neutral-900"
                )}
              >
                {displayData?.carrierName} - {displayData?.truckTypeName}
              </p>
              <p
                className={cn(
                  "text-sm font-bold",
                  displayData?.isTaken ? "text-neutral-600" : "text-primary-700"
                )}
              >
                {formatCurrency(displayData?.totalPrice)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p
                className={cn(
                  "flex items-center text-[12px] font-medium",
                  displayData?.isTaken ? "text-neutral-600" : "text-[#7B7B7B]"
                )}
              >
                <IconComponent
                  src="/icons/truk16.svg"
                  className="mr-2 h-4 w-4 text-neutral-600"
                />
                Kebutuhan :{" "}
                <span
                  className={cn(
                    displayData?.isTaken
                      ? "text-neutral-600"
                      : "text-neutral-900"
                  )}
                >
                  {displayData?.truckCount || 1} Unit
                </span>
              </p>
              <div
                className={cn(
                  "rounded-[6px] border px-2 py-2 text-xs font-semibold",
                  displayData?.isTaken
                    ? "border-neutral-400 bg-white text-neutral-600"
                    : "border-[#7A360D] bg-white text-[#7A360D]"
                )}
              >
                {request.orderCode}
              </div>
            </div>
          </div>
          <div className="my-4 border-b border-[#C4C4C4]"></div>

          {/* Waktu Muat */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3
                className={cn(
                  "text-[12px] font-semibold",
                  displayData?.isTaken ? "text-neutral-600" : "text-neutral-600"
                )}
              >
                Waktu Muat
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <p
                className={cn(
                  "flex items-center text-[12px] font-semibold",
                  displayData?.isTaken ? "text-neutral-600" : "text-neutral-900"
                )}
              >
                <IconComponent
                  src="/icons/calendar16.svg"
                  className={cn(
                    "mr-2 h-4 w-4",
                    displayData?.isTaken ? "text-neutral-600" : "text-[#461B02]"
                  )}
                />
                <span
                  className={cn(
                    displayData?.isTaken
                      ? "text-neutral-600"
                      : "text-neutral-900"
                  )}
                >
                  {displayData?.loadDateTime ||
                    "03 Jan 2025 09:00 WIB s/d 04 Jan 2025 11:00 WIB"}
                </span>
              </p>
            </div>
          </div>
          <div className="my-4 border-b border-[#C4C4C4]"></div>

          {/* Rute Muat & Bongkar */}
          <div>
            <div className="mb-3 flex items-center">
              <h3
                className={cn(
                  "text-[12px] font-semibold",
                  displayData?.isTaken ? "text-neutral-600" : "text-neutral-600"
                )}
              >
                Rute Muat & Bongkar
              </h3>
              <span
                className={cn(
                  "ml-2 inline-flex items-center rounded-[100px] border border-neutral-400 px-3 py-2 text-[10px] font-semibold",
                  displayData?.isTaken
                    ? "text-neutral-600"
                    : "bg-neutral-200 text-neutral-900"
                )}
              >
                Estimasi Jarak: {displayData?.estimatedDistance || 0} km
              </span>
            </div>

            <div className="mb-4 flex w-full justify-between">
              <div className="w-full">
                {/* Combined Timeline Section */}
                {(() => {
                  const pickupLocations = displayData?.pickupLocations || [];
                  const dropoffLocations = displayData?.dropoffLocations || [];

                  // Create items array with headers and locations
                  const timelineItems = [];

                  // Add Lokasi Muat header as timeline item
                  timelineItems.push({
                    type: "header",
                    text: "Lokasi Muat",
                  });

                  // Add pickup locations
                  pickupLocations.forEach((location, index) => {
                    timelineItems.push({
                      type: "location",
                      variant: "number-muat",
                      location: location,
                      originalIndex: index,
                    });
                  });

                  // Add Lokasi Bongkar header as timeline item
                  timelineItems.push({
                    type: "header",
                    text: "Lokasi Bongkar",
                  });

                  // Add dropoff locations
                  dropoffLocations.forEach((location, index) => {
                    timelineItems.push({
                      type: "location",
                      variant: "number-bongkar",
                      location: location,
                      originalIndex: index,
                    });
                  });

                  return (
                    <div>
                      <TimelineContainer>
                        {timelineItems.map((item, globalIndex) => {
                          const isLastItem =
                            globalIndex === timelineItems.length - 1;

                          if (item.type === "header") {
                            return (
                              <div
                                key={`header-${globalIndex}`}
                                className="grid grid-cols-[16px_1fr] items-center gap-x-2 pb-2"
                              >
                                <div className="relative flex justify-center">
                                  {/* Garis penghubung untuk header - hanya untuk "Lokasi Bongkar" */}
                                  {!isLastItem &&
                                    item.text === "Lokasi Bongkar" && (
                                      <div className="absolute left-1/2 top-0 h-[32px] w-px -translate-x-1/2 border-l-2 border-dashed border-neutral-400" />
                                    )}
                                </div>
                                <div className="">
                                  <h4
                                    className={cn(
                                      "text-[12px] font-medium",
                                      displayData?.isTaken
                                        ? "text-neutral-600"
                                        : "text-neutral-600"
                                    )}
                                  >
                                    {item.text}
                                  </h4>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <NewTimelineItem
                              key={`${item.variant}-${item.originalIndex}`}
                              variant={item.variant}
                              index={item.originalIndex}
                              activeIndex={0}
                              isLast={isLastItem}
                              title={item.location.fullAddress}
                              className="pb-2"
                              appearance={{
                                titleClassname: cn(
                                  "break-all text-[12px] font-medium",
                                  displayData?.isTaken
                                    ? "text-neutral-600"
                                    : "text-neutral-900"
                                ),
                              }}
                            />
                          );
                        })}
                      </TimelineContainer>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
          <div className="my-4 border-b border-[#C4C4C4]"></div>

          {/* Informasi Muatan */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3
                className={cn(
                  "text-[12px] font-semibold",
                  displayData?.isTaken ? "text-neutral-600" : "text-neutral-600"
                )}
              >
                Informasi Muatan (Total:{" "}
                {displayData?.cargos?.reduce(
                  (sum, cargo) => sum + (cargo.weight || 0),
                  0
                ) || 0}{" "}
                kg)
              </h3>
            </div>

            <div className="space-y-2">
              {displayData?.cargos?.map((cargo, index) => (
                <div key={cargo.id} className="flex items-center">
                  <IconComponent
                    src="/icons/box16.svg"
                    className={cn(
                      "mr-2 h-4 w-4",
                      displayData?.isTaken
                        ? "text-neutral-600"
                        : "text-[#461B02]"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[12px] font-semibold",
                      displayData?.isTaken
                        ? "text-neutral-600"
                        : "text-neutral-900"
                    )}
                  >
                    {cargo.name}{" "}
                    <span
                      className={cn(
                        "text-[12px] font-semibold",
                        displayData?.isTaken
                          ? "text-neutral-600"
                          : "text-neutral-600"
                      )}
                    >
                      ({cargo.weight?.toLocaleString("id-ID") || "0"} kg)
                      {cargo.length && cargo.width && cargo.height && (
                        <span>
                          {" "}
                          ({cargo.length}x{cargo.width}x{cargo.height}{" "}
                          {cargo.dimensionUnit || "m"})
                        </span>
                      )}
                    </span>
                  </span>
                </div>
              )) || (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <IconComponent
                      src="/icons/box16.svg"
                      className={cn(
                        "mr-2 h-4 w-4",
                        displayData?.isTaken
                          ? "text-neutral-600"
                          : "text-[#461B02]"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[12px] font-semibold",
                        displayData?.isTaken
                          ? "text-neutral-600"
                          : "text-neutral-900"
                      )}
                    >
                      Besi Baja{" "}
                      <span
                        className={cn(
                          "text-[12px] font-semibold",
                          displayData?.isTaken
                            ? "text-neutral-600"
                            : "text-neutral-600"
                        )}
                      >
                        (1.000 kg)
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <IconComponent
                      src="/icons/box16.svg"
                      className={cn(
                        "mr-2 h-4 w-4",
                        displayData?.isTaken
                          ? "text-neutral-600"
                          : "text-[#461B02]"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[12px] font-semibold",
                        displayData?.isTaken
                          ? "text-neutral-600"
                          : "text-neutral-900"
                      )}
                    >
                      Batu Bata{" "}
                      <span
                        className={cn(
                          "text-[12px] font-semibold",
                          displayData?.isTaken
                            ? "text-neutral-600"
                            : "text-neutral-600"
                        )}
                      >
                        (1.000 kg)
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <IconComponent
                      src="/icons/box16.svg"
                      className={cn(
                        "mr-2 h-4 w-4",
                        displayData?.isTaken
                          ? "text-neutral-600"
                          : "text-[#461B02]"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[12px] font-semibold",
                        displayData?.isTaken
                          ? "text-neutral-600"
                          : "text-neutral-900"
                      )}
                    >
                      Karet Mentah{" "}
                      <span
                        className={cn(
                          "text-[12px] font-semibold",
                          displayData?.isTaken
                            ? "text-neutral-600"
                            : "text-neutral-600"
                        )}
                      >
                        (500 kg)
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="my-4 border-b border-[#C4C4C4]"></div>

          {/* Deskripsi Muatan */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3
                className={cn(
                  "text-[12px] font-semibold",
                  displayData?.isTaken ? "text-neutral-600" : "text-neutral-600"
                )}
              >
                Deskripsi Muatan
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <p
                className={cn(
                  "text-[12px] font-medium",
                  displayData?.isTaken ? "text-neutral-600" : "text-neutral-900"
                )}
              >
                {displayData?.cargoDescription ||
                  "tolong kirim muatan dengan hati hati, jangan sampai rusak dan hancur, terimakasih"}
              </p>
            </div>
          </div>
          <div className="my-4 border-b border-[#C4C4C4]"></div>

          {/* Foto Muatan */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3
                className={cn(
                  "text-[12px] font-semibold",
                  displayData?.isTaken ? "text-neutral-600" : "text-neutral-600"
                )}
              >
                Foto Muatan
              </h3>
            </div>

            <LightboxProvider
              images={
                displayData?.photos?.map((photo) => photo.photoUrl) || [
                  "https://picsum.photos/400/300?random=1",
                  "https://picsum.photos/400/300?random=2",
                  "https://picsum.photos/400/300?random=3",
                  "https://picsum.photos/400/300?random=4",
                ]
              }
              title="Foto Muatan"
            >
              <div className="flex gap-2">
                {(
                  displayData?.photos || [
                    {
                      id: "1",
                      photoUrl: "https://picsum.photos/400/300?random=1",
                      description: "Foto muatan 1",
                    },
                    {
                      id: "2",
                      photoUrl: "https://picsum.photos/400/300?random=2",
                      description: "Foto muatan 2",
                    },
                    {
                      id: "3",
                      photoUrl: "https://picsum.photos/400/300?random=3",
                      description: "Foto muatan 3",
                    },
                    {
                      id: "4",
                      photoUrl: "https://picsum.photos/400/300?random=4",
                      description: "Foto muatan 4",
                    },
                  ]
                ).map((photo, index) => (
                  <LightboxPreview
                    key={photo.id}
                    image={photo.photoUrl}
                    index={index}
                    className="h-14 w-14 overflow-hidden rounded-md border border-neutral-200 object-cover"
                    alt={photo.description || `Foto muatan ${index + 1}`}
                  />
                ))}
              </div>
            </LightboxProvider>
          </div>

          {/* Layanan Tambahan - Only show if there are additional services */}
          {displayData?.additionalServices?.length > 0 && (
            <>
              <div className="my-4 border-b border-[#C4C4C4]"></div>

              <div className="">
                <div className="mb-3 flex items-center justify-between">
                  <h3
                    className={cn(
                      "text-[12px] font-semibold",
                      displayData?.isTaken
                        ? "text-neutral-600"
                        : "text-neutral-600"
                    )}
                  >
                    Layanan Tambahan
                  </h3>
                </div>

                <div className="space-y-2">
                  {displayData.additionalServices.map((service, index) => (
                    <div key={service.id} className="flex items-center">
                      <IconComponent
                        src={
                          service.serviceName === "Kirim Berkas"
                            ? "/icons/service-plus.svg"
                            : "/icons/service-plus.svg"
                        }
                        className={cn(
                          "mr-2 h-4 w-4",
                          displayData?.isTaken
                            ? "text-neutral-600"
                            : "text-[#461B02]"
                        )}
                      />
                      <span
                        className={cn(
                          "text-[12px] font-medium",
                          displayData?.isTaken
                            ? "text-neutral-600"
                            : "text-neutral-900"
                        )}
                      >
                        {service.serviceName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-shrink-0 border-t border-neutral-400 bg-white px-5 py-3">
        <div className="flex gap-2">
          {displayData?.isTaken ? (
            <div className="flex w-full flex-col gap-3">
              <div className="flex w-full rounded-xl bg-error-50 p-2">
                <span className="text-xs font-semibold text-error-400">
                  Permintaan sudah diambil transporter lain
                </span>
              </div>
              <Button
                variant="muattrans-primary"
                className="w-full py-3 text-[14px] font-semibold"
                onClick={handleUnderstand}
              >
                Mengerti
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="muattrans-error-secondary"
                className="flex-1 py-2 text-[14px] font-semibold"
                onClick={onBack}
              >
                Tolak
              </Button>
              <Button
                variant="muattrans-primary"
                className="flex-1 py-2 text-[14px] font-semibold"
                onClick={() =>
                  console.log("Terima clicked for:", displayData?.orderCode)
                }
              >
                Terima
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermintaanAngkutDetail;
