import { useState } from "react";

import { Search } from "lucide-react";

import FilterDropdown from "@/components/FilterDropdown";
import Input from "@/components/Form/Input";
import { cn } from "@/lib/utils";

import Pagination from "../Pagination/Pagination";

const DataTable = ({
  data = [],
  columns = [],
  searchPlaceholder = "Search...",
  showFilter = true,
  showSearch = true,
  showPagination = true,
  showTotalCount = true,
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
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});

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

  const renderHeader = () => (
    <div className="flex items-center justify-between border-b border-neutral-300 px-6 py-4">
      <div className="flex items-center gap-3">
        {showSearch && (
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyUp={handleSearchKeyUp}
            icon={{
              left: <Search className="h-4 w-4 text-neutral-500" />,
            }}
            appearance={{
              containerClassName: "h-8 w-[262px]",
              inputClassName: "text-xs font-medium ",
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
          />
        )}
      </div>
      <div className="flex items-center gap-3">
        {headerActions}
        {showTotalCount && totalItems !== undefined && (
          <div className="text-sm font-semibold text-neutral-900">
            Total : {totalItems} {totalCountLabel}
          </div>
        )}
      </div>
    </div>
  );

  const renderTable = () => (
    <div className="relative h-[calc(100dvh-360px)] overflow-hidden">
      <div className="absolute inset-0 overflow-auto">
        <table className="w-full table-auto">
          <thead className="sticky top-0 z-10 bg-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-300">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    "bg-white px-6 py-4 text-left text-xs font-bold text-neutral-600",
                    column.headerClassName
                  )}
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.header}
                </th>
              ))}
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
                    <div className="text-sm text-neutral-500">
                      No data available
                    </div>
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
    </div>
  );

  return (
    <div className="">
      <div
        className={cn(
          "w-full overflow-hidden rounded-lg border border-neutral-300 bg-white",
          className
        )}
      >
        {renderHeader()}
        {renderTable()}
      </div>
      {showPagination && !loading && data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          perPage={perPage}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          variants={paginationVariant}
        />
      )}
    </div>
  );
};

export default DataTable;
