"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import Button from "@/components/Button/Button";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import FilterDropdown from "@/components/FilterDropdown/FilterDropdown";
import Input from "@/components/Input/Input";
import Pagination from "@/components/Pagination/Pagination";

const LaporanPencairanDanaTable = ({
  data = [],
  columns = [],
  currentPage = 1,
  totalPages = 1,
  perPage = 10,
  onPageChange,
  onPerPageChange,
  onPeriodChange,
  onDownload,
  periodOptions = [],
  currentPeriodValue = null,
  recentPeriodOptions = [],
  filterConfig = {},
  onFilter,
  onSearch,
  onSort,
  searchValue = "",
  filters = {},
  sortConfig = { sort: null, order: null },
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSearch = (value) => {
    setLocalSearchValue(value);
    onSearch?.(value);
  };

  const handleFilter = (newFilters) => {
    setLocalFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleSort = (columnKey) => {
    if (!onSort) return;
    onSort(columnKey);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.sort === columnKey) {
      return sortConfig.order === "desc" ? (
        <ChevronDown className="h-4 w-4 text-primary-700" />
      ) : (
        <ChevronUp className="h-4 w-4 text-primary-700" />
      );
    }
    return <ChevronDown className="h-4 w-4 text-gray-400" />;
  };

  const filteredData = data.filter((row) => {
    // Search filter
    if (localSearchValue) {
      const searchLower = localSearchValue.toLowerCase();
      const searchableFields = columns
        .filter((col) => col.searchable !== false)
        .map((col) => {
          if (col.render) {
            // For rendered columns, try to extract text content
            const rendered = col.render(row);
            if (typeof rendered === "string") return rendered;
            if (typeof rendered === "object" && rendered.props?.children) {
              return rendered.props.children;
            }
            return "";
          }
          return row[col.key] || "";
        });

      if (
        !searchableFields.some((field) =>
          String(field).toLowerCase().includes(searchLower)
        )
      ) {
        return false;
      }
    }

    // Custom filters
    if (Object.keys(localFilters).length > 0) {
      for (const [category, selectedValues] of Object.entries(localFilters)) {
        if (selectedValues && selectedValues.length > 0) {
          const filterCategory = filterConfig.categories?.find(
            (cat) => cat.key === category
          );
          if (filterCategory) {
            const rowValue = row[filterCategory.key];
            if (!selectedValues.includes(rowValue)) {
              return false;
            }
          }
        }
      }
    }

    return true;
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Header with Filters */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FilterDropdown
              categories={filterConfig.categories || []}
              data={filterConfig.data || []}
              selectedValues={localFilters}
              onSelectionChange={handleFilter}
              searchPlaceholder="Cari Filter"
            />
            <DropdownPeriode
              options={periodOptions}
              onSelect={onPeriodChange}
              recentSelections={recentPeriodOptions}
              value={currentPeriodValue}
            />
          </div>
          <div className="text-sm font-semibold text-neutral-900">
            Total : {filteredData.length} Pencairan
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {/* <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Cari Pencairan"
            value={localSearchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={onDownload}
            className="h-9 px-4"
            variant="muattrans-warning"
          >
            Unduh
          </Button>
        </div>
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900"
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-2 hover:text-gray-700"
                    >
                      {column.header}
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <div className="text-neutral-500">
                    Tidak ada data yang ditemukan
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 text-sm text-gray-900"
                      style={column.width ? { width: column.width } : {}}
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

      {/* Pagination */}
      <div className="border-t border-gray-200 px-6 py-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          perPage={perPage}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
        />
      </div>
    </div>
  );
};

export default LaporanPencairanDanaTable;
