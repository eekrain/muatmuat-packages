"use client";

import { useEffect, useState } from "react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import Button from "@/components/Button/Button";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import NotificationDot from "@/components/NotificationDot/NotificationDot";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import ModalTransportDilihat from "./ModalTransportDilihat";
import ModalTransportDisimpan from "./ModalTransportDisimpan";
import ModalTransportTersedia from "./ModalTransportTersedia";

const TransportRequestCard = ({
  request,
  isSuspended = false,
  onBookmarkToggle,
  isBookmarked,
  onUnderstand,
  onShowDetail,
}) => {
  // Use the prop if provided, otherwise fall back to request.isSaved
  const [isSaved, setIsSaved] = useState(
    isBookmarked !== undefined ? isBookmarked : request.isSaved
  );

  const [showDetail, setShowDetail] = useState(false);
  const [showModalTransporter, setShowModalTransporter] = useState(false);
  const [showModalDisimpan, setShowModalDisimpan] = useState(false);
  const [showModalDilihat, setShowModalDilihat] = useState(false);
  const [showHubungiModal, setShowHubungiModal] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    if (isBookmarked !== undefined) {
      setIsSaved(isBookmarked);
    }
  }, [isBookmarked]);

  const handleSave = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    if (onBookmarkToggle) onBookmarkToggle(request.id, newSavedState);
  };

  const handleDetail = () => {
    if (onShowDetail) {
      onShowDetail(request);
    }
  };

  const handleReject = () => {
    // TODO: Implement reject functionality
  };

  const handleAccept = () => {
    // TODO: Implement accept functionality
  };

  const handleUnderstand = () => {
    toast.success(`Permintaan ${request.orderCode} berhasil ditutup`);
    if (onUnderstand) onUnderstand(request.id);
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

  // Parse countdown string (HH:mm:ss) to seconds
  const parseCountdownToSeconds = (str) => {
    if (!str) return 0;
    const parts = str.split(":");
    if (parts.length !== 3) return 0;
    const [h, m, s] = parts.map(Number);
    return h * 3600 + m * 60 + s;
  };

  // Countdown logic: start at createdAt, allow negative values
  const getCountdownSeconds = () => {
    if (!request.timeLabels?.countdown || !request.shipperInfo?.createdAt)
      return 0;
    const start = new Date(request.shipperInfo.createdAt);
    const now = new Date();
    const initial = parseCountdownToSeconds(request.timeLabels.countdown);
    const elapsed = Math.floor((now - start) / 1000);
    // Allow negative countdown if time has passed
    return initial - elapsed;
  };

  const [countdown, setCountdown] = useState(getCountdownSeconds());
  useEffect(() => {
    setCountdown(getCountdownSeconds());
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [request.timeLabels?.countdown, request.shipperInfo?.createdAt]);
  // (removed duplicate countdown state/effect)

  // Format always as hh:mm:ss for < 1 day
  const formatHHMMSS = (seconds) => {
    const absSec = Math.abs(seconds);
    const days = Math.floor(absSec / 86400);
    if (days > 0) {
      return `${seconds < 0 ? "-" : ""}${days} Hari`;
    }
    const hours = Math.floor((absSec % 86400) / 3600);
    const minutes = Math.floor((absSec % 3600) / 60);
    const secs = absSec % 60;
    if (absSec < 3600) {
      // Less than 1 hour: show mm:ss only
      return `${
        seconds < 0 ? "-" : ""
      }${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    // 1 hour to < 1 day: show hh:mm:ss
    return `${
      seconds < 0 ? "-" : ""
    }${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Calculate loadTimeText (e.g., 'Muat 3 Hari Lagi')
  let loadTimeText = request.loadTimeText;
  let loadTimeColor = "bg-primary-50 text-primary-700";
  if (request.loadTimeStart) {
    const today = new Date();
    const muatDate = new Date(request.loadTimeStart);
    today.setHours(0, 0, 0, 0);
    muatDate.setHours(0, 0, 0, 0);
    const diffDays = Math.round((muatDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      loadTimeText = "Muat Hari Ini";
      loadTimeColor = "bg-success-50 text-success-400";
    } else if (diffDays === 1) {
      loadTimeText = "Muat Besok";
      loadTimeColor = "bg-success-50 text-success-400";
    } else if (diffDays >= 2 && diffDays <= 5) {
      loadTimeText = `Muat ${diffDays} Hari Lagi`;
      loadTimeColor = "bg-warning-100 text-warning-900";
    } else if (diffDays > 5) {
      loadTimeText = `Muat ${diffDays} Hari Lagi`;
      loadTimeColor = "bg-primary-50 text-primary-700";
    }
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "overflow-hidden rounded-[8px] border border-[#C4C4C4] bg-white shadow-sm",
          request.isTaken && "brightness-95 grayscale"
        )}
      >
        <>
          <div className="flex h-[66px] items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <img
                src={request.shipperInfo?.logo || "/img/muatan1.png"}
                alt={request.shipperInfo?.name || "Logo Shipper"}
                className="h-10 w-10 rounded-full border-[1.25px] border-neutral-400 object-cover"
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {request.shipperInfo?.name || "-"}
                </p>
                <div
                  className="flex items-center gap-1"
                  onClick={() => setShowHubungiModal(true)}
                >
                  <IconComponent
                    src="/icons/contact.svg"
                    className={cn(
                      "h-4 w-4",
                      request.isTaken ? "text-neutral-700" : ""
                    )}
                  />
                  <p className="cursor-pointer text-xs font-medium text-primary-700">
                    Hubungi Shipper
                  </p>

                  {/* HubungiModal integration */}
                  <HubungiModal
                    isOpen={showHubungiModal}
                    onClose={() => setShowHubungiModal(false)}
                    transporterData={null} // TODO: pass actual transporter data if available
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-xs text-gray-600">
                {(() => {
                  // Anggap createdAt sudah WIB
                  const created = new Date(request.shipperInfo?.createdAt);
                  const now = new Date();

                  // Hitung selisih dalam ms
                  const diffMs = now - created;
                  const diffSec = Math.floor(diffMs / 1000);
                  const diffMin = Math.floor(diffSec / 60);
                  const diffHour = Math.floor(diffMin / 60);
                  const diffDay = Math.floor(diffHour / 24);

                  if (diffDay > 0) return `${diffDay} Hari yang lalu`;
                  if (diffHour > 0) return `${diffHour} Jam yang lalu`;
                  if (diffMin > 0) return `${diffMin} Menit yang lalu`;
                  return `${diffSec} Detik yang lalu`;
                })()}
              </p>
              <p className="text-xs font-semibold text-neutral-900">
                {formatHHMMSS(countdown)}
              </p>
              {request.reblast !== "1" && (
                <p className="text-xs text-gray-600">
                  Permintaan ke-{request.reblast}
                </p>
              )}
            </div>
          </div>
          <div className="border-b border-neutral-400"></div>
        </>

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
                    : request.orderType === "INSTANT"
                      ? "bg-success-50 text-success-400"
                      : "bg-primary-50 text-primary-700"
                )}
              >
                {request.orderType === "INSTANT" ? "Instan" : "Terjadwal"}
              </span>

              {/* Load Time Label */}
              <span
                className={cn(
                  "flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold",
                  request.isTaken ? "text-neutral-700" : loadTimeColor
                )}
              >
                {loadTimeText || "Muat 7 Hari Lagi"}
              </span>

              {/* Overload Badge */}
              {request.potentialOverload && (
                <span
                  className={cn(
                    "flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold",
                    request.isTaken
                      ? "text-neutral-700"
                      : "bg-error-50 text-error-400"
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
                          "h-[15.286855697631836px] w-[11.406869888305664px]",
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
          </div>

          {/* Divider after status tags */}
          <div className="mb-3 border-b border-[#C4C4C4]"></div>

          {/* Location Info */}
          <div className="mb-3 flex w-full justify-between">
            <div className="w-[279px]">
              <TimelineContainer>
                {[
                  {
                    fullAddress: request.locations?.pickupLocations?.[0]
                      ? `${request.locations.pickupLocations[0].city}, ${request.locations.pickupLocations[0].district}`
                      : "Lokasi Muat",
                    type: "pickup",
                  },
                  {
                    fullAddress: request.locations?.dropoffLocations?.[0]
                      ? `${request.locations.dropoffLocations[0].city}, ${request.locations.dropoffLocations[0].district}`
                      : "Lokasi Bongkar",
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
                {request.locations?.estimatedDistance} km
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
                    request.cargo?.items?.[0]?.weight || 0,
                    request.cargo?.items?.[0]?.weightUnit || "kg"
                  )}
                  )
                </div>
                <div
                  className={cn(
                    "text-xs font-semibold",
                    request.isTaken ? "text-[#7B7B7B]" : "text-neutral-900"
                  )}
                >
                  {request.cargo?.additionalItems > 0 ? (
                    <>
                      {request.cargo.items[0].name},{" "}
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
                            +{request.cargo.additionalItems} lainnya
                          </span>
                        }
                      >
                        <div className="text-sm">
                          <div className="mb-2 font-medium">
                            Informasi Muatan
                          </div>
                          <div className="space-y-1">
                            {request.cargo.items
                              .slice(1)
                              .map((cargo, index) => (
                                <div key={index} className="text-sm">
                                  {index + 1}. {cargo.name}
                                </div>
                              ))}
                          </div>
                        </div>
                      </InfoTooltip>
                    </>
                  ) : (
                    request.cargo?.items?.[0]?.name
                  )}
                </div>
              </div>
            </div>
            <div className="ml-4">
              <span className="rounded-[6px] border border-[#7A360D] bg-white px-2 py-2 text-xs font-semibold text-[#7A360D]">
                {request.orderCode}
              </span>
            </div>
          </div>
          {/* Vehicle Info */}
          {showDetail && (
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
                  {request.vehicle?.truckCount} Unit (
                  {request.vehicle?.truckType} - {request.vehicle?.carrierType})
                </div>
              </div>
            </div>
          )}

          {/* Schedule Info */}
          {showDetail && (
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
                  {request.loadDateTime ||
                    "03 Jan 2025 09:00 WIB s/d 11:00 WIB"}
                </div>
              </div>
            </div>
          )}

          {/* Toggle Button */}
          <div className="mb-4 flex w-full items-center justify-between">
            {/* Kiri */}
            <div
              className="flex cursor-pointer items-center gap-1"
              onClick={() => setShowDetail((prev) => !prev)}
            >
              <span className="text-xs font-medium text-primary-700">
                {showDetail ? "Sembunyikan" : "Lihat Selengkapnya"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 text-primary-700 transition-transform duration-300 ${
                  showDetail ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Kanan */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-neutral-600">
                Potensi Pendapatan
              </span>
              <span className="text-[12px] font-bold text-primary-700">
                {request.pricing?.potentialIncome
                  ? formatCurrency(request.pricing.potentialIncome)
                  : "-"}
              </span>
            </div>
          </div>

          {/* Divider before action buttons */}
          <div
            className={cn(
              "border-b border-[#C4C4C4]",
              request.isTaken ? "mb-10" : "mb-3"
            )}
          ></div>

          {/* Transporter Info */}
          <div className="mb-3 flex items-center gap-2">
            {/* Transporter Tersedia */}
            <div
              className="flex cursor-pointer items-center gap-1"
              onClick={() => setShowModalTransporter(true)}
            >
              <IconComponent
                src="/icons/truk16.svg"
                className="h-4 w-4 text-[#7B3F00]"
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  (request.counters?.available ?? 0) > 0
                    ? "text-primary-700"
                    : "text-neutral-600"
                )}
              >
                {request.counters?.available ?? 0} Transporter Tersedia
              </span>
            </div>

            {/* Modal */}
            {showModalTransporter && (
              <ModalTransportTersedia
                onClose={() => setShowModalTransporter(false)}
              />
            )}

            {/* Dilihat */}
            <div
              className="flex cursor-pointer items-center gap-1"
              onClick={() => setShowModalDilihat(true)}
            >
              <IconComponent
                src="/icons/eyes.svg"
                className="h-4 w-4 text-[#7B3F00]"
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  (request.counters?.viewed ?? 0) > 0
                    ? "text-primary-700"
                    : "text-neutral-600"
                )}
              >
                {request.counters?.viewed ?? 0} Dilihat
              </span>
            </div>
            {showModalDilihat && (
              <ModalTransportDilihat
                onClose={() => setShowModalDilihat(false)}
              />
            )}

            {/* Disimpan */}
            <div
              className="flex cursor-pointer items-center gap-1"
              onClick={() => setShowModalDisimpan(true)}
            >
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-100">
                <IconComponent
                  src="/icons/bookmark-fill.svg"
                  className="h-3 w-3 text-red-500"
                />
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  (request.counters?.saved ?? 0) > 0
                    ? "text-primary-700"
                    : "text-neutral-600"
                )}
              >
                {request.counters?.saved ?? 0} Disimpan
              </span>
            </div>
            {showModalDisimpan && (
              <ModalTransportDisimpan
                onClose={() => setShowModalDisimpan(false)}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <>
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 w-[180px] rounded-[24px] px-4 text-[14px] font-semibold"
                onClick={handleDetail}
              >
                Detail
              </Button>
              <Button
                variant="muattrans-warning"
                className="h-8 w-[180px] rounded-[24px] px-4 text-[14px] font-semibold text-[#461B02]"
                onClick={handleAccept}
              >
                Assign Transporter
              </Button>
            </>
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
            <NotificationDot
              position="absolute"
              positionClasses="right-[1px] top-[-1px]"
              size="md"
              color="red"
              animated={true}
            />
          </div>
        </>
      )}

      {/* HubungiModal integration */}
      <HubungiModal
        isOpen={showHubungiModal}
        onClose={() => setShowHubungiModal(false)}
        transporterData={request.shipperInfo || null}
      />
    </div>
  );
};

export default TransportRequestCard;
