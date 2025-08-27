import { useState } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/BottomSheet/BottomSheetUp";
import IconComponent from "@/components/IconComponent/IconComponent";

import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";

const WaitingTimeBottomsheet = ({ waitingTimeData }) => {
  const { t } = useTranslation();
  const isSectionExpandable = waitingTimeData.length > 1;
  const [expandedDrivers, setExpandedDrivers] = useState({});
  // Calculate total from all drivers' data
  const totalAmount = useShallowMemo(
    () =>
      waitingTimeData
        .flatMap((item) => item.data)
        .reduce((sum, item) => sum + item.totalPrice, 0),
    [waitingTimeData]
  );

  // Fungsi untuk toggle expanded state
  const toggleExpanded = (driverId) => {
    setExpandedDrivers((prev) => ({
      ...prev,
      [driverId]: !prev[driverId],
    }));
  };
  return (
    <BottomSheet>
      <BottomSheetTrigger asChild>
        <button className="w-fit text-xs font-semibold leading-[1.1] text-primary-700">
          {t(
            "WaitingTimeBottomsheet.triggerViewDetails",
            {},
            "Lihat Detail Waktu Tunggu"
          )}{" "}
        </button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>
            {t(
              "WaitingTimeBottomsheet.titleDetails",
              {},
              "Detail Waktu Tunggu"
            )}
          </BottomSheetTitle>
        </BottomSheetHeader>
        <div className="flex flex-col gap-y-6 px-4 pb-6">
          <div className="flex h-[38px] items-center gap-x-2.5 rounded-md bg-warning-100 px-3">
            <div className="size-5">
              <IconComponent
                className="text-secondary-400"
                src="/icons/warning20.svg"
                width={20}
                height={20}
              />
            </div>
            <span className="text-xs font-medium text-neutral-900">
              {t(
                "WaitingTimeBottomsheet.textFreeFirst12Hours",
                {},
                "FREE untuk 12 jam awal dan dikenakan biaya waktu tunggu lebih dari 12 jam"
              )}
            </span>
          </div>
          <div className="flex flex-col gap-y-6">
            {waitingTimeData.map((item, key) => (
              <div
                className={cn(
                  "flex flex-col border-b border-b-neutral-400",
                  waitingTimeData.length - 1 === key ? "pb-6" : "pb-4",
                  expandedDrivers[key] || !isSectionExpandable
                    ? "gap-y-3"
                    : "gap-y-0"
                )}
                key={key}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-y-2">
                    <span className="text-sm font-semibold leading-[1.1] text-neutral-900">{`${t("WaitingTimeBottomsheet.labelDriver", {}, "Driver :")} ${item.name}`}</span>
                    {!expandedDrivers[key] && isSectionExpandable ? (
                      <span className="text-xs font-medium leading-[1.1] text-neutral-600">{`${t("WaitingTimeBottomsheet.labelTotalDuration", {}, "Durasi Total:")} ${item.totalWaitingTime}`}</span>
                    ) : null}
                  </div>
                  {isSectionExpandable ? (
                    <IconComponent
                      className={cn(
                        "text-neutral-700 transition-transform",
                        expandedDrivers[key] ? "rotate-180" : ""
                      )}
                      onClick={() => toggleExpanded(key)}
                      src="/icons/chevron-down.svg"
                    />
                  ) : null}
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedDrivers[key] || !isSectionExpandable
                      ? "max-h-screen opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex flex-col gap-y-4">
                    {item.data.map((child, index) => (
                      <div className="flex flex-col gap-y-2" key={index}>
                        <div className="flex items-center justify-between text-xs font-semibold leading-[1.1] text-neutral-900">
                          <span>{child.detail}</span>
                          <span>{idrFormat(child.totalPrice)}</span>
                        </div>
                        <span className="text-xs font-medium leading-[1.1] text-neutral-600">
                          {`${formatDate(child.startDate)} s/d ${formatDate(child.endDate)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm font-semibold leading-[1.1] text-neutral-900">
              <h4>{t("WaitingTimeBottomsheet.labelTotal", {}, "Total")}</h4>
              <span>{idrFormat(totalAmount)}</span>
            </div>
          </div>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default WaitingTimeBottomsheet;
