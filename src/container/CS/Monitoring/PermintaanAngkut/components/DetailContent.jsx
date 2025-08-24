import { useState } from "react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

import ModalTransportDilihat from "./ModalTransportDilihat";
import ModalTransportDisimpan from "./ModalTransportDisimpan";
import ModalTransportTersedia from "./ModalTransportTersedia";

const DetailContent = ({
  displayData,
  request,
  formatCurrency,
  getOrderTypeStyle,
  getTimeLabelStyle,
  handleSave,
  isSaved,
}) => {
  const { t } = useTranslation();
  const [showHubungiModal, setShowHubungiModal] = useState(false);
  const [showTersediaModal, setShowTersediaModal] = useState(false);
  const [showDilihatModal, setShowDilihatModal] = useState(false);
  const [showDisimpanModal, setShowDisimpanModal] = useState(false);

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
      {/* Halal Certification Notice */}
      {(displayData?.isHalalLogistics || request?.isHalalLogistics) && (
        <div className="flex-shrink-0 pb-4">
          <div className="flex items-center gap-3 rounded-xl bg-[#F7EAFD] px-4 py-2">
            <IconComponent src="/icons/halal.svg" className="h-6 w-[18px]" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#652672]">
                {t(
                  "DetailContent.noticeHalalLogistics",
                  {},
                  "Memerlukan pengiriman dengan sertifikasi halal logistik"
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Informasi Shipper */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex h-14 flex-col justify-between">
            <h3 className="text-xs font-bold text-neutral-900">
              {t(
                "DetailContent.titleShipperInformation",
                {},
                "Informasi Shipper"
              )}
            </h3>
            <div className="flex items-center gap-2">
              <img
                src={request.shipperInfo?.logo || "/img/muatan1.png"}
                alt={
                  request.shipperInfo?.name ||
                  t("DetailContent.altShipperLogo", {}, "Logo Shipper")
                }
                className="h-8 w-8 rounded-full border-[1.25px] border-neutral-400 object-cover"
              />
              <div className="space-y-1">
                <p className="text-xs font-bold">
                  {request.shipperInfo?.name || "-"}
                </p>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    <IconComponent
                      src="/icons/contact.svg"
                      className={cn(
                        "h-4 w-4",
                        request.isTaken ? "text-neutral-700" : ""
                      )}
                    />
                    <p
                      className="cursor-pointer text-xs font-medium text-primary-700"
                      onClick={() => setShowHubungiModal(true)}
                    >
                      {t("DetailContent.buttonContact", {}, "Hubungi")}
                    </p>
                    <HubungiModal
                      isOpen={showHubungiModal}
                      onClose={() => setShowHubungiModal(false)}
                      transporterContacts={request.shipperInfo || null}
                    />
                  </div>
                  <div className="mx-1 h-0.5 w-0.5 rounded-full bg-neutral-600"></div>
                  <div className="flex items-center gap-1">
                    <IconComponent
                      src="/icons/location-driver.svg"
                      className="h-4 w-4 text-neutral-600"
                    />
                    <p className="text-[10px] font-medium text-neutral-900">
                      {(() => {
                        const address = request.shipperInfo?.address;
                        let location = "-";
                        if (address) {
                          location = `${t("DetailContent.textSubdistrictAbbreviation", {}, "Kec.")} ${address.district}, ${address.city}${address.province ? `, ${address.province}` : ""}`;
                        }
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

                if (diffDay > 0)
                  return t(
                    "DetailContent.textDaysAgo",
                    { diffDay },
                    "{diffDay} Hari yang lalu"
                  );
                if (diffHour > 0)
                  return t(
                    "DetailContent.textHoursAgo",
                    { diffHour },
                    "{diffHour} Jam yang lalu"
                  );
                if (diffMin > 0)
                  return t(
                    "DetailContent.textMinutesAgo",
                    { diffMin },
                    "{diffMin} Menit yang lalu"
                  );
                return t(
                  "DetailContent.textSecondsAgo",
                  { diffSec },
                  "{diffSec} Detik yang lalu"
                );
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
                    return `${seconds < 0 ? "-" : ""}${t("DetailContent.textDays", { days }, "{days} Hari")}`;
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
                {t(
                  "DetailContent.textRequestNumber",
                  { reblast: displayData?.reblast || request?.reblast },
                  "Permintaan ke-{reblast}"
                )}
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
              ? t("DetailContent.labelInstant", {}, "Instan")
              : t("DetailContent.labelScheduled", {}, "Terjadwal")}
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

                if (diffDays === 0)
                  return t("DetailContent.labelLoadToday", {}, "Muat Hari Ini");
                if (diffDays === 1)
                  return t("DetailContent.labelLoadTomorrow", {}, "Muat Besok");
                if (diffDays > 1)
                  return t(
                    "DetailContent.labelLoadInDays",
                    { diffDays },
                    "Muat {diffDays} Hari Lagi"
                  );
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
              {t(
                "DetailContent.badgePotentialOverload",
                {},
                "Potensi Overload"
              )}
            </span>
          )}
        </div>
      </div>

      {/* Transporter Info */}
      <div className="mb-3 flex items-center gap-2">
        {/* Transporter Tersedia */}
        <div
          className="flex cursor-pointer items-center gap-1"
          onClick={() => setShowTersediaModal(true)}
        >
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
            {t(
              "DetailContent.textAvailableTransporters",
              {
                count:
                  displayData?.counters?.available ||
                  request?.counters?.available ||
                  0,
              },
              "{count} Transporter Tersedia"
            )}
          </span>
        </div>
        {showTersediaModal && (
          <ModalTransportTersedia onClose={() => setShowTersediaModal(false)} />
        )}

        {/* Dilihat */}
        <div
          className="flex cursor-pointer items-center gap-1"
          onClick={() => setShowDilihatModal(true)}
        >
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
            {t(
              "DetailContent.textViewed",
              {
                count:
                  displayData?.counters?.viewed ||
                  request?.counters?.viewed ||
                  0,
              },
              "{count} Dilihat"
            )}
          </span>
        </div>
        {showDilihatModal && (
          <ModalTransportDilihat onClose={() => setShowDilihatModal(false)} />
        )}

        {/* Disimpan */}
        <div
          className="flex cursor-pointer items-center gap-1"
          onClick={() => setShowDisimpanModal(true)}
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
              ((displayData?.counters?.saved || request?.counters?.saved) ??
                0) > 0
                ? "text-primary-700"
                : "text-neutral-600"
            )}
          >
            {t(
              "DetailContent.textSaved",
              {
                count:
                  displayData?.counters?.saved || request?.counters?.saved || 0,
              },
              "{count} Disimpan"
            )}
          </span>
        </div>
        {showDisimpanModal && (
          <ModalTransportDisimpan onClose={() => setShowDisimpanModal(false)} />
        )}
      </div>

      {/* Divider after status tags */}
      <div className="mb-3 border-b border-[#C4C4C4] px-4"></div>

      {/* Informasi Armada */}
      <div className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-neutral-600">
            {t("DetailContent.titleFleetInformation", {}, "Informasi Armada")}
          </h3>
          <h3 className="text-xs font-semibold text-neutral-600">
            {t("DetailContent.titlePotentialIncome", {}, "Potensi Pendapatan")}
          </h3>
        </div>

        <div className="mb-3 flex justify-between">
          <p className="w-[251px] text-sm font-bold text-neutral-900">
            {displayData?.vehicle?.truckType || "Tractor head 6 x 4"} -{" "}
            {displayData?.vehicle?.carrierType ||
              "Semi Trailer - Skeletal Container Jumbo 45 ft (3 As  )"}{" "}
          </p>
          <p className="text-sm font-bold text-primary-700">
            {formatCurrency(displayData?.pricing?.potentialIncome || 800000)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="flex items-center text-xs font-medium text-neutral-600">
            <IconComponent
              src="/icons/truk16.svg"
              className="mr-2 h-4 w-4 text-neutral-600"
            />
            {t("DetailContent.labelRequirement", {}, "Kebutuhan : ")}{" "}
            <span className="ml-1 text-neutral-900">
              {t(
                "DetailContent.textUnits",
                { count: displayData?.vehicle?.truckCount || 3 },
                "{count} Unit"
              )}
            </span>
          </p>
          <div className="rounded-md border border-muat-trans-primary-900 bg-white px-2 py-1 text-xs font-semibold text-muat-trans-primary-900">
            {displayData?.orderCode || request?.orderCode || "MT25A001A"}
          </div>
        </div>
      </div>

      <div className="mb-3 border-b border-[#C4C4C4] px-4"></div>

      {/* Waktu Muat */}
      <div className="mb-4">
        <h3 className="mb-3 text-xs font-semibold text-neutral-600">
          {t("DetailContent.titleLoadTime", {}, "Waktu Muat")}
        </h3>
        <div className="flex items-center">
          <IconComponent
            src="/icons/calendar16.svg"
            className="mr-2 h-4 w-4 text-orange-600"
          />
          <span className="text-xs font-semibold text-neutral-900">
            {formatLoadDateTime()}
          </span>
        </div>
      </div>

      <div className="mb-3 border-b border-[#C4C4C4] px-4"></div>

      {/* Rute Muat & Bongkar */}
      <div className="mb-4">
        <div className="mb-3 flex items-center">
          <h3 className="text-xs font-semibold text-neutral-600">
            {t("DetailContent.titleLoadUnloadRoute", {}, "Rute Muat & Bongkar")}
          </h3>
          <span className="ml-2 inline-flex items-center rounded-[100px] border border-neutral-400 bg-neutral-200 px-3 py-2 text-[10px] font-semibold text-neutral-900">
            {t("DetailContent.labelEstimatedDistance", {}, "Estimasi Jarak: ")}
            {t(
              "DetailContent.textKilometers",
              {
                distance:
                  displayData?.locations?.estimatedDistance ||
                  request?.locations?.estimatedDistance ||
                  0,
              },
              "{distance} km"
            )}
          </span>
        </div>

        <div className="mb-4 flex w-full justify-between">
          <div className="w-full">
            {(() => {
              const pickupLocations =
                displayData?.locations?.pickupLocations ||
                request?.locations?.pickupLocations ||
                [];
              const dropoffLocations =
                displayData?.locations?.dropoffLocations ||
                request?.locations?.dropoffLocations ||
                [];

              // Create items array with headers and locations
              const timelineItems = [];

              // Add Lokasi Muat header
              timelineItems.push({
                type: "header",
                text: t(
                  "DetailContent.headerLoadingLocation",
                  {},
                  "Lokasi Muat"
                ),
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

              // Add Lokasi Bongkar header
              timelineItems.push({
                type: "header",
                text: t(
                  "DetailContent.headerUnloadingLocation",
                  {},
                  "Lokasi Bongkar"
                ),
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
                                item.text ===
                                  t(
                                    "DetailContent.headerUnloadingLocation",
                                    {},
                                    "Lokasi Bongkar"
                                  ) && (
                                  <div className="absolute left-1/2 top-0 h-[32px] w-px -translate-x-1/2 border-l-2 border-dashed border-neutral-400" />
                                )}
                            </div>
                            <div className="">
                              <h4 className="text-xs font-medium text-neutral-600">
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
                          title={`${item.location.city}, ${item.location.district}`}
                          className="pb-2"
                          appearance={{
                            titleClassname:
                              "break-all text-xs font-medium text-neutral-900",
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

      {/* Divider after rute */}
      <div className="mb-3 border-b border-[#C4C4C4] px-4"></div>

      {/* Informasi Muatan */}
      <div className="mb-4">
        <h3 className="mb-3 text-xs font-semibold text-neutral-600">
          {t(
            "DetailContent.titleCargoInformation",
            { totalWeight: displayData?.cargo?.totalWeight || 2500 },
            "Informasi Muatan (Total: {totalWeight} kg)"
          )}
        </h3>

        <div className="space-y-2">
          {displayData?.cargo?.items?.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center">
              <IconComponent
                src="/icons/box16.svg"
                className="mr-2 h-4 w-4 text-orange-600"
              />
              <span className="text-xs font-semibold text-neutral-900">
                {item.name}{" "}
                <span className="text-xs font-semibold text-neutral-600">
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

      <div className="mb-3 border-b border-[#C4C4C4] px-4"></div>

      {/* Deskripsi Muatan */}
      <div className="mb-4">
        <h3 className="mb-3 text-xs font-semibold text-neutral-600">
          {t("DetailContent.titleCargoDescription", {}, "Deskripsi Muatan")}
        </h3>
        <p className="text-xs font-semibold text-neutral-900">
          {displayData?.cargo?.description ||
            t(
              "DetailContent.defaultCargoDescription",
              {},
              "tolong kirim muatan dengan hati hati, jangan sampai rusak dan hancur, terimakasih"
            )}
        </p>
      </div>

      <div className="mb-3 border-b border-[#C4C4C4] px-4"></div>

      {/* Foto Muatan */}
      <div className="mb-4">
        <h3 className="mb-3 text-xs font-semibold text-neutral-600">
          {t("DetailContent.titleCargoPhotos", {}, "Foto Muatan")}
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
          title={t("DetailContent.titleCargoPhotos", {}, "Foto Muatan")}
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
                alt={t(
                  "DetailContent.altCargoPhoto",
                  { number: index + 1 },
                  "Foto muatan {number}"
                )}
              />
            ))}
          </div>
        </LightboxProvider>
      </div>

      <div className="mb-3 border-b border-[#C4C4C4] px-4"></div>

      <div className="mb-4">
        <h3 className="mb-3 text-xs font-semibold text-neutral-600">
          {t("DetailContent.titleAdditionalServices", {}, "Layanan Tambahan")}
        </h3>

        <div className="space-y-2">
          {(
            displayData?.additionalServices ||
            request?.additionalServices ||
            []
          ).map((service, index) => (
            <div key={service.id || index} className="flex items-center gap-2">
              <IconComponent
                src="/icons/service-plus.svg"
                className="h-4 w-4 text-primary-700"
              />
              <span className="text-xs font-medium text-neutral-900">
                {service.serviceName}
              </span>
            </div>
          ))}

          {/* Fallback jika tidak ada layanan tambahan */}
          {!displayData?.additionalServices && !request?.additionalServices && (
            <div className="flex items-center gap-2">
              <IconComponent
                src="/icons/service-plus.svg"
                className="h-4 w-4 text-primary-700"
              />
              <span className="text-xs font-medium text-neutral-900">
                {t("DetailContent.serviceSendDocuments", {}, "Kirim Berkas")}
              </span>
            </div>
          )}

          {!displayData?.additionalServices && !request?.additionalServices && (
            <div className="flex items-center gap-2">
              <IconComponent
                src="/icons/service-plus.svg"
                className="h-4 w-4 text-primary-700"
              />
              <span className="text-xs font-medium text-neutral-900">
                {t(
                  "DetailContent.serviceAdditionalHelp",
                  {},
                  "Bantuan Tambahan"
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Hubungi Modal */}
      {showHubungiModal && (
        <HubungiModal
          isOpen={showHubungiModal}
          onClose={() => setShowHubungiModal(false)}
          transporterContacts={request.shipperInfo || null}
        />
      )}
    </div>
  );
};

export default DetailContent;
