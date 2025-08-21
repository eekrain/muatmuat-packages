"use client";

import { useState } from "react";

import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";
import { useTranslation } from "@/hooks/use-translation";

// Truck Status Constants
export const TRUCK_STATUS = {
  ON_DUTY: "ON_DUTY",
  READY_FOR_ORDER: "READY_FOR_ORDER",
  NOT_PAIRED: "NOT_PAIRED",
  WAITING_LOADING_TIME: "WAITING_LOADING_TIME",
  INACTIVE: "INACTIVE",
};

export const LegendButton = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { t } = useTranslation();

  const truckStatuses = [
    {
      status: TRUCK_STATUS.ON_DUTY,
      image: "/img/monitoring/truck/blue.png",
      label: t("LegendButton.truckOnDuty", {}, "Bertugas"),
    },
    {
      status: TRUCK_STATUS.WAITING_LOADING_TIME,
      image: "/img/monitoring/truck/yellow.png",
      label: t("LegendButton.truckWaitingLoading", {}, "Akan Muat Hari Ini"),
    },
    {
      status: TRUCK_STATUS.READY_FOR_ORDER,
      image: "/img/monitoring/truck/green.png",
      label: t("LegendButton.truckReadyForOrder", {}, "Siap Menerima Order"),
    },
    {
      status: TRUCK_STATUS.INACTIVE,
      image: "/img/monitoring/truck/red.png",
      label: t("LegendButton.truckInactive", {}, "Nonaktif"),
    },
    {
      status: TRUCK_STATUS.NOT_PAIRED,
      image: "/img/monitoring/truck/gray.png",
      label: t("LegendButton.truckNotPaired", {}, "Belum Dipasang"),
    },
  ];

  const TriggerButton = (
    <button className="h-8 w-8 place-content-center rounded-xl bg-muat-trans-secondary-900 shadow-lg">
      <IconComponent
        src="/icons/monitoring/info.svg"
        className="mx-auto size-6"
      />
    </button>
  );

  // If popover is open, render popover without tooltip
  if (popoverOpen) {
    return (
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
        <PopoverContent
          side="left"
          align="start"
          sideOffset={16}
          className="relative flex flex-col items-start gap-4 rounded-xl border-0 bg-white shadow-lg"
          style={{
            zIndex: 9999,
            width: "440px",
            padding: "24px 0",
            border: "none",
          }}
        >
          {/* Arrow/pointer using CSS triangle */}
          <div
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderStyle: "solid",
              borderWidth: "12px 0 12px 12px",
              borderColor: "transparent transparent transparent white",
              right: "-10px",
              top: "5px",
            }}
          />
          {/* Close button positioned from card edges */}
          <button
            onClick={() => setPopoverOpen(false)}
            className="absolute text-primary-700 hover:text-primary-800"
            style={{ top: "8px", right: "8px" }}
          >
            <IconComponent src="/icons/close20.svg" className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="w-full px-6">
            <h3 className="text-base font-bold text-black">
              {t("LegendButton.title", {}, "Legenda Armada")}
            </h3>
          </div>

          {/* Status Truk Section */}
          <div className="flex w-full flex-col items-start gap-4 px-6">
            <h4 className="text-xs font-semibold text-black">
              {t("LegendButton.truckStatusSection", {}, "Status Truk")}
            </h4>
            <div className="grid w-full grid-cols-2 gap-3">
              {truckStatuses.slice(0, 4).map((status, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex h-[12px] w-[42px] items-center justify-center">
                    <img
                      src={status.image}
                      alt={status.label}
                      className="h-[42px] w-[12px] object-contain"
                      style={{ transform: "rotate(90deg)" }}
                    />
                  </div>
                  <span className="text-xs font-medium text-black">
                    {status.label}
                  </span>
                </div>
              ))}
            </div>
            {/* Last item spans full width */}
            <div className="flex items-center gap-2">
              <div className="flex h-[12px] w-[42px] items-center justify-center">
                <img
                  src={truckStatuses[4].image}
                  alt={truckStatuses[4].label}
                  className="h-[42px] w-[12px] object-contain"
                  style={{ transform: "rotate(90deg)" }}
                />
              </div>
              <span className="text-xs font-medium text-black">
                {truckStatuses[4].label}
              </span>
            </div>
          </div>

          {/* Status Pesanan Section */}
          <div className="flex w-full flex-col items-start gap-4 px-6">
            <h4 className="text-xs font-semibold text-black">
              {t("LegendButton.orderStatusSection", {}, "Status Pesanan")}
            </h4>
            <div className="flex w-full flex-row gap-4">
              <div className="flex flex-1 flex-row items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFF9C1] p-1">
                  <IconComponent
                    src="/icons/warning16.svg"
                    className="h-4 w-4"
                  />
                </div>
                <span className="text-xs font-medium text-black">
                  {t(
                    "LegendButton.orderNeedsResponse",
                    {},
                    "Perlu Respon Perubahan"
                  )}
                </span>
              </div>
              <div className="flex flex-1 flex-row items-center gap-2">
                <div className="flex items-center justify-center rounded-md bg-[#EE4343] px-2 py-1">
                  <span className="text-xs font-semibold text-[#FFE9ED]">
                    {t("LegendButton.sosLabel", {}, "SOS")}
                  </span>
                </div>
                <span className="text-xs font-medium text-black">
                  {t("LegendButton.sosReport", {}, "Laporan SOS")}
                </span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // If popover is closed, render button with tooltip
  return (
    <InfoTooltip
      trigger={
        <button
          className="h-8 w-8 place-content-center rounded-xl bg-muat-trans-secondary-900 shadow-lg"
          onClick={() => setPopoverOpen(true)}
        >
          <IconComponent
            src="/icons/monitoring/info.svg"
            className="mx-auto size-6"
          />
        </button>
      }
      side="left"
    >
      {t("LegendButton.tooltip", {}, "Legenda")}
    </InfoTooltip>
  );
};
