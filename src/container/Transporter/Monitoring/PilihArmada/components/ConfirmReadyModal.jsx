"use client";

import { useState } from "react";

import { format } from "date-fns";
import { id } from "date-fns/locale";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";
import MuatBongkarStepperWithModal from "@/components/Stepper/MuatBongkarStepperWithModal";
import { toast } from "@/lib/toast";
import { getArmadaStatusBadge } from "@/lib/utils/armadaStatus";

const ConfirmReadyModal = ({ isOpen, onClose, orderData }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Use order data directly from the list
  const orderInfo = orderData || {};

  // Use assigned vehicles from orderData
  const assignedVehicles = orderData?.assignedVehicles || [];
  const estimatedDistance = orderInfo?.estimatedDistance || 121;
  const potentialEarnings = orderInfo?.potentialEarnings || "Rp999.999.999";

  const handleConfirm = async () => {
    setConfirmLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const orderCode = orderInfo?.orderCode || "MT25A001A";
      toast.success(`Berhasil konfirmasi siap untuk pesanan ${orderCode}`);
      onClose();
    } catch (error) {
      toast.error("Gagal melakukan konfirmasi. Silakan coba lagi.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const formatLoadTime = (startTime, endTime) => {
    if (!startTime || !endTime) return "-";
    const start = new Date(startTime);
    const end = new Date(endTime);

    const startDate = format(start, "dd MMM yyyy HH:mm", { locale: id });
    const endDate = format(end, "dd MMM yyyy HH:mm", { locale: id });

    return `${startDate} WIB s/d ${endDate} WIB`;
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent
        type="muatmuat"
        className="w-[600px] max-w-[90vw]"
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
              Konfirmasi Siap
            </ModalTitle>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 px-6 py-4">
            {/* Informasi Armada Section */}
            <div className="max-h-[160px] overflow-y-auto rounded-lg border border-neutral-400 p-4">
              <h3 className="mb-4 text-xs font-medium leading-[120%] text-neutral-600">
                Informasi Armada
              </h3>

              <div className="space-y-3">
                {assignedVehicles.length === 0 ? (
                  <div className="flex h-32 items-center justify-center">
                    <span className="text-sm text-neutral-600">
                      Tidak ada armada tersedia
                    </span>
                  </div>
                ) : (
                  assignedVehicles.map((vehicle, index) => (
                    <div
                      key={vehicle.id}
                      className={`${
                        index !== assignedVehicles.length - 1
                          ? "border-b border-neutral-200 pb-3"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-1 flex-col gap-2 py-1">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold leading-[120%] text-black">
                              {vehicle.licensePlate}
                            </span>
                            <span className="flex-1 text-xs font-semibold leading-[120%] text-[#434343]">
                              - {vehicle.driverName || "No Driver"}
                            </span>
                          </div>
                          {vehicle.location && (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                <IconComponent
                                  src="/icons/location.svg"
                                  className="h-3.5 w-3.5 text-[#461B02]"
                                />
                                <span className="text-[10px] font-medium leading-[130%] text-black">
                                  {vehicle.location.currentLocation}
                                </span>
                                {vehicle.location.distanceFromPickup && (
                                  <span className="text-[10px] font-medium leading-[130%] text-[#7B7B7B]">
                                    ({vehicle.location.distanceFromPickup})
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <BadgeStatus
                          variant={
                            getArmadaStatusBadge(vehicle.driverStatus).variant
                          }
                          className="h-6 w-[137px] px-0 text-xs font-semibold"
                        >
                          {getArmadaStatusBadge(vehicle.driverStatus).label}
                        </BadgeStatus>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Informasi Pesanan Section */}
            <div className="max-h-[160px] overflow-y-auto rounded-lg border border-neutral-400 p-4">
              <div className="mb-4 flex justify-between gap-3">
                {/* Heading and Badges */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xs font-medium leading-[120%] text-neutral-600">
                    Informasi Pesanan
                  </h3>
                  <div className="flex items-center gap-2">
                    <BadgeStatus variant="success" className="w-auto text-xs">
                      Instan
                    </BadgeStatus>
                    {orderInfo?.timeLabel && (
                      <BadgeStatus
                        variant="warning"
                        className="w-auto whitespace-nowrap text-xs"
                      >
                        {orderInfo.timeLabel.text || "Muat Besok"}
                      </BadgeStatus>
                    )}
                    {orderInfo?.hasOverload && (
                      <BadgeStatus
                        variant="error"
                        className="w-auto whitespace-nowrap text-xs"
                      >
                        Potensi Overload
                      </BadgeStatus>
                    )}
                    {orderInfo?.hasAdditionalService && (
                      <BadgeStatus
                        variant="primary"
                        className="w-auto whitespace-nowrap text-xs"
                      >
                        <IconComponent
                          src="/icons/add.svg"
                          className="mr-1 h-3 w-3"
                        />
                        Layanan Tambahan
                      </BadgeStatus>
                    )}
                    {orderInfo?.isHalalLogistics && (
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-[#F7EAFD] p-1">
                        <IconComponent
                          src="/icons/halal.svg"
                          className="h-4 w-4 text-[#652672]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Potential Earnings */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-medium leading-[120%] text-neutral-600">
                    Potensi Pendapatan
                  </span>
                  <span className="text-sm font-bold leading-[120%] text-primary-700">
                    {potentialEarnings}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Divider */}
                <div className="border-b border-neutral-400"></div>

                {/* Locations */}
                <div className="flex items-center justify-between">
                  <MuatBongkarStepperWithModal
                    pickupLocations={orderInfo?.pickupLocations || []}
                    dropoffLocations={orderInfo?.dropoffLocations || []}
                    appearance={{
                      titleClassName: "text-xs font-bold",
                    }}
                  />
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium leading-[130%] text-black/50">
                      Estimasi Jarak
                    </span>
                    <span className="text-xs font-semibold leading-[130%] text-black">
                      {estimatedDistance} km
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-b border-neutral-400"></div>

                {/* Order Details */}
                <div className="space-y-4">
                  {/* Cargo Info */}
                  <div className="flex items-center gap-3">
                    <IconComponent
                      src="/icons/monitoring/daftar-pesanan-aktif/box.svg"
                      className="h-6 w-6 text-muat-trans-secondary-900"
                    />
                    <div className="flex flex-1 flex-col gap-1.5">
                      <span className="text-xs font-medium leading-[120%] text-[#7B7B7B]">
                        Informasi Muatan (Total :{" "}
                        {orderInfo?.totalWeight
                          ? `${orderInfo.totalWeight} ${orderInfo.weightUnit || "kg"}`
                          : "2.500 kg"}
                        )
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold leading-[120%] text-black">
                          {orderInfo?.cargos?.[0]?.name ||
                            "Peralatan Rumah Tangga"}
                          ,
                        </span>
                        {orderInfo?.cargos?.length > 1 && (
                          <span className="text-xs font-semibold leading-[120%] text-primary-700">
                            +{orderInfo.cargos.length - 1} lainnya
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-6 place-content-center rounded-md border border-muat-trans-primary-900 px-2">
                      <div className="text-xs font-semibold text-muat-trans-primary-900">
                        {orderInfo?.orderCode || "MT25A001A"}
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Requirements */}
                  <div className="flex items-center gap-3">
                    <IconComponent
                      src="/icons/monitoring/daftar-pesanan-aktif/truck.svg"
                      className="h-6 w-6 text-muat-trans-secondary-900"
                    />
                    <div className="flex flex-1 flex-col gap-1.5">
                      <span className="text-xs font-medium leading-[120%] text-[#7B7B7B]">
                        Kebutuhan Armada
                      </span>
                      <span className="text-xs font-semibold leading-[120%] text-black">
                        {orderInfo?.truckCount || 3} Unit (
                        {orderInfo?.truckTypeName ||
                          orderInfo?.truckType?.name ||
                          "Colt Diesel Engkel"}{" "}
                        -{" "}
                        {orderInfo?.carrierName ||
                          orderInfo?.carrierTruck?.name ||
                          "Box"}
                        )
                      </span>
                    </div>
                  </div>

                  {/* Load Time */}
                  <div className="flex items-center gap-3">
                    <IconComponent
                      src="/icons/monitoring/daftar-pesanan-aktif/calendar.svg"
                      className="h-6 w-6 text-muat-trans-secondary-900"
                    />
                    <div className="flex flex-1 flex-col gap-1.5">
                      <span className="text-xs font-medium leading-[120%] text-[#7B7B7B]">
                        Waktu Muat
                      </span>
                      <span className="text-xs font-semibold leading-[120%] text-black">
                        {formatLoadTime(
                          orderInfo?.loadTimeStart,
                          orderInfo?.loadTimeEnd
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Additional Services */}
                  {orderInfo?.additionalServices?.length > 0 && (
                    <div className="flex h-6 items-center rounded-md bg-[#FFF5C6] px-2 py-2">
                      <span className="flex-1 text-xs font-semibold leading-[120%] text-black">
                        +{" "}
                        {orderInfo.additionalServices
                          .map((s) => s.serviceName)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-3 px-6 pb-4">
            <Button
              variant="muattrans-primary-secondary"
              onClick={onClose}
              className="w-[112px] text-sm md:h-[34px]"
              disabled={confirmLoading}
            >
              Batal
            </Button>
            <Button
              variant="muattrans-primary"
              onClick={handleConfirm}
              className="w-[150px] text-sm md:h-[34px]"
              disabled={confirmLoading}
            >
              {confirmLoading ? "Memproses..." : "Konfirmasi Siap"}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmReadyModal;
