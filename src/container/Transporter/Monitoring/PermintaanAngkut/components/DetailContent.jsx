import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";
import { useTranslation } from "@/hooks/use-translation";
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
  const { t } = useTranslation();

  return (
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
                {t(
                  "DetailContent.titleAccountSuspended",
                  {},
                  "Akun Kamu Ditangguhkan"
                )}
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  displayData?.isTaken ? "text-neutral-600" : "text-neutral-900"
                )}
              >
                {t(
                  "DetailContent.messageContactSupport",
                  {},
                  "Hubungi dukungan pelanggan untuk aktivasi kembali"
                )}
                <span
                  className={cn(
                    displayData?.isTaken
                      ? "text-neutral-600"
                      : "text-primary-700"
                  )}
                >
                  {" "}
                  {t("DetailContent.linkHere", {}, "disini")}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Halal Certification Notice */}
      {!displayData?.isHalalCertified && (
        <div
          className={cn(
            "flex-shrink-0 px-4 pb-4",
            displayData?.isSuspended && "pt-2"
          )}
        >
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
                {t(
                  "DetailContent.messageHalalRequired",
                  {},
                  "Memerlukan pengiriman dengan sertifikasi halal logistik"
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Status Tags Row */}
      <div className="flex-shrink-0 bg-white px-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Order Type Tag - custom color logic */}
          {displayData?.orderType && (
            <span
              className={cn(
                "flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold",
                displayData?.isTaken
                  ? "text-neutral-700"
                  : displayData.orderType === "INSTANT"
                    ? "bg-success-50 text-success-400"
                    : "bg-primary-50 text-primary-700"
              )}
            >
              {displayData.orderType === "INSTANT"
                ? t("DetailContent.tagInstant", {}, "Instan")
                : t("DetailContent.tagScheduled", {}, "Terjadwal")}
            </span>
          )}

          {/* Load Time Text Tag - custom calculation */}
          {(() => {
            const createdAt = displayData?.createdAt || request?.createdAt;
            const loadTimeStart =
              displayData?.loadTimeStart || request?.loadTimeStart;
            if (!createdAt || !loadTimeStart) {
              return (
                <span className="flex h-6 items-center rounded-[6px] bg-primary-50 px-2 text-xs font-semibold text-primary-700">
                  -
                </span>
              );
            }
            const createdDate = new Date(createdAt);
            const loadDate = new Date(loadTimeStart);
            if (isNaN(createdDate.getTime()) || isNaN(loadDate.getTime())) {
              return (
                <span className="flex h-6 items-center rounded-[6px] bg-primary-50 px-2 text-xs font-semibold text-primary-700">
                  -
                </span>
              );
            }
            const diffTime = loadDate - createdDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            let labelKey = "";
            let labelParams = {};
            let fallbackLabel = "-";
            let colorClass = "bg-primary-50 text-primary-700";

            if (diffDays === 0) {
              labelKey = "DetailContent.tagLoadToday";
              fallbackLabel = "Muat Hari Ini";
              colorClass = "bg-success-50 text-success-400";
            } else if (diffDays === 1) {
              labelKey = "DetailContent.tagLoadTomorrow";
              fallbackLabel = "Muat Besok";
              colorClass = "bg-success-50 text-success-400";
            } else if (diffDays >= 2 && diffDays <= 5) {
              labelKey = "DetailContent.tagLoadInDays";
              labelParams = { diffDays };
              fallbackLabel = `Muat ${diffDays} Hari`;
              colorClass = "bg-warning-100 text-warning-900";
            } else if (diffDays > 5) {
              labelKey = "DetailContent.tagLoadInDays";
              labelParams = { diffDays };
              fallbackLabel = `Muat ${diffDays} Hari`;
              colorClass = "bg-primary-50 text-primary-700";
            }
            return (
              <span
                className={cn(
                  "flex h-6 items-center rounded-[6px] px-2 text-xs font-semibold",
                  displayData?.isTaken ? "text-neutral-700" : colorClass
                )}
              >
                {t(labelKey, labelParams, fallbackLabel)}
              </span>
            );
          })()}

          {/* Overload Badge */}
          {displayData?.overloadInfo?.hasOverload && (
            <span
              className={cn(
                "flex h-6 items-center rounded-[6px] px-2 py-2 text-xs font-semibold",
                displayData?.isTaken
                  ? "text-neutral-600"
                  : "bg-error-50 text-error-400"
              )}
            >
              {t("DetailContent.tagPotentialOverload", {}, "Potensi Overload")}
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
                  isSaved ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"
                }
                className={cn("h-5 w-5", isSaved && "text-error-600")}
              />
            </button>
          </div>
        </div>
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
              {t("DetailContent.titleFleetInformation", {}, "Informasi Armada")}
            </h3>
            <h3
              className={cn(
                "text-[12px] font-semibold",
                displayData?.isTaken ? "text-neutral-600" : "text-neutral-500"
              )}
            >
              {t(
                "DetailContent.titlePotentialRevenue",
                {},
                "Potensi Pendapatan"
              )}
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
              <span
                className={cn(
                  displayData?.isTaken ? "text-neutral-600" : "text-neutral-900"
                )}
              >
                {t(
                  "DetailContent.labelRequirementUnit",
                  { truckCount: displayData?.truckCount || 1 },
                  `Kebutuhan : ${displayData?.truckCount || 1} Unit`
                )}
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
              {t("DetailContent.titleLoadTime", {}, "Waktu Muat")}
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
                  displayData?.isTaken ? "text-neutral-600" : "text-neutral-900"
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
              {t("DetailContent.titleRoute", {}, "Rute Muat & Bongkar")}
            </h3>
            <span
              className={cn(
                "ml-2 inline-flex items-center rounded-[100px] border border-neutral-400 px-3 py-2 text-[10px] font-semibold",
                displayData?.isTaken
                  ? "text-neutral-600"
                  : "bg-neutral-200 text-neutral-900"
              )}
            >
              {t(
                "DetailContent.labelEstimatedDistance",
                { distance: displayData?.estimatedDistance || 0 },
                `Estimasi Jarak: ${displayData?.estimatedDistance || 0} km`
              )}
            </span>
          </div>

          <div className="mb-4 flex w-full justify-between">
            <div className="w-full">
              {/* Combined Timeline Section */}
              {(() => {
                const pickupLocations = displayData?.pickupLocations || [];
                const dropoffLocations = displayData?.dropoffLocations || [];
                const timelineItems = [];

                timelineItems.push({
                  type: "header",
                  text: t(
                    "DetailContent.headerLoadingLocation",
                    {},
                    "Lokasi Muat"
                  ),
                });
                pickupLocations.forEach((location, index) => {
                  timelineItems.push({
                    type: "location",
                    variant: "number-muat",
                    location: location,
                    originalIndex: index,
                  });
                });

                timelineItems.push({
                  type: "header",
                  text: t(
                    "DetailContent.headerUnloadingLocation",
                    {},
                    "Lokasi Bongkar"
                  ),
                });
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
              {t(
                "DetailContent.titleCargoInformation",
                {
                  totalWeight:
                    displayData?.cargos?.reduce(
                      (sum, cargo) => sum + (cargo.weight || 0),
                      0
                    ) || 0,
                },
                `Informasi Muatan (Total: ${
                  displayData?.cargos?.reduce(
                    (sum, cargo) => sum + (cargo.weight || 0),
                    0
                  ) || 0
                } kg)`
              )}
            </h3>
          </div>

          <div className="space-y-2">
            {displayData?.cargos?.map((cargo, index) => (
              <div key={cargo.id || index} className="flex items-center">
                <IconComponent
                  src="/icons/box16.svg"
                  className={cn(
                    "mr-2 h-4 w-4",
                    displayData?.isTaken ? "text-neutral-600" : "text-[#461B02]"
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
                {/* Fallback content would also be translated in a real scenario */}
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
              {t("DetailContent.titleCargoDescription", {}, "Deskripsi Muatan")}
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
              {t("DetailContent.titleCargoPhotos", {}, "Foto Muatan")}
            </h3>
          </div>

          <LightboxProvider
            images={displayData?.photos?.map((photo) => photo.photoUrl) || []}
            title={t("DetailContent.titleCargoPhotos", {}, "Foto Muatan")}
            modalClassName="w-[592px] h-[445px]"
          >
            <div className="flex gap-2">
              {(displayData?.photos || []).map((photo, index) => (
                <LightboxPreview
                  key={photo.id || index}
                  image={photo.photoUrl}
                  index={index}
                  className="h-14 w-14 overflow-hidden rounded-md border border-neutral-200 object-cover"
                  alt={photo.description || `Foto muatan ${index + 1}`}
                />
              ))}
            </div>
          </LightboxProvider>
        </div>

        {/* Layanan Tambahan */}
        {displayData?.additionalServices?.length > 0 && (
          <>
            <div className="my-4 border-b border-[#C4C4C4]"></div>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3
                  className={cn(
                    "text-[12px] font-semibold",
                    displayData?.isTaken
                      ? "text-neutral-600"
                      : "text-neutral-600"
                  )}
                >
                  {t(
                    "DetailContent.titleAdditionalServices",
                    {},
                    "Layanan Tambahan"
                  )}
                </h3>
              </div>
              <div className="space-y-2">
                {displayData.additionalServices.map((service, index) => (
                  <div key={service.id || index} className="flex items-center">
                    <IconComponent
                      src={"/icons/service-plus.svg"}
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
  );
};

export default DetailContent;
