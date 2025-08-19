"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { BadgeStatusPesanan as BadgeStatus } from "@/components/Badge/BadgeStatusPesanan";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import IconComponent from "@/components/IconComponent/IconComponent";
import { DriverTimeline } from "@/components/Timeline/DriverTimeline";
import { cn } from "@/lib/utils";

const LihatPosisiArmada = ({ onClose, orderData }) => {
  const [expandedVehicles, setExpandedVehicles] = useState({});

  const toggleVehicle = (id) => {
    setExpandedVehicles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const breadcrumbData = [
    { name: "Monitoring", href: "/monitoring" },
    { name: "Daftar Pesanan Aktif" },
    { name: "Detail Pesanan" },
    { name: "Lihat Posisi Armada" },
  ];

  // Mock data for demonstration. In a real app, this would come from the `orderData` prop.
  const fleetData = {
    orderCode: "MT240115001",
    vehicles: [
      {
        id: "1",
        licensePlate: "AE 1111 LBA",
        driverName: "Pratama Setiawan Nugroho Putra Perdana Kusuma",
        status: "Sedang Muat",
        statusVariant: "primary",
        icon: "/img/mock-armada/one.png",
        timeline: {
          statusDefinitions: [
            {
              mappedOrderStatus: "LOADING",
              date: "2024-09-12T12:00:00Z",
              children: [
                {
                  statusCode: "SEDANG_MUAT",
                  statusName: "Sedang Muat",
                  date: "2024-09-12T12:00:00Z",
                  requiresPhoto: true,
                  photos: ["https://picsum.photos/400/300?random=1"],
                },
                {
                  statusCode: "ANTRI_DI_LOKASI_MUAT",
                  statusName: "Antri di Lokasi Muat",
                  date: "2024-09-12T11:30:00Z",
                  requiresPhoto: false,
                },
                {
                  statusCode: "TIBA_DI_LOKASI_MUAT",
                  statusName: "Tiba di Lokasi Muat",
                  date: "2024-09-12T11:00:00Z",
                  requiresPhoto: false,
                },
                {
                  statusCode: "MENUJU_KE_LOKASI_MUAT",
                  statusName: "Menuju ke Lokasi Muat",
                  date: "2024-09-12T10:30:00Z",
                  requiresPhoto: false,
                },
              ],
            },
          ],
        },
      },
      {
        id: "2",
        licensePlate: "AE 2222 LBA",
        driverName: "Yoel Galagher",
        status: "Sedang Muat",
        statusVariant: "primary",
        icon: "/img/mock-armada/two.png",
        timeline: {
          statusDefinitions: [
            {
              mappedOrderStatus: "LOADING",
              date: "2024-09-12T12:00:00Z",
              children: [
                {
                  statusCode: "SEDANG_MUAT",
                  statusName: "Sedang Muat",
                  date: "2024-09-12T12:00:00Z",
                  requiresPhoto: false,
                },
              ],
            },
          ],
        },
      },
      {
        id: "3",
        licensePlate: "AE 3333 LBA",
        driverName: "Wills Galagher",
        status: "Menuju ke Lokasi Bongkar",
        statusVariant: "primary",
        icon: "/img/mock-armada/three.png",
        timeline: {
          statusDefinitions: [
            {
              mappedOrderStatus: "UNLOADING",
              date: "2024-09-12T12:00:00Z",
              children: [
                {
                  statusCode: "MENUJU_KE_LOKASI_BONGKAR",
                  statusName: "Menuju ke Lokasi Bongkar",
                  date: "2024-09-12T12:00:00Z",
                  requiresPhoto: false,
                },
              ],
            },
          ],
        },
      },
    ],
  };

  // Use actual data from props if available, otherwise fallback to mock data
  const vehicles = orderData?.fleets || fleetData.vehicles;

  return (
    <div className="flex h-full flex-col rounded-xl bg-white">
      <div className="px-4">
        <BreadCrumb data={breadcrumbData} className="justify-center pt-6" />
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
        <div className="space-y-4">
          {(vehicles || []).map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex flex-col rounded-lg border border-neutral-300 bg-white"
            >
              <div className="relative p-4">
                <div className="mb-3">
                  <BadgeStatus
                    variant={vehicle.statusVariant}
                    className="inline-flex w-auto"
                  >
                    {vehicle.status}
                  </BadgeStatus>
                </div>

                <div className="flex items-center gap-4 pr-10">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-neutral-300 bg-white">
                    <img
                      src={vehicle.icon}
                      alt="Ikon Truk"
                      className="h-6 w-6 object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-neutral-900">
                      {vehicle.licensePlate}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5">
                      <IconComponent
                        src="/icons/user.svg"
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
                    onClick={() => toggleVehicle(vehicle.id)}
                    className="rounded-full p-1 transition-colors hover:bg-neutral-100"
                    aria-label={
                      expandedVehicles[vehicle.id]
                        ? "Sembunyikan detail"
                        : "Tampilkan detail"
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
                <div className="border-t border-neutral-300">
                  <div className="bg-neutral-100 p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-neutral-500">
                        Estimasi Tiba di Lokasi Bongkar
                      </span>
                      <span className="text-xs font-semibold text-neutral-900">
                        -
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="mb-4 text-sm font-semibold text-neutral-900">
                      Detail Status Driver
                    </h3>
                    <DriverTimeline
                      dataTimeline={vehicle.timeline}
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
      </div>
    </div>
  );
};

export default LihatPosisiArmada;
