"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ChevronDown } from "lucide-react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import { DataTable } from "@/components/DataTable";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import PageTitle from "@/components/PageTitle/PageTitle";
import { getArmadaStatusBadge } from "@/lib/utils/armadaStatus";
import { useGetExpiredVehicles } from "@/services/Transporter/manajemen-armada/getExpiredVehicles";

const Page = () => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});

  // Fetch expired vehicles data with pagination and filters
  const { data, isLoading, mutate } = useGetExpiredVehicles({
    page: currentPage,
    limit: perPage,
    search: searchValue,
    ...filters,
  });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getStatusBadge = (vehicle) => {
    const statusConfig = getArmadaStatusBadge(vehicle.status);
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
      key: "stnkExpiryDate",
      header: "Masa Berlaku STNK",
      render: (row) => (
        <div className="text-xs">{formatDate(row.stnkExpiryDate)}</div>
      ),
    },
    {
      key: "kirExpiryDate",
      header: "Masa Berlaku KIR",
      render: (row) => (
        <div className="text-xs">{formatDate(row.kirExpiryDate)}</div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: false,
      render: (row) => getStatusBadge(row),
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

          <SimpleDropdownContent className="w-[124px]" align="end">
            <SimpleDropdownItem
              onClick={() =>
                router.push(`/manajemen-armada/${row.id}/detail?from=expired`)
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
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters) => {
    const processedFilters = {};

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        processedFilters[key] = value.map((item) =>
          typeof item === "object" && item.id ? item.id : item
        );
      } else if (typeof value === "object" && value?.id) {
        processedFilters[key] = value.id;
      } else {
        processedFilters[key] = value;
      }
    });

    setFilters(processedFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (limit) => {
    setPerPage(limit);
    setCurrentPage(1);
  };

  const handleSort = (sort, order) => {
    setSortConfig({ sort, order });
  };

  // Breadcrumb data
  const breadcrumbData = [
    {
      name: "Manajemen Armada",
      href: "/manajemen-armada",
    },
    {
      name: "Perlu Pembaruan STNK/KIR",
    },
  ];

  return (
    <div className="my-6 max-h-screen w-full space-y-4">
      <BreadCrumb data={breadcrumbData} className="mb-2" />
      <PageTitle withBack={true}>Perlu Pembaruan STNK/KIR</PageTitle>

      <div className="h-[calc(100vh-260px)]">
        <DataTable
          data={data?.items || []}
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
        />
      </div>
    </div>
  );
};

export default Page;
