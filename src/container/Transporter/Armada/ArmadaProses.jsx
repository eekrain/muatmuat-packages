"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import { DataTable } from "@/components/DataTable";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import { getArmadaStatusBadge } from "@/lib/utils/armadaStatus";
import { useGetProcessVehiclesData } from "@/services/Transporter/manajemen-armada/getProcessVehiclesData";

const ArmadaProses = ({ onPageChange, onPerPageChange, onStatusChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});

  // Fetch vehicles data with pagination, filters and status
  const { data, isLoading } = useGetProcessVehiclesData({
    page: currentPage,
    limit: perPage,
    search: searchValue,
    status: selectedStatus,
    ...filters,
  });

  const getStatusBadge = (status) => {
    const statusConfig = getArmadaStatusBadge(status);
    return (
      <BadgeStatus variant={statusConfig.variant}>
        {statusConfig.label}
      </BadgeStatus>
    );
  };

  const columns = [
    {
      key: "photo",
      header: "Foto",
      width: "80px",
      sortable: false,
      render: (row) => (
        <div className="h-12 w-12 overflow-hidden rounded">
          <img
            src={row.photoUrl || "/img/truck.png"}
            alt={row.licensePlate}
            className="h-full w-full object-cover"
          />
        </div>
      ),
    },
    {
      key: "licensePlate",
      header: "No. Polisi",
      render: (row) => (
        <div className="text-xs font-bold">{row.licensePlate}</div>
      ),
    },
    {
      key: "truckType",
      header: "Jenis Armada",
      render: (row) => (
        <div className="space-y-1">
          <div className="text-xs font-semibold">{row.truckType?.name}</div>
          <div className="text-xxs font-medium text-neutral-600">
            {row.carrierType?.name}
          </div>
        </div>
      ),
    },
    {
      key: "vehicleBrand",
      header: "Merek Kendaraan",
      render: (row) => row.vehicleBrand?.name || "-",
    },
    {
      key: "vehicleType",
      header: "Tipe Kendaraan",
      render: (row) => row.vehicleType?.name || "-",
    },
    {
      key: "status",
      header: "Status",
      sortable: false,
      render: (row) => getStatusBadge(row.status),
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

          <SimpleDropdownContent className="w-fit">
            <SimpleDropdownItem onClick={() => {}}>Detail</SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => {}}>Edit</SimpleDropdownItem>
            {row.status === "VERIFICATION_REJECTED" && (
              <SimpleDropdownItem onClick={() => {}}>
                Kirim Ulang Verifikasi
              </SimpleDropdownItem>
            )}
            {row.status === "WAITING_GPS_INSTALLATION" && (
              <SimpleDropdownItem onClick={() => {}}>
                Konfirmasi Pemasangan GPS
              </SimpleDropdownItem>
            )}
            <SimpleDropdownItem onClick={() => {}}>Batalkan</SimpleDropdownItem>
          </SimpleDropdownContent>
        </SimpleDropdown>
      ),
    },
  ];

  const handleSearch = (value) => {
    // Search functionality
    setSearchValue(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilter = (newFilters) => {
    // Apply filters
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Transform dataFilter to match FilterDropdown format
  const getFilterConfig = () => {
    if (!data?.dataFilter) return null;

    return {
      categories: [
        { key: "truckType", label: "Jenis Truk" },
        { key: "carrierType", label: "Jenis Carrier" },
        { key: "vehicleBrand", label: "Merek Kendaraan" },
        { key: "vehicleType", label: "Tipe Kendaraan" },
      ],
      data: {
        truckType:
          data.dataFilter.truckType?.map((item) => ({
            id: item.id,
            label: item.value,
          })) || [],
        carrierType:
          data.dataFilter.carrierType?.map((item) => ({
            id: item.id,
            label: item.value,
          })) || [],
        vehicleBrand:
          data.dataFilter.vehicleBrand?.map((item) => ({
            id: item.id,
            label: item.value,
          })) || [],
        vehicleType:
          data.dataFilter.vehicleType?.map((item) => ({
            id: item.id,
            label: item.value,
          })) || [],
      },
    };
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handlePerPageChange = (limit) => {
    setPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing items per page
    onPerPageChange?.(limit);
  };

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    // Sorting by key and direction
    // TODO: Implement actual sorting logic here
    // This would typically involve calling an API with sort parameters
  };

  const handleStatusChange = (status) => {
    // Status clicked
    setSelectedStatus(status);
    onStatusChange?.(status);
    // New status set
  };

  // Add warning indicators to rows
  // const rowClassName = (row) => {
  //   if (row.status === "VERIFICATION_REJECTED") {
  //     return "bg-red-50";
  //   }
  //   return "";
  // };

  // Prepare display options for status filter
  const getDisplayOptions = () => {
    // Get display options called

    if (!data?.dataFilter?.status) {
      // No status data available in dataFilter
      return null;
    }

    // Map status IDs to summary keys
    const getCountFromSummary = (statusId) => {
      if (!data?.summary) return 0;

      switch (statusId) {
        case "IN_REVIEW":
          return data.summary.dalamTinjauan || 0;
        case "VERIFICATION_REJECTED":
          return data.summary.verifikasiDitolak || 0;
        case "WAITING_GPS_INSTALLATION":
          return data.summary.menungguPemasanganGPS || 0;
        case "CALIBRATION_PROCESS":
          return data.summary.prosesKalibrasi || 0;
        default:
          return 0;
      }
    };

    const statusOptions = data.dataFilter.status.map((item) => {
      const count = getCountFromSummary(item.id);
      return {
        value: item.id,
        label: item.value,
        count: count,
        hasNotification: item.id === "CALIBRATION_PROCESS" && count > 0,
      };
    });

    // Status options with summary counts

    return {
      statusOptions,
      currentStatus: selectedStatus,
      onStatusChange: handleStatusChange,
      totalCount:
        data?.summary?.totalProcess || data?.pagination?.totalItems || 0,
    };
  };

  return (
    <div className="h-[calc(100vh-300px)]">
      <DataTable
        data={data?.vehicles || []}
        columns={columns}
        searchPlaceholder="Cari No. Polisi, Jenis Truk atau lainnya"
        totalCountLabel="Armada"
        currentPage={data?.pagination?.page || currentPage}
        totalPages={data?.pagination?.totalPages || 1}
        totalItems={data?.pagination?.totalItems || 0}
        perPage={data?.pagination?.limit || perPage}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        loading={isLoading}
        showPagination
        showDisplayView={true}
        displayOptions={getDisplayOptions()}
        // rowClassName={rowClassName}
        filterConfig={getFilterConfig()}
      />
    </div>
  );
};

export default ArmadaProses;
