"use client";

import { useEffect, useState } from "react";

import { SlidersHorizontal } from "lucide-react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";

// --- (TRUCK_STATUS_OPTIONS dan ORDER_STATUS_OPTIONS tetap sama) ---
const TRUCK_STATUS_OPTIONS = [
  {
    id: "ON_DUTY",
    label: "Bertugas",
    icon: "/img/monitoring/truck/blue.png",
  },
  {
    id: "WAITING_LOADING_TIME",
    label: "Akan Muat Hari Ini",
    icon: "/img/monitoring/truck/yellow.png",
  },
  {
    id: "READY_FOR_ORDER",
    label: "Siap Menerima Order",
    icon: "/img/monitoring/truck/green.png",
  },
  {
    id: "INACTIVE",
    label: "Nonaktif",
    icon: "/img/monitoring/truck/red.png",
  },
  {
    id: "NOT_PAIRED",
    label: "Belum Dipasangkan",
    icon: "/img/monitoring/truck/gray.png",
  },
];

const ORDER_STATUS_OPTIONS = [
  {
    id: "NEEDS_RESPONSE",
    label: "Perlu Respon Perubahan",
    icon: "warning",
  },
];

export default function FilterPopoverArmada({
  onApplyFilter,
  filterCounts = {},
  isPopoverOpen,
  onOpenChange,
  isFilterActive,
  currentTruckFilters = [],
  currentOrderFilters = [],
}) {
  const [selectedTruckStatuses, setSelectedTruckStatuses] =
    useState(currentTruckFilters);
  const [selectedOrderStatuses, setSelectedOrderStatuses] =
    useState(currentOrderFilters);

  // Sync with parent state when props change
  useEffect(() => {
    setSelectedTruckStatuses(currentTruckFilters);
    setSelectedOrderStatuses(currentOrderFilters);
  }, [currentTruckFilters, currentOrderFilters]);

  // Mapping dari frontend filter ID ke API filter key yang sesuai dengan getFleetList.js
  const countKeyMapping = {
    ON_DUTY: "OnDuty",
    WAITING_LOADING_TIME: "WaitingLoadingTime",
    READY_FOR_ORDER: "ReadyForOrder",
    INACTIVE: "inactive",
    NOT_PAIRED: "notPaired",
    NEEDS_RESPONSE: "needResponse",
  };

  console.log("FilterPopoverArmada received filterCounts:", filterCounts); // Debug log
  console.log("FilterPopoverArmada countKeyMapping:", countKeyMapping); // Debug log

  const truckStatusOptionsWithCount = TRUCK_STATUS_OPTIONS.map((opt) => {
    const count = filterCounts[countKeyMapping[opt.id]] ?? 0;
    console.log(
      `Truck status ${opt.id} mapped to ${countKeyMapping[opt.id]} with count: ${count}`
    ); // Debug log
    return {
      ...opt,
      count: count,
    };
  });

  // Get count directly from filter data for order status
  const orderStatusCount = filterCounts.needResponse ?? 0;
  console.log("Order status count (needResponse):", orderStatusCount); // Debug log

  const toggleTruckStatus = (id) => {
    setSelectedTruckStatuses((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleOrderStatus = (id) => {
    setSelectedOrderStatuses((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setSelectedTruckStatuses([]);
    setSelectedOrderStatuses([]);
    onApplyFilter?.([], []);
  };

  const handleApply = () => {
    onApplyFilter?.(selectedTruckStatuses, selectedOrderStatuses);
  };

  return (
    // PERUBAHAN: Jadikan Popover sebagai controlled component
    <Popover open={isPopoverOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex h-8 items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition-colors hover:border-primary-700 hover:bg-gray-50 ${
            isFilterActive
              ? "border-primary-700 text-primary-700" // Style saat aktif
              : "border-neutral-600 text-neutral-600" // Style default
          }`}
        >
          <SlidersHorizontal
            className={`h-4 w-4 ${isFilterActive ? "text-primary-700" : "text-neutral-600"}`}
          />
          Filter
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="relative w-[500px] rounded-xl border-0 bg-white p-5 shadow-lg"
        side="right"
        align="start"
        alignOffset={-4}
        sideOffset={12}
        style={{ border: "none" }}
      >
        {/* Konten popover lainnya tetap sama... */}
        {/* ... */}
        <div
          className="absolute"
          style={{
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "8px 10px 8px 0",
            borderColor: "transparent white transparent transparent",
            left: "-9px",
            top: "12px",
            filter: "drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.1))",
          }}
        />
        <div className="flex flex-col gap-4">
          {/* Header */}
          <h3 className="text-base font-bold text-black">Filter Armada</h3>

          {/* Truck Status Filter */}
          <div>
            <p className="mb-3 text-xs font-semibold text-black">Status Truk</p>
            <div className="grid grid-cols-2 gap-3">
              {truckStatusOptionsWithCount.map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedTruckStatuses.includes(opt.id)}
                    onChange={() => toggleTruckStatus(opt.id)}
                    value={opt.id}
                    label=""
                  />
                  <div
                    className="flex h-[12px] w-[42px] cursor-pointer items-center justify-center"
                    onClick={() => toggleTruckStatus(opt.id)}
                  >
                    <img
                      src={opt.icon}
                      alt={opt.label}
                      className="h-[42px] w-[12px] object-contain"
                      style={{ transform: "rotate(90deg)" }}
                    />
                  </div>
                  <span
                    className="cursor-pointer text-xs font-medium text-black"
                    onClick={() => toggleTruckStatus(opt.id)}
                  >
                    {opt.label} ({opt.count})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status Filter */}
          <div>
            <p className="mb-3 text-xs font-semibold text-black">
              Status Pesanan
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedOrderStatuses.includes("NEEDS_RESPONSE")}
                  onChange={() => toggleOrderStatus("NEEDS_RESPONSE")}
                  value="NEEDS_RESPONSE"
                  label=""
                />
                <IconComponent
                  src="/icons/warning16.svg"
                  className="h-4 w-4 text-orange-500"
                />
                <span
                  className="cursor-pointer text-xs font-medium text-black"
                  onClick={() => toggleOrderStatus("NEEDS_RESPONSE")}
                >
                  Perlu Respon Perubahan ({orderStatusCount})
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 border-t border-gray-200 pt-4">
            <Button
              size="small"
              variant="muattrans-primary-secondary"
              onClick={handleReset}
              className="min-w-[100px]"
            >
              Reset
            </Button>
            <Button
              size="small"
              variant="muattrans-primary"
              onClick={handleApply}
              className="min-w-[100px]"
            >
              Terapkan
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
