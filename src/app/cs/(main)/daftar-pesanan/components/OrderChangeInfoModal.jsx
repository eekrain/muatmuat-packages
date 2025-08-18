"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";

import Button from "@/components/Button/Button";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("Rp", "Rp");
const formatDistance = (distanceInMeters) =>
  distanceInMeters < 1000
    ? `${distanceInMeters} m`
    : `${(distanceInMeters / 1000).toFixed(1)} km`.replace(".", ",");

const LocationChangeRow = ({ oldLoc, newLoc, index, isLast, type }) => {
  const isChanged = oldLoc.fullAddress !== newLoc.fullAddress;

  return (
    <div
      className={`relative grid grid-cols-2 gap-0 ${isChanged ? "-mx-2 h-[24px] rounded bg-success-50 px-2" : ""}`}
    >
      {isChanged && (
        <div className="absolute -left-10 h-[24px] w-[200px] rounded bg-success-50"></div>
      )}
      <div className="relative flex items-center gap-3">
        {!isLast && (
          <div className="absolute left-2 top-[16px] z-0 h-[calc(100%+14px)] w-0 border-l-[2px] border-dashed border-neutral-400" />
        )}
        <div
          className={`relative z-[4] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${type === "pickup" ? "bg-[#FFC217]" : "bg-[#461B02]"}`}
        >
          <span
            className={`text-[10px] font-bold leading-[12px] ${type === "pickup" ? "text-[#461B02]" : "text-white"}`}
          >
            {oldLoc.sequence || index + 1}
          </span>
        </div>
        <p className="relative z-[4] line-clamp-1 flex-1 break-all text-xs font-medium leading-[120%] text-black">
          {oldLoc.fullAddress}
        </p>
      </div>
      <div className="relative flex items-center gap-3">
        {!isLast && (
          <div className="absolute left-2 top-[16px] z-0 h-[calc(100%+14px)] w-0 border-l-[2px] border-dashed border-neutral-400" />
        )}
        <div
          className={`relative z-[4] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${type === "pickup" ? "bg-[#FFC217]" : "bg-[#461B02]"}`}
        >
          <span
            className={`text-[10px] font-bold leading-[12px] ${type === "pickup" ? "text-[#461B02]" : "text-white"}`}
          >
            {newLoc.sequence || index + 1}
          </span>
        </div>
        <div className="relative z-[4] flex flex-1 items-center gap-2">
          <p className="line-clamp-1 flex-1 break-all text-xs font-medium leading-[120%] text-black">
            {newLoc.fullAddress}
          </p>
          {isChanged && (
            <span className="flex h-[14px] w-[54px] flex-shrink-0 items-center justify-center rounded bg-black text-[8px] font-semibold leading-[130%] text-white">
              Rute Diubah
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const OrderChangeInfoModal = ({
  isOpen,
  onClose,
  changeDetails,
  isLoading,
  onHubungi,
}) => {
  const { t } = useTranslation();

  const formatDateTimeRange = (startDate, endDate) => {
    if (!startDate) return "-";
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    const startStr = format(start, "dd MMM yyyy HH:mm", { locale: id });
    if (!end) return `${startStr} WIB`;
    const isSameDay = format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd");
    if (isSameDay)
      return `${startStr} WIB s/d ${format(end, "HH:mm", { locale: id })} WIB`;
    return `${startStr} WIB s/d ${format(end, "dd MMM yyyy HH:mm", { locale: id })} WIB`;
  };

  const oldPickups =
    changeDetails?.originalData?.locations?.filter(
      (l) => l.locationType === "PICKUP"
    ) || [];
  const newPickups =
    changeDetails?.requestedChanges?.locations?.filter(
      (l) => l.locationType === "PICKUP"
    ) || [];
  const oldDropoffs =
    changeDetails?.originalData?.locations?.filter(
      (l) => l.locationType === "DROPOFF"
    ) || [];
  const newDropoffs =
    changeDetails?.requestedChanges?.locations?.filter(
      (l) => l.locationType === "DROPOFF"
    ) || [];

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent
        type="muatmuat"
        className="w-[800px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="relative flex flex-col">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white"
          >
            <IconComponent
              src="/icons/close.svg"
              className="h-[9px] w-[9px] text-primary-700"
            />
          </button>
          <div className="flex items-center justify-center px-6 pt-6">
            <ModalTitle className="text-base font-bold leading-[120%] text-black">
              {t("orderChange.modalTitle", {}, "Informasi Perubahan Pesanan")}
            </ModalTitle>
          </div>
          <div className="flex flex-col gap-4 px-6 py-4">
            <div className="flex items-center gap-2 rounded-md bg-[#FFECB4] px-6 py-4">
              <IconComponent
                src="/icons/warning24.svg"
                className="h-6 w-6 flex-shrink-0 text-[#FF7A00]"
              />
              <p className="text-xs font-medium leading-[120%] text-black">
                {t(
                  "orderChange.bannerText",
                  {},
                  "Terdapat perubahan pesanan dari shipper, mohon pelajari perubahannya dan segera beri respon"
                )}
              </p>
            </div>
            {isLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-700 border-t-transparent"></div>
                <p className="ml-4 text-sm text-gray-500">
                  {t(
                    "orderChange.loadingText",
                    {},
                    "Memuat detail perubahan..."
                  )}
                </p>
              </div>
            ) : changeDetails ? (
              <>
                <div className="max-h-[300px] space-y-3 overflow-y-auto rounded-lg border border-neutral-400 p-4">
                  {(changeDetails.changeType === "LOCATION_AND_TIME" ||
                    changeDetails.changeType === "TIME_ONLY") && (
                    <div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muat-trans-primary-400">
                          <IconComponent src="/icons/monitoring/daftar-pesanan-aktif/change-time.svg" />
                        </div>
                        <h3 className="text-xs font-bold leading-[120%] text-black">
                          {t(
                            "orderChange.timeChangeTitle",
                            {},
                            "Perubahan Waktu Muat"
                          )}
                        </h3>
                      </div>
                      <div className="relative grid grid-cols-2 gap-12">
                        <div className="absolute bottom-0 left-1/2 top-0 z-[3] w-0 -translate-x-1/2 border-l border-solid border-neutral-400" />
                        <div className="relative z-10 ml-12 flex flex-col gap-2">
                          <p className="text-xs font-bold leading-[120%] text-[#0FBB81]">
                            {t("orderChange.oldTime", {}, "Waktu Muat Awal")}
                          </p>
                          <p className="text-xs font-medium leading-[120%] text-black">
                            {formatDateTimeRange(
                              changeDetails.originalData?.loadTimeStart,
                              changeDetails.originalData?.loadTimeEnd
                            )}
                          </p>
                        </div>
                        <div className="relative z-10 flex flex-col gap-2">
                          <p className="text-xs font-bold leading-[120%] text-[#7A360D]">
                            {t("orderChange.newTime", {}, "Waktu Muat Baru")}
                          </p>
                          <p className="text-xs font-medium leading-[120%] text-black">
                            {formatDateTimeRange(
                              changeDetails.requestedChanges?.loadTimeStart,
                              changeDetails.requestedChanges?.loadTimeEnd
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {changeDetails.changeType === "LOCATION_AND_TIME" && <hr />}

                  {(changeDetails.changeType === "LOCATION_AND_TIME" ||
                    changeDetails.changeType === "LOCATION_ONLY") && (
                    <div>
                      <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muat-trans-primary-400">
                          <IconComponent
                            src="/icons/monitoring/daftar-pesanan-aktif/change-route.svg"
                            className="h-5 w-5 text-primary-700"
                          />
                        </div>
                        <h3 className="text-xs font-bold leading-[120%] text-black">
                          {t(
                            "orderChange.routeChangeTitle",
                            {},
                            "Perubahan Rute Muat & Bongkar"
                          )}
                        </h3>
                      </div>
                      <div className="relative ml-12 grid grid-cols-1">
                        <div className="absolute bottom-0 left-[calc(50%-24px)] top-0 z-[3] w-0 -translate-x-1/2 border-l border-solid border-neutral-400" />
                        <div className="grid grid-cols-2 gap-0">
                          <p className="text-xs font-bold leading-[120%] text-[#0FBB81]">
                            {t("orderChange.oldRoute", {}, "Rute Awal")} :{" "}
                            <span className="font-medium text-neutral-900">
                              {t("orderChange.estimation", {}, "Estimasi")}{" "}
                              {formatDistance(
                                changeDetails.originalData?.estimatedDistance ||
                                  0
                              )}
                            </span>
                          </p>
                          <p className="text-xs font-bold leading-[120%] text-[#7A360D]">
                            {t("orderChange.newRoute", {}, "Rute Baru")} :{" "}
                            <span className="font-medium text-neutral-900">
                              {t("orderChange.estimation", {}, "Estimasi")}{" "}
                              {formatDistance(
                                changeDetails.requestedChanges
                                  ?.estimatedDistance || 0
                              )}
                            </span>
                          </p>
                        </div>
                        <div className="mt-2 space-y-2">
                          <div className="w-ful grid grid-cols-2">
                            <p className="ml-7 text-xs font-medium leading-[120%] text-[#7B7B7B]">
                              {t(
                                "orderChange.pickupLocation",
                                {},
                                "Lokasi Muat"
                              )}
                            </p>
                            <p className="ml-7 text-xs font-medium leading-[120%] text-[#7B7B7B]">
                              {t(
                                "orderChange.pickupLocation",
                                {},
                                "Lokasi Muat"
                              )}
                            </p>
                          </div>
                          {newPickups.map((loc, idx) => (
                            <LocationChangeRow
                              key={`p-${idx}`}
                              oldLoc={oldPickups[idx]}
                              newLoc={loc}
                              index={idx}
                              isLast={
                                idx === newPickups.length - 1 &&
                                newDropoffs.length === 0
                              }
                              type="pickup"
                            />
                          ))}
                        </div>
                        <div className="mt-3 space-y-2">
                          <div className="w-ful grid grid-cols-2">
                            <p className="ml-7 text-xs font-medium leading-[120%] text-[#7B7B7B]">
                              {t(
                                "orderChange.dropoffLocation",
                                {},
                                "Lokasi Bongkar"
                              )}
                            </p>
                            <p className="ml-7 text-xs font-medium leading-[120%] text-[#7B7B7B]">
                              {t(
                                "orderChange.dropoffLocation",
                                {},
                                "Lokasi Bongkar"
                              )}
                            </p>
                          </div>
                          {newDropoffs.map((loc, idx) => (
                            <LocationChangeRow
                              key={`d-${idx}`}
                              oldLoc={oldDropoffs[idx]}
                              newLoc={loc}
                              index={idx}
                              isLast={idx === newDropoffs.length - 1}
                              type="dropoff"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {changeDetails.incomeAdjustment?.hasAdjustment && (
                  <div className="flex items-center gap-12 rounded-lg border border-neutral-400 py-4 pl-4 pr-20">
                    <div className="flex flex-1 items-center gap-2">
                      <h3 className="text-sm font-bold leading-[120%] text-black">
                        {t(
                          "orderChange.incomeAdjustment",
                          {},
                          "Penyesuaian Pendapatan"
                        )}
                      </h3>
                      <InfoTooltip side="top">
                        <p>
                          {t(
                            "orderChange.incomeTooltip",
                            {},
                            "Penyesuaian pendapatan hanya estimasi. Pendapatan yang kamu terima menyesuaikan respon perubahan yang kamu kirimkan."
                          )}
                        </p>
                      </InfoTooltip>
                    </div>
                    <div className="flex flex-1 items-center justify-end gap-4">
                      <span className="text-sm font-medium leading-[120%] text-black line-through">
                        {formatCurrency(
                          changeDetails.incomeAdjustment.originalAmount
                        )}
                      </span>
                      <IconComponent
                        src="/icons/monitoring/daftar-pesanan-aktif/change-arrow.svg"
                        className="h-4 w-4 text-[#555555]"
                      />
                      <span className="text-sm font-bold leading-[120%] text-black">
                        {formatCurrency(
                          changeDetails.incomeAdjustment.adjustedAmount
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-center text-gray-500">
                  {t(
                    "orderChange.errorText",
                    {},
                    "Tidak dapat memuat detail perubahan"
                  )}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center px-6 pb-6">
            <Button
              variant="muattrans-primary"
              onClick={onHubungi}
              disabled={isLoading}
              className="text-sm text-muat-trans-secondary-900 disabled:text-neutral-600 md:h-[34px]"
            >
              {t("orderChange.contactTransporter", {}, "Hubungi")}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default OrderChangeInfoModal;
