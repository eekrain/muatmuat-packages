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
import { FleetSelectionModal } from "@/container/Transporter/Armada/FleetSelectionModal";
import { ExpiredDocumentWarningModal } from "@/container/Transporter/Driver/DriverSelectionModal";
import { toast } from "@/lib/toast";
import { getDriverStatusBadge } from "@/lib/utils/driverStatus";
import { getPhoneNumberStatus } from "@/lib/utils/phoneNumberStatus";
import { unlinkDriver } from "@/services/Transporter/manajemen-armada/unlinkDriver";
import { useGetNonActiveDriversData } from "@/services/Transporter/manajemen-driver/getNonActiveDriversData";
import { useGetSimExpiryNotification } from "@/services/Transporter/manajemen-driver/getSimExpiryNotification";

const DriverNonaktif = ({
  onPageChange,
  onPerPageChange,
  onStatusChange,
  count,
}) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showExpiredWarning, setShowExpiredWarning] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationModalConfig, setConfirmationModalConfig] = useState({});
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [confirmUnlinkDriver, setConfirmUnlinkDriver] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch drivers data with pagination, filters and status
  const { data, isLoading, mutate } = useGetNonActiveDriversData({
    page: currentPage,
    limit: perPage,
    search: searchValue,
    status: selectedStatus,
    ...filters,
    ...sortConfig,
  });

  // Fetch SIM expiry notification
  const { data: simExpiryData } = useGetSimExpiryNotification();

  const getStatusBadge = (status) => {
    const statusConfig = getDriverStatusBadge(status);
    return (
      <BadgeStatus variant={statusConfig.variant}>
        {statusConfig.label}
      </BadgeStatus>
    );
  };

  const handleActivateClick = (row) => {
    setConfirmationModalConfig({
      description: {
        text: (
          <>
            Apakah kamu yakin ingin mengaktifkan driver{" "}
            <span className="font-bold">{row.name}</span>?
          </>
        ),
      },
      confirm: {
        text: "Ya",
        onClick: () => {
          // Add activate logic here
          toast.success("Berhasil mengaktifkan driver");
          setIsConfirmationModalOpen(false);
        },
        classname: "w-[112px]",
      },
      cancel: { text: "Tidak", classname: "w-[112px]" },
    });
    setIsConfirmationModalOpen(true);
  };

  const handleDeleteClick = (row) => {
    setConfirmationModalConfig({
      description: {
        text: "Apakah kamu yakin ingin menghapus driver ini?",
      },
      confirm: {
        text: "Ya",
        onClick: () => {
          // Add delete logic here
          toast.success("Berhasil menghapus driver");
          setIsConfirmationModalOpen(false);
        },
        classname: "w-[112px]",
      },
      cancel: { text: "Tidak", classname: "w-[112px]" },
    });
    setIsConfirmationModalOpen(true);
  };

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
          <div className="flex items-end gap-3 text-xxs font-semibold">
            {row.fleet ? (
              <>
                <div className="line-clamp-1 h-3 flex-1 break-all">
                  No. Polisi : {row.fleet.licensePlate}
                </div>
                <div className="flex gap-1">
                  <button
                    className="text-neutral-700 hover:text-primary-700"
                    onClick={() => {
                      setSelectedDriver(row);
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
                    onClick={() => {
                      setSelectedDriver(row);
                      setConfirmUnlinkDriver(true);
                    }}
                    className="text-neutral-700 hover:text-primary-700"
                  >
                    <IconComponent size={12} src={"/icons/unlink.svg"} />
                  </button>
                </div>
              </>
            ) : (
              "No. Polisi : - "
            )}
          </div>
          <div className="text-xxs font-medium text-neutral-600">
            {row.fleet ? (
              `${row.fleet.carrierTruck?.name} - ${row.fleet.truckType?.name}`
            ) : (
              <button
                className="font-semibold text-primary-700 hover:text-primary-700"
                onClick={() => {
                  setSelectedDriver(row);
                  if (row.warningDocumentExpired) {
                    setShowExpiredWarning(true);
                  } else {
                    setIsModalOpen(true);
                  }
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
      key: "status",
      header: "Status",
      sortable: false,
      render: (row) => getStatusBadge(row.driverStatus),
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
            {row.driverStatus === "NON_ACTIVE" && (
              <SimpleDropdownItem onClick={() => {}}>
                Lihat Agenda Driver
              </SimpleDropdownItem>
            )}
            <SimpleDropdownItem
              onClick={() =>
                router.push(`/manajemen-driver/${row.id}/detail?from=inactive`)
              }
            >
              Detail
            </SimpleDropdownItem>
            {row.driverStatus === "NON_ACTIVE" && (
              <SimpleDropdownItem onClick={() => handleActivateClick(row)}>
                Aktifkan
              </SimpleDropdownItem>
            )}
            {row.driverStatus === "NOT_PAIRED" && (
              <>
                <SimpleDropdownItem
                  onClick={() =>
                    router.push(
                      `/manajemen-driver/${row.id}/ubah?from=inactive`
                    )
                  }
                >
                  Ubah
                </SimpleDropdownItem>
                <SimpleDropdownItem
                  className="text-error-400"
                  onClick={() => handleDeleteClick(row)}
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
        {
          key: "verificationStatus",
          label: "Status Nomor Whatsapp",
          searchable: false,
        },
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
  };

  const handleStatusChange = (status) => {
    // Status clicked
    setSelectedStatus(status);
    onStatusChange?.(status);
    mutate(); // Fetch data ulang setelah status diganti
    console.log("Status changed to:", data);
    // New status set
  };

  const handleUnlinkDriver = async () => {
    setIsUpdating(true);
    try {
      await unlinkDriver(selectedDriver?.id);
      toast.success("Berhasil melepaskan armada");
      setSelectedDriver(null);
      setConfirmUnlinkDriver(false);
      // Refresh the data after successful unlink
      mutate();
    } catch (error) {
      console.error("Failed to unlink driver:", error);
      toast.error("Gagal melepaskan armada. Silakan coba lagi.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Prepare display options for status filter
  const getDisplayOptions = () => {
    // Get display options called

    if (!data?.dataFilter?.driverStatus?.length > 0) {
      // No status data available in dataFilter
      return null;
    }

    // Map status IDs to summary keys
    const getCountFromSummary = (statusId) => {
      if (!data?.summary) return 0;

      switch (statusId) {
        case "NOT_PAIRED":
          return data.summary.unassigned || 0;
        case "NON_ACTIVE":
          return data.summary.inactive || 0;
        default:
          return 0;
      }
    };

    const statusOptions = data.dataFilter.driverStatus.map((item) => {
      const count = getCountFromSummary(item.id);
      return {
        value: item.id,
        label:
          item.value === "NOT_PAIRED"
            ? "Belum Dipasangkan"
            : item.value === "NON_ACTIVE"
              ? "Tidak Aktif"
              : item.value,
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

  const handleFleetUpdateSuccess = () => {
    // Refresh the drivers data to reflect the change
    mutate();

    // Close modal and reset state
    setIsModalOpen(false);
    setSelectedDriver(null);
  };

  const hasAlert = simExpiryData?.hasNotification;

  return (
    <>
      <div
        className={hasAlert ? "h-[calc(100vh-352px)]" : "h-[calc(100vh-300px)]"}
      >
        {hasAlert && (
          <Alert className="mb-4 h-12 bg-secondary-100">
            <div className="font-medium">
              Terdapat{" "}
              <span className="font-bold">{simExpiryData.total} Driver</span>{" "}
              dengan masa berlaku SIM yang akan segera/telah berakhir.
              <Link
                href="/manajemen-driver/expired"
                className="ml-2 text-primary-700"
              >
                Lihat Driver
              </Link>
            </div>
          </Alert>
        )}
        <DataTable
          data={data?.drivers || []}
          columns={columns}
          loading={isLoading} // Pastikan isLoading false setelah data di-fetch
          searchPlaceholder="Cari Nama Driver, No. HP atau lainnya"
          totalCountLabel="Driver"
          currentPage={data?.pagination?.page || currentPage}
          totalPages={data?.pagination?.totalPages || 1}
          totalItems={count || 0}
          perPage={data?.pagination?.limit || perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          showPagination
          showDisplayView={true}
          displayOptions={getDisplayOptions()}
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
              Apakah kamu ingin melepas <b>{selectedDriver?.name}</b> dari{" "}
              <b>No. Polisi : {selectedDriver?.fleet?.licensePlate}</b>
            </p>
          ),
        }}
        confirm={{
          text: "Ya",
          onClick: () => {
            handleUnlinkDriver();
          },
          classname: "w-[112px]",
        }}
        cancel={{
          text: "Tidak",
          onClick: () => {
            setConfirmUnlinkDriver(false);
          },
          classname: "w-[112px]",
        }}
      />

      {isConfirmationModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          setIsOpen={setIsConfirmationModalOpen}
          {...confirmationModalConfig}
        />
      )}
    </>
  );
};

export default DriverNonaktif;
