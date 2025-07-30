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
import { useGetProcessDriversData } from "@/services/Transporter/manajemen-driver/getProcessDriversData";

const DriverProses = ({ count, onPageChange, onPerPageChange }) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});

  const { data, isLoading } = useGetProcessDriversData({
    page: currentPage,
    limit: perPage,
    search: searchValue,
    ...filters,
  });

  const getProcessStatusBadge = (status) => {
    switch (status) {
      case "PENDING_VERIFICATION":
        return <BadgeStatus variant="warning">Menunggu Verifikasi</BadgeStatus>;
      case "IN_REVIEW":
        return <BadgeStatus variant="info">Sedang Ditinjau</BadgeStatus>;
      case "ADDITIONAL_DOCS_REQUIRED":
        return (
          <BadgeStatus variant="warning">
            Dokumen Tambahan Diperlukan
          </BadgeStatus>
        );
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
        </div>
      ),
    },
    {
      key: "submittedDate",
      header: "Tanggal Daftar",
      render: (row) => (
        <div className="text-xs">
          {row.submittedDate
            ? new Date(row.submittedDate).toLocaleDateString("id-ID")
            : "-"}
        </div>
      ),
    },
    {
      key: "processStatus",
      header: "Status Proses",
      sortable: false,
      render: (row) => getProcessStatusBadge(row.processStatus),
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
              Tinjau Dokumen
            </SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => {}}>
              Verifikasi
            </SimpleDropdownItem>
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

  return (
    <div className="h-[calc(100vh-300px)]">
      <DataTable
        data={data?.drivers || []}
        columns={columns}
        searchPlaceholder="Cari Nama Driver, No. HP atau lainnya"
        totalCountLabel="Proses Pendaftaran"
        currentPage={data?.pagination?.currentPage || currentPage}
        totalPages={data?.pagination?.totalPages || 1}
        totalItems={count || 0}
        perPage={data?.pagination?.itemsPerPage || perPage}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        loading={isLoading}
        showPagination
      />
    </div>
  );
};

export default DriverProses;
