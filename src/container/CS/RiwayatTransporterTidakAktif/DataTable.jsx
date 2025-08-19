import { useState } from "react";

import { X } from "lucide-react";

import ActiveFiltersBar from "@/components/ActiveFiltersBar/ActiveFiltersBar";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import DisplayOptionsBar from "@/components/DisplayOptionsBar/DisplayOptionsBar";
import FilterDropdown from "@/components/FilterDropdown";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import { cn } from "@/lib/utils";

const DataTable = ({
  data = [],
  columns = [],
  searchPlaceholder = "Search...",
  showFilter = true,
  showSearch = true,
  showPagination = true,
  showTotalCount = true,
  showDisplayView = false,
  totalCountLabel = "items",
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  perPage = 10,
  onPageChange,
  onPerPageChange,
  onSearch,
  onFilter,
  loading = false,
  emptyState = null,
  className,
  headerActions = null,
  onRowClick = null,
  rowClassName = null,
  paginationVariant = "muatrans",
  filterConfig = null,
  onSort,
  displayOptions = null,
  isSearch = false,
  tableTitle = null,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  console.log("DataTable rendered with data:", data);

  const handleSearch = (value) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleSearchKeyUp = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchValue);
    }
  };

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
    onFilter?.(filters);
  };

  // Convert selected filters to active filter format
  const getActiveFilters = () => {
    const activeFilters = [];

    Object.entries(selectedFilters).forEach(([categoryKey, items]) => {
      if (Array.isArray(items)) {
        // Multi-select
        items.forEach((item) => {
          activeFilters.push({
            id: `${categoryKey}-${item.id}`,
            label: item.label,
            categoryKey,
            item,
          });
        });
      } else if (items) {
        // Single-select
        activeFilters.push({
          id: `${categoryKey}-${items.id}`,
          label: items.label,
          categoryKey,
          item: items,
        });
      }
    });

    return activeFilters;
  };

  const handleRemoveFilter = (filter) => {
    const newFilters = { ...selectedFilters };

    if (Array.isArray(newFilters[filter.categoryKey])) {
      // Multi-select
      newFilters[filter.categoryKey] = newFilters[filter.categoryKey].filter(
        (item) => item.id !== filter.item.id
      );
      if (newFilters[filter.categoryKey].length === 0) {
        delete newFilters[filter.categoryKey];
      }
    } else {
      // Single-select
      delete newFilters[filter.categoryKey];
    }

    setSelectedFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleClearAllFilters = () => {
    setSelectedFilters({});
    onFilter?.({});
  };

  const handleSort = (sort) => {
    if (!onSort) return;

    let newOrder = null;
    let newSort = sort;

    if (sortConfig.sort === sort) {
      // Same column: cycle through asc → desc → null
      if (sortConfig.order === "asc") {
        newOrder = "desc";
      } else if (sortConfig.order === "desc") {
        newOrder = null;
        newSort = null;
      } else {
        newOrder = "asc";
      }
    } else {
      // Different column: start with asc
      newOrder = "asc";
    }

    setSortConfig({ sort: newSort, order: newOrder });

    if (newOrder) {
      onSort(newSort, newOrder);
    } else {
      // Notify parent that sorting is cleared
      onSort(null, null);
    }
  };

  const renderHeader = () => {
    const activeFilters = getActiveFilters();
    const hasSearchValue = searchValue.trim();
    const hasActiveFilters = activeFilters.length > 0;
    const noData = totalItems === 0 && !loading;

    // When search data not found: search stays active, filter gets disabled
    // When filter data not found: filter stays active, search gets disabled
    const isSearchDisabled = noData && hasActiveFilters && !hasSearchValue;
    const isFilterDisabled = noData && hasSearchValue && !hasActiveFilters;

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {tableTitle && tableTitle}
          {showSearch && (
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyUp={handleSearchKeyUp}
              disabled={isSearchDisabled}
              icon={{
                left: (
                  <IconComponent src="/icons/datatable-search.svg" width={12} />
                ),
                right:
                  searchValue.length > 2 ? (
                    <button
                      onClick={() => {
                        setSearchValue("");
                        onSearch?.("");
                      }}
                      className="flex items-center justify-center rounded-full p-0.5 hover:bg-neutral-200"
                    >
                      <X className="h-3 w-3 text-neutral-600" />
                    </button>
                  ) : null,
              }}
              appearance={{
                containerClassName: "h-8 w-[262px]",
                inputClassName: "text-xs font-medium mt-0",
              }}
              className="w-fit"
            />
          )}
          {showFilter && filterConfig && (
            <FilterDropdown
              categories={filterConfig.categories}
              data={filterConfig.data}
              selectedValues={selectedFilters}
              onSelectionChange={handleFilterChange}
              searchPlaceholder="Cari {category}"
              disabled={isFilterDisabled}
            />
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {headerActions}
          {showTotalCount && (
            <div className="text-sm font-semibold text-neutral-900">
              Total : {data.length} {totalCountLabel}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEmptyState = () => {
    const activeFilters = getActiveFilters();

    return (
      <tr>
        <td colSpan={columns.length} className="px-6 py-8 text-center">
          {emptyState || (
            <>
              <DataNotFound
                className="gap-y-5"
                title={
                  searchValue.trim()
                    ? "Keyword Tidak Ditemukan"
                    : "Data Tidak Ditemukan."
                }
              />
              {activeFilters.length > 0 && (
                <div className="font-semibold text-neutral-600">
                  Mohon coba hapus beberapa filter
                </div>
              )}
            </>
          )}
        </td>
      </tr>
    );
  };

  const activeFilters = getActiveFilters();

  return (
    <>
      <div
        className={cn(
          "flex h-full w-full flex-col overflow-hidden rounded-lg border border-neutral-300 bg-white",
          className
        )}
      >
        <div className="flex-shrink-0 space-y-4 px-6 py-5">
          {renderHeader()}
          {showFilter && activeFilters.length > 0 && (
            <ActiveFiltersBar
              filters={activeFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          )}
          {showDisplayView && displayOptions && (
            <DisplayOptionsBar
              totalCount={displayOptions.totalCount || totalItems}
              statusOptions={displayOptions.statusOptions || []}
              currentStatus={displayOptions.currentStatus}
              onStatusChange={displayOptions.onStatusChange}
            />
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <Table
            columns={columns}
            data={data}
            loading={loading}
            onRowClick={onRowClick}
            rowClassName={rowClassName}
            onSort={handleSort}
            sortConfig={sortConfig}
            emptyComponent={renderEmptyState()}
          />
        </div>
      </div>
      {showPagination && !loading && data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          perPage={perPage}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          variants={paginationVariant}
          className="pb-0"
        />
      )}
    </>
  );
};

export default DataTable;
