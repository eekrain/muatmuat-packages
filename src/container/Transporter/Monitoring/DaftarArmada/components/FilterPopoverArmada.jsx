"use client";

import { useState } from "react";

import { SlidersHorizontal } from "lucide-react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";

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

export default function FilterPopoverArmada({ onApplyFilter }) {
  const [selectedTruckStatuses, setSelectedTruckStatuses] = useState([]);
  const [selectedOrderStatuses, setSelectedOrderStatuses] = useState([]);

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
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:border-primary-700 hover:bg-gray-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[420px] rounded-xl border border-gray-200 bg-white p-5 shadow-lg"
        side="right"
        align="start"
        sideOffset={12}
      >
        <div className="flex flex-col gap-4">
          {/* Header */}
          <h3 className="text-base font-bold text-black">Filter Armada</h3>

          {/* Truck Status Filter */}
          <div>
            <p className="mb-3 text-xs font-semibold text-black">Status Truk</p>
            <div className="grid grid-cols-2 gap-3">
              {TRUCK_STATUS_OPTIONS.map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedTruckStatuses.includes(opt.id)}
                    onChange={() => toggleTruckStatus(opt.id)}
                    value={opt.id}
                    label=""
                  />
                  <img
                    src={opt.icon}
                    alt={opt.label}
                    className="h-5 w-5 object-contain"
                  />
                  <span
                    className="cursor-pointer text-xs text-black"
                    onClick={() => toggleTruckStatus(opt.id)}
                  >
                    {opt.label}
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
              {ORDER_STATUS_OPTIONS.map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedOrderStatuses.includes(opt.id)}
                    onChange={() => toggleOrderStatus(opt.id)}
                    value={opt.id}
                    label=""
                  />
                  {opt.icon === "warning" && (
                    <IconComponent
                      src="/icons/warning16.svg"
                      className="h-4 w-4 text-orange-500"
                    />
                  )}
                  <span
                    className="cursor-pointer text-xs text-black"
                    onClick={() => toggleOrderStatus(opt.id)}
                  >
                    {opt.label}
                  </span>
                </div>
              ))}
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
