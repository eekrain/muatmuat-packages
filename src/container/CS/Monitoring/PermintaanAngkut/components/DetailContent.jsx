import { useState } from "react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { cn } from "@/lib/utils";

const DetailContent = ({
  displayData,
  request,
  formatCurrency,
  getOrderTypeStyle,
  getTimeLabelStyle,
  handleSave,
  isSaved,
}) => {
  const [showHubungiModal, setShowHubungiModal] = useState(false);

  // Helper function to format load date time
  const formatLoadDateTime = () => {
    if (!displayData?.loadTimeStart) return "03 Jan 2025 09:00 WIB";

    const startDate = new Date(displayData.loadTimeStart);

    const formatDate = (date) => {
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const formatTime = (date) => {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    return `${formatDate(startDate)} ${formatTime(startDate)} WIB`;
  };

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto px-4",
        displayData?.isTaken && "grayscale"
      )}
    >
      {/* Informasi Shipper */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex h-14 flex-col justify-between">
            <h3 className="text-xs font-bold text-neutral-900">
              Informasi Shipper
            </h3>
            <div className="flex items-center gap-2">
              <img
                src={request.shipperInfo?.logo || "/img/muatan1.png"}
                alt={request.shipperInfo?.name || "Logo Shipper"}
                className="h-8 w-8 rounded-full border-[1.25px] border-neutral-400 object-cover"
              />
              <div className="space-y-1">
                <p className="text-xs font-bold">
                  {request.shipperInfo?.name || "-"}
                </p>
                <div className="flex items-center gap-1">
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
                      Hubungi
                    </p>
                  </div>
                  <div className="mx-1 h-0.5 w-0.5 rounded-full bg-neutral-600"></div>
                  <div className="flex items-center gap-1">
                    <IconComponent
                      src="/icons/location-driver.svg"
                      className="h-4 w-4 text-neutral-600"
                    />
                    <p className="text-[10px] font-medium text-neutral-900">
                      {(() => {
                        const location = "Kec. Tegalsari kulon, Kota Surabaya";
                        return location.length > 31
                          ? `${location.substring(0, 31)}...`
                          : location;
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-xs font-medium text-gray-600">
              {(() => {
                // Anggap createdAt sudah WIB
                const created = new Date(
                  displayData?.shipperInfo?.createdAt ||
                    request?.shipperInfo?.createdAt
                );
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
            <p className="text-sm font-semibold text-neutral-900">
              {(() => {
                // Format countdown time
                const parseCountdownToSeconds = (timeStr) => {
                  if (!timeStr) return 0;
                  const parts = timeStr.split(":");
                  if (parts.length !== 3) return 0;
                  const [h, m, s] = parts.map(Number);
                  return h * 3600 + m * 60 + s;
                };

                const getCountdownSeconds = () => {
                  const timeLabels =
                    displayData?.timeLabels || request?.timeLabels;
                  const createdAt =
                    displayData?.shipperInfo?.createdAt ||
                    request?.shipperInfo?.createdAt;

                  if (!timeLabels?.countdown || !createdAt) return 0;

                  const start = new Date(createdAt);
                  const now = new Date();
                  const initial = parseCountdownToSeconds(timeLabels.countdown);
                  const elapsed = Math.floor((now - start) / 1000);
                  return initial - elapsed;
                };

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
                    return `${seconds < 0 ? "-" : ""}${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
                  }
                  return `${seconds < 0 ? "-" : ""}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
                };

                const countdown = getCountdownSeconds();
                return formatHHMMSS(countdown);
              })()}
            </p>
            {(displayData?.reblast !== "1" || request?.reblast !== "1") && (
              <p className="text-xs font-medium text-gray-600">
                Permintaan ke-{displayData?.reblast || request?.reblast}
              </p>
            )}
          </div>
        </div>
        <div className="border-b border-neutral-400 pt-4"></div>
      </div>

      {/* Status Tags */}
      <div className="mb-3 flex h-6 w-full items-start justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Label */}
          <span
            className={cn(
              "flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold",
              displayData?.isTaken || request?.isTaken
                ? "text-neutral-700"
                : (displayData?.orderType || request?.orderType) === "INSTANT"
                  ? "bg-success-50 text-success-400"
                  : "bg-primary-50 text-primary-700"
            )}
          >
            {(displayData?.orderType || request?.orderType) === "INSTANT"
              ? "Instan"
              : "Terjadwal"}
          </span>

          {/* Load Time Label */}
          <span
            className={cn(
              "flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold",
              displayData?.isTaken || request?.isTaken
                ? "text-neutral-700"
                : (() => {
                    const loadTimeStart =
                      displayData?.loadTimeStart || request?.loadTimeStart;
                    if (loadTimeStart) {
                      const today = new Date();
                      const muatDate = new Date(loadTimeStart);
                      today.setHours(0, 0, 0, 0);
                      muatDate.setHours(0, 0, 0, 0);
                      const diffDays = Math.round(
                        (muatDate - today) / (1000 * 60 * 60 * 24)
                      );

                      if (diffDays === 0 || diffDays === 1)
                        return "bg-success-50 text-success-400";
                      if (diffDays >= 2 && diffDays <= 5)
                        return "bg-warning-100 text-warning-900";
                      if (diffDays > 5) return "bg-primary-50 text-primary-700";
                    }
                    return "bg-primary-50 text-primary-700";
                  })()
            )}
          >
            {(() => {
              const loadTimeStart =
                displayData?.loadTimeStart || request?.loadTimeStart;
              if (loadTimeStart) {
                const today = new Date();
                const muatDate = new Date(loadTimeStart);
                today.setHours(0, 0, 0, 0);
                muatDate.setHours(0, 0, 0, 0);
                const diffDays = Math.round(
                  (muatDate - today) / (1000 * 60 * 60 * 24)
                );

                if (diffDays === 0) return "Muat Hari Ini";
                if (diffDays === 1) return "Muat Besok";
                if (diffDays > 1) return `Muat ${diffDays} Hari Lagi`;
              }
              return (
                displayData?.loadTimeText ||
                request?.loadTimeText ||
                "Muat 7 Hari Lagi"
              );
            })()}
          </span>

          {/* Overload Badge */}
          {(displayData?.potentialOverload || request?.potentialOverload) && (
            <span
              className={cn(
                "flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold",
                displayData?.isTaken || request?.isTaken
                  ? "text-neutral-700"
                  : "bg-error-50 text-error-400"
              )}
            >
              Potensi Overload
            </span>
          )}

          {/* Halal Certification Required Badge */}
          {(displayData?.isHalalLogistics || request?.isHalalLogistics) && (
            <div
              className={cn(
                "flex h-6 w-6 cursor-pointer items-center justify-center rounded-md px-1 py-2",
                displayData?.isTaken || request?.isTaken ? "" : "bg-[#F7EAFD]"
              )}
            >
              <IconComponent
                src="/icons/halal.svg"
                className={cn(
                  "h-[15.286855697631836px] w-[11.406869888305664px]",
                  displayData?.isTaken || request?.isTaken
                    ? "text-neutral-700"
                    : ""
                )}
              />
            </div>
          )}
        </div>
      </div>

      {/* Transporter Info */}
      <div className="mb-3 flex items-center gap-2">
        {/* Transporter Tersedia */}
        <div className="flex cursor-pointer items-center gap-1">
          <IconComponent
            src="/icons/truk16.svg"
            className="h-4 w-4 text-[#7B3F00]"
          />
          <span
            className={cn(
              "text-xs font-medium",
              ((displayData?.counters?.available ||
                request?.counters?.available) ??
                0) > 0
                ? "text-primary-700"
                : "text-neutral-600"
            )}
          >
            {(displayData?.counters?.available ||
              request?.counters?.available) ??
              0}{" "}
            Transporter Tersedia
          </span>
        </div>

        {/* Dilihat */}
        <div className="flex cursor-pointer items-center gap-1">
          <IconComponent
            src="/icons/eyes.svg"
            className="h-4 w-4 text-[#7B3F00]"
          />
          <span
            className={cn(
              "text-xs font-medium",
              ((displayData?.counters?.viewed || request?.counters?.viewed) ??
                0) > 0
                ? "text-primary-700"
                : "text-neutral-600"
            )}
          >
            {(displayData?.counters?.viewed || request?.counters?.viewed) ?? 0}{" "}
            Dilihat
          </span>
        </div>

        {/* Disimpan */}
        <div className="flex cursor-pointer items-center gap-1">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-100">
            <IconComponent
              src="/icons/bookmark-fill.svg"
              className="h-3 w-3 text-red-500"
            />
          </div>
          <span
            className={cn(
              "text-xs font-medium",
              ((displayData?.counters?.saved || request?.counters?.saved) ??
                0) > 0
                ? "text-primary-700"
                : "text-neutral-600"
            )}
          >
            {(displayData?.counters?.saved || request?.counters?.saved) ?? 0}{" "}
            Disimpan
          </span>
        </div>
      </div>

      {/* Divider after status tags */}
      <div className="mb-3 border-b border-[#C4C4C4] px-4"></div>

      {/* Informasi Armada */}
      <div className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">
            Informasi Armada
          </h3>
          <h3 className="text-sm font-semibold text-neutral-500">
            Potensi Pendapatan
          </h3>
        </div>

        <div className="mb-3 flex justify-between">
          <p className="text-sm font-bold text-neutral-900">
            {displayData?.vehicle?.truckType || "Tractor head 6 x 4"} dan{" "}
            {displayData?.vehicle?.carrierType ||
              "Semi Trailer - Skeletal Container Jumbo 45 ft"}{" "}
            ({displayData?.vehicle?.truckCount || 3} As)
          </p>
          <p className="text-sm font-bold text-primary-700">
            {formatCurrency(displayData?.pricing?.potentialIncome || 800000)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="flex items-center text-xs font-medium text-neutral-600">
            <IconComponent
              src="/icons/truck.svg"
              className="mr-2 h-4 w-4 text-neutral-600"
            />
            Kebutuhan : {displayData?.vehicle?.truckCount || 3} Unit
          </p>
          <div className="rounded-md border border-orange-600 bg-white px-2 py-1 text-xs font-semibold text-orange-600">
            {displayData?.orderCode || request?.orderCode || "MT25A001A"}
          </div>
        </div>
      </div>

      {/* Waktu Muat */}
      <div className="mb-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">
          Waktu Muat
        </h3>
        <div className="flex items-center">
          <IconComponent
            src="/icons/calendar.svg"
            className="mr-2 h-4 w-4 text-orange-600"
          />
          <span className="text-sm font-semibold text-neutral-900">
            {formatLoadDateTime()}
          </span>
        </div>
      </div>

      {/* Rute Muat & Bongkar */}
      <div className="mb-4">
        <div className="mb-3 flex items-center">
          <h3 className="text-sm font-semibold text-neutral-900">
            Rute Muat & Bongkar
          </h3>
          <span className="ml-2 inline-flex items-center rounded-full border border-neutral-400 bg-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-900">
            Estimasi Jarak: {displayData?.locations?.estimatedDistance || 121}{" "}
            km
          </span>
        </div>

        <div className="space-y-3">
          {/* Lokasi Muat */}
          <div>
            <h4 className="mb-2 text-xs font-medium text-neutral-600">
              Lokasi Muat
            </h4>
            <div className="flex items-start gap-2">
              <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-100">
                <span className="text-xs font-semibold text-orange-600">1</span>
              </div>
              <span className="text-sm font-medium text-neutral-900">
                {displayData?.locations?.pickupLocations?.[0]?.fullAddress ||
                  "Kota Surabaya, Kec. Tegalsari"}
              </span>
            </div>
          </div>

          {/* Lokasi Bongkar */}
          <div>
            <h4 className="mb-2 text-xs font-medium text-neutral-600">
              Lokasi Bongkar
            </h4>
            <div className="flex items-start gap-2">
              <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                <span className="text-xs font-semibold text-green-600">1</span>
              </div>
              <span className="text-sm font-medium text-neutral-900">
                {displayData?.locations?.dropoffLocations?.[0]?.fullAddress ||
                  "Kab. Tanah Bumbu Tanah Bumbu Tanah Bumbu Tanah Bumbu, Kec. Karangbintang Bandarkarangmulyo Gunung"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informasi Muatan */}
      <div className="mb-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">
          Informasi Muatan (Total: {displayData?.cargo?.totalWeight || 2500} kg)
        </h3>

        <div className="space-y-2">
          {displayData?.cargo?.items?.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center">
              <IconComponent
                src="/icons/box.svg"
                className="mr-2 h-4 w-4 text-orange-600"
              />
              <span className="text-sm font-semibold text-neutral-900">
                {item.name}{" "}
                <span className="font-medium text-neutral-600">
                  ({item.weight?.toLocaleString("id-ID") || "0"} kg)
                  {item.dimensions && (
                    <span>
                      {" "}
                      ({item.dimensions.length}x{item.dimensions.width}x
                      {item.dimensions.height} m)
                    </span>
                  )}
                </span>
              </span>
            </div>
          )) || (
            <>
              <div className="flex items-center">
                <IconComponent
                  src="/icons/box.svg"
                  className="mr-2 h-4 w-4 text-orange-600"
                />
                <span className="text-sm font-semibold text-neutral-900">
                  Besi Baja{" "}
                  <span className="font-medium text-neutral-600">
                    (1.000 kg) (1x2x5 m)
                  </span>
                </span>
              </div>
              <div className="flex items-center">
                <IconComponent
                  src="/icons/box.svg"
                  className="mr-2 h-4 w-4 text-orange-600"
                />
                <span className="text-sm font-semibold text-neutral-900">
                  Batu Bata{" "}
                  <span className="font-medium text-neutral-600">
                    (1.000 kg) (1x2x5 m)
                  </span>
                </span>
              </div>
              <div className="flex items-center">
                <IconComponent
                  src="/icons/box.svg"
                  className="mr-2 h-4 w-4 text-orange-600"
                />
                <span className="text-sm font-semibold text-neutral-900">
                  Karet Mentah{" "}
                  <span className="font-medium text-neutral-600">
                    (500 kg) (1x2x5 m)
                  </span>
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Deskripsi Muatan */}
      <div className="mb-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">
          Deskripsi Muatan
        </h3>
        <p className="text-sm font-medium text-neutral-900">
          {displayData?.cargo?.description ||
            "tolong kirim muatan dengan hati hati, jangan sampai rusak dan hancur, terimakasih"}
        </p>
      </div>

      {/* Foto Muatan */}
      <div className="mb-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-900">
          Foto Muatan
        </h3>

        <LightboxProvider
          images={
            displayData?.photos || [
              "https://picsum.photos/400/300?random=1",
              "https://picsum.photos/400/300?random=2",
              "https://picsum.photos/400/300?random=3",
              "https://picsum.photos/400/300?random=4",
            ]
          }
          title="Foto Muatan"
          modalClassName="w-[592px] h-[445px]"
        >
          <div className="flex gap-2">
            {(
              displayData?.photos || [
                "https://picsum.photos/400/300?random=1",
                "https://picsum.photos/400/300?random=2",
                "https://picsum.photos/400/300?random=3",
                "https://picsum.photos/400/300?random=4",
              ]
            ).map((photo, index) => (
              <LightboxPreview
                key={index}
                image={photo}
                index={index}
                className="h-14 w-14 overflow-hidden rounded-md border border-neutral-200 object-cover"
                alt={`Foto muatan ${index + 1}`}
              />
            ))}
          </div>
        </LightboxProvider>
      </div>

      {/* Hubungi Modal */}
      {showHubungiModal && (
        <HubungiModal
          onClose={() => setShowHubungiModal(false)}
          shipperData={displayData?.shipperInfo || request?.shipperInfo}
        />
      )}
    </div>
  );
};

export default DetailContent;
