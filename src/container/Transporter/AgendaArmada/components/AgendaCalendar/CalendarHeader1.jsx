import { memo, useCallback, useEffect, useMemo, useState } from "react";

import Button from "@/components/Button/Button";
import MyDropdown from "@/components/Dropdown/MyDropdown";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { useGetAgendaFilterOptions } from "@/services/Transporter/agenda-armada-driver/getAgendaFilterOptions";

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
  const { t } = useTranslation();
  const { viewType, availablePeriods, isLoadingPeriods } =
    useAgendaNavigatorStore();

  // Use store data if available, otherwise fallback to props
  const actualAvailableMonths = useMemo(() => {
    if (availablePeriods?.availableMonths) {
      return availablePeriods.availableMonths;
    }
    return availableMonths;
  }, [availablePeriods?.availableMonths, availableMonths]);

  const availableYears = useMemo(() => {
    if (!actualAvailableMonths) return [];
    return Object.keys(actualAvailableMonths).sort(
      (a, b) => parseInt(b) - parseInt(a)
    );
  }, [actualAvailableMonths]);

  const getAvailableMonthsForYear = useCallback(
    (year) => {
      const temp = actualAvailableMonths?.[year];
      console.log("🚀 ~ Available months for year", year, ":", temp);
      if (!temp) return [];
      return temp.map((monthNum) => ({
        id: monthNum,
        label: months[monthNum - 1],
      }));
    },
    [actualAvailableMonths]
  );

  const handleMonthClick = useCallback(
    (year, monthNum) => {
      onMonthClick?.(parseInt(year), monthNum);
    },
    [onMonthClick]
  );

  if (isLoadingPeriods) {
    return (
      <div className="flex items-center gap-1 text-xs text-neutral-500">
        <IconComponent
          src="/icons/agenda/chevron-down.svg"
          width={12}
          height={12}
        />
        <span>
          {t("CalendarHeader1.labelMemuatPeriode", {}, "Memuat Periode...")}
        </span>
      </div>
    );
  }

  if (!availableYears.length) {
    return (
      <div className="flex items-center gap-1 text-xs text-neutral-500">
        <IconComponent
          src="/icons/agenda/chevron-down.svg"
          width={12}
          height={12}
        />
        <span>
          {t("CalendarHeader1.labelPilihPeriode", {}, "Pilih Periode")}
        </span>
      </div>
    );
  }

  return (
    <MyDropdown.Root>
      <MyDropdown.Trigger asChild>
        <button className="flex cursor-pointer items-center gap-1 text-xxs font-semibold text-primary-700 hover:text-primary-800">
          {t("CalendarHeader1.labelUbahPeriode", {}, "Ubah Periode")}
        </button>
      </MyDropdown.Trigger>
      <MyDropdown.Content>
        {availableYears.map((year) => (
          <MyDropdown.HoverRoot key={year} title={year}>
            <MyDropdown.HoverContent>
              {getAvailableMonthsForYear(year).map((month) => (
                <MyDropdown.HoverItem
                  key={month.id}
                  onClick={() => handleMonthClick(year, month.id)}
                >
                  {month.label}
                </MyDropdown.HoverItem>
              ))}
            </MyDropdown.HoverContent>
          </MyDropdown.HoverRoot>
        ))}
      </MyDropdown.Content>
    </MyDropdown.Root>
  );
});

PeriodDropdown.displayName = "PeriodDropdown";

const getStatusFiltersData = (t) => [
  {
    id: "BERTUGAS",
    label: t("CalendarHeader1.statusBertugas", {}, "Bertugas"),
    count: 3,
    color: { className: "bg-[#176CF7]" },
  },
  {
    id: "MENUNGGU_JAM_MUAT",
    label: t(
      "CalendarHeader1.statusMenungguJamMuat",
      {},
      "Menunggu Jam Muat & Dijadwalkan"
    ),
    count: 2,
    color: { className: "bg-[#FF7A00]" },
  },
  {
    id: "SOS",
    label: t("CalendarHeader1.statusSOS", {}, "Urgent Issue & SOS (1)"),
    count: 2,
    color: { className: "bg-error-400" },
  },
  {
    id: "PENGIRIMAN_SELESAI",
    label: t(
      "CalendarHeader1.statusPengirimanSelesai",
      {},
      "Pengiriman Selesai"
    ),
    count: 1,
    color: { className: "bg-[#F1F1F1] border border-[#C4C4C4]" },
  },
  {
    id: "NON_AKTIF",
    label: t("CalendarHeader1.statusNonAktif", {}, "Non Aktif"),
    count: 5,
    color: { className: "bg-[#F8F8FB] border border-[#C4C4C4]" },
  },
];

const getArmadaFiltersData = (t) => [
  {
    id: "cdd-box",
    label: t("CalendarHeader1.armadaCddBox", {}, "CDD - box"),
    count: 2,
  },
  {
    id: "tronton-box",
    label: t("CalendarHeader1.armadaTrontonBox", {}, "Tronton - Box"),
    count: 2,
  },
  {
    id: "pickup-box",
    label: t("CalendarHeader1.armadaPickupBox", {}, "Pickup - Box"),
    count: 2,
  },
  {
    id: "colt-diesel-double-box",
    label: t(
      "CalendarHeader1.armadaColtDieselDoubleBox",
      {},
      "Colt Diesel Double - Box"
    ),
    count: 2,
  },
  {
    id: "colt-diesel-engkel-engkel",
    label: t(
      "CalendarHeader1.armadaColtDieselEngkelEngkel",
      {},
      "Colt Diesel Engkel - Engkel"
    ),
    count: 1,
  },
];

// Memoized Search Section Component
const SearchSection = memo(
  ({ _search, _onSearchChange, _filterAgendaStatus, onFilterChange }) => {
    const { t } = useTranslation();
    const { viewType } = useAgendaNavigatorStore();
    // Store integration
    const { filterAgendaStatus, setFilterAgendaStatus } =
      useAgendaNavigatorStore();

    // Get filter options from API
    const { data: filterOptionsData, isLoading: isLoadingFilterOptions } =
      useGetAgendaFilterOptions(viewType);

    // Transform API data to match component expectations
    const statusFilterOptions = useMemo(() => {
      if (!filterOptionsData?.statusOptions) {
        return getStatusFiltersData(t); // Fallback to static data
      }

      return filterOptionsData.statusOptions.map((option) => ({
        id: option.value,
        label: option.label,
        count: option.count,
        color: {
          className: `bg-[${option.color}] border border-gray-300`,
        },
      }));
    }, [filterOptionsData?.statusOptions, t, viewType]);

    const armadaFilterOptions = useMemo(() => {
      if (!filterOptionsData?.truckTypeOptions) {
        return getArmadaFiltersData(t); // Fallback to static data
      }

      return filterOptionsData.truckTypeOptions.map((option) => ({
        id: option.id,
        label: option.name,
        count: option.count,
      }));
    }, [filterOptionsData?.truckTypeOptions, t, viewType]);

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
    }, [filterAgendaStatus, statusFilterOptions, viewType]);

    // Filter button style based on active filters
    const filterButtonClass = useMemo(() => {
      const baseClass =
        "flex h-8 w-[104px] items-center gap-2 rounded-md border bg-white p-3";
      const borderClass = hasActiveFilters
        ? "border-primary-700"
        : "border-[#7B7B7B]";
      return `${baseClass} ${borderClass}`;
    }, [hasActiveFilters, viewType]);

    const filterTextClass = useMemo(() => {
      return hasActiveFilters ? "text-primary-700" : "text-[#7B7B7B]";
    }, [hasActiveFilters, viewType]);

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

      // Create dynamic armada filters based on API data
      const armadaFilters = {};
      if (viewType === "armada" && armadaFilterOptions.length > 0) {
        armadaFilterOptions.forEach((option) => {
          armadaFilters[option.id] = true; // Default to all enabled
        });
      }

      return {
        status: statusFilters,
        ...(viewType === "armada" && Object.keys(armadaFilters).length > 0
          ? { armada: armadaFilters }
          : {}),
      };
    }, [
      filterAgendaStatus,
      statusFilterOptions,
      viewType,
      armadaFilterOptions,
    ]);

    // Update filter state
    const [filters, setFilters] = useState(filtersFromStore);

    // Sync filters when store changes
    useEffect(() => {
      setFilters(filtersFromStore);
    }, [filtersFromStore, viewType]);

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
      viewType,
    ]);

    const handleFiltersChange = useCallback(
      (category, id) => {
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
      },
      [viewType]
    );

    const handleSelect = useCallback(
      (_item) => {
        // Selection is handled by the store integration
      },
      [viewType]
    );

    return (
      <div className="flex h-full items-center gap-3 p-3">
        <AgendaAutocomplete.Root
          useStoreSearch={true} // Enable store integration
          useApiSuggestions={true} // Enable API suggestions
          viewType={viewType} // Search for vehicles and drivers
          limit={10} // Show up to 10 suggestions
          onSelect={handleSelect}
        >
          <AgendaAutocomplete.Trigger>
            <AgendaAutocomplete.Input
              placeholder={t(
                "CalendarHeader1.placeholderCariNoPolisiDriver",
                {},
                "Cari No. Polisi atau Nama Driver"
              )}
            />
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
          key={viewType} // Force re-render when viewType changes
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={handleApplyFilters}
        >
          <AgendaFilterPopover.Trigger key={`${viewType}-trigger`}>
            {/* Filter button with conditional styling */}
            <button className={filterButtonClass}>
              <span
                className={`flex-grow text-left text-xs font-medium ${filterTextClass}`}
              >
                {t("CalendarHeader1.buttonFilter", {}, "Filter")}
              </span>
              <IconComponent
                src="/icons/filter16.svg"
                className={`size-4 shrink-0 ${filterTextClass}`}
              />
            </button>
          </AgendaFilterPopover.Trigger>

          <AgendaFilterPopover.Content>
            <AgendaFilterPopover.CloseButton key={`${viewType}-close`} />

            {isLoadingFilterOptions ? (
              <div
                key={`${viewType}-loading`}
                className="flex items-center justify-center py-8"
              >
                <div className="flex flex-col items-center gap-2">
                  <img
                    src="/img/loading-animation.webp"
                    width={40}
                    height={40}
                    alt={t("CalendarHeader1.altLoading", {}, "loading")}
                  />
                  <div className="text-xs text-gray-600">
                    {t(
                      "CalendarHeader1.labelMemuatFilter",
                      {},
                      "Memuat filter..."
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div key={`${viewType}-content-wrapper`}>
                <AgendaFilterPopover.Section
                  key={`${viewType}-status-section`}
                  title={t("CalendarHeader1.sectionTitleStatus", {}, "Status")}
                >
                  {statusFilterOptions.map((item) => (
                    <AgendaFilterPopover.CheckboxItem
                      key={`${viewType}-${item.id}`}
                      {...item}
                      category="status"
                    />
                  ))}
                </AgendaFilterPopover.Section>

                {viewType === "armada" && (
                  <AgendaFilterPopover.Section
                    key={`${viewType}-armada-section`}
                    title={t(
                      "CalendarHeader1.sectionTitleJenisArmada",
                      {},
                      "Jenis Armada"
                    )}
                  >
                    {armadaFilterOptions.map((item) => (
                      <AgendaFilterPopover.CheckboxItem
                        key={`${viewType}-${item.id}`}
                        {...item}
                        category="armada"
                      />
                    ))}
                  </AgendaFilterPopover.Section>
                )}
              </div>
            )}

            {!isLoadingFilterOptions && (
              <AgendaFilterPopover.Footer key={`${viewType}-footer`}>
                <AgendaFilterPopover.ResetButton>
                  {t("CalendarHeader1.buttonReset", {}, "Reset")}
                </AgendaFilterPopover.ResetButton>
                <AgendaFilterPopover.ApplyButton>
                  {t("CalendarHeader1.buttonTampilkan", {}, "Tampilkan")}
                </AgendaFilterPopover.ApplyButton>
              </AgendaFilterPopover.Footer>
            )}
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
  }) => {
    const { t } = useTranslation();

    return (
      <div className="absolute left-1/2 flex h-full flex-1 -translate-x-1/2 flex-col items-center justify-center gap-2 p-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={t(
              "CalendarHeader1.ariaLabelPreviousMonth",
              {},
              "Previous Month"
            )}
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
            aria-label={t(
              "CalendarHeader1.ariaLabelNextMonth",
              {},
              "Next Month"
            )}
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
    );
  }
);

NavigationSection.displayName = "NavigationSection";

// Memoized Today Button Component
const TodayButton = memo(({ setDate, todayDate, isTodayNotInView }) => {
  const { t } = useTranslation();

  return (
    <div className="flex h-full w-[415px] items-center justify-end p-3">
      <Button
        className="text-xxs md:h-7"
        disabled={!isTodayNotInView}
        onClick={() => setDate(todayDate)}
        variant="muatparts-primary"
      >
        {t("CalendarHeader1.buttonKembaliKeHariIni", {}, "Kembali Ke Hari Ini")}
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
    const { t } = useTranslation();
    const { viewType, availablePeriods: storeAvailablePeriods } =
      useAgendaNavigatorStore();
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

    // Use store data if available, otherwise fallback to props
    const actualAvailablePeriods = useMemo(() => {
      if (storeAvailablePeriods) {
        return storeAvailablePeriods;
      }
      return availablePeriods;
    }, [storeAvailablePeriods, availablePeriods]);

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
          availableMonths={actualAvailablePeriods?.availableMonths}
          setMonth={setMonth}
        />
        <div className="flex h-full items-center justify-end p-3">
          <Button
            className="text-xxs md:h-7"
            disabled={!isTodayNotInView}
            onClick={() => setDate(todayDate)}
            variant="muatparts-primary"
          >
            {t(
              "CalendarHeader1.buttonKembaliKeHariIni",
              {},
              "Kembali Ke Hari Ini"
            )}
          </Button>
        </div>
      </div>
    );
  }
);

CalendarHeader1.displayName = "CalendarHeader1";
