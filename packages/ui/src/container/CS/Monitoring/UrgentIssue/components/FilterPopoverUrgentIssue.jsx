"use client";

import { useCallback, useMemo, useState } from "react";

import { SlidersHorizontal } from "lucide-react";

// API & Service Imports
import { useGetFilterOption } from "@/services/CS/monitoring/urgent-issue/getFilterOption";

// Component Imports
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

// --- Constants ---
// NOTE: Definisikan atau import konstanta ini dari lokasi yang sesuai.
// Ini adalah placeholder berdasarkan variabel yang hilang di kode asli.
const ORDER_STATUS_OPTIONS = [];
const countKeyMapping = {};

const DEFAULT_PERIOD = {
  name: "Semua Periode (Default)",
  value: "",
  format: "day",
};

/**
 * Komponen filter untuk halaman Urgent Issue.
 * @param {object} props
 * @param {Function} props.onApplyFilter - Callback function yang dipanggil saat filter diterapkan.
 * @param {object} [props.filterCounts={}] - Object berisi jumlah untuk setiap status.
 */
export default function UrgentIssueFilter({
  onApplyFilter,
  filterCounts = {},
}) {
  const { data: filterData, isLoading: isFilterLoading } = useGetFilterOption();

  // --- State Management ---
  const [selectedIssueTypes, setSelectedIssueTypes] = useState([]);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [currentPeriodValue, setCurrentPeriodValue] = useState(DEFAULT_PERIOD);
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);

  // --- Memoized Data Transformation ---
  // Mencegah kalkulasi ulang pada setiap render jika data tidak berubah.

  const issueTypeOptions = useMemo(
    () =>
      (filterData?.issue_types || []).map((opt) => ({
        id: opt.type,
        label: opt.label,
        count: opt.count,
      })),
    [filterData?.issue_types]
  );

  const transporterOptions = useMemo(
    () =>
      (filterData?.transporters || []).map((tr) => ({
        label: tr.name,
        value: tr.id,
      })),
    [filterData?.transporters]
  );

  const periodOptions = useMemo(
    () => [
      DEFAULT_PERIOD,
      ...(filterData?.historyPeriods || []).map((p) => ({
        name: `${p.startDate} - ${p.endDate}`,
        value: `${p.startDate}_${p.endDate}`,
        format: "custom",
        range: { start: p.startDate, end: p.endDate },
      })),
    ],
    [filterData?.historyPeriods]
  );

  // NOTE: Placeholder untuk 'orderStatusOptionsWithCount' yang hilang di kode asli.
  // Jika tidak digunakan, ini bisa dihapus.
  const orderStatusOptionsWithCount = useMemo(
    () =>
      ORDER_STATUS_OPTIONS.map((opt) => ({
        ...opt,
        count: filterCounts[countKeyMapping[opt.id]] || 0,
      })),
    [filterCounts]
  );

  // --- Event Handlers ---
  // useCallback untuk menjaga referensi fungsi tetap stabil antar render.

  const handleToggleIssueType = useCallback((id) => {
    setSelectedIssueTypes((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }, []);

  const handleSelectPeriod = useCallback(
    (selectedOption) => {
      setCurrentPeriodValue(selectedOption);

      // Tambahkan ke 'recent selections' jika merupakan rentang tanggal custom
      if (
        selectedOption?.range &&
        !recentPeriodOptions?.some((opt) => opt.value === selectedOption.value)
      ) {
        setRecentPeriodOptions((prev) => [...prev, selectedOption]);
      }
    },
    [recentPeriodOptions]
  );

  const handleReset = useCallback(() => {
    setSelectedIssueTypes([]);
    setSelectedTransporter(null);
    setCurrentPeriodValue(DEFAULT_PERIOD);

    // Memanggil onApplyFilter dengan state yang sudah di-reset
    onApplyFilter?.({
      issueTypes: [],
      transporter: null,
      period: DEFAULT_PERIOD,
    });
  }, [onApplyFilter]);

  const handleApply = useCallback(() => {
    onApplyFilter?.({
      issueTypes: selectedIssueTypes,
      transporter: selectedTransporter,
      period: currentPeriodValue,
    });
  }, [
    onApplyFilter,
    selectedIssueTypes,
    selectedTransporter,
    currentPeriodValue,
  ]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-8 items-center gap-2 rounded-md border border-neutral-600 px-3 py-2 text-xs font-semibold text-neutral-600 transition-colors hover:border-primary-700 hover:bg-gray-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
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
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-black">
              Filter Urgent Issue
            </h3>
            <PopoverClose className="absolute -top-1 right-[6px] hover:cursor-pointer">
              <IconComponent
                src="/icons/silang-primary.svg"
                width={16}
                height={16}
              />
            </PopoverClose>
          </div>

          {/* Filter: Jenis Laporan */}
          {issueTypeOptions.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-black">Jenis Laporan</p>
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
          )}

          {/* Filter: Transporter */}
          {transporterOptions.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-semibold text-black">
                Transporter
              </p>
              <SelectFilterRadix
                options={transporterOptions}
                placeholder="Semua Transporter"
                value={selectedTransporter}
                onValueChange={setSelectedTransporter}
              />
            </div>
          )}

          {/* Filter: Periode */}
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
