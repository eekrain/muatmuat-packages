"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { Alert } from "@/components/Alert/Alert";
import BadgeStatus from "@/components/Badge/BadgeStatus";
import { DataTable } from "@/components/DataTable";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import {
  DriverSelectionModal,
  ExpiredDocumentWarningModal,
} from "@/container/Transporter/Driver/DriverSelectionModal";
import { toast } from "@/lib/toast";
import { getArmadaStatusBadge } from "@/lib/utils/armadaStatus";
import { activateVehicle } from "@/services/Transporter/manajemen-armada/activateVehicle";
import { deleteVehicle } from "@/services/Transporter/manajemen-armada/deleteVehicle";
import { useGetExpiredVehiclesSummary } from "@/services/Transporter/manajemen-armada/getExpiredVehicles";
import { useGetInactiveVehiclesData } from "@/services/Transporter/manajemen-armada/getInactiveVehiclesData";
import { unlinkDriver } from "@/services/Transporter/manajemen-armada/unlinkDriver";

const ArmadaNonaktif = ({
  onPageChange,
  onPerPageChange,
  onStatusChange,
  count,
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showExpiredWarning, setShowExpiredWarning] = useState(false);
  const [confirmUnlinkDriver, setConfirmUnlinkDriver] = useState(false);
  const [confirmDeleteVehicle, setConfirmDeleteVehicle] = useState(false);
  const [confirmActivateVehicle, setConfirmActivateVehicle] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Fetch vehicles data with pagination, filters and status
  const { data, isLoading, mutate } = useGetInactiveVehiclesData({
    page: currentPage,
    limit: perPage,
    search: searchValue,
    status: selectedStatus,
    ...filters,
    ...sortConfig,
  });

  // Fetch expired vehicles summary
  const { data: summaryData } = useGetExpiredVehiclesSummary();

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
      key: "driver",
      header: "Driver",
      width: "280px",
      render: (row) => (
        <div className="space-y-1">
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
                      if (row.warningDocumentExpired) {
                        setShowExpiredWarning(true);
                      } else {
                        setIsModalOpen(true);
                      }
                    }}
                  >
                    <IconComponent
                      size={12}
                      src={"/icons/pencil-outline.svg"}
                    />
                  </button>
                  <button
                    className="text-neutral-700 hover:text-primary-700"
                    onClick={() => {
                      setSelectedVehicle(row);
                      setConfirmUnlinkDriver(true);
                    }}
                  >
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
                  if (row.warningDocumentExpired) {
                    setShowExpiredWarning(true);
                  } else {
                    setIsModalOpen(true);
                  }
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

          <SimpleDropdownContent className="w-[133px]" align="end">
            {row.status === "INACTIVE" && (
              <>
                <SimpleDropdownItem onClick={() => {}}>
                  Lihat Agenda Driver
                </SimpleDropdownItem>
                <SimpleDropdownItem
                  onClick={() => {
                    setSelectedVehicle(row);
                    setConfirmActivateVehicle(true);
                  }}
                >
                  Aktifkan
                </SimpleDropdownItem>
              </>
            )}
            <SimpleDropdownItem
              onClick={() =>
                router.push(`/manajemen-armada/${row.id}/detail?from=inactive`)
              }
            >
              Detail
            </SimpleDropdownItem>
            {row.status === "NOT_PAIRED" && (
              <>
                <SimpleDropdownItem onClick={() => {}}>Ubah</SimpleDropdownItem>
                <SimpleDropdownItem
                  className="text-error-400"
                  onClick={() => {
                    setSelectedVehicle(row);
                    setConfirmDeleteVehicle(true);
                  }}
                >
                  Hapus
                </SimpleDropdownItem>
              </>
            )}
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
    if (!data?.dataFilter) return {};

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

  const handleSort = (sort, order) => {
    if (sort || order) {
      setSortConfig({ sort, order });
    } else {
      setSortConfig();
    }
  };

  const handleStatusChange = (status) => {
    // Status clicked
    setSelectedStatus(status);
    onStatusChange?.(status);
    // New status set
  };

  // Prepare display options for status filter
  const getDisplayOptions = () => {
    // Get display options called

    if (!data?.dataFilter?.status.length > 0) {
      // No status data available in dataFilter
      return null;
    }

    // Map status IDs to summary keys
    const getCountFromSummary = (statusId) => {
      if (!data?.summary) return 0;

      switch (statusId) {
        case "NOT_PAIRED":
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
        hasNotification: item.id === "NOT_PAIRED" && count > 0,
      };
    });

    // Status options with summary counts

    return {
      statusOptions,
      currentStatus: selectedStatus,
      onStatusChange: handleStatusChange,
      totalCount: count || 0,
    };
  };

  const handleDriverUpdateSuccess = () => {
    // Refresh the vehicles data to reflect the change
    mutate();

    // Close modal and reset state
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  const hasAlert = summaryData?.totalExpiringFleets > 0;

  return (
    <>
      <div
        className={hasAlert ? "h-[calc(100vh-352px)]" : "h-[calc(100vh-300px)]"}
      >
        {hasAlert && (
          <Alert className="mb-4 h-12 bg-secondary-100">
            <div className="font-medium">
              Terdapat{" "}
              <span className="font-bold">
                {summaryData?.totalExpiringFleets} Armada
              </span>{" "}
              dengan masa berlaku STNK atau KIR yang akan segera/telah berakhir.
              <Link
                href="/manajemen-armada/expired"
                className="ml-2 text-primary-700"
              >
                Lihat Armada
              </Link>
            </div>
          </Alert>
        )}
        <DataTable
          data={data?.vehicles || []}
          columns={columns}
          searchPlaceholder="Cari No. Polisi, Jenis Truk atau lainnya"
          totalCountLabel="Armada"
          currentPage={data?.pagination?.page || currentPage}
          totalPages={data?.pagination?.totalPages || 1}
          totalItems={count || 0}
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
          filterConfig={getFilterConfig()}
        />
      </div>

      {isModalOpen && (
        <DriverSelectionModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleDriverUpdateSuccess}
          vehicleId={selectedVehicle?.id}
          vehiclePlate={selectedVehicle?.licensePlate}
          currentDriverId={selectedVehicle?.assignedDriver?.id}
          title={
            selectedVehicle?.assignedDriver ? "Ubah Driver" : "Pilih Driver"
          }
        />
      )}

      {showExpiredWarning && (
        <ExpiredDocumentWarningModal
          onClose={() => setShowExpiredWarning(false)}
        />
      )}

      <ConfirmationModal
        isOpen={confirmUnlinkDriver}
        setIsOpen={setConfirmUnlinkDriver}
        description={{
          text: (
            <p>
              Apakah kamu ingin melepas <br />
              <b>No. Polisi: {selectedVehicle?.licensePlate}</b> dari{" "}
              <b>{selectedVehicle?.assignedDriver?.fullName}</b> ?
            </p>
          ),
        }}
        confirm={{
          text: "Ya",
          onClick: async () => {
            setIsUpdating(true);
            try {
              await unlinkDriver(selectedVehicle?.assignedDriver?.id);
              toast.success("Berhasil melepaskan driver");
              mutate();
              setConfirmUnlinkDriver(false);
              setSelectedVehicle(null);
            } catch (error) {
              toast.error("Gagal melepas driver dari armada");
            } finally {
              setIsUpdating(false);
            }
          },
          classname: "w-[112px]",
        }}
        cancel={{
          text: "Tidak",
          onClick: () => {
            setConfirmUnlinkDriver(false);
            setSelectedVehicle(null);
          },
          classname: "w-[112px]",
        }}
      />

      <ConfirmationModal
        isOpen={confirmDeleteVehicle}
        setIsOpen={setConfirmDeleteVehicle}
        description={{
          text: (
            <p>
              Apakah kamu yakin ingin menghapus armada <br />
              <b>No. Polisi: {selectedVehicle?.licensePlate}</b> ?
            </p>
          ),
        }}
        confirm={{
          text: "Ya",
          onClick: async () => {
            setIsUpdating(true);
            try {
              await deleteVehicle(selectedVehicle?.id);
              toast.success("Armada berhasil dihapus");
              mutate();
              setConfirmDeleteVehicle(false);
              setSelectedVehicle(null);
            } catch (error) {
              toast.error("Gagal menghapus armada");
            } finally {
              setIsUpdating(false);
            }
          },
          classname: "w-[112px]",
        }}
        cancel={{
          text: "Tidak",
          onClick: () => {
            setConfirmDeleteVehicle(false);
            setSelectedVehicle(null);
          },
          classname: "w-[112px]",
        }}
      />

      <ConfirmationModal
        isOpen={confirmActivateVehicle}
        setIsOpen={setConfirmActivateVehicle}
        description={{
          text: (
            <p>
              Apakah kamu yakin ingin mengaktifkan armada <br />
              <b>No. Polisi: {selectedVehicle?.licensePlate}</b> ?
            </p>
          ),
        }}
        confirm={{
          text: "Ya",
          onClick: async () => {
            setIsUpdating(true);
            try {
              await activateVehicle(selectedVehicle?.id);
              toast.success("Armada berhasil diaktifkan");
              mutate();
              setConfirmActivateVehicle(false);
              setSelectedVehicle(null);
            } catch (error) {
              toast.error("Gagal mengaktifkan armada");
            } finally {
              setIsUpdating(false);
            }
          },
          classname: "w-[112px]",
        }}
        cancel={{
          text: "Tidak",
          onClick: () => {
            setConfirmActivateVehicle(false);
            setSelectedVehicle(null);
          },
          classname: "w-[112px]",
        }}
      />
    </>
  );
};

export default ArmadaNonaktif;
