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
import IconComponent from "@/components/IconComponent/IconComponent";
import DriverSelectionModal from "@/components/Modal/DriverSelectionModal";
import { useGetDriversList } from "@/services/Transporter/manajemen-armada/getDriversList";
import { useGetInactiveVehiclesData } from "@/services/Transporter/manajemen-armada/getInactiveVehiclesData";
import { updateVehicleDriver } from "@/services/Transporter/manajemen-armada/updateVehicleDriver";

const ArmadaNonaktif = ({ onPageChange, onPerPageChange, onStatusChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [driverSearchValue, setDriverSearchValue] = useState("");

  // Fetch vehicles data with pagination, filters and status
  const { data, isLoading } = useGetInactiveVehiclesData({
    page: currentPage,
    limit: perPage,
    search: searchValue,
    status: selectedStatus,
    ...filters,
  });

  // Fetch drivers list
  const {
    data: driversData,
    error: driversError,
    isLoading: driversLoading,
  } = useGetDriversList({
    page: 1,
    limit: 10,
    search: driverSearchValue,
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "UNPAIRED":
        return <BadgeStatus variant="warning">Belum Dipasangkan</BadgeStatus>;
      case "INACTIVE":
        return <BadgeStatus variant="neutral">Nonaktif</BadgeStatus>;
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
        <div className="space-y-2">
          <div className="flex items-end gap-3 text-xxs font-semibold">
            {row.assignedDriver?.fullName ? (
              <>
                <div className="line-clamp-1 h-3 flex-1 break-all">
                  Driver : {row.assignedDriver?.fullName}
                </div>
                <div className="flex gap-1">
                  <button
                    className="text-neutral-700 hover:text-primary-700"
                    onClick={() => {
                      setSelectedVehicle(row);
                      setIsModalOpen(true);
                    }}
                  >
                    <IconComponent
                      size={12}
                      src={"/icons/pencil-outline.svg"}
                    />
                  </button>
                  <button className="text-neutral-700 hover:text-primary-700">
                    <IconComponent size={12} src={"/icons/unlink.svg"} />
                  </button>
                </div>
              </>
            ) : (
              "Driver : - "
            )}
          </div>
          <div className="text-xxs font-medium text-neutral-600">
            {row.assignedDriver?.whatsappNumber ? (
              `No. HP : ${row.assignedDriver.whatsappNumber}`
            ) : (
              <button
                className="font-semibold text-primary-700 hover:text-primary-700"
                onClick={() => {
                  setSelectedVehicle(row);
                  setIsModalOpen(true);
                }}
              >
                Pilih Driver
              </button>
            )}
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
  const rowClassName = (row) => {
    if (row.warningDocumentExpired) {
      return "";
    }
    return "";
  };

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
        case "UNPAIRED":
          return data.summary.unpaired || 0;
        case "INACTIVE":
          return data.summary.inactive || 0;
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
        hasNotification: item.id === "UNPAIRED" && count > 0,
      };
    });

    // Status options with summary counts

    return {
      statusOptions,
      currentStatus: selectedStatus,
      onStatusChange: handleStatusChange,
      totalCount:
        data?.summary?.totalInactive || data?.pagination?.totalItems || 0,
    };
  };

  const handleSaveDriver = async (vehicleId, driverId) => {
    try {
      await updateVehicleDriver(vehicleId, driverId);

      // After successful API call, refresh the data
      // You might want to trigger a refetch of the vehicle data here
      // For example: mutate() if using SWR

      setIsModalOpen(false);
      setSelectedVehicle(null);

      // Show success message (you might want to use a toast notification)
      // Driver updated successfully
    } catch (error) {
      // Failed to update driver
      // Show error message (you might want to use a toast notification)
    }
  };

  return (
    <>
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
        rowClassName={rowClassName}
        filterConfig={getFilterConfig()}
      />

      <DriverSelectionModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setDriverSearchValue(""); // Clear search when modal closes
          }
        }}
        onSave={handleSaveDriver}
        vehicleId={selectedVehicle?.id}
        vehiclePlate={selectedVehicle?.licensePlate}
        currentDriverId={selectedVehicle?.assignedDriver?.id}
        title={selectedVehicle?.assignedDriver ? "Ubah Driver" : "Pilih Driver"}
        drivers={driversData?.drivers || []}
        isLoading={driversLoading}
        error={driversError}
        onSearch={setDriverSearchValue}
      />
    </>
  );
};

export default ArmadaNonaktif;
