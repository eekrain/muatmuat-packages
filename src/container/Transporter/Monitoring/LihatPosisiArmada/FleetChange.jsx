"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { useGetFleetPositions } from "@/services/Transporter/monitoring/lacak-armada/getFleetPositions";

import { BadgeSOSPopover } from "@/components/Badge/BadgeSOSPopover";
import { BadgeStatusPesanan as BadgeStatus } from "@/components/Badge/BadgeStatusPesanan";
import IconComponent from "@/components/IconComponent/IconComponent";
import { DriverTimeline } from "@/components/Timeline/DriverTimeline";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

import { getTrackingStatusBadgeWithTranslation } from "@/utils/Transporter/trackingStatus";

const FleetChange = () => {
  const { t } = useTranslation();
  const [expandedVehicles, setExpandedVehicles] = useState({});
  const [expandedVehiclesChange, setExpandedVehiclesChange] = useState({});

  const {
    data: fleetPositons,
    // isLoading
  } = useGetFleetPositions();

  const toggleVehicle = (id) => {
    setExpandedVehicles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const toggleVehicleChange = (id) => {
    setExpandedVehiclesChange((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      {(fleetPositons?.fleets || []).map((vehicle, index) => (
        <div
          className="flex flex-col rounded-lg border border-neutral-300 p-4"
          key={vehicle.id}
        >
          <div className="relative">
            <div className="mb-3 flex items-center gap-2">
              <BadgeStatus
                variant={
                  getTrackingStatusBadgeWithTranslation(vehicle.orderStatus, t)
                    .variant
                }
                className="inline-flex w-auto flex-shrink-0"
              >
                {
                  getTrackingStatusBadgeWithTranslation(vehicle.orderStatus, t)
                    .label
                }
              </BadgeStatus>
              {vehicle.sosStatus === "ACTIVE" && (
                <BadgeSOSPopover
                  data={{
                    licensePlate: vehicle.licensePlate,
                    truckIcon: `/img/mock-armada/${["one", "two", "three"][index % 3]}.png`,
                    reportTime: "10 Jan 2025 12:00 WIB",
                    images: [],
                    vehicleType: "Colt Diesel Double - Bak Terbuka",
                    driverName: vehicle.driver?.name,
                    driverPhone: "0823-3123-1290",
                    lastLocation: "Kab. Batu",
                    orderNumber: fleetPositons?.orderCode || "N/A",
                    pickupLocation:
                      fleetPositons?.pickupLocations?.[0]?.fullAddress || "N/A",
                    dropoffLocation:
                      fleetPositons?.dropoffLocations?.[0]?.fullAddress ||
                      "N/A",
                  }}
                />
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-neutral-300 bg-white">
                <img
                  src={`/img/mock-armada/${["one", "two", "three"][index % 3]}.png`}
                  alt={t("LihatPosisiArmada.truckIcon", {}, "Ikon Truk")}
                  className="h-6 w-6 object-contain"
                />
              </div>

              <div className="max-w-[376px] flex-1">
                <h3 className="text-sm font-bold text-neutral-900">
                  {vehicle.licensePlate}
                </h3>
                <div className="mt-1 flex items-center gap-1.5">
                  <IconComponent
                    src="/icons/user16.svg"
                    className="h-4 w-4 flex-shrink-0 text-neutral-600"
                  />
                  <span className="truncate text-xs font-medium text-neutral-800">
                    {vehicle.driver?.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <button
                onClick={() => toggleVehicle(vehicle.id)}
                className="rounded-full p-1 transition-colors hover:bg-neutral-100"
                aria-label={
                  expandedVehicles[vehicle.id]
                    ? t(
                        "LihatPosisiArmada.hideDetail",
                        {},
                        "Sembunyikan detail"
                      )
                    : t("LihatPosisiArmada.showDetail", {}, "Tampilkan detail")
                }
              >
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-neutral-600 transition-transform",
                    expandedVehicles[vehicle.id] && "rotate-180"
                  )}
                />
              </button>
            </div>
          </div>

          {expandedVehicles[vehicle.id] && (
            <div className="mt-4 border-t border-neutral-300 pt-4">
              <div className="bg-neutral-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="w-[120px] text-xs font-medium text-neutral-600">
                    {t(
                      "LihatPosisiArmada.estimatedArrivalBongkar",
                      {},
                      "Estimasi Tiba di Lokasi Bongkar"
                    )}
                  </span>
                  <span className="text-xs font-semibold">
                    {vehicle.estimatedArrival
                      ? `${new Date(vehicle.estimatedArrival).toLocaleString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Asia/Jakarta",
                          }
                        )} WIB`
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="mb-4 text-xs font-semibold text-neutral-900">
                  {t(
                    "LihatPosisiArmada.driverStatusDetail",
                    {},
                    "Detail Status Driver"
                  )}
                </h3>
                <DriverTimeline
                  dataTimeline={
                    vehicle.timeline || {
                      statusDefinitions: [
                        {
                          mappedOrderStatus:
                            vehicle.driverStatus?.mainStatus || "FLEET_CHANGE",
                          date:
                            vehicle.currentLocation?.lastUpdate ||
                            new Date().toISOString(),
                        },
                      ],
                    }
                  }
                  onClickProof={(photos) => alert(`Viewing proof: ${photos}`)}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 text-nowrap py-4">
            <div className="w-full border-t border-neutral-400"></div>
            <div className="text-xs text-neutral-600">
              {t("FleetChange.replacementFleet", {}, "Menggantikan Armada")}
            </div>
            <div className="w-full border-t border-neutral-400"></div>
          </div>

          <div className="relative flex items-center gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-neutral-300 bg-white">
              <img
                src={`/img/mock-armada/${["one", "two", "three"][index % 3]}.png`}
                alt={t("LihatPosisiArmada.truckIcon", {}, "Ikon Truk")}
                className="h-6 w-6 object-contain"
              />
            </div>

            <div className="max-w-[376px] flex-1">
              <h3 className="text-sm font-bold text-neutral-900">
                {vehicle.replacementFleet.licensePlate}
              </h3>
              <div className="mt-1 flex items-center gap-1.5">
                <IconComponent
                  src="/icons/user16.svg"
                  className="h-4 w-4 flex-shrink-0 text-neutral-600"
                />
                <span className="truncate text-xs font-medium text-neutral-800">
                  {vehicle.replacementFleet.driverName}
                </span>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <button
                onClick={() => toggleVehicleChange(vehicle.id)}
                className="rounded-full p-1 transition-colors hover:bg-neutral-100"
                aria-label={
                  expandedVehiclesChange[vehicle.id]
                    ? t(
                        "LihatPosisiArmada.hideDetail",
                        {},
                        "Sembunyikan detail"
                      )
                    : t("LihatPosisiArmada.showDetail", {}, "Tampilkan detail")
                }
              >
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-neutral-600 transition-transform",
                    expandedVehiclesChange[vehicle.id] && "rotate-180"
                  )}
                />
              </button>
            </div>
          </div>
          {expandedVehiclesChange[vehicle.id] && (
            <div className="mt-4 border-t border-neutral-300 pt-4">
              <div className="bg-neutral-100 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="w-[120px] text-xs font-medium text-neutral-600">
                    {t(
                      "LihatPosisiArmada.estimatedArrivalBongkar",
                      {},
                      "Estimasi Tiba di Lokasi Bongkar"
                    )}
                  </span>
                  <span className="text-xs font-semibold">
                    {vehicle.estimatedArrival
                      ? `${new Date(vehicle.estimatedArrival).toLocaleString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Asia/Jakarta",
                          }
                        )} WIB`
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="mb-4 text-xs font-semibold text-neutral-900">
                  {t(
                    "LihatPosisiArmada.driverStatusDetail",
                    {},
                    "Detail Status Driver"
                  )}
                </h3>
                <DriverTimeline
                  dataTimeline={
                    vehicle.timeline || {
                      statusDefinitions: [
                        {
                          mappedOrderStatus:
                            vehicle.driverStatus?.mainStatus || "CONFIRMED",
                          date:
                            vehicle.currentLocation?.lastUpdate ||
                            new Date().toISOString(),
                        },
                      ],
                    }
                  }
                  onClickProof={(photos) => alert(`Viewing proof: ${photos}`)}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default FleetChange;
