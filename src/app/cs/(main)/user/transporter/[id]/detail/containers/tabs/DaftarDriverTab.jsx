"use client";

import { useState } from "react";

import ActiveFiltersBar from "@/components/ActiveFiltersBar/ActiveFiltersBar";
import BadgeStatus from "@/components/Badge/BadgeStatus";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import FilterDropdown from "@/components/FilterDropdown/FilterDropdown";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import { TabsContent } from "@/components/Tabs/Tabs";

const DaftarDriverTab = ({ mockDriverData = [] }) => {
  // Local state for this tab
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });

  // Status label mapping from API status to display label
  const getStatusLabel = (apiStatus) => {
    const statusMap = {
      READY_FOR_ORDER: "Siap Menerima Order",
      SCHEDULED: "Akan Muat Hari Ini",
      ON_DUTY: "Bertugas",
      NOT_PAIRED: "Belum Dipasangkan",
      NON_ACTIVE: "Nonaktif",
      WAITING_FOR_LOADING: "Menunggu Jam Muat",
    };
    return statusMap[apiStatus] || apiStatus;
  };

  // Status badge helper
  const getStatusBadge = (status) => {
    let variant = "success";
    if (status === "Siap Menerima Order") {
      variant = "success"; // Green
    } else if (
      status === "Akan Muat Hari Ini" ||
      status === "Menunggu Jam Muat"
    ) {
      variant = "warning"; // Yellow/Orange
    } else if (status === "Bertugas") {
      variant = "primary"; // Blue
    } else if (status === "Belum Dipasangkan") {
      variant = "warning"; // Yellow/Orange
    } else if (status === "Nonaktif") {
      variant = "neutral"; // Gray
    } else if (status === "Verifikasi Ditolak") {
      variant = "error"; // Red
    } else if (status === "Dalam Verifikasi") {
      variant = "warning"; // Yellow/Orange
    } else if (status === "Non Aktif") {
      variant = "neutral"; // Gray
    }
    return <BadgeStatus variant={variant}>{status}</BadgeStatus>;
  };

  // Driver table columns
  const driverColumns = [
    {
      key: "driverName",
      header: "Nama Driver",
      sortable: true,
      className: "min-w-[315px]",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative flex aspect-square size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-400 bg-neutral-100">
            {row.avatar ? (
              <img
                src={row.avatar}
                alt={row.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <IconComponent
                src="/icons/person.svg"
                className="text-neutral-600"
                width={20}
                height={20}
              />
            )}
          </div>
          <div>
            <div className="line-clamp-1 text-xs font-bold">{row.name}</div>
            <div className="mt-2 text-[10px] font-medium">{row.phone}</div>
          </div>
        </div>
      ),
    },
    {
      key: "licenseType",
      header: "No. Pol Kendaraan",
      sortable: true,
      render: (row) => (
        <div className="text-[10px] font-medium">
          {row.truckLicensePlate || "-"}
        </div>
      ),
    },
    {
      key: "vehicleType",
      header: "Jenis Armada",
      sortable: false,
      render: (row) => (
        <div className="line-clamp-2 text-[10px] font-medium">
          {row.truckType || ""}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: false,
      className: "min-w-[200px]",
      render: (row) => getStatusBadge(row.status),
    },
  ];

  // Filter configuration
  const getFilterConfig = () => {
    return {
      categories: [{ key: "status", label: "Status" }],
      data: {
        status: [
          { id: "READY_FOR_ORDER", label: "Siap Menerima Order" },
          { id: "WAITING_FOR_LOADING", label: "Menunggu Jam Muat" },
          { id: "SCHEDULED", label: "Akan Muat Hari Ini" },
          { id: "ON_DUTY", label: "Bertugas" },
          { id: "NOT_PAIRED", label: "Belum Dipasangkan" },
          { id: "NON_ACTIVE", label: "Nonaktif" },
        ],
      },
    };
  };

  // Search and filter logic
  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      performSearch(searchValue);
    }
  };

  const performSearch = (value) => {
    if (value.length >= 3 || value.length === 0) {
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    performSearch("");
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (limit) => {
    setPerPage(limit);
    setCurrentPage(1);
  };

  const getActiveFilters = () => {
    const activeFilters = [];
    Object.entries(filters).forEach(([categoryKey, items]) => {
      if (Array.isArray(items)) {
        items.forEach((item) => {
          activeFilters.push({
            id: `${categoryKey}-${item.id}`,
            label: item.label,
            categoryKey,
            item,
          });
        });
      } else if (items) {
        activeFilters.push({
          id: `${categoryKey}-${items.id || items}`,
          label: items.label || items,
          categoryKey,
          item: items,
        });
      }
    });
    return activeFilters;
  };

  const handleRemoveFilter = (filter) => {
    const newFilters = { ...filters };
    if (Array.isArray(newFilters[filter.categoryKey])) {
      newFilters[filter.categoryKey] = newFilters[filter.categoryKey].filter(
        (item) => (item.id || item) !== (filter.item.id || filter.item)
      );
      if (newFilters[filter.categoryKey].length === 0) {
        delete newFilters[filter.categoryKey];
      }
    } else {
      delete newFilters[filter.categoryKey];
    }
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let order = "asc";
    if (sortConfig.sort === key && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ sort: key, order });
    setCurrentPage(1);
  };

  // Transform API data to match component expectations
  const transformDriverData = (apiDrivers) => {
    if (!apiDrivers || !Array.isArray(apiDrivers)) return [];

    return apiDrivers.map((driver) => ({
      id: driver.id,
      name: driver.name,
      phone: driver.phoneNumber,
      truckLicensePlate: driver.truckLicensePlate,
      truckType: driver.truckType,
      truckCarrierType: driver.truckCarrierType,
      status: getStatusLabel(driver.status),
      avatar: driver.photo || null,
    }));
  };

  // Transform and prepare data
  const transformedData = transformDriverData(mockDriverData);

  // Data filtering and pagination
  const getFilteredData = () => {
    let filteredData = [...transformedData];

    if (searchValue.trim() && searchValue.length >= 3) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }

    if (filters.status) {
      const statusValue =
        typeof filters.status === "object" ? filters.status.id : filters.status;
      filteredData = filteredData.filter((item) => {
        // Get the original API status from the raw data
        const originalDriver = mockDriverData?.find(
          (driver) => driver.id === item.id
        );
        return originalDriver?.status === statusValue;
      });
    }

    if (sortConfig.sort && sortConfig.order) {
      filteredData.sort((a, b) => {
        let aValue = a[sortConfig.sort];
        let bValue = b[sortConfig.sort];

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.order === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.order === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  const filteredData = getFilteredData();
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const showPagination = totalItems >= 10;

  // Data state logic
  const hasSearch = searchValue.trim().length > 0;
  const hasFilters = Object.keys(filters).length > 0;
  const hasData = filteredData.length > 0;
  const originalDataExists = transformedData.length > 0;

  const showNoDataState = !originalDataExists;
  const showSearchNotFoundState = hasSearch && !hasData && originalDataExists;
  const showFilterNotFoundState =
    hasFilters && !hasData && originalDataExists && !hasSearch;

  return (
    <TabsContent value="daftar-driver" className="">
      <div className="mt-4 overflow-hidden !rounded-xl !bg-white shadow-muat">
        {showNoDataState ? (
          <div className="flex h-[400px] w-full flex-col items-center justify-center">
            <DataNotFound type="data" width={95} height={76}>
              <div className="text-center text-neutral-600">
                <p className="font-semibold">Belum Ada Driver</p>
                <p className="mt-2 text-xs font-medium">
                  Hubungi Transporter untuk menambahkan driver
                </p>
              </div>
            </DataNotFound>
          </div>
        ) : (
          <>
            {/* Search and Filter Section */}
            <div className="px-6 pb-6 pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Input
                    icon={{
                      left: (
                        <IconComponent
                          src="/icons/search16.svg"
                          className="!text-neutral-700"
                          width={16}
                          height={16}
                        />
                      ),
                      right: searchValue.length > 0 && (
                        <button onClick={handleClearSearch}>
                          <IconComponent
                            src="/icons/close20.svg"
                            width={20}
                            height={20}
                          />
                        </button>
                      ),
                    }}
                    appearance={{
                      inputClassName: "!text-xs",
                      containerClassName: "!w-full min-w-[262px]",
                    }}
                    placeholder="Cari Driver"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    disabled={showFilterNotFoundState}
                  />
                  <FilterDropdown
                    triggerClassName="!w-[165px] hover:!border-neutral-600 hover:!bg-white"
                    selectedValues={filters}
                    categories={getFilterConfig().categories}
                    data={getFilterConfig().data}
                    onSelectionChange={handleFilter}
                    multiSelect={false}
                    searchable={false}
                    disabled={showSearchNotFoundState}
                  />
                </div>
                <div>
                  <p className="font-semibold">Total: {totalItems} Driver</p>
                </div>
              </div>

              {/* Active Filters */}
              {Object.keys(filters).length > 0 && (
                <div className="mt-6">
                  <ActiveFiltersBar
                    filters={getActiveFilters()}
                    onRemoveFilter={handleRemoveFilter}
                    onClearAll={handleClearAllFilters}
                  />
                </div>
              )}
            </div>

            {/* Table */}
            <Table
              data={paginatedData}
              columns={driverColumns}
              emptyComponent={
                showSearchNotFoundState ? (
                  <DataNotFound type="search" title="Keyword Tidak Ditemukan" />
                ) : showFilterNotFoundState ? (
                  <DataNotFound
                    type="data"
                    title="Data tidak Ditemukan."
                    subtitle="Mohon coba hapus beberapa filter"
                  />
                ) : (
                  <DataNotFound
                    type="data"
                    title="Belum Ada Driver"
                    subtitle="Hubungi Transporter untuk menambahkan driver"
                  />
                )
              }
              onSort={handleSort}
              sortConfig={sortConfig}
            />
          </>
        )}
      </div>
      {/* Pagination */}
      {showPagination && hasData && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            perPage={perPage}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            variants="muatrans"
          />
        </div>
      )}
    </TabsContent>
  );
};

export default DaftarDriverTab;
