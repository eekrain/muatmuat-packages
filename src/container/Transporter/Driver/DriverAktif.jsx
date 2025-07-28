"use client";

import { useRouter } from "next/navigation";
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
import IconComponent from "@/components/IconComponent/IconComponent";
import { useGetActiveDriversData } from "@/services/Transporter/manajemen-driver/getActiveDriversData";

const DriverAktif = ({ onPageChange, onPerPageChange }) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});

  // Fetch drivers data with pagination and filters
  const { data, isLoading, mutate } = useGetActiveDriversData({
    page: currentPage,
    limit: perPage,
    search: searchValue,
    ...filters,
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return <BadgeStatus variant="success">Tersedia</BadgeStatus>;
      case "ON_DUTY":
        return <BadgeStatus variant="primary">Bertugas</BadgeStatus>;
      case "REST":
        return <BadgeStatus variant="warning">Istirahat</BadgeStatus>;
      default:
        return <BadgeStatus variant="neutral">{status}</BadgeStatus>;
    }
  };

  const getVerificationBadge = (status) => {
    switch (status) {
      case "VERIFIED":
        return <BadgeStatus variant="success">Terverifikasi</BadgeStatus>;
      case "UNVERIFIED":
        return <BadgeStatus variant="warning">Belum Terverifikasi</BadgeStatus>;
      case "REJECTED":
        return <BadgeStatus variant="danger">Ditolak</BadgeStatus>;
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
        <div className="h-12 w-12 overflow-hidden rounded-full">
          <img
            src={row.profileImage || "/img/default-avatar.png"}
            alt={row.name}
            className="h-full w-full object-cover"
          />
        </div>
      ),
    },
    {
      key: "name",
      header: "Nama Driver",
      render: (row) => (
        <div className="space-y-1">
          <div className="text-xs font-bold">{row.name}</div>
          <div className="text-xxs font-medium text-neutral-600">
            {row.phoneNumber}
          </div>
          <div className="flex gap-2">
            {row.warningDocumentExpired && (
              <IconComponent
                size={16}
                src={"/icons/warning-triangle.svg"}
                className="text-warning-500"
              />
            )}
            {row.pendingUpdateDriver && (
              <IconComponent
                size={16}
                src={"/icons/info-circle.svg"}
                className="text-info-500"
              />
            )}
          </div>
        </div>
      ),
    },
    {
      key: "fleet",
      header: "Armada",
      render: (row) => (
        <div className="space-y-1">
          {row.fleet ? (
            <>
              <div className="text-xs font-semibold">
                {row.fleet.licensePlate}
              </div>
              <div className="text-xxs font-medium text-neutral-600">
                {row.fleet.truckType?.carrierTruck?.name} -{" "}
                {row.fleet.truckType?.name}
              </div>
            </>
          ) : (
            <span className="text-xs text-neutral-500">Belum ditugaskan</span>
          )}
        </div>
      ),
    },
    {
      key: "driverStatus",
      header: "Status Driver",
      sortable: false,
      render: (row) => getStatusBadge(row.driverStatus),
    },
    {
      key: "verificationStatus",
      header: "Status Verifikasi",
      sortable: false,
      render: (row) => getVerificationBadge(row.verificationStatus),
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
              Lihat Agenda Driver
            </SimpleDropdownItem>
            {row.driverStatus === "AVAILABLE" && (
              <SimpleDropdownItem onClick={() => {}}>
                Nonaktifkan
              </SimpleDropdownItem>
            )}
            <SimpleDropdownItem
              onClick={() => router.push(`/manajemen-driver/${row.id}/detail`)}
            >
              Detail
            </SimpleDropdownItem>
          </SimpleDropdownContent>
        </SimpleDropdown>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Transform dataFilter to match FilterDropdown format
  const getFilterConfig = () => {
    if (!data?.dataFilter) return null;

    return {
      categories: [
        { key: "truckType", label: "Jenis Truk" },
        { key: "carrierType", label: "Jenis Carrier" },
        { key: "verificationStatus", label: "Status Verifikasi" },
        { key: "driverStatus", label: "Status Driver" },
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
        verificationStatus:
          data.dataFilter.verificationStatus?.map((item) => ({
            id: item.id,
            label: item.value,
          })) || [],
        driverStatus:
          data.dataFilter.driverStatus?.map((item) => ({
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
    setCurrentPage(1);
    onPerPageChange?.(limit);
  };

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
  };

  const rowClassName = (row) => {
    if (row.warningDocumentExpired || row.pendingUpdateDriver) {
      return "";
    }
    return "";
  };

  return (
    <div className="h-[calc(100vh-300px)]">
      <DataTable
        data={data?.drivers || []}
        columns={columns}
        searchPlaceholder="Cari Nama Driver, No. HP atau lainnya"
        totalCountLabel="Driver"
        currentPage={data?.pagination?.currentPage || currentPage}
        totalPages={data?.pagination?.totalPages || 1}
        totalItems={data?.pagination?.totalItems || 0}
        perPage={data?.pagination?.itemsPerPage || perPage}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        loading={isLoading}
        showPagination
        rowClassName={rowClassName}
        filterConfig={getFilterConfig()}
      />
    </div>
  );
};

export default DriverAktif;
