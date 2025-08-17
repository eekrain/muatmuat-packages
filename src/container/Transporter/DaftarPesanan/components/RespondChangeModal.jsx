"use client";

import { useState } from "react";

import { format } from "date-fns";
import { id } from "date-fns/locale";

import Button from "@/components/Button/Button";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";
import { toast } from "@/lib/toast";
import {
  formatCurrency,
  formatDistance,
  useGetOrderChangeDetail,
} from "@/services/Transporter/monitoring/order-change/getOrderChangeDetail";

const RespondChangeModal = ({ isOpen, onClose, orderData }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Fetch order change details
  const { data: changeDetails, isLoading: isLoadingDetails } =
    useGetOrderChangeDetail(orderData?.id, {
      enabled: isOpen && !!orderData?.id,
    });

  const handleAcceptChange = async () => {
    setIsLoading(true);
    try {
      // TODO: Call API to accept change
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(
        `Berhasil mengirimkan respon perubahan untuk pesanan ${orderData?.orderCode}`
      );
      onClose();
    } catch (error) {
      toast.error("Gagal merespon perubahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectChange = () => {
    // TODO: Handle rejection logic
    console.log("Rejecting change for order:", orderData?.id);
    onClose();
  };

  const formatDateTimeRange = (startDate, endDate) => {
    if (!startDate) return "-";

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    const startStr = format(start, "dd MMM yyyy HH:mm", { locale: id });

    if (!end) {
      return `${startStr} WIB`;
    }

    const startDateOnly = format(start, "dd MMM yyyy", { locale: id });
    const endDateOnly = format(end, "dd MMM yyyy", { locale: id });

    if (startDateOnly === endDateOnly) {
      // Same day
      return `${startStr} WIB s/d ${format(end, "HH:mm", { locale: id })} WIB`;
    } else {
      // Different days
      return `${startStr} WIB s/d ${format(end, "dd MMM yyyy HH:mm", { locale: id })} WIB`;
    }
  };

  if (!orderData) return null;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent
        type="muatmuat"
        className="w-[800px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="relative flex flex-col">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white"
          >
            <IconComponent
              src="/icons/close.svg"
              className="h-[9px] w-[9px] text-primary-700"
            />
          </button>

          {/* Header */}
          <div className="flex items-center justify-center px-6 pt-6">
            <ModalTitle className="text-base font-bold leading-[120%] text-black">
              Informasi Perubahan Pesanan
            </ModalTitle>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 px-6 py-4">
            {/* Warning Banner */}
            <div className="flex items-center gap-2 rounded-md bg-[#FFECB4] px-6 py-4">
              <IconComponent
                src="/icons/warning24.svg"
                className="h-6 w-6 flex-shrink-0 text-[#FF7A00]"
              />
              <p className="text-xs font-medium leading-[120%] text-black">
                Terdapat perubahan pesanan dari shipper, mohon pelajari
                perubahannya dan segera beri respon
              </p>
            </div>

            {isLoadingDetails ? (
              <div className="flex h-[200px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary-700"></div>
                  <p className="text-sm text-gray-500">
                    Memuat detail perubahan...
                  </p>
                </div>
              </div>
            ) : changeDetails ? (
              <>
                {/* Combined Changes Section */}
                {(changeDetails.changeType === "LOCATION_AND_TIME" ||
                  changeDetails.changeType === "TIME_ONLY" ||
                  changeDetails.changeType === "LOCATION_ONLY") && (
                  <div className="max-h-[200px] overflow-y-auto rounded-lg border border-neutral-400 p-4">
                    {/* Time Change Section */}
                    {(changeDetails.changeType === "LOCATION_AND_TIME" ||
                      changeDetails.changeType === "TIME_ONLY") && (
                      <>
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muat-trans-primary-400">
                            <IconComponent
                              src="/icons/monitoring/daftar-pesanan-aktif/change-time.svg"
                              className="h-5 w-5 text-primary-700"
                            />
                          </div>
                          <h3 className="text-xs font-bold leading-[120%] text-black">
                            Perubahan Waktu Muat
                          </h3>
                        </div>

                        <div className="relative mb-6 grid grid-cols-2 gap-12 px-12">
                          {/* Vertical divider line */}
                          <div className="absolute bottom-0 left-1/2 top-0 z-[3] w-0 -translate-x-1/2 border-l border-solid border-neutral-400" />

                          <div className="relative z-10 flex flex-col gap-3">
                            <p className="text-xs font-bold leading-[120%] text-[#0FBB81]">
                              Waktu Muat Awal
                            </p>
                            <p className="text-xs font-medium leading-[120%] text-black">
                              {formatDateTimeRange(
                                changeDetails.originalData?.loadTimeStart,
                                changeDetails.originalData?.loadTimeEnd
                              )}
                            </p>
                          </div>
                          <div className="relative z-10 flex flex-col gap-3">
                            <p className="text-xs font-bold leading-[120%] text-[#7A360D]">
                              Waktu Muat Baru
                            </p>
                            <p className="text-xs font-medium leading-[120%] text-black">
                              {formatDateTimeRange(
                                changeDetails.requestedChanges?.loadTimeStart,
                                changeDetails.requestedChanges?.loadTimeEnd
                              )}
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Divider if both sections exist */}
                    {changeDetails.changeType === "LOCATION_AND_TIME" && (
                      <div className="mb-6 border-b border-neutral-400"></div>
                    )}

                    {/* Location Change Section */}
                    {(changeDetails.changeType === "LOCATION_AND_TIME" ||
                      changeDetails.changeType === "LOCATION_ONLY") && (
                      <>
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muat-trans-primary-400">
                            <IconComponent
                              src="/icons/monitoring/daftar-pesanan-aktif/change-route.svg"
                              className="h-5 w-5 text-primary-700"
                            />
                          </div>
                          <h3 className="text-xs font-bold leading-[120%] text-black">
                            Perubahan Rute Muat & Bongkar
                          </h3>
                        </div>

                        <div className="relative grid grid-cols-2 gap-12 px-12">
                          {/* Vertical divider line */}
                          <div className="absolute bottom-0 left-1/2 top-0 z-[3] w-0 -translate-x-1/2 border-l border-solid border-neutral-400" />

                          {/* Original Route */}
                          <div className="relative z-10 flex flex-col gap-3">
                            <p className="text-xs font-bold leading-[120%] text-[#0FBB81]">
                              Rute Awal : Estimasi{" "}
                              {formatDistance(
                                changeDetails.originalData?.estimatedDistance ||
                                  0
                              )}
                            </p>
                            <div className="space-y-4">
                              {/* Pickup Locations */}
                              <div className="space-y-2">
                                <p className="text-xs font-medium leading-[120%] text-[#7B7B7B]">
                                  Lokasi Muat
                                </p>
                                <div className="relative flex flex-col gap-3">
                                  {(() => {
                                    const originalPickups =
                                      changeDetails.originalData?.locations?.filter(
                                        (loc) => loc.locationType === "PICKUP"
                                      ) || [];
                                    const newPickups =
                                      changeDetails.requestedChanges?.locations?.filter(
                                        (loc) => loc.locationType === "PICKUP"
                                      ) || [];

                                    return originalPickups.map(
                                      (loc, idx, pickupArray) => {
                                        const isChanged =
                                          newPickups[idx]?.fullAddress !==
                                          loc.fullAddress;
                                        return (
                                          <div
                                            key={`pickup-${idx}`}
                                            className={`relative flex items-center gap-3 ${isChanged ? "rounded bg-success-50" : ""}`}
                                          >
                                            {/* Dashed line connector */}
                                            {idx < pickupArray.length - 1 && (
                                              <div className="absolute left-2 top-[16px] z-0 h-[calc(100%+12px)] w-0 border-l-[1.5px] border-dashed border-neutral-400" />
                                            )}
                                            {/* Bullet with number */}
                                            <div className="relative z-[4] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#FFC217]">
                                              <span className="text-[10px] font-bold leading-[12px] text-[#461B02]">
                                                {idx + 1}
                                              </span>
                                            </div>
                                            <p className="relative z-[4] line-clamp-1 flex-1 break-all text-xs font-medium leading-[120%] text-black">
                                              {loc.fullAddress}
                                            </p>
                                          </div>
                                        );
                                      }
                                    );
                                  })()}
                                </div>
                              </div>

                              {/* Dropoff Locations */}
                              <div className="space-y-2">
                                <p className="text-xs font-medium leading-[120%] text-[#7B7B7B]">
                                  Lokasi Bongkar
                                </p>
                                <div className="relative flex flex-col gap-3">
                                  {(() => {
                                    const originalDropoffs =
                                      changeDetails.originalData?.locations?.filter(
                                        (loc) => loc.locationType === "DROPOFF"
                                      ) || [];
                                    const newDropoffs =
                                      changeDetails.requestedChanges?.locations?.filter(
                                        (loc) => loc.locationType === "DROPOFF"
                                      ) || [];

                                    return originalDropoffs.map(
                                      (loc, idx, dropoffArray) => {
                                        const isChanged =
                                          newDropoffs[idx]?.fullAddress !==
                                          loc.fullAddress;
                                        return (
                                          <div
                                            key={`dropoff-${idx}`}
                                            className={`relative flex items-center gap-3 ${isChanged ? "rounded bg-success-50" : ""}`}
                                          >
                                            {/* Dashed line connector */}
                                            {idx < dropoffArray.length - 1 && (
                                              <div className="absolute left-2 top-[16px] z-0 h-[calc(100%+12px)] w-0 border-l-[1.5px] border-dashed border-neutral-400" />
                                            )}
                                            {/* Bullet with number */}
                                            <div className="relative z-[4] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#461B02]">
                                              <span className="text-[10px] font-bold leading-[12px] text-white">
                                                {idx + 1}
                                              </span>
                                            </div>
                                            <p className="relative z-[4] line-clamp-1 flex-1 break-all text-xs font-medium leading-[120%] text-black">
                                              {loc.fullAddress}
                                            </p>
                                          </div>
                                        );
                                      }
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* New Route */}
                          <div className="relative z-10 flex flex-col gap-3">
                            <p className="text-xs font-bold leading-[120%] text-[#7A360D]">
                              Rute Baru : Estimasi{" "}
                              {formatDistance(
                                changeDetails.requestedChanges
                                  ?.estimatedDistance || 0
                              )}
                            </p>
                            <div className="space-y-4">
                              {/* Pickup Locations */}
                              <div className="space-y-2">
                                <p className="text-xs font-medium leading-[120%] text-[#7B7B7B]">
                                  Lokasi Muat
                                </p>
                                <div className="relative flex flex-col gap-3">
                                  {(() => {
                                    const originalPickups =
                                      changeDetails.originalData?.locations?.filter(
                                        (loc) => loc.locationType === "PICKUP"
                                      ) || [];
                                    const newPickups =
                                      changeDetails.requestedChanges?.locations?.filter(
                                        (loc) => loc.locationType === "PICKUP"
                                      ) || [];

                                    return newPickups.map(
                                      (loc, idx, pickupArray) => {
                                        const isChanged =
                                          originalPickups[idx]?.fullAddress !==
                                          loc.fullAddress;
                                        return (
                                          <div
                                            key={`pickup-${idx}`}
                                            className={`relative flex items-center gap-3 ${isChanged ? "rounded bg-success-50" : ""}`}
                                          >
                                            {/* Dashed line connector */}
                                            {idx < pickupArray.length - 1 && (
                                              <div className="absolute left-2 top-[16px] z-0 h-[calc(100%+12px)] w-0 border-l-[1.5px] border-dashed border-neutral-400" />
                                            )}
                                            {/* Bullet with number */}
                                            <div className="relative z-[4] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#FFC217]">
                                              <span className="text-[10px] font-bold leading-[12px] text-[#461B02]">
                                                {idx + 1}
                                              </span>
                                            </div>
                                            <div className="relative z-[4] flex flex-1 items-center gap-2">
                                              <p className="line-clamp-1 flex-1 break-all text-xs font-medium leading-[120%] text-black">
                                                {loc.fullAddress}
                                              </p>
                                              {isChanged && (
                                                <span className="flex h-[14px] w-[54px] flex-shrink-0 items-center justify-center rounded bg-black text-[8px] font-semibold leading-[130%] text-white">
                                                  Rute Diubah
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      }
                                    );
                                  })()}
                                </div>
                              </div>

                              {/* Dropoff Locations */}
                              <div className="space-y-2">
                                <p className="text-xs font-medium leading-[120%] text-[#7B7B7B]">
                                  Lokasi Bongkar
                                </p>
                                <div className="relative flex flex-col gap-3">
                                  {(() => {
                                    const originalDropoffs =
                                      changeDetails.originalData?.locations?.filter(
                                        (loc) => loc.locationType === "DROPOFF"
                                      ) || [];
                                    const newDropoffs =
                                      changeDetails.requestedChanges?.locations?.filter(
                                        (loc) => loc.locationType === "DROPOFF"
                                      ) || [];

                                    return newDropoffs.map(
                                      (loc, idx, dropoffArray) => {
                                        const isChanged =
                                          originalDropoffs[idx]?.fullAddress !==
                                          loc.fullAddress;
                                        return (
                                          <div
                                            key={`dropoff-${idx}`}
                                            className={`relative flex items-center gap-3 ${isChanged ? "rounded bg-success-50" : ""}`}
                                          >
                                            {/* Dashed line connector */}
                                            {idx < dropoffArray.length - 1 && (
                                              <div className="absolute left-2 top-[16px] z-0 h-[calc(100%+12px)] w-0 border-l-[1.5px] border-dashed border-neutral-400" />
                                            )}
                                            {/* Bullet with number */}
                                            <div className="relative z-[4] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#461B02]">
                                              <span className="text-[10px] font-bold leading-[12px] text-white">
                                                {idx + 1}
                                              </span>
                                            </div>
                                            <div className="relative z-[4] flex flex-1 items-center gap-2">
                                              <p className="line-clamp-1 flex-1 break-all text-xs font-medium leading-[120%] text-black">
                                                {loc.fullAddress}
                                              </p>
                                              {isChanged && (
                                                <span className="flex h-[14px] w-[54px] flex-shrink-0 items-center justify-center rounded bg-black text-[8px] font-semibold leading-[130%] text-white">
                                                  Rute Diubah
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      }
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Income Adjustment Section */}
                {changeDetails.incomeAdjustment?.hasAdjustment && (
                  <div className="flex items-center gap-12 rounded-lg border border-neutral-400 px-16 py-4">
                    <div className="flex flex-1 items-center gap-2">
                      <h3 className="text-sm font-bold leading-[120%] text-black">
                        Penyesuaian Pendapatan
                      </h3>
                      <InfoTooltip side="right">
                        <p>{changeDetails.incomeAdjustment.reason}</p>
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
                  Tidak dapat memuat detail perubahan
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-3 px-6 pb-4">
            <Button
              variant="muattrans-primary-secondary"
              onClick={handleRejectChange}
              disabled={isLoading}
              className="w-[112px] text-sm md:h-[34px]"
            >
              Batal
            </Button>
            <Button
              variant="muattrans-primary"
              onClick={handleAcceptChange}
              disabled={isLoading || isLoadingDetails}
              className="w-[180px] text-sm md:h-[34px]"
            >
              {isLoading ? "Memproses..." : "Respon Perubahan"}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default RespondChangeModal;
