"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { X } from "lucide-react";

import ActiveFiltersBar from "@/components/ActiveFiltersBar/ActiveFiltersBar";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import FilterDropdown from "@/components/FilterDropdown/FilterDropdown";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination/Pagination";
import MuatBongkarStepper from "@/components/Stepper/MuatBongkarStepper";
import Table from "@/components/Table/Table";
import { cn } from "@/lib/utils";

// Custom component untuk image yang bisa diklik
const ClickableImage = ({ src, alt, className, onImageClick }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={() => onImageClick(src)}
    />
  );
};

const LaporanAktivitasDriverTable = ({
  data = [],
  currentPage = 1,
  totalPages = 1,
  perPage = 10,
  onPageChange,
  onPerPageChange,
  filterConfig = {},
  onFilter,
  onSearch,
  onSort,
  searchValue = "",
  filters = {},
  sortConfig = { sort: null, order: null },
  showFilter = true,
  showSearch = true,
  showPagination = true,
  showTotalCount = true,
  searchPlaceholder = "Cari Driver",
  disabledByPeriod = false,
  loading = false,
  className = "border-0",
  multiSelect = true, // ✅ Default to true, bisa di-override
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [localFilters, setLocalFilters] = useState(filters);
  const [localSortConfig, setLocalSortConfig] = useState(sortConfig);
  const [selectedImage, setSelectedImage] = useState("");
  const router = useRouter();

  // Table columns for Driver
  const columns = [
    {
      header: "Nama Driver",
      key: "name",
      sortable: true,
      width: "250px",
      searchable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <ClickableImage
            src={row.profileImage}
            alt="Driver"
            className="h-12 w-12 cursor-pointer rounded object-cover transition-opacity hover:opacity-80"
            onImageClick={setSelectedImage}
          />
          <div>
            <div className="font-semibold text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-600">{row.phoneNumber}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Armada",
      key: "armada",
      sortable: false,
      width: "150px",
      searchable: true,
      render: (row) => {
        if (!row.currentFleet || !row.currentFleet.licensePlate) {
          return <div className="text-sm text-gray-500">Belum Ada</div>;
        }

        return (
          <div className="flex flex-col">
            <div className="text-sm font-semibold text-gray-900">
              {row.currentFleet.licensePlate}
            </div>
            <div className="text-xs text-gray-600">
              {row.currentFleet.truckType} - {row.currentFleet.carrierType}
            </div>
            <div className="text-xs text-gray-500">
              {row.currentFleet.currentLocation === "-"
                ? "Lokasi tidak tersedia"
                : row.currentFleet.currentLocation}
            </div>
          </div>
        );
      },
    },
    {
      header: "Kode Pesanan Aktif",
      key: "activeOrderCode",
      sortable: true,
      width: "150px",
      searchable: true,
      render: (row) => {
        if (!row.activeOrderCode || row.activeOrderCode === "") {
          return <div className="text-sm">Belum Ada</div>;
        }
        return <div className="text-sm">{row.activeOrderCode}</div>;
      },
    },
    {
      header: "Rute Pesanan Aktif",
      key: "activeOrderRoute",
      sortable: false,
      width: "220px",
      searchable: false,
      render: (row) => {
        if (!row.activeOrderRoute || row.activeOrderRoute === "Belum Ada") {
          return <div className="text-sm">Belum Ada</div>;
        }

        // Parse route data to extract pickup and dropoff locations
        const routeData = row.activeOrderRoute;
        let pickupLocations = [];
        let dropoffLocations = [];

        if (routeData.origin && routeData.destination) {
          pickupLocations = [routeData.origin];
          dropoffLocations = [routeData.destination];
        }

        return (
          <div className="space-y-2">
            {routeData.estimate && (
              <div className="text-xs font-medium text-neutral-700">
                Estimasi: {routeData.estimate}
              </div>
            )}
            <MuatBongkarStepper
              pickupLocations={pickupLocations}
              dropoffLocations={dropoffLocations}
              appearance={{
                titleClassName: "text-xs font-medium text-neutral-900",
              }}
            />
          </div>
        );
      },
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      width: "200px",
      searchable: true,
      render: (row) => {
        let bgColor = "bg-gray-200";
        let textColor = "text-gray-600";

        if (row.currentStatus === "READY_FOR_ORDER") {
          bgColor = "bg-green-100";
          textColor = "text-green-900";
        } else if (row.currentStatus === "NOT_PAIRED") {
          bgColor = "bg-gray-100";
          textColor = "text-gray-600";
        } else if (row.currentStatus === "ON_DUTY") {
          bgColor = "bg-blue-100";
          textColor = "text-blue-900";
        } else if (row.currentStatus === "WAITING_LOADING_TIME") {
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-900";
        } else if (row.currentStatus === "INACTIVE") {
          bgColor = "bg-red-100";
          textColor = "text-red-900";
        } else if (row.currentStatus === "NON_ACTIVE") {
          bgColor = "bg-red-100";
          textColor = "text-red-900";
        } else if (row.currentStatus === null) {
          bgColor = "bg-gray-100";
          textColor = "text-gray-500";
        }

        // Map status to display labels
        let displayStatus = row.currentStatus;
        if (row.currentStatus === "READY_FOR_ORDER") {
          displayStatus = "Siap Menerima Order";
        } else if (row.currentStatus === "NOT_PAIRED") {
          displayStatus = "Belum Dipasangkan";
        } else if (row.currentStatus === "ON_DUTY") {
          displayStatus = "Bertugas";
        } else if (row.currentStatus === "WAITING_LOADING_TIME") {
          displayStatus = "Akan Muat Hari Ini";
        } else if (row.currentStatus === "INACTIVE") {
          displayStatus = "Nonaktif";
        } else if (row.currentStatus === "NON_ACTIVE") {
          displayStatus = "Nonaktif";
        } else if (row.currentStatus === null) {
          displayStatus = "Tidak Ada Status";
        }

        return (
          <span
            className={`inline-flex w-full items-center justify-center rounded-md px-3 py-1.5 text-xs font-semibold ${bgColor} ${textColor}`}
          >
            {displayStatus}
          </span>
        );
      },
    },
    {
      header: "Action",
      key: "action",
      sortable: false,
      width: "100px",
      searchable: false,
      render: (row) => (
        <Button
          className="h-8 px-4 text-xs"
          onClick={() => {
            // Store minimal driver data temporarily for detail page
            const driverData = {
              name: row.name,
              phoneNumber: row.phoneNumber,
              profileImage: row.profileImage,
              currentStatus: row.currentStatus,
              truckType: row.currentFleet?.truckType,
              carrierType: row.currentFleet?.carrierType,
              currentLocation: row.currentFleet?.currentLocation,
            };

            // Store temporarily in sessionStorage (cleared when tab closes)
            sessionStorage.setItem(
              `driver_${row.id}`,
              JSON.stringify(driverData)
            );

            // Navigate to detail page with only driver ID
            router.push(`/laporan/aktivitas-armada-driver/driver/${row.id}`);
          }}
        >
          Detail
        </Button>
      ),
    },
  ];

  const handleSearch = (value) => {
    setLocalSearchValue(value);
    onSearch?.(value);
  };

  const handleSearchKeyUp = (e) => {
    if (e.key === "Enter") {
      onSearch?.(localSearchValue);
    }
  };

  const handleFilter = (newFilters) => {
    setLocalFilters(newFilters);
    onFilter?.(newFilters);
  };

  // Convert selected filters to active filter format
  const getActiveFilters = () => {
    const activeFilters = [];

    Object.entries(localFilters).forEach(([categoryKey, items]) => {
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
    const newFilters = { ...localFilters };

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

    setLocalFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleClearAllFilters = () => {
    setLocalFilters({});
    onFilter?.({});
  };

  const handleSort = (sort) => {
    if (!onSort) return;

    let newOrder = null;
    let newSort = sort;

    if (localSortConfig.sort === sort) {
      // Same column: cycle through asc → desc → null
      if (localSortConfig.order === "asc") {
        newOrder = "desc";
      } else if (localSortConfig.order === "desc") {
        newOrder = null;
        newSort = null;
      } else {
        newOrder = "asc";
      }
    } else {
      // Different column: start with asc
      newOrder = "asc";
    }

    setLocalSortConfig({ sort: newSort, order: newOrder });

    if (newOrder) {
      onSort(newSort, newOrder);
    } else {
      // Notify parent that sorting is cleared
      onSort(null, null);
    }
  };

  const renderHeader = () => {
    const noDataDisabled = data.length === 0 && !loading;

    // Search input should never be disabled by data availability
    const disableSearchInput = disabledByPeriod;

    // Interlock states - FilterDropdown disabled when search is active
    const isSearchActive = localSearchValue.length > 0;
    const isFilterActive = Object.keys(localFilters).some(
      (key) => localFilters[key] && localFilters[key] !== ""
    );

    // Filter dropdown can be disabled by no data or search active
    const disableFilterDropdown =
      (data.length === 0 && !loading) || disabledByPeriod || isSearchActive;

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showSearch && (
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={localSearchValue}
              onChange={(e) => setLocalSearchValue(e.target.value)}
              onKeyUp={handleSearchKeyUp}
              disabled={disableSearchInput}
              icon={{
                left: (
                  <IconComponent src="/icons/datatable-search.svg" width={12} />
                ),
                right:
                  localSearchValue.length > 0 ? (
                    <button
                      onClick={() => {
                        setLocalSearchValue("");
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
              categories={filterConfig.categories || []}
              data={filterConfig.data || []}
              selectedValues={localFilters}
              onSelectionChange={handleFilter}
              searchPlaceholder="Cari {category}"
              disabled={disableFilterDropdown}
              multiSelect={multiSelect} // ✅ Gunakan prop multiSelect
            />
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {showTotalCount && (
            <div className="text-sm font-semibold text-neutral-900">
              Total : {data.length} Driver
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEmptyState = () => {
    // Check if this is a search/filter result or truly no data
    const hasSearchOrFilter =
      localSearchValue ||
      Object.keys(localFilters).some(
        (key) => localFilters[key] && localFilters[key] !== ""
      );

    if (hasSearchOrFilter) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 flex items-center gap-3">
            {/* Magnifying glass with X */}
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-blue-100 p-3">
                <svg
                  className="h-full w-full text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white">
                  <span className="text-xs font-bold">×</span>
                </div>
              </div>
            </div>

            {/* Yellow circle with smiley */}
            <div className="h-12 w-12 rounded-full bg-yellow-100 p-2">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-yellow-400">
                <span className="text-lg">😊</span>
              </div>
            </div>

            {/* Yellow square with X */}
            <div className="h-8 w-8 rounded bg-yellow-100 p-1">
              <div className="flex h-full w-full items-center justify-center rounded bg-yellow-400">
                <span className="text-xs font-bold text-black">×</span>
              </div>
            </div>
          </div>

          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Data tidak Ditemukan
          </h3>
          <p className="text-center text-gray-600">
            Mohon coba hapus beberapa filter
          </p>
        </div>
      );
    }

    // Default empty state for no data
    return <DataNotFound className="gap-y-5" title="Belum Ada Data" />;
  };

  const activeFilters = getActiveFilters();

  // Use data directly from API (no client-side filtering)
  const filteredData = data;

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
        </div>
        <div className="flex-1 overflow-hidden">
          <Table
            columns={columns}
            data={filteredData}
            loading={loading}
            onSort={handleSort}
            sortConfig={localSortConfig}
            emptyComponent={renderEmptyState()}
          />
        </div>
      </div>
      {showPagination && !loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          perPage={perPage}
          onPageChange={onPageChange}
          onPerPageChange={onPerPageChange}
          variants="muatrans"
          className="pb-0"
        />
      )}

      {/* Image Modal */}
      <Modal open={!!selectedImage} onOpenChange={() => setSelectedImage("")}>
        <ModalContent className="h-full max-h-[65vh] w-full max-w-[40vw]">
          <div className="p-4 md:p-6">
            <div className="mb-4 flex items-center justify-center">
              <h2 className="text-center text-xl font-semibold md:text-2xl">
                Gambar Driver
              </h2>
            </div>
            {selectedImage && (
              <div className="flex justify-center rounded-lg">
                <img
                  src={selectedImage}
                  alt="Driver"
                  className="h-full w-full rounded-lg object-contain"
                  style={{
                    maxHeight: "calc(65vh - 100px)",
                    maxWidth: "100%",
                  }}
                />
              </div>
            )}
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LaporanAktivitasDriverTable;
