import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";
import { useTranslation } from "@/hooks/use-translation";

// ...existing code...

export const FilterPopover = ({
  onApplyFilter,
  fleetCounts = {},
  activeFilters = { truck: [], order: [] },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTruckStatuses, setSelectedTruckStatuses] = useState(
    activeFilters.truck
  );
  const [selectedOrderStatuses, setSelectedOrderStatuses] = useState(
    activeFilters.order
  );
  const { t } = useTranslation();

  // Truck status options with translation
  const TRUCK_STATUS_OPTIONS = [
    {
      id: "ON_DUTY",
      label: t("FilterPopover.truckOnDuty", {}, "Bertugas"),
      icon: "/img/monitoring/truck/blue.png",
      count: 3,
    },
    {
      id: "WAITING_LOADING_TIME",
      label: t("FilterPopover.truckWaitingLoading", {}, "Akan Muat Hari Ini"),
      icon: "/img/monitoring/truck/yellow.png",
      count: 5,
    },
    {
      id: "READY_FOR_ORDER",
      label: t("FilterPopover.truckReadyForOrder", {}, "Siap Menerima Order"),
      icon: "/img/monitoring/truck/green.png",
      count: 4,
    },
    {
      id: "INACTIVE",
      label: t("FilterPopover.truckInactive", {}, "Nonaktif"),
      icon: "/img/monitoring/truck/red.png",
      count: 1,
    },
    {
      id: "NOT_PAIRED",
      label: t("FilterPopover.truckNotPaired", {}, "Belum Dipasangkan"),
      icon: "/img/monitoring/truck/gray.png",
      count: 1,
    },
  ];

  const ORDER_STATUS_OPTIONS = [
    {
      id: "NEEDS_RESPONSE",
      label: t(
        "FilterPopover.orderNeedsResponse",
        {},
        "Perlu Respon Perubahan"
      ),
      icon: "warning",
      count: 1,
    },
  ];

  // Sync with parent state when activeFilters change
  useEffect(() => {
    setSelectedTruckStatuses(activeFilters.truck);
    setSelectedOrderStatuses(activeFilters.order);
  }, [activeFilters]);

  // Update counts from actual fleet data
  const truckStatusOptions = TRUCK_STATUS_OPTIONS.map((option) => ({
    ...option,
    count: fleetCounts[option.id] || 0,
  }));

  const handleTruckStatusToggle = (statusId) => {
    setSelectedTruckStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  const handleOrderStatusToggle = (statusId) => {
    setSelectedOrderStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  const handleReset = () => {
    setSelectedTruckStatuses([]);
    setSelectedOrderStatuses([]);
    onApplyFilter?.([], []);
  };

  const handleApply = () => {
    onApplyFilter?.(selectedTruckStatuses, selectedOrderStatuses);
    setIsOpen(false);
  };

  // Calculate total active filters for display (from parent state, not local state)
  const totalActiveFilters =
    activeFilters.truck.length + activeFilters.order.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="muattrans-primary-secondary"
          iconLeft={
            <IconComponent
              src="/icons/monitoring/filter.svg"
              className="size-4"
            />
          }
        >
          {t("FilterPopover.filterButton", {}, "Filter")}{" "}
          {totalActiveFilters > 0 && `(${totalActiveFilters})`}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="relative w-[500px] rounded-xl border-0 bg-white p-0 shadow-lg"
        align="center"
        sideOffset={16}
        style={{ border: "none" }}
      >
        {/* Arrow/triangle pointing upward */}
        <div
          className="absolute"
          style={{
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "0 12px 12px 12px",
            borderColor: "transparent transparent white transparent",
            top: "-12px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-start px-6 py-4">
            <h3 className="text-base font-bold text-black">
              {t("FilterPopover.title", {}, "Filter Armada")}
            </h3>
          </div>

          {/* Truck Status Section */}
          <div className="flex flex-col gap-4 px-6 pb-4">
            <div className="text-xs font-semibold text-black">
              {t("FilterPopover.truckStatusSection", {}, "Status Truk")}
            </div>

            {/* Two column layout for truck statuses */}
            <div className="grid grid-cols-2 gap-3">
              {truckStatusOptions.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedTruckStatuses.includes(option.id)}
                    onChange={() => handleTruckStatusToggle(option.id)}
                    value={option.id}
                    label=""
                    className="gap-0"
                  />
                  <div
                    className="flex h-[12px] w-[42px] cursor-pointer items-center justify-center"
                    onClick={() => handleTruckStatusToggle(option.id)}
                  >
                    <img
                      src={option.icon}
                      alt={option.label}
                      className="h-[42px] w-[12px] object-contain"
                      style={{ transform: "rotate(90deg)" }}
                    />
                  </div>
                  <span
                    className="flex-1 cursor-pointer text-xs font-medium text-black"
                    onClick={() => handleTruckStatusToggle(option.id)}
                  >
                    {option.label} ({option.count})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status Section */}
          <div className="flex flex-col gap-4 px-6 pb-5">
            <div className="text-xs font-semibold text-black">
              {t("FilterPopover.orderStatusSection", {}, "Status Pesanan")}
            </div>

            <div className="flex flex-col gap-3">
              {ORDER_STATUS_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedOrderStatuses.includes(option.id)}
                    onChange={() => handleOrderStatusToggle(option.id)}
                    value={option.id}
                    label=""
                    className="gap-0"
                  />
                  {option.icon === "warning" && (
                    <div
                      className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-yellow-100"
                      onClick={() => handleOrderStatusToggle(option.id)}
                    >
                      <IconComponent
                        src="/icons/warning16.svg"
                        className="h-4 w-4 text-orange-500"
                      />
                    </div>
                  )}
                  <span
                    className="cursor-pointer text-xs font-medium text-black"
                    onClick={() => handleOrderStatusToggle(option.id)}
                  >
                    {option.label} ({option.count})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-300 px-6 py-5">
            <Button
              variant="muattrans-primary-secondary"
              size="small"
              onClick={handleReset}
              className="min-w-[112px]"
            >
              {t("FilterPopover.resetButton", {}, "Reset")}
            </Button>
            <Button
              variant="muattrans-primary"
              size="small"
              onClick={handleApply}
              className="min-w-[115px]"
            >
              {t("FilterPopover.applyButton", {}, "Tampilkan")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
