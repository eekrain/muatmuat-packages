"use client";

import { useEffect, useState } from "react";

import { SlidersHorizontal } from "lucide-react";

import Button from "@/components/Button/Button";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import Checkbox from "@/components/Form/Checkbox";
import SelectFilterRadix from "@/components/Form/SelectFilterRadix";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";
import { useGetFilterOption } from "@/services/CS/monitoring/urgent-issue/getFilterOption";

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

// FIX 1: Menambahkan deklarasi fungsi komponen
export default function UrgentIssueFilter({
  onApplyFilter,
  filterCounts = {},
}) {
  // Ambil data filter dari mock
  const { data: filterData, isLoading: isFilterLoading } = useGetFilterOption();
  const [selectedTruckStatuses, setSelectedTruckStatuses] = useState([]);
  const [selectedOrderStatuses, setSelectedOrderStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rangeDateModal, setRangeDateModal] = useState(false);
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null);

  // Mapping from option IDs to API filter keys
  const countKeyMapping = {
    ON_DUTY: "OnDuty",
    WAITING_LOADING_TIME: "WaitingLoadingTime",
    READY_FOR_ORDER: "ReadyForOrder",
    INACTIVE: "inactive",
    NOT_PAIRED: "notPaired",
    NEEDS_RESPONSE: "needResponse",
  };

  // FIX 2: Definisikan variabel 'orderStatusOptionsWithCount' yang hilang
  const orderStatusOptionsWithCount = ORDER_STATUS_OPTIONS.map((opt) => ({
    ...opt,
    count: filterCounts[countKeyMapping[opt.id]] || 0,
  }));

  // Jenis laporan dari API
  const issueTypeOptions = (filterData?.issue_types || []).map((opt) => ({
    id: opt.type,
    label: opt.label,
    count: opt.count,
  }));
  const [selectedIssueTypes, setSelectedIssueTypes] = useState([]);

  const handleToggleIssueType = (id) => {
    setSelectedIssueTypes((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  // Transporter dari API
  const transporterOptions = (filterData?.transporters || []).map((tr) => ({
    label: tr.name,
    value: tr.id,
  }));

  // Periode dari API
  const apiPeriodOptions = (filterData?.historyPeriods || []).map((p) => ({
    name: `${p.startDate} - ${p.endDate}`,
    value: `${p.startDate}_${p.endDate}`,
    format: "custom",
    range: { start: p.startDate, end: p.endDate },
  }));

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

  // Transporter dropdown
  const [dynamicKecamatanOptions, setDynamicKecamatanOptions] = useState([]);
  const [selectedTransporter, setSelectedTransporter] = useState(null);

  useEffect(() => {
    setDynamicKecamatanOptions(transporterOptions);
  }, [filterData?.transporters]);

  // Gabungkan default dan API period
  const periodOptions = [
    {
      name: "Semua Periode (Default)",
      value: "",
      format: "day",
    },
    ...apiPeriodOptions,
  ];

  const handleSelectPeriod = (selectedOption) => {
    if (selectedOption?.range) {
      if (
        !recentPeriodOptions?.some((s) => s?.value === selectedOption?.value)
      ) {
        setRecentPeriodOptions((prev) => [...prev, selectedOption]);
      }
      setCurrentPeriodValue(selectedOption);
    } else if (selectedOption?.value === "") {
      setCurrentPeriodValue(selectedOption);
    } else if (selectedOption?.value !== undefined) {
      setCurrentPeriodValue(selectedOption);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-8 items-center gap-2 rounded-md border border-neutral-600 px-3 py-2 text-xs font-semibold text-neutral-600 transition-colors hover:border-primary-700 hover:bg-gray-50"
        >
          <SlidersHorizontal className="h-4 w-4 text-neutral-600" />
          Filter
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="relative w-[318px] rounded-xl bg-white p-5 shadow-lg"
        side="right"
        align="start"
        alignOffset={-4}
        sideOffset={12}
        style={{ border: "none" }}
      >
        <div className="flex flex-col gap-4">
          {/* Header */}
          <h3 className="text-base font-bold text-black">
            Filter Urgent Issue
          </h3>
          <PopoverClose>
            <IconComponent
              src="/icons/silang-primary.svg"
              width={16}
              height={16}
              className="absolute -top-1 right-[6px] text-primary-700 hover:cursor-pointer"
            />
          </PopoverClose>

          {/* Jenis Laporan dari API */}
          <div className="space-y-4">
            <p className="mb-3 text-xs font-semibold text-black">
              Jenis Laporan
            </p>
            {issueTypeOptions.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                <Checkbox
                  label=""
                  checked={selectedIssueTypes.includes(opt.id)}
                  onChange={() => handleToggleIssueType(opt.id)}
                />
                <span
                  className="cursor-pointer text-xs font-medium text-black"
                  onClick={() => handleToggleIssueType(opt.id)}
                >
                  {opt.label} ({opt.count})
                </span>
              </div>
            ))}
          </div>

          {/* Order Status Filter */}
          {orderStatusOptionsWithCount.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-semibold text-black">
                Transporter
              </p>
              <SelectFilterRadix
                options={dynamicKecamatanOptions}
                placeholder="Semua Transporter"
                value={selectedTransporter}
                onValueChange={(val) => setSelectedTransporter(val)}
              />
              {/* Tampilkan nama transporter yang dipilih */}
              {selectedTransporter && (
                <div className="mt-2 text-xs font-semibold text-primary-700">
                  {
                    dynamicKecamatanOptions.find(
                      (tr) => tr.value === selectedTransporter
                    )?.label
                  }
                </div>
              )}
            </div>
          )}

          {orderStatusOptionsWithCount.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-semibold text-black">
                Pilih Periode
              </p>
              <DropdownPeriode
                options={periodOptions}
                onSelect={handleSelectPeriod}
                recentSelections={recentPeriodOptions}
                value={currentPeriodValue}
                width="w-full"
              />
            </div>
          )}

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
