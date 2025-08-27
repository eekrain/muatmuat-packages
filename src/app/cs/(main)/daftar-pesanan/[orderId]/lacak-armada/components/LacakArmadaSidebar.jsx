"use client";

import Image from "next/image";
import { useState } from "react";

import { ChevronDown, X } from "lucide-react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import IconComponent from "@/components/IconComponent/IconComponent";
import { DriverTimeline } from "@/components/Timeline/DriverTimeline";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

const LacakArmadaSidebar = ({ onClose, vehicles = [], isLoading }) => {
  const { t } = useTranslation();
  const [expandedVehicles, setExpandedVehicles] = useState({});

  const toggleVehicle = (vehicleId) => {
    setExpandedVehicles((prev) => ({ ...prev, [vehicleId]: !prev[vehicleId] }));
  };

  return (
    <div className="flex h-full flex-col rounded-l-2xl bg-white">
      <div className="flex items-center justify-between border-neutral-300 px-4 py-3">
        <h2 className="text-base font-bold text-black">
          {t("lacakArmada.title", {}, "Lacak Armada")}
        </h2>
        <button
          onClick={onClose}
          className="rounded-full p-1 transition-colors hover:bg-neutral-100"
        >
          <X className="h-5 w-5 text-primary-700" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-700 border-t-transparent"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="relative flex flex-col rounded-lg border border-neutral-400 bg-white p-4"
              >
                <div className="mb-3">
                  <BadgeStatusPesanan
                    variant="primary"
                    className="inline-flex w-auto"
                  >
                    {vehicle.status}
                  </BadgeStatusPesanan>
                </div>
                <div className="relative">
                  <div className="flex items-center gap-4 pr-12">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[7px] border border-neutral-400 bg-white">
                      <Image
                        src="/img/truck.png"
                        className="h-10 w-10 rounded-[7px] object-contain"
                        alt="truck"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                      <h3 className="text-xs font-bold leading-[120%] text-black">
                        {vehicle.licensePlate}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <IconComponent
                            src="/icons/truck-jenis.svg"
                            className="h-4 w-4 text-[#461B02]"
                          />
                          <p className="truncate text-xs font-medium leading-[120%]">
                            {vehicle.transporterName}
                          </p>
                        </div>
                        <div className="aspect-square h-0.5 rounded-full bg-neutral-600"></div>
                        <div className="flex items-center gap-1">
                          <IconComponent
                            src="/icons/user16.svg"
                            className="h-4 w-4 text-[#461B02]"
                          />
                          <span className="truncate text-xs font-medium leading-[120%] text-black">
                            {vehicle.driverName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute right-4 top-[40px]">
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
                {expandedVehicles[vehicle.id] && (
                  <div className="mt-6">
                    <div className="flex flex-col items-start gap-6 self-stretch rounded-none bg-[#F1F1F1] p-3">
                      <div className="flex flex-col items-start gap-4 self-stretch">
                        <div className="flex items-center justify-between gap-3 self-stretch">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium leading-[110%] text-[#7B7B7B]">
                              {t(
                                "lacakArmada.etaLabel",
                                {},
                                "Estimasi Tiba di Lokasi Bongkar"
                              )}
                            </span>
                            <span className="text-xs font-semibold leading-[110%] text-black">
                              -
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="my-4">
                      <h3 className="text-xs font-semibold leading-[120%] text-black">
                        {t(
                          "lacakArmada.driverStatusTitle",
                          {},
                          "Detail Status Driver"
                        )}
                      </h3>
                    </div>
                    <DriverTimeline
                      dataTimeline={vehicle.timeline}
                      onClickProof={() => {}}
                    />
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

export default LacakArmadaSidebar;
