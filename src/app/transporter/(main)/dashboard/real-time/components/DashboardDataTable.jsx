"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { X } from "lucide-react";

import ActiveFiltersBar from "@/components/ActiveFiltersBar/ActiveFiltersBar";
import Button from "@/components/Button/Button";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import DisplayOptionsBar from "@/components/DisplayOptionsBar/DisplayOptionsBar";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

import DashboardFilter from "./DashboardFilter";

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const DashboardDataTable = ({
  data = [],
  columns = [],
  loading = false,
  totalItems = 0,
  searchPlaceholder,
  showFilter = true,
  showSearch = true,
  currentPage,
  perPage,
  activeSearchValue,
  activeFilters,
  isPeriodActive,
  onPageChange,
  onPerPageChange,
  onSearchChange,
  onFilterChange,
  onSort,
  onControlsStateChange,
  filterConfig = null,
  headerActions = null,
  firsTimerTitle,
  firstTimerSubtitle,
  firstTimerButtonText,
  firstTimerButtonLink,
  className,
  displayOptions,
  displayActions,
  showDisplayView,
  containerClassName,
  infoView,
}) => {
  const { t } = useTranslation();
  const [localSearchValue, setLocalSearchValue] = useState(
    activeSearchValue || ""
  );
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  const [lastActionType, setLastActionType] = useState(null);

  const prevSearch = usePrevious(activeSearchValue);
  const prevFilters = usePrevious(JSON.stringify(activeFilters));
  const prevPeriod = usePrevious(isPeriodActive);

  useEffect(() => {
    if (activeSearchValue !== prevSearch) setLastActionType("search");
    else if (JSON.stringify(activeFilters) !== prevFilters)
      setLastActionType("filter");
    else if (isPeriodActive !== prevPeriod) setLastActionType("period");
  }, [
    activeSearchValue,
    activeFilters,
    isPeriodActive,
    prevSearch,
    prevFilters,
    prevPeriod,
  ]);

  useEffect(() => {
    setLocalSearchValue(activeSearchValue || "");
  }, [activeSearchValue]);

  const hasNoData = !loading && totalItems === 0;

  const hasActiveFilters = useMemo(() => {
    const filters = activeFilters || {};
    return Object.values(filters).some((value) =>
      Array.isArray(value) ? value.length > 0 : !!value
    );
  }, [activeFilters]);

  const disableSearch = hasNoData && lastActionType !== "search";
  const disableFilter = hasNoData && lastActionType !== "filter";

  useEffect(() => {
    onControlsStateChange?.({
      disablePeriod: hasNoData && lastActionType !== "period",
    });
  }, [hasNoData, lastActionType, onControlsStateChange]);

  const handleSearchKeyUp = (e) => {
    if (e.key === "Enter") onSearchChange(localSearchValue);
  };
  const handleClearSearch = () => {
    setLocalSearchValue("");
    onSearchChange("");
  };

  const handleSort = (sort) => {
    if (!onSort) return;
    let newOrder = "asc";
    if (sortConfig.sort === sort && sortConfig.order === "asc")
      newOrder = "desc";
    else if (sortConfig.sort === sort && sortConfig.order === "desc") {
      setSortConfig({ sort: null, order: null });
      onSort(null, null);
      return;
    }
    setSortConfig({ sort, order: newOrder });
    onSort(sort, newOrder);
  };

  const router = useRouter();

  const renderEmptyState = useMemo(() => {
    if (!hasNoData) return null;
    switch (lastActionType) {
      case "search":
        return (
          <DataNotFound
            title={t(
              "DashboardDataTable.notFoundSearchTitle",
              {},
              "Keyword Tidak Ditemukan"
            )}
            className="!w-full"
          />
        );
      case "filter":
        return (
          <DataNotFound
            title={
              <p>
                {t(
                  "DashboardDataTable.notFoundFilterPart1",
                  {},
                  "Data Tidak Ditemukan."
                )}
                <br />
                {t(
                  "DashboardDataTable.notFoundFilterPart2",
                  {},
                  "Mohon coba hapus beberapa filter"
                )}
              </p>
            }
            className="!w-full"
          />
        );
      case "period":
        return (
          <DataEmpty
            title={t("DashboardDataTable.emptyDataTitle", {}, "Tidak ada data")}
            subtitle=""
            className="!w-full !shadow-none"
          />
        );
      default:
        return (
          <DataEmpty
            title={
              firsTimerTitle ||
              t("DashboardDataTable.emptyDataTitle", {}, "Tidak ada data")
            }
            subtitle=""
            className="!shadow-none"
          >
            <div>
              {firstTimerSubtitle && (
                <div className="-mt-2 mb-1 text-center text-xs font-medium text-neutral-600">
                  {firstTimerSubtitle}
                </div>
              )}
              {firstTimerButtonText && (
                <Button
                  className="mx-auto mt-4"
                  onClick={() => router.push(firstTimerButtonLink)}
                >
                  {firstTimerButtonText}
                </Button>
              )}
            </div>
          </DataEmpty>
        );
    }
  }, [
    hasNoData,
    lastActionType,
    firsTimerTitle,
    firstTimerSubtitle,
    firstTimerButtonText,
    firstTimerButtonLink,
    router,
    t,
  ]);

  const activeFiltersForBar = useMemo(() => {
    const barFilters = [];
    Object.entries(activeFilters || {}).forEach(([categoryKey, items]) => {
      if (Array.isArray(items)) {
        items.forEach((item) =>
          barFilters.push({
            id: `${categoryKey}-${item.id}`,
            label: item.label,
            categoryKey,
            item,
          })
        );
      } else if (items && typeof items === "object") {
        barFilters.push({
          id: `${categoryKey}-${items.id}`,
          label: items.label,
          categoryKey,
          item: items,
        });
      }
    });
    return barFilters;
  }, [activeFilters]);

  const handleRemoveFilter = (filter) => {
    const newFilters = { ...activeFilters };
    const categoryType =
      filterConfig?.categories.find((c) => c.key === filter.categoryKey)
        ?.type || "checkbox-multi";

    if (categoryType === "radio-single") {
      delete newFilters[filter.categoryKey];
    } else {
      newFilters[filter.categoryKey] = newFilters[filter.categoryKey].filter(
        (item) => item.id !== filter.item.id
      );
      if (newFilters[filter.categoryKey].length === 0) {
        delete newFilters[filter.categoryKey];
      }
    }
    onFilterChange(newFilters);
  };

  const handleClearAllFilters = () => onFilterChange({});

  const isFirstTimer =
    hasNoData && !isPeriodActive && !activeSearchValue && !hasActiveFilters;

  return (
    <>
      <div
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-xl bg-neutral-50 shadow-[0px_4px_11px_0px_#41414140]",
          className
        )}
      >
        {isFirstTimer ? (
          <div className="flex h-full items-center justify-center pb-8 pt-16">
            <DataEmpty
              title={
                firsTimerTitle ||
                t("DashboardDataTable.emptyDataTitle", {}, "Tidak ada data")
              }
              subtitle=""
              className="!shadow-none"
            >
              <div>
                {firstTimerSubtitle && (
                  <div className="-mt-2 mb-1 text-center text-xs font-medium text-neutral-600">
                    {firstTimerSubtitle}
                  </div>
                )}
                {firstTimerButtonText && (
                  <Button
                    className="mx-auto mt-4"
                    onClick={() => router.push(firstTimerButtonLink)}
                  >
                    {firstTimerButtonText}
                  </Button>
                )}
              </div>
            </DataEmpty>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "flex-shrink-0 space-y-4 px-6 py-5",
                containerClassName
              )}
            >
              {infoView}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {showSearch && (
                    <Input
                      type="text"
                      placeholder={
                        searchPlaceholder ||
                        t(
                          "DashboardDataTable.searchPlaceholderDefault",
                          {},
                          "Search..."
                        )
                      }
                      value={localSearchValue}
                      onChange={(e) => setLocalSearchValue(e.target.value)}
                      onKeyUp={handleSearchKeyUp}
                      disabled={disableSearch}
                      icon={{
                        left: (
                          <IconComponent
                            src="/icons/datatable-search.svg"
                            width={12}
                          />
                        ),
                        right: localSearchValue ? (
                          <button onClick={handleClearSearch}>
                            <X className="h-4 w-4" />
                          </button>
                        ) : null,
                      }}
                      className="w-[280px]"
                    />
                  )}
                  {showFilter && filterConfig && (
                    <DashboardFilter
                      categories={filterConfig.categories}
                      data={filterConfig.data}
                      selectedValues={activeFilters || {}}
                      onSelectionChange={onFilterChange}
                      disabled={disableFilter}
                    />
                  )}
                </div>
                {headerActions}
              </div>

              {showFilter && activeFiltersForBar.length > 0 && (
                <ActiveFiltersBar
                  filters={activeFiltersForBar}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={handleClearAllFilters}
                />
              )}
              <div className="flex w-full justify-between">
                {showDisplayView && displayOptions && (
                  <DisplayOptionsBar
                    totalCount={displayOptions.totalCount || totalItems}
                    statusOptions={displayOptions.statusOptions || []}
                    currentStatus={displayOptions.currentStatus}
                    showAllOption={displayOptions.showAllOption}
                    onStatusChange={displayOptions.onStatusChange}
                  />
                )}
                {displayActions}
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <Table
                columns={columns}
                data={data}
                loading={loading}
                sortConfig={sortConfig}
                onSort={handleSort}
                emptyComponent={renderEmptyState}
              />
            </div>
          </>
        )}
      </div>
      {!loading && totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / perPage)}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          className="!mt-0"
          perPage={perPage}
        />
      )}
    </>
  );
};

export default DashboardDataTable;
