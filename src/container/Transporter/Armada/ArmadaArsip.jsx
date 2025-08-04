"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import { DataTable } from "@/components/DataTable";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import { getArmadaStatusBadge } from "@/lib/utils/armadaStatus";
import { useGetArchivedVehiclesData } from "@/services/Transporter/manajemen-armada/getArchivedVehiclesData";

const ArmadaArsip = ({ onPageChange, onPerPageChange, count }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Fetch vehicles data with pagination and filters
  const { data, isLoading } = useGetArchivedVehiclesData({
    page: currentPage,
    limit: perPage,
    search: searchValue,
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
      header: "Nama Kendaraan",
      render: (row) => (
        <div className="space-y-1">
          <div className="text-xs font-bold">{row.licensePlate}</div>
          <div className="text-xxs font-medium">
            {row.carrierType?.name} - {row.truckType?.name}
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
        <SimpleDropdown
          open={openDropdowns[row.id] || false}
          onOpenChange={(isOpen) =>
            setOpenDropdowns((prev) => ({ ...prev, [row.id]: isOpen }))
          }
        >
          <SimpleDropdownTrigger asChild>
            <button className="flex h-8 flex-row items-center justify-between gap-2 rounded-md border border-neutral-600 bg-white px-3 py-2 shadow-sm transition-colors duration-150 hover:border-primary-700 hover:bg-gray-50 focus:outline-none">
              <span className="text-xs font-medium leading-tight text-black">
                Aksi
              </span>
              {openDropdowns[row.id] ? (
                <ChevronUp className="h-4 w-4 text-neutral-700" />
              ) : (
                <ChevronDown className="h-4 w-4 text-neutral-700" />
              )}
            </button>
          </SimpleDropdownTrigger>

          <SimpleDropdownContent className="w-[124px]" align="end">
            <SimpleDropdownItem
              onClick={() =>
                router.push(`/manajemen-armada/${row.id}/detail?from=archive`)
              }
            >
              Detail
            </SimpleDropdownItem>
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
        { key: "status", label: "Status" },
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
        status:
          data.dataFilter.status?.map((item) => ({
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

  const handleSort = (sort, order) => {
    setSortConfig({ sort, order });
    // Sorting by sort and order
    // TODO: Implement actual sorting logic here
    // This would typically involve calling an API with sort parameters
  };

  return (
    <div className="h-[calc(100vh-300px)]">
      <DataTable
        data={data?.vehicles || []}
        columns={columns}
        searchPlaceholder="Cari No. Polisi, Jenis Truk atau lainnya"
        totalCountLabel="Armada Arsip"
        currentPage={data?.pagination?.page || currentPage}
        totalPages={data?.pagination?.totalPages || 1}
        totalItems={count || data?.pagination?.totalItems || 0}
        perPage={data?.pagination?.limit || perPage}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        loading={isLoading}
        showPagination
        filterConfig={getFilterConfig()}
      />
    </div>
  );
};

export default ArmadaArsip;
