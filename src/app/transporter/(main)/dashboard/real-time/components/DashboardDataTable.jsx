"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
import { cn } from "@/lib/utils";

import DashboardFilter from "./DashboardFilter";

const DashboardDataTable = ({
  data = [],
  columns = [],
  loading = false,
  totalItems = 0,
  searchPlaceholder = "Search...",
  showFilter = true,
  showSearch = true,
  currentPage,
  perPage,
  activeSearchValue,
  activeFilters,
  isPeriodActive,
  onPageChange,
  onPerPageChange,
  displayOptions = null,
  showDisplayView = false,
  onSearchChange,
  onFilterChange,
  onSort,
  onControlsStateChange,
  filterConfig = null,
  headerActions = null,
  displayActions = null,
  firsTimerTitle,
  firstTimerSubtitle,
  firstTimerButtonText,
  firstTimerButtonLink,
  className,
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(
    activeSearchValue || ""
  );
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  useEffect(() => {
    setLocalSearchValue(activeSearchValue || "");
  }, [activeSearchValue]);
  const hasNoData = !loading && totalItems === 0;
  const disableSearch = hasNoData && !activeSearchValue;
  const disableFilter = hasNoData && !Object.keys(activeFilters || {}).length;

  useEffect(() => {
    onControlsStateChange?.({
      disablePeriod: hasNoData && !isPeriodActive,
    });
  }, [hasNoData, isPeriodActive, onControlsStateChange]);
  const handleSearchKeyUp = (e) => {
    if (e.key === "Enter") {
      onSearchChange(localSearchValue);
    }
  };

  const handleClearSearch = () => {
    setLocalSearchValue("");
    onSearchChange("");
  };

  const hasActiveFilters = Object.keys(activeFilters || {}).length > 0;
  const isFirstTimer =
    hasNoData && !isPeriodActive && !activeSearchValue && !hasActiveFilters;

  const renderFirstTimer = (
    <DataEmpty
      title={firsTimerTitle || "Tidak ada data"}
      subtitle={firstTimerSubtitle || ""}
      className="!shadow-none"
    >
      {firstTimerButtonText && (
        <Button onClick={() => router.push(firstTimerButtonLink)}>
          {firstTimerButtonText}
        </Button>
      )}
    </DataEmpty>
  );

  const handleSort = (sort) => {
    if (!onSort) return;
    let newOrder = "asc";
    if (sortConfig.sort === sort && sortConfig.order === "asc") {
      newOrder = "desc";
    } else if (sortConfig.sort === sort && sortConfig.order === "desc") {
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
    if (activeSearchValue)
      return (
        <DataNotFound title="Keyword Tidak Ditemukan" className="!w-full" />
      );
    if (hasActiveFilters)
      return (
        <DataNotFound
          title={
            <p>
              Data Tidak Ditemukan.
              <br /> Mohon coba hapus beberapa filter
            </p>
          }
          className="!w-full"
        />
      );
    if (isPeriodActive)
      return (
        <DataEmpty
          title="Tidak ada data"
          subtitle=""
          className="!w-full !shadow-none"
        />
      );
    return (
      <DataEmpty
        title={firsTimerTitle || "Tidak ada data"}
        subtitle={firstTimerSubtitle || ""}
        className="!w-full !shadow-none"
      >
        {firstTimerButtonText && (
          <Button onClick={() => router.push(firstTimerButtonLink)}>
            {firstTimerButtonText}
          </Button>
        )}
      </DataEmpty>
    );
  }, [
    hasNoData,
    activeSearchValue,
    hasActiveFilters,
    isPeriodActive,
    firsTimerTitle,
    firstTimerSubtitle,
    firstTimerButtonText,
    router,
    firstTimerButtonLink,
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
            {renderFirstTimer}
          </div>
        ) : (
          <>
            <div className="flex-shrink-0 space-y-4 px-6 py-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {showSearch && (
                    <Input
                      type="text"
                      placeholder={searchPlaceholder}
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
              <div className="flex w-full items-center justify-between">
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
                emptyComponent={<div className="py-4">{renderEmptyState}</div>}
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
