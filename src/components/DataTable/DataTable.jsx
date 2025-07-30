import { useState } from "react";

import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";

import FilterDropdown from "@/components/FilterDropdown";
import Input from "@/components/Form/Input";
import { cn } from "@/lib/utils";

import ActiveFiltersBar from "../ActiveFiltersBar/ActiveFiltersBar";
import DataNotFound from "../DataNotFound/DataNotFound";
import DisplayOptionsBar from "../DisplayOptionsBar/DisplayOptionsBar";
import Pagination from "../Pagination/Pagination";

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

  tableTitle = null,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

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

  const handleSort = (key) => {
    if (!onSort) return;

    let newDirection = null;
    let newKey = key;

    if (sortConfig.key === key) {
      // Same column: cycle through asc → desc → null
      if (sortConfig.direction === "asc") {
        newDirection = "desc";
      } else if (sortConfig.direction === "desc") {
        newDirection = null;
        newKey = null;
      } else {
        newDirection = "asc";
      }
    } else {
      // Different column: start with asc
      newDirection = "asc";
    }

    setSortConfig({ key: newKey, direction: newDirection });

    if (newDirection) {
      onSort(newKey, newDirection);
    } else {
      // Notify parent that sorting is cleared
      onSort(null, null);
    }
  };

  const renderHeader = () => {
    const isDisabled = totalItems === 0 && !loading;

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
              disabled={isDisabled}
              icon={{
                left: <Search className="h-4 w-4 text-neutral-500" />,
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
              disabled={isDisabled}
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

  const renderTable = () => {
    return (
      <div className="h-full overflow-y-auto border-t border-neutral-400">
        <table className="w-full table-auto">
          <thead className="sticky top-0 z-10 bg-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-300">
            <tr>
              {columns.map((column, index) => {
                const isSortable =
                  column.sortable !== false && column.key && onSort;
                const isSorted = sortConfig.key === column.key;

                return (
                  <th
                    key={index}
                    className={cn(
                      "bg-white px-6 py-4 text-left text-xs font-bold text-neutral-600",
                      isSortable &&
                        "cursor-pointer select-none hover:bg-neutral-50",
                      column.headerClassName
                    )}
                    style={column.width ? { width: column.width } : {}}
                    onClick={() => isSortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      <span>{column.header}</span>
                      {isSortable && (
                        <div className="ml-1">
                          {!isSorted ? (
                            <ArrowUpDown className="h-3 w-3 text-neutral-400" />
                          ) : sortConfig.direction === "asc" ? (
                            <ArrowUp className="h-3 w-3 text-primary-700" />
                          ) : (
                            <ArrowDown className="h-3 w-3 text-primary-700" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-700 border-t-transparent"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  {emptyState || (
                    <DataNotFound
                      className="gap-y-5"
                      title="Keyword Tidak Ditemukan"
                    />
                  )}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    "border-b border-neutral-200 hover:bg-neutral-50",
                    onRowClick && "cursor-pointer",
                    rowClassName?.(row, rowIndex)
                  )}
                  onClick={() => onRowClick?.(row, rowIndex)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn("px-6 py-4 text-xxs", column.className)}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
        {totalItems === 0 && !loading ? (
          <DataNotFound
            className="gap-y-5 pb-10 pt-6"
            title="Belum Ada Data"
            type="data"
          />
        ) : (
          <div className="flex-1 overflow-hidden">{renderTable()}</div>
        )}
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
