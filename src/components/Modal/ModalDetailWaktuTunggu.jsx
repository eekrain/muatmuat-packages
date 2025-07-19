import { useState } from "react";

import { sub } from "date-fns";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Alert } from "../Alert/Alert";
import { Modal, ModalContent, ModalTrigger } from "./Modal";

export const ModalDetailWaktuTunggu = ({
  drivers = [
    {
      name: "Daffa Toldo",
      data: [
        {
          detail: "Lokasi Muat 1 : 1 Jam 59 Menit",
          startDate: sub(new Date(), { hours: 2 }).toISOString(),
          endDate: sub(new Date(), { hours: 1 }).toISOString(),
          totalPrice: 100000,
        },
        {
          detail: "Lokasi Muat 1 : 1 Jam 59 Menit",
          startDate: sub(new Date(), { hours: 2 }).toISOString(),
          endDate: sub(new Date(), { hours: 1 }).toISOString(),
          totalPrice: 200000,
        },
      ],
    },
  ],
}) => {
  // Use an array of booleans to track expanded state for each driver
  const [expandedDrivers, setExpandedDrivers] = useState(
    drivers.map(() => false)
  );

  const toggleDriver = (idx) => {
    setExpandedDrivers((prev) =>
      prev.map((val, i) => (i === idx ? !val : val))
    );
  };

  return (
    <Modal>
      <ModalTrigger>
        <button className="text-xs font-medium leading-[14.4px] text-primary-700">
          Lihat Detail Waktu Tunggu
        </button>
      </ModalTrigger>
      <ModalContent
        className="flex w-[578px] flex-col gap-y-4 p-6"
        type="muatmuat"
      >
        {/* Header */}
        <h2 className="text-center text-base font-bold leading-[19.2px] text-neutral-900">
          Detail Waktu Tunggu
        </h2>

        <Alert variant="secondary" className="my-3 font-semibold">
          Free untuk 12 jam awal dan dikenakan biaya waktu tunggu lebih dari 12
          jam
        </Alert>

        {/* Driver Section */}
        <div className="flex flex-col">
          {drivers.map((driver, idx) => (
            <div
              className={cn(
                "w-full border-b border-neutral-400 pb-6",
                idx !== drivers.length - 1 && "mb-3"
              )}
              key={idx}
            >
              {/* Driver Header */}
              <button
                type="button"
                className={
                  "flex w-full cursor-pointer items-center justify-between"
                }
                onClick={() => toggleDriver(idx)}
              >
                <h3 className="text-sm font-semibold text-neutral-900">
                  Driver : {driver.name}
                </h3>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-neutral-500 transition-transform duration-200",
                    expandedDrivers[idx] && "rotate-180"
                  )}
                />
              </button>

              {/* Expandable Content */}
              <div
                className={cn(
                  "flex flex-col gap-3 overflow-hidden transition-all duration-300 ease-in-out",
                  expandedDrivers[idx]
                    ? "mt-3 max-h-96 opacity-100"
                    : "mt-0 max-h-0 opacity-0",
                  "text-xs font-medium leading-[1.2]"
                )}
              >
                {/* Loading Location Details */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-900">{driver.detail}</span>
                    <span className="text-neutral-900">Rp100.000</span>
                  </div>
                  <div className="text-neutral-600">
                    {driver.startDate} s/d {driver.endDate}
                  </div>
                </div>
                {/* You can add more details per driver here if needed */}
              </div>
            </div>
          ))}

          <div className="text-neutral-90 flex items-center justify-between pt-6 text-base font-bold">
            <span className="">Total</span>
            <span className="">
              {drivers
                .reduce(
                  (acc, d) =>
                    acc + (parseInt(d?.totalPrice?.replace(/[^\d]/g, "")) || 0),
                  0
                )
                .toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                })}
            </span>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
