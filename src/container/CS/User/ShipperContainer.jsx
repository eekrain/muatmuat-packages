"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ChevronDown } from "lucide-react";

import { useGetCSShippersWithParams } from "@/services/CS/shippers/getCSShippers";

import ActiveFiltersBar from "@/components/ActiveFiltersBar/ActiveFiltersBar";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import ShipperSearchAndFilter from "@/app/cs/(main)/user/components/ShipperSearchAndFilter";
import TransporterEmptyStates from "@/app/cs/(main)/user/components/TransporterEmptyStates";
import { useShipperLogic } from "@/app/cs/(main)/user/components/useShipperLogic";

const ShipperContainer = ({
  onPageChange,
  onPerPageChange,
  count,
  onDataStateChange,
}) => {
  const router = useRouter();

  const {
    currentPage,
    perPage,
    searchValue,
    searchQuery,
    filters,
    processedFilters,
    sortConfig,

    // Handlers
    handleSearch,
    handleSearchKeyDown,
    handleSearchBlur,
    handleClearSearch,
    handleFilter,
    getActiveFilters,
    handleRemoveFilter,
    handleClearAllFilters,
    handlePageChange,
    handlePerPageChange,
    handleSort,
  } = useShipperLogic({ onPageChange, onPerPageChange, onDataStateChange });

  // Fetch data from mock API using the service
  const {
    data,
    error: fetchError,
    isLoading: loading,
  } = useGetCSShippersWithParams({
    page: currentPage,
    limit: perPage,
    // only trigger search when performSearch updated searchQuery in the hook
    search: (searchQuery || "").trim(),
    // include processed filters so server-side filtering can work
    ...(processedFilters && Object.keys(processedFilters).length > 0
      ? { ...processedFilters }
      : {}),
  });

  const apiData = data?.Data || {};
  const apiShippers = apiData.shippers || [];
  const pagination = apiData.pagination || {};
  const totalItemsLocal = pagination.totalItems ?? 0;
  const totalPagesLocal = pagination.totalPages ?? 1;
  const isLoading = loading;
  const error = fetchError;
  // apply sort from sortConfig if provided (simple client-side sort)
  const sortedShippers = (() => {
    if (!sortConfig || !sortConfig.sort) return apiShippers;
    const { sort, order } = sortConfig;
    const dir = order === "desc" ? -1 : 1;
    return [...apiShippers].sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      if (av === null || typeof av === "undefined") return 1 * dir;
      if (bv === null || typeof bv === "undefined") return -1 * dir;
      if (typeof av === "string") return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });
  })();
  // ... no status badge helper needed for Shipper table

  const columns = [
    {
      key: "name",
      header: "Nama",
      render: (row) => (
        <div className="space-y-1">
          <div className="text-xxs font-semibold">{row.fullName}</div>
          <div className="text-xxs font-medium text-neutral-600">
            Email : {row.email || "-"}
          </div>
        </div>
      ),
      className: "min-w-64",
    },
    {
      key: "contact",
      header: "No. Whatsapp",
      width: "280px",
      render: (row) => (
        <div className="space-y-1">
          <div className="text-xxs font-medium">{row.whatsappNumber}</div>
        </div>
      ),
    },
    {
      key: "address",
      header: "Alamat",
      sortable: false,
      render: (row) => (
        <div className="text-xxs font-medium text-neutral-600">
          {row.companyAddress || "-"}
        </div>
      ),
      className: "w-full max-w-[700px]",
    },
    {
      key: "activeOrders",
      header: "Pesanan Aktif",
      render: (row) => (
        <div className="text-xxs font-medium">
          {row.activeOrders && Number(row.activeOrders) > 0
            ? `${row.activeOrders} Pesanan Aktif`
            : "Belum Ada"}
        </div>
      ),
    },
    {
      key: "completedOrders",
      header: "Pesanan Selesai",
      render: (row) => (
        <div className="text-xxs font-medium">
          {row.completedOrders && Number(row.completedOrders) > 0
            ? `${row.completedOrders} Pesanan Selesai`
            : "Belum Ada"}
        </div>
      ),
    },

    {
      key: "action",
      header: "",
      width: "120px",
      sortable: false,
      render: (row) => (
        <SimpleDropdown>
          <SimpleDropdownTrigger asChild>
            <button className="flex h-8 flex-row items-center justify-between gap-2 rounded-md border border-neutral-600 bg-white px-3 py-2 shadow-sm transition-colors duration-150 hover:border-primary-700 hover:bg-gray-50 focus:outline-none">
              <span className="text-xs font-medium leading-tight text-black">
                Aksi
              </span>
              <ChevronDown className="h-4 w-4 text-neutral-700" />
            </button>
          </SimpleDropdownTrigger>

          <SimpleDropdownContent className="w-[133px]" align="end">
            <SimpleDropdownItem
              onClick={() => router.push(`/user/shipper/${row.id}/detail`)}
            >
              Detail
            </SimpleDropdownItem>
            <SimpleDropdownItem
              onClick={() => {
                handleHubungiModal(row);
              }}
            >
              Hubungi
            </SimpleDropdownItem>
          </SimpleDropdownContent>
        </SimpleDropdown>
      ),
    },
  ];

  const [selectedData, setSelectedData] = useState();
  const [isHubungiModalOpen, setIsHubungiModalOpen] = useState(false);

  const handleHubungiModal = (row) => {
    setSelectedData(row);
    setIsHubungiModalOpen(true);
  };

  // handlers provided by useShipperLogic are used instead

  // Filter config for DataTable
  const getFilterConfig = () => {
    return {
      categories: [{ key: "status", label: "Filter" }],
      data: {
        status: [
          { id: "active", label: "Active" },
          { id: "inactive", label: "Inactive" },
        ],
        totalOrders: [
          { id: "0", label: "No Orders" },
          { id: "1-10", label: "1-10 Orders" },
          { id: "11-50", label: "11-50 Orders" },
          { id: "50+", label: "50+ Orders" },
        ],
      },
    };
  };
  // Map API shape to table rows expected by columns
  const paginated = sortedShippers;

  // Notify parent about data state
  useEffect(() => {
    if (onDataStateChange) {
      const hasSearch = !!searchValue;
      const hasFilters = filters && Object.keys(filters).length > 0;
      const hasData = totalItemsLocal > 0;
      const showNoDataState =
        !isLoading && !hasData && !hasSearch && !hasFilters;
      const showSearchNotFoundState =
        !isLoading && hasSearch && !hasData && !error && !hasFilters;
      const showFilterNotFoundState =
        !isLoading && hasFilters && !hasData && !error && !hasSearch;

      onDataStateChange({
        hasData,
        hasSearch,
        hasFilters,
        showSearchNotFoundState,
        showFilterNotFoundState,
        showNoDataState,
        totalItems: totalItemsLocal,
        isLoading,
        error,
      });
    }
  }, [
    onDataStateChange,
    totalItemsLocal,
    searchValue,
    filters,
    isLoading,
    error,
  ]);

  const emptyComponent = (
    <TransporterEmptyStates
      error={error}
      showNoDataState={
        !isLoading &&
        totalItemsLocal === 0 &&
        !searchValue &&
        !(filters && Object.keys(filters).length)
      }
      showSearchNotFoundState={!!searchValue && totalItemsLocal === 0}
      showFilterNotFoundState={
        filters && Object.keys(filters).length > 0 && totalItemsLocal === 0
      }
    />
  );

  return (
    <div className="h-[calc(100vh-300px)]">
      <div className="bg-white p-6 pt-5">
        <ShipperSearchAndFilter
          searchValue={searchValue}
          onSearch={handleSearch}
          onSearchKeyDown={handleSearchKeyDown}
          onSearchBlur={handleSearchBlur}
          onClearSearch={handleClearSearch}
          filters={filters}
          onFilter={handleFilter}
          showFilterNotFoundState={false}
          showSearchNotFoundState={false}
          isLoading={isLoading}
          totalItems={totalItemsLocal}
        />

        {Object.keys(filters || {}).length > 0 && (
          <div className="mt-4">
            <ActiveFiltersBar
              filters={getActiveFilters()}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />
          </div>
        )}
      </div>

      <div className="">
        <Table
          data={paginated}
          columns={columns}
          searchPlaceholder="Search company name, email, or PIC..."
          totalCountLabel="Shippers"
          currentPage={currentPage}
          totalPages={totalPagesLocal}
          totalItems={count || totalItemsLocal}
          perPage={perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={(key) => handleSort(key)}
          loading={isLoading}
          showPagination={false}
          filterConfig={getFilterConfig()}
          emptyComponent={emptyComponent}
          rowClassName={(_row, _index) => `border-b border-neutral-400`}
        />
      </div>

      {totalItemsLocal > 0 && !isLoading && !error && (
        <div className="px-6 pb-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPagesLocal}
            perPage={perPage}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            variants="muatrans"
          />
        </div>
      )}
      <HubungiModal
        isOpen={isHubungiModalOpen}
        onClose={() => setIsHubungiModalOpen(false)}
        contacts={{
          pics: selectedData?.contacts,
          emergencyContact: selectedData?.emergency,
          companyContact: selectedData?.picPhone,
        }}
      />
    </div>
  );
};

export default ShipperContainer;
