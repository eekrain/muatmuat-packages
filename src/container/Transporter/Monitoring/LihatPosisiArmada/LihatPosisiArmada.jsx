"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import BadgeSOSPopover from "@/components/Badge/BadgeSOSPopover";
import { BadgeStatusPesanan as BadgeStatus } from "@/components/Badge/BadgeStatusPesanan";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import IconComponent from "@/components/IconComponent/IconComponent";
import { DriverTimeline } from "@/components/Timeline/DriverTimeline";
import { cn } from "@/lib/utils";
import { useGetOrdersMultiFleetTracking } from "@/services/Transporter/monitoring/lacak-armada/getOrdersMultiFleetTracking";
import { getTrackingStatusBadge } from "@/utils/Transporter/trackingStatus";

const LihatPosisiArmada = ({ onClose, orderId }) => {
  const [expandedVehicles, setExpandedVehicles] = useState({});

  // Fetch multi-fleet tracking data
  const { data, isLoading } = useGetOrdersMultiFleetTracking(orderId);

  const toggleVehicle = (id) => {
    setExpandedVehicles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const breadcrumbData = [
    { name: "Monitoring", href: "/monitoring" },
    { name: "Detail Pesanan" },
    { name: "Lihat Posisi Armada" },
  ];

  return (
    <div className="flex h-full flex-col rounded-xl bg-white">
      <div className="px-4">
        <BreadCrumb data={breadcrumbData} className="pt-6" />
      </div>

      <div className="mt-4 flex items-center gap-3 px-4">
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-100"
          aria-label="Tutup panel"
        >
          <IconComponent
            src="/icons/arrow-left24.svg"
            className="h-4 w-4 text-primary-700"
          />
        </button>
        <h1 className="text-base font-bold text-neutral-900">
          Lihat Posisi Armada
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-sm text-neutral-500">Loading...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {(data?.vehicles || []).map((vehicle, index) => (
              <div
                key={vehicle.vehicleId}
                className="flex flex-col rounded-lg border border-neutral-300 p-4"
              >
                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <BadgeStatus
                      variant={
                        getTrackingStatusBadge(vehicle.trackingStatus).variant
                      }
                      className="inline-flex w-auto"
                    >
                      {getTrackingStatusBadge(vehicle.trackingStatus).label}
                    </BadgeStatus>
                    {vehicle.sosStatus?.hasSos && (
                      <BadgeSOSPopover
                        sosData={{
                          licensePlate: vehicle.licensePlate,
                          truckIcon: `/img/mock-armada/${["one", "two", "three"][index % 3]}.png`,
                          reportTime: "10 Jan 2025 12:00 WIB",
                          images: [],
                          vehicleType: "Colt Diesel Double - Bak Terbuka",
                          driverName: vehicle.driverName,
                          driverPhone: "0823-3123-1290",
                          lastLocation: "Kab. Batu",
                          orderNumber: data?.orderCode || "N/A",
                          pickupLocation:
                            data?.pickupLocations?.[0]?.fullAddress || "N/A",
                          dropoffLocation:
                            data?.dropoffLocations?.[0]?.fullAddress || "N/A",
                        }}
                        onProcessLoad={() => console.log("Process Load")}
                        onViewDetail={() => console.log("View Detail")}
                        onViewHistory={() => console.log("View History")}
                        onConfirm={() => console.log("Confirm")}
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-neutral-300 bg-white">
                      <img
                        src={`/img/mock-armada/${["one", "two", "three"][index % 3]}.png`}
                        alt="Ikon Truk"
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
                          {vehicle.driverName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <button
                      onClick={() => toggleVehicle(vehicle.vehicleId)}
                      className="rounded-full p-1 transition-colors hover:bg-neutral-100"
                      aria-label={
                        expandedVehicles[vehicle.vehicleId]
                          ? "Sembunyikan detail"
                          : "Tampilkan detail"
                      }
                    >
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-neutral-600 transition-transform",
                          expandedVehicles[vehicle.vehicleId] && "rotate-180"
                        )}
                      />
                    </button>
                  </div>
                </div>

                {expandedVehicles[vehicle.vehicleId] && (
                  <div className="mt-4 border-t border-neutral-300 pt-4">
                    <div className="bg-neutral-100 p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-neutral-500">
                          Estimasi Tiba di Lokasi Bongkar
                        </span>
                        <span className="text-xs font-semibold text-neutral-900">
                          {vehicle.estimatedArrival
                            ? `${new Date(
                                vehicle.estimatedArrival
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
                      <h3 className="mb-4 text-sm font-semibold text-neutral-900">
                        Detail Status Driver
                      </h3>
                      <DriverTimeline
                        dataTimeline={
                          vehicle.timeline || {
                            statusDefinitions: [
                              {
                                mappedOrderStatus:
                                  vehicle.driverStatus?.mainStatus ||
                                  "CONFIRMED",
                                date:
                                  vehicle.currentLocation?.lastUpdate ||
                                  new Date().toISOString(),
                                children: [
                                  {
                                    statusCode:
                                      vehicle.driverStatus?.subStatus ||
                                      "IN_TRANSIT",
                                    date:
                                      vehicle.currentLocation?.lastUpdate ||
                                      new Date().toISOString(),
                                    requiresPhoto: false,
                                  },
                                ],
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LihatPosisiArmada;
