import { useState } from "react";

import { sub } from "date-fns";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

import { Alert } from "../Alert/Alert";
import { Modal, ModalContent } from "./Modal";

export const ModalDetailWaktuTunggu = ({
  open,
  onOpenChange,
  drivers = [
    {
      name: "Daffa Toldo",
      durasiTotal: "1 Jam 14 Menit",
      data: [
        {
          detail: "Lokasi Muat 1 : 1 Jam 59 Menit",
          startDate: sub(new Date(), { hours: 2 }).toISOString(),
          endDate: sub(new Date(), { hours: 1 }).toISOString(),
          totalPrice: 100000,
        },
        {
          detail: "Lokasi Bongkar 1 : 1 Jam 59 Menit",
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

  // Calculate total from all drivers' data
  const totalAmount = drivers.reduce((driverAcc, driver) => {
    return (
      driverAcc +
      driver.data.reduce((dataAcc, item) => {
        return dataAcc + (item.totalPrice || 0);
      }, 0)
    );
  }, 0);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
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
                <div className="flex flex-col items-start gap-2">
                  <h3 className="capsize text-sm font-semibold text-neutral-900">
                    Driver : {driver.name}
                  </h3>
                  {driver.durasiTotal && !expandedDrivers[idx] && (
                    <span className="capsize text-xs font-medium text-neutral-600">
                      Durasi Total: {driver.durasiTotal}
                    </span>
                  )}
                </div>
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
                {driver.data.map((item, dataIdx) => (
                  <div key={dataIdx} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-900">{item.detail}</span>
                      <span className="text-neutral-900">
                        {idrFormat(item.totalPrice)}
                      </span>
                    </div>
                    <div className="text-neutral-600">
                      {formatDate(item.startDate)} s/d{" "}
                      {formatDate(item.endDate)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="text-neutral-90 flex items-center justify-between pt-6 text-base font-bold">
            <span className="">Total</span>
            <span className="">{idrFormat(totalAmount)}</span>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
