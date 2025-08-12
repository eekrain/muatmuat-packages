import { useState } from "react";

import { ChevronDown, X } from "lucide-react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import IconComponent from "@/components/IconComponent/IconComponent";
import { DriverTimeline } from "@/components/Timeline/DriverTimeline";
import { cn } from "@/lib/utils";

const LacakArmada = ({ onClose, orderId }) => {
  const [expandedVehicles, setExpandedVehicles] = useState({});

  // Mock data - replace with actual API call using orderId
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
                  requiresPhoto: false,
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

  const toggleVehicle = (vehicleId) => {
    setExpandedVehicles((prev) => ({
      ...prev,
      [vehicleId]: !prev[vehicleId],
    }));
  };

  return (
    <div className="flex h-full flex-col bg-white pt-12">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-base font-bold text-black">Lacak Armada</h2>
        <button
          onClick={onClose}
          className="rounded-full p-1 transition-colors hover:bg-neutral-100"
        >
          <X className="h-5 w-5 text-neutral-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="flex flex-col gap-3">
          {fleetData.vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex flex-col rounded-lg border border-neutral-400 bg-white p-4"
            >
              {/* Status Badge */}
              <div className="mb-3">
                <BadgeStatus
                  variant={vehicle.statusVariant}
                  className="inline-flex w-auto"
                >
                  {vehicle.status}
                </BadgeStatus>
              </div>

              {/* Vehicle Info Row - separated divs */}
              <div className="relative">
                {/* Left side: Truck Icon and Details */}
                <div className="flex items-center gap-4 pr-12">
                  {/* Truck Icon */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[7px] border border-neutral-400 bg-white">
                    <img
                      src={vehicle.icon}
                      alt="Truck"
                      className="h-6 w-6 object-contain"
                    />
                  </div>

                  {/* Vehicle Details */}
                  <div className="flex flex-1 flex-col gap-1">
                    <h3 className="text-xs font-bold leading-[120%] text-black">
                      {vehicle.licensePlate}
                    </h3>
                    <div className="flex items-center gap-1">
                      <IconComponent
                        src="/icons/user.svg"
                        className="h-4 w-4 text-[#461B02]"
                      />
                      <span className="text-xs font-medium leading-[120%] text-black">
                        {vehicle.driverName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chevron Button - Absolutely positioned and centered */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <button
                    onClick={() => toggleVehicle(vehicle.id)}
                    className="rounded-full p-1 transition-colors hover:bg-neutral-100"
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

              {/* Expanded Details - Driver Timeline */}
              {expandedVehicles[vehicle.id] && (
                <div className="mt-6">
                  {/* Header Section with Gray Background - Frame 1171277239 */}
                  <div className="flex flex-col items-start gap-6 self-stretch rounded-none bg-[#F1F1F1] p-3">
                    {/* Frame 1171275921 - Header Container */}
                    <div className="flex flex-col items-start gap-4 self-stretch">
                      {/* Frame 1171276101 - Top row with "Estimasi Tiba" and "-" */}
                      <div className="flex items-center justify-between gap-3 self-stretch">
                        {/* Frame 1171276813 - Left section with "Estimasi Tiba" */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium leading-[110%] text-[#7B7B7B]">
                            Estimasi Tiba di Lokasi Bongkar
                          </span>
                          <span className="text-xs font-semibold leading-[110%] text-black">
                            -
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detail Status Driver Title */}
                  <div className="my-4">
                    <h3 className="text-xs font-semibold leading-[120%] text-black">
                      Detail Status Driver
                    </h3>
                  </div>

                  {/* Driver Timeline Component */}
                  <DriverTimeline
                    dataTimeline={vehicle.timeline}
                    onClickProof={() => {}}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LacakArmada;
