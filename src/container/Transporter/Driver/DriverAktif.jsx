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
import { FleetSelectionModal } from "@/container/Transporter/Armada/FleetSelectionModal";
import { getDriverStatusBadge } from "@/lib/utils/driverStatus";
import { getPhoneNumberStatus } from "@/lib/utils/phoneNumberStatus";
import { useGetActiveDriversData } from "@/services/Transporter/manajemen-driver/getActiveDriversData";

const DriverAktif = ({ onPageChange, onPerPageChange }) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Fetch drivers data with pagination and filters
  const { data, isLoading, mutate } = useGetActiveDriversData({
    page: currentPage,
    limit: perPage,
    search: searchValue,
    ...filters,
  });

  const columns = [
    {
      key: "photo",
      header: "Foto",
      width: "80px",
      sortable: false,
      render: (row) => (
        <div className="h-12 w-12 overflow-hidden rounded-md">
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
      render: (row) => <div className="text-xs font-bold">{row.name}</div>,
    },
    {
      key: "fleet",
      header: "Armada",
      width: "280px",
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-end gap-3">
            <div className="line-clamp-1 h-3 flex-1 break-all text-xxs font-semibold">
              No. Polisi : {row.fleet?.licensePlate || "-"}
            </div>

            {row.fleet && (
              <div className="flex gap-1">
                <button
                  className="text-neutral-700 hover:text-primary-700"
                  onClick={() => {
                    setSelectedDriver(row);
                    setIsModalOpen(true);
                  }}
                >
                  <IconComponent size={12} src={"/icons/pencil-outline.svg"} />
                </button>
                <button className="text-neutral-700 hover:text-primary-700">
                  <IconComponent size={12} src={"/icons/unlink.svg"} />
                </button>
              </div>
            )}
          </div>
          <div className="text-xxs font-medium">
            {row.fleet ? (
              `${row.fleet.truckType?.carrierTruck?.name} - ${row.fleet.truckType?.name}`
            ) : (
              <button
                className="font-semibold text-primary-700 hover:text-primary-700"
                onClick={() => {
                  setSelectedDriver(row);
                  setIsModalOpen(true);
                }}
              >
                Pilih Armada
              </button>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "phoneNumber",
      header: "No. Whatsapp",
      render: (row) => {
        const phoneStatus = getPhoneNumberStatus(row.verificationStatus);
        return (
          <div className="space-y-1 text-xxs">
            {phoneStatus && (
              <div className="flex items-center gap-1">
                <IconComponent
                  src={`/icons/${phoneStatus.icon}`}
                  className={`size-3 ${phoneStatus.color}`}
                />
                <span className={`font-semibold ${phoneStatus.color}`}>
                  {phoneStatus.label}
                </span>
              </div>
            )}
            <div className="font-semibold">{row.phoneNumber || "-"}</div>
          </div>
        );
      },
    },
    {
      key: "driverStatus",
      header: "Status Driver",
      sortable: false,
      render: (row) => {
        const statusConfig = getDriverStatusBadge(row.driverStatus);
        return (
          <BadgeStatus variant={statusConfig.variant}>
            {statusConfig.label}
          </BadgeStatus>
        );
      },
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
            {row.driverStatus === "READY_FOR_ORDER" && (
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

  const handleFleetUpdateSuccess = () => {
    // Refresh the drivers data to reflect the change
    mutate();

    // Close modal and reset state
    setIsModalOpen(false);
    setSelectedDriver(null);
  };

  return (
    <>
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

      {isModalOpen && (
        <FleetSelectionModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleFleetUpdateSuccess}
          driverId={selectedDriver?.id}
          driverName={selectedDriver?.name}
          currentFleetId={selectedDriver?.fleet?.id}
          title={selectedDriver?.fleet ? "Ubah Armada" : "Pilih Armada"}
        />
      )}
    </>
  );
};

export default DriverAktif;
