"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import { DataTable } from "@/components/DataTable";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";

const ArmadaNonaktif = ({ data, isLoading, onPageChange, onPerPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const getStatusBadge = (status) => {
    switch (status) {
      case "UNPAIRED":
        return <BadgeStatus variant="warning">Belum Dipasangkan</BadgeStatus>;
      case "INACTIVE":
        return <BadgeStatus variant="neutral">Tidak Aktif</BadgeStatus>;
      default:
        return <BadgeStatus variant="neutral">{status}</BadgeStatus>;
    }
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
      key: "driver",
      header: "Driver",
      width: "280px",
      render: (row) => (
        <div className="">
          <div className="text-xxs font-semibold">
            {row.assignedDriver?.fullName || "-"}
          </div>
          <div className="text-xxs font-medium text-neutral-600">
            {row.assignedDriver?.whatsappNumber
              ? `No. HP : ${row.assignedDriver.whatsappNumber}`
              : "-"}
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
            <SimpleDropdownItem onClick={() => {}}>
              Aktifkan Armada
            </SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => {}}>Detail</SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => {}}>Edit</SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => {}}>Hapus</SimpleDropdownItem>
          </SimpleDropdownContent>
        </SimpleDropdown>
      ),
    },
  ];

  const handleSearch = (searchValue) => {
    console.log("Search:", searchValue);
    // Implement search logic here
  };

  const handleFilter = (filters) => {
    console.log("Filters:", filters);
    // Implement filter logic here
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

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
    console.log(`Sorting by ${key} in ${direction} order`);
    // TODO: Implement actual sorting logic here
    // This would typically involve calling an API with sort parameters
  };

  // Add warning indicators to rows
  const rowClassName = (row) => {
    if (row.warningDocumentExpired) {
      return "";
    }
    return "";
  };

  return (
    <DataTable
      data={data?.vehicles || []}
      columns={columns}
      searchPlaceholder="Cari No. Polisi, Jenis Truk atau lainnya"
      totalCountLabel="Armada Nonaktif"
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
      rowClassName={rowClassName}
      filterConfig={getFilterConfig()}
      emptyState={
        <div className="flex flex-col items-center gap-2 py-8">
          <div className="text-sm text-neutral-500">
            Tidak ada armada nonaktif
          </div>
          <Button variant="muatparts-primary" size="sm">
            Tambah Armada
          </Button>
        </div>
      }
    />
  );
};

export default ArmadaNonaktif;
