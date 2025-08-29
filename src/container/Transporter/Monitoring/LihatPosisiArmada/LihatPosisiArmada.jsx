"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { useGetFleetTracking } from "@/services/Transporter/monitoring/lacak-armada/getFleetTracking";

import { BadgeSOSPopover } from "@/components/Badge/BadgeSOSPopover";
import { BadgeStatusPesanan as BadgeStatus } from "@/components/Badge/BadgeStatusPesanan";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { DriverTimeline } from "@/components/Timeline/DriverTimeline";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

import { getTrackingStatusBadgeWithTranslation } from "@/utils/Transporter/trackingStatus";

// import FleetChange from "./FleetChange";

const LihatPosisiArmada = ({ onClose, orderId }) => {
  const { t } = useTranslation();
  const [expandedVehicles, setExpandedVehicles] = useState({});
  const [expandedVehiclesChange, setExpandedVehiclesChange] = useState({});
  const [openSosPopover, setOpenSosPopover] = useState(null); // vehicleId or null

  // Fetch fleet tracking data
  const { data, isLoading } = useGetFleetTracking(orderId);

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

  const breadcrumbData = [
    {
      name: t("LihatPosisiArmada.breadcrumb.monitoring", {}, "Monitoring"),
      href: "/monitoring",
    },
    {
      name: t("LihatPosisiArmada.breadcrumb.orderDetail", {}, "Detail Pesanan"),
    },
    {
      name: t(
        "LihatPosisiArmada.breadcrumb.viewFleetPosition",
        {},
        "Lihat Posisi Armada"
      ),
    },
  ];

  return (
    <div className="relative flex h-full flex-col rounded-xl bg-white">
      <div className="px-4">
        <BreadCrumb data={breadcrumbData} className="pt-6" />
      </div>

      <div className="mt-4 flex items-center gap-3 px-4">
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-100"
          aria-label={t("LihatPosisiArmada.closePanel", {}, "Tutup panel")}
        >
          <IconComponent
            src="/icons/arrow-left24.svg"
            className="h-4 w-4 text-primary-700"
          />
        </button>
        <h1 className="text-base font-bold text-neutral-900">
          {t("LihatPosisiArmada.title", {}, "Lihat Posisi Armada")}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-sm text-neutral-500">
              {t("LihatPosisiArmada.loading", {}, "Loading...")}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {(data?.fleetDetails || []).map((fleet, index) => (
              <div
                key={fleet.id}
                className="flex flex-col rounded-lg border border-neutral-300 p-4"
              >
                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <BadgeStatus
                      variant={
                        getTrackingStatusBadgeWithTranslation(
                          data?.orderInfo?.orderStatus || fleet.fleetStatus,
                          t
                        ).variant
                      }
                      className="inline-flex w-auto flex-shrink-0"
                    >
                      {
                        getTrackingStatusBadgeWithTranslation(
                          data?.orderInfo?.orderStatus || fleet.fleetStatus,
                          t
                        ).label
                      }
                    </BadgeStatus>
                    {fleet.sosStatus?.hasSos && (
                      <>
                        <div className="flex h-[24px] w-10 items-center justify-center rounded-md bg-error-400 text-xs font-semibold text-error-50">
                          {t("CardLacakArmada.sosLabel", {}, "SOS")}
                        </div>
                        <Button
                          className="text-xs"
                          onClick={() => setOpenSosPopover(fleet.id)}
                          variant="link"
                        >
                          {t("CardLacakArmada.viewSOS", {}, "Lihat SOS")}
                        </Button>
                      </>
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
                        {fleet.licensePlate}
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5">
                        <IconComponent
                          src="/icons/user16.svg"
                          className="h-4 w-4 flex-shrink-0 text-neutral-600"
                        />
                        <span className="truncate text-xs font-medium text-neutral-800">
                          {fleet.driverInfo?.name || fleet.driverName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <button
                      onClick={() => toggleVehicle(fleet.id)}
                      className="rounded-full p-1 transition-colors hover:bg-neutral-100"
                      aria-label={
                        expandedVehicles[fleet.id]
                          ? t(
                              "LihatPosisiArmada.hideDetail",
                              {},
                              "Sembunyikan detail"
                            )
                          : t(
                              "LihatPosisiArmada.showDetail",
                              {},
                              "Tampilkan detail"
                            )
                      }
                    >
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-neutral-600 transition-transform",
                          expandedVehicles[fleet.id] && "rotate-180"
                        )}
                      />
                    </button>
                  </div>
                </div>

                {expandedVehicles[fleet.id] && (
                  <div className="mt-4 border-t border-neutral-300 pt-4">
                    <div className="bg-neutral-100 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="w-[120px] text-xs font-medium text-neutral-600">
                          {t(
                            "LihatPosisiArmada.estimatedArrival",
                            {},
                            "Estimasi Tiba di Lokasi Bongkar"
                          )}
                        </span>
                        <span className="text-xs font-semibold">
                          {fleet.estimatedArrival &&
                          !fleet?.replacementFleet?.id
                            ? `${new Date(
                                fleet.estimatedArrival
                              ).toLocaleString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: "Asia/Jakarta",
                              })} WIB`
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
                          fleet.milestones && fleet.milestones.length > 0
                            ? {
                                statusDefinitions: [
                                  {
                                    mappedOrderStatus:
                                      data?.orderInfo?.orderStatus ||
                                      "IN_PROGRESS",
                                    date:
                                      fleet.milestones[
                                        fleet.milestones.length - 1
                                      ]?.completedAt ||
                                      new Date().toISOString(),
                                    children: fleet.milestones.map(
                                      (milestone) => ({
                                        statusCode: milestone.statusName
                                          .toUpperCase()
                                          .replace(/ /g, "_"),
                                        statusName: milestone.statusName,
                                        date: milestone.completedAt,
                                        requiresPhoto: false,
                                        isCompleted: milestone.isCompleted,
                                        icon: milestone.icon,
                                        colorCode: milestone.colorCode,
                                        photos: [],
                                      })
                                    ),
                                  },
                                ],
                              }
                            : {
                                statusDefinitions: [
                                  {
                                    mappedOrderStatus:
                                      data?.orderInfo?.orderStatus ||
                                      "IN_PROGRESS",
                                    date: new Date().toISOString(),
                                    children: [],
                                  },
                                ],
                              }
                        }
                        onClickProof={() => {
                          // Handle proof viewing
                        }}
                      />
                    </div>
                  </div>
                )}

                {fleet?.replacementFleet?.id && (
                  <>
                    <div className="flex items-center justify-between gap-4 text-nowrap py-4">
                      <div className="w-full border-t border-neutral-400"></div>
                      <div className="text-xs text-neutral-600">
                        {t(
                          "LihatPosisiArmada.replacingFleet",
                          {},
                          "Menggantikan Armada"
                        )}
                      </div>
                      <div className="w-full border-t border-neutral-400"></div>
                    </div>

                    <div className="relative flex items-center gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-neutral-300 bg-white">
                        <img
                          src={`/img/mock-armada/${["one", "two", "three"][index % 3]}.png`}
                          alt={t(
                            "LihatPosisiArmada.truckIcon",
                            {},
                            "Ikon Truk"
                          )}
                          className="h-6 w-6 object-contain"
                        />
                      </div>

                      <div className="max-w-[376px] flex-1">
                        <h3 className="text-sm font-bold text-neutral-900">
                          {fleet.replacementFleet.licensePlate}
                        </h3>
                        <div className="mt-1 flex items-center gap-1.5">
                          <IconComponent
                            src="/icons/user16.svg"
                            className="h-4 w-4 flex-shrink-0 text-neutral-600"
                          />
                          <span className="truncate text-xs font-medium text-neutral-800">
                            {fleet.replacementFleet.driverName}
                          </span>
                        </div>
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <button
                          onClick={() => toggleVehicleChange(fleet.id)}
                          className="rounded-full p-1 transition-colors hover:bg-neutral-100"
                          aria-label={
                            expandedVehiclesChange[fleet.id]
                              ? t(
                                  "LihatPosisiArmada.hideDetail",
                                  {},
                                  "Sembunyikan detail"
                                )
                              : t(
                                  "LihatPosisiArmada.showDetail",
                                  {},
                                  "Tampilkan detail"
                                )
                          }
                        >
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 text-neutral-600 transition-transform",
                              expandedVehiclesChange[fleet.id] && "rotate-180"
                            )}
                          />
                        </button>
                      </div>
                    </div>
                    {expandedVehiclesChange[fleet.id] && (
                      <div className="mt-4 border-t border-neutral-300 pt-4">
                        <div className="bg-neutral-100 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="w-[120px] text-xs font-medium text-neutral-600">
                              {t(
                                "LihatPosisiArmada.estimatedArrival",
                                {},
                                "Estimasi Tiba di Lokasi Bongkar"
                              )}
                            </span>
                            <span className="text-xs font-semibold">
                              {fleet.estimatedArrival &&
                              !fleet?.replacementFleet?.id
                                ? `${new Date(
                                    fleet.estimatedArrival
                                  ).toLocaleString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZone: "Asia/Jakarta",
                                  })} WIB`
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
                              fleet.replacementFleet.timeline || {
                                statusDefinitions: [
                                  {
                                    mappedOrderStatus:
                                      fleet.driverStatus?.mainStatus ||
                                      "CONFIRMED",
                                    date:
                                      fleet.lastLocationUpdate ||
                                      new Date().toISOString(),
                                  },
                                ],
                              }
                            }
                            onClickProof={(photos) =>
                              alert(`Viewing proof: ${photos}`)
                            }
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {/* <FleetChange /> */}
          </div>
        )}
      </div>
      {/* Show BadgeSOSPopover only when openSosPopover is set */}
      {openSosPopover &&
        (() => {
          const fleet = (data?.fleetDetails || []).find(
            (f) => f.id === openSosPopover
          );
          if (!fleet) return null;
          const index = (data?.fleetDetails || []).findIndex(
            (f) => f.id === openSosPopover
          );
          return (
            <div className="absolute bottom-0 right-[-72px] z-50">
              <BadgeSOSPopover
                data={{
                  licensePlate: fleet.licensePlate,
                  truckIcon: `/img/mock-armada/${["one", "two", "three"][index % 3]}.png`,
                  reportTime: "10 Jan 2025 12:00 WIB",
                  images: [],
                  vehicleType:
                    fleet.truckType || "Colt Diesel Double - Bak Terbuka",
                  driverName: fleet.driverInfo?.name || fleet.driverName,
                  driverPhone:
                    fleet.driverInfo?.phoneNumber || "0823-3123-1290",
                  lastLocation: "Kab. Batu",
                  orderNumber: data?.orderInfo?.orderCode || "N/A",
                  pickupLocation:
                    data?.pickupLocations?.[0]?.fullAddress || "N/A",
                  dropoffLocation:
                    data?.dropoffLocations?.[0]?.fullAddress || "N/A",
                }}
                onProcessLoad={() => {}}
                onViewDetail={() => {}}
                onViewHistory={() => {}}
                onConfirm={() => {}}
                onClose={() => setOpenSosPopover(null)}
              />
            </div>
          );
        })()}
    </div>
  );
};

export default LihatPosisiArmada;
