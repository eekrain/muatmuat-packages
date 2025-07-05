import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Alert } from "../Badge/Alert";
import { Modal, ModalContent, ModalTrigger } from "./Modal";

export const ModalDetailWaktuTunggu = ({
  driver = {
    name: "Daffa Toldo",
    detail: "Lokasi Muat 1 : 1 Jam 59 Menit",
    startDate: "22 Nov 2024 15:00 WIB",
    endDate: "22 Nov 2024 16:59 WIB",
    totalPrice: "Rp100.000",
  },
}) => {
  const [isDriverExpanded, setIsDriverExpanded] = useState(false);

  return (
    <Modal>
      <ModalTrigger>
        <button className="text-[12px] font-medium leading-[14.4px] text-primary-700">
          Lihat Detail Waktu Tunggu
        </button>
      </ModalTrigger>
      <ModalContent
        className="flex w-[578px] flex-col gap-y-4 p-6"
        type="muatmuat"
      >
        {/* Header */}
        <h2 className="text-center text-[16px] font-bold leading-[19.2px] text-neutral-900">
          Detail Waktu Tunggu
        </h2>

        <Alert variant="secondary" className="my-3 font-semibold">
          Free untuk 12 jam awal dan dikenakan biaya waktu tunggu lebih dari 12
          jam
        </Alert>

        {/* Driver Section */}
        <div className="space-y-6">
          <div className="w-full">
            {/* Driver Header */}
            <button
              type="button"
              className={
                "flex w-full cursor-pointer items-center justify-between"
              }
              onClick={() => setIsDriverExpanded(!isDriverExpanded)}
            >
              <h3 className="text-sm font-semibold text-neutral-900">
                Driver : {driver.name}
              </h3>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-neutral-500 transition-transform duration-200",
                  isDriverExpanded && "rotate-180"
                )}
              />
            </button>

            {/* Expandable Content */}
            <div
              className={cn(
                "flex flex-col gap-3 overflow-hidden transition-all duration-300 ease-in-out",
                isDriverExpanded
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
            </div>
          </div>

          <hr className="border-neutral-400" />
          <div className="flex items-center justify-between text-base font-bold text-neutral-900">
            <span className="">Total</span>
            <span className="">{driver.totalPrice}</span>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
