import { memo, useCallback, useMemo, useState } from "react";

import Button from "@/components/Button/Button";
import NestedDropdown from "@/components/Dropdown/NestedDropdown";
import IconComponent from "@/components/IconComponent/IconComponent";

import { AgendaAutocomplete } from "../AgendaAutocomplete";
import { AgendaFilterPopover } from "../AgendaFilterPopover";
import { useAgendaNavigatorStore } from "./agendaNavigatorStore";
import { useDateNavigator } from "./use-date-navigator";

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

// Memoized Period Dropdown Component
const PeriodDropdown = memo(({ availableMonths, onMonthClick }) => {
  const availableYears = useMemo(() => {
    if (!availableMonths) return [];
    return Object.keys(availableMonths).sort(
      (a, b) => parseInt(b) - parseInt(a)
    );
  }, [availableMonths]);

  const getAvailableMonthsForYear = useCallback(
    (year) => {
      if (!availableMonths?.[year]) return [];
      return availableMonths[year].map((monthNum) => ({
        id: monthNum,
        label: months[monthNum - 1],
      }));
    },
    [availableMonths]
  );

  const handleMonthClick = useCallback(
    (year, monthNum) => {
      onMonthClick?.(parseInt(year), monthNum);
    },
    [onMonthClick]
  );

  if (!availableYears.length) {
    return (
      <div className="flex items-center gap-1 text-xs text-neutral-500">
        <IconComponent
          src="/icons/agenda/chevron-down.svg"
          width={12}
          height={12}
        />
        <span>Pilih Periode</span>
      </div>
    );
  }

  return (
    <NestedDropdown.Root>
      <NestedDropdown.Trigger>
        <div className="flex cursor-pointer items-center gap-1 text-xxs font-semibold text-primary-700 hover:text-primary-800">
          <IconComponent
            src="/icons/agenda/chevron-down.svg"
            width={12}
            height={12}
          />
          <span>Ubah Periode</span>
        </div>
      </NestedDropdown.Trigger>
      <NestedDropdown.Content>
        {availableYears.map((year) => (
          <NestedDropdown.Item
            key={year}
            subContent={
              <NestedDropdown.SubContent>
                {getAvailableMonthsForYear(year).map((month) => (
                  <NestedDropdown.SubItem
                    key={month.id}
                    onClick={() => handleMonthClick(year, month.id)}
                  >
                    {month.label}
                  </NestedDropdown.SubItem>
                ))}
              </NestedDropdown.SubContent>
            }
          >
            {year}
          </NestedDropdown.Item>
        ))}
      </NestedDropdown.Content>
    </NestedDropdown.Root>
  );
});

PeriodDropdown.displayName = "PeriodDropdown";

const statusFiltersData = [
  {
    id: "BERTUGAS",
    label: "Bertugas",
    count: 3,
    color: { className: "bg-[#176CF7]" },
  },
  {
    id: "MENUNGGU_JAM_MUAT",
    label: "Menunggu Jam Muat",
    count: 2,
    color: { className: "bg-[#FF7A00]" },
  },
  {
    id: "DIJADWALKAN",
    label: "Dijadwalkan",
    count: 2,
    color: { className: "bg-[#FF7A00]" },
  },
  {
    id: "PENGIRIMAN_SELESAI",
    label: "Pengiriman Selesai",
    count: 1,
    color: { className: "bg-[#F1F1F1] border border-[#C4C4C4]" },
  },
  {
    id: "NON_AKTIF",
    label: "Non Aktif",
    count: 5,
    color: { className: "bg-[#F8F8FB] border border-[#C4C4C4]" },
  },
];

const armadaFiltersData = [
  { id: "coltDieselEngkel", label: "Colt Diesel Engkel - Box", count: 5 },
  { id: "tronton", label: "Tronton - Box", count: 5 },
  {
    id: "coltDieselEngkelEngkel",
    label: "Colt Diesel Engkel - Engkel",
    count: 5,
  },
  { id: "pickup", label: "Pickup - Box", count: 5 },
  { id: "coltDieselDouble", label: "Colt Diesel Double - Box", count: 5 },
];

// Memoized Search Section Component
const SearchSection = memo(
  ({ _search, _onSearchChange, _filterAgendaStatus, onFilterChange }) => {
    // Store integration
    const { filterAgendaStatus, setFilterAgendaStatus } =
      useAgendaNavigatorStore();

    // Use the predefined status filters data instead of generating from STATUS_CODES
    const statusFilterOptions = statusFiltersData;

    // Check if any filters are active (not all enabled, which is the default state)
    const hasActiveFilters = useMemo(() => {
      if (!Array.isArray(filterAgendaStatus)) return false;

      // If no filters in store, it means all are enabled (default state)
      if (filterAgendaStatus.length === 0) return false;

      // If some but not all filters are selected, consider it as active filtering
      const totalStatusFilters = statusFilterOptions.length;
      return (
        filterAgendaStatus.length > 0 &&
        filterAgendaStatus.length < totalStatusFilters
      );
    }, [filterAgendaStatus, statusFilterOptions]);

    // Filter button style based on active filters
    const filterButtonClass = useMemo(() => {
      const baseClass =
        "flex h-8 w-[104px] items-center gap-2 rounded-md border bg-white p-3";
      const borderClass = hasActiveFilters
        ? "border-primary-700"
        : "border-[#7B7B7B]";
      return `${baseClass} ${borderClass}`;
    }, [hasActiveFilters]);

    const filterTextClass = useMemo(() => {
      return hasActiveFilters ? "text-primary-700" : "text-[#7B7B7B]";
    }, [hasActiveFilters]);

    // Convert filterAgendaStatus array to filter format expected by popover
    const filtersFromStore = useMemo(() => {
      const statusFilters = {};
      statusFilterOptions.forEach((option) => {
        // If no filters are set in store, default to all enabled
        // Otherwise, use the store value
        if (filterAgendaStatus.length === 0) {
          statusFilters[option.id] = true;
        } else {
          statusFilters[option.id] = filterAgendaStatus.includes(option.id);
        }
      });

      return {
        status: statusFilters,
        armada: {
          coltDieselEngkel: true,
          tronton: true,
          coltDieselEngkelEngkel: true,
          pickup: true,
          coltDieselDouble: true,
        },
      };
    }, [filterAgendaStatus, statusFilterOptions]);

    // Update filter state
    const [filters, setFilters] = useState(filtersFromStore);

    // Sync filters when store changes
    useMemo(() => {
      setFilters(filtersFromStore);
    }, [filtersFromStore]);

    const handleApplyFilters = useCallback(() => {
      // Extract active status filters and update store
      const activeStatusFilters = Object.entries(filters.status)
        .filter(([_, isActive]) => isActive)
        .map(([statusId]) => statusId);

      // If all status filters are selected, store empty array (default state)
      const totalStatusFilters = statusFilterOptions.length;
      const filtersToStore =
        activeStatusFilters.length === totalStatusFilters
          ? []
          : activeStatusFilters;

      setFilterAgendaStatus(filtersToStore);
      onFilterChange?.(filtersToStore);
    }, [
      filters.status,
      setFilterAgendaStatus,
      onFilterChange,
      statusFilterOptions,
    ]);

    const handleFiltersChange = useCallback((category, id) => {
      if (typeof category === "object") {
        // If category is the entire filters object (from reset)
        setFilters(category);
      } else {
        // If category and id are individual properties
        setFilters((prevFilters) => ({
          ...prevFilters,
          [category]: {
            ...prevFilters[category],
            [id]: !prevFilters[category][id],
          },
        }));
      }
    }, []);

    const handleSelect = (_item) => {
      // Selection is handled by the store integration
    };

    return (
      <div className="flex h-full items-center gap-3 p-3">
        <AgendaAutocomplete.Root
          useStoreSearch={true} // Enable store integration
          useApiSuggestions={true} // Enable API suggestions
          viewType="armada" // Search for vehicles and drivers
          limit={10} // Show up to 10 suggestions
          onSelect={handleSelect}
        >
          <AgendaAutocomplete.Trigger>
            <AgendaAutocomplete.Input placeholder="Cari No. Polisi atau Nama Driver" />
          </AgendaAutocomplete.Trigger>

          <AgendaAutocomplete.Popover>
            <AgendaAutocomplete.List>
              {(item, index) => (
                <AgendaAutocomplete.Item
                  key={
                    typeof item === "object" ? item.value || item.label : item
                  }
                  index={index}
                  item={item}
                />
              )}
            </AgendaAutocomplete.List>
          </AgendaAutocomplete.Popover>
        </AgendaAutocomplete.Root>

        <AgendaFilterPopover.Root
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={handleApplyFilters}
        >
          <AgendaFilterPopover.Trigger>
            {/* Filter button with conditional styling */}
            <button className={filterButtonClass}>
              <span
                className={`flex-grow text-left text-xs font-medium ${filterTextClass}`}
              >
                Filter
              </span>
              <IconComponent
                src="/icons/filter16.svg"
                className={`size-4 shrink-0 ${filterTextClass}`}
              />
            </button>
          </AgendaFilterPopover.Trigger>

          <AgendaFilterPopover.Content>
            <AgendaFilterPopover.CloseButton />

            <AgendaFilterPopover.Section title="Status">
              {statusFilterOptions.map((item) => (
                <AgendaFilterPopover.CheckboxItem
                  key={item.id}
                  {...item}
                  category="status"
                />
              ))}
            </AgendaFilterPopover.Section>

            <AgendaFilterPopover.Section title="Jenis Armada">
              {armadaFiltersData.map((item) => (
                <AgendaFilterPopover.CheckboxItem
                  key={item.id}
                  {...item}
                  category="armada"
                />
              ))}
            </AgendaFilterPopover.Section>

            <AgendaFilterPopover.Footer>
              <AgendaFilterPopover.ResetButton>
                Reset
              </AgendaFilterPopover.ResetButton>
              <AgendaFilterPopover.ApplyButton>
                Tampilkan
              </AgendaFilterPopover.ApplyButton>
            </AgendaFilterPopover.Footer>
          </AgendaFilterPopover.Content>
        </AgendaFilterPopover.Root>
      </div>
    );
  }
);

SearchSection.displayName = "SearchSection";

// Memoized Navigation Section Component
const NavigationSection = memo(
  ({
    displayMonthYear,
    prevMonth,
    nextMonth,
    canPrevMonth,
    canNextMonth,
    availableMonths,
    setMonth,
  }) => (
    <div className="absolute left-1/2 flex h-full flex-1 -translate-x-1/2 flex-col items-center justify-center gap-2 p-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous Month"
          className="flex h-5 w-5 items-center justify-center rounded hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={prevMonth}
          disabled={!canPrevMonth}
        >
          <IconComponent
            src="/icons/agenda/chevron-left-rounded.svg"
            width={7}
            height={12}
            className="text-neutral-900"
          />
        </button>
        <h2 className="text-center text-lg font-semibold text-neutral-900">
          {displayMonthYear}
        </h2>
        <button
          type="button"
          aria-label="Next Month"
          className="flex h-5 w-5 items-center justify-center rounded hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={nextMonth}
          disabled={!canNextMonth}
        >
          <IconComponent
            src="/icons/agenda/chevron-right-rounded.svg"
            width={7}
            height={12}
            className="text-neutral-900"
          />
        </button>
      </div>
      <PeriodDropdown
        availableMonths={availableMonths}
        onMonthClick={setMonth}
      />
    </div>
  )
);

NavigationSection.displayName = "NavigationSection";

// Memoized Today Button Component
const TodayButton = memo(({ setDate, todayDate, isTodayNotInView }) => {
  return (
    <div className="flex h-full w-[415px] items-center justify-end p-3">
      <Button
        className="text-xxs md:h-7"
        disabled={!isTodayNotInView}
        onClick={() => setDate(todayDate)}
        variant="muatparts-primary"
      >
        Kembali Ke Hari Ini
      </Button>
    </div>
  );
});

TodayButton.displayName = "TodayButton";

// Main Component
export const CalendarHeader1 = memo(
  ({
    search,
    onSearchChange,
    _filterAgendaStatus,
    onFilterChange,
    availablePeriods,
  }) => {
    const {
      displayMonthYear,
      prevMonth,
      nextMonth,
      canPrevMonth,
      canNextMonth,
      setDate,
      setMonth,
      todayDate,
      isTodayNotInView,
    } = useDateNavigator();

    return (
      <div className="relative flex h-[56px] w-full justify-between border-b">
        <SearchSection
          search={search}
          onSearchChange={onSearchChange}
          _filterAgendaStatus={_filterAgendaStatus}
          onFilterChange={onFilterChange}
        />
        <NavigationSection
          displayMonthYear={displayMonthYear}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
          canPrevMonth={canPrevMonth}
          canNextMonth={canNextMonth}
          availableMonths={availablePeriods?.availableMonths}
          setMonth={setMonth}
        />
        <div className="flex h-full items-center justify-end p-3">
          <Button
            className="text-xxs md:h-7"
            disabled={!isTodayNotInView}
            onClick={() => setDate(todayDate)}
            variant="muatparts-primary"
          >
            Kembali Ke Hari Ini
          </Button>
        </div>
      </div>
    );
  }
);

CalendarHeader1.displayName = "CalendarHeader1";
