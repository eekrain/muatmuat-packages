"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// 1. Import ChevronUp
import { ChevronDown, ChevronUp } from "lucide-react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import { DataTable } from "@/components/DataTable";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import DriverDelegasiModal from "@/components/Modal/DriverDelegasiModal";
import Toggle from "@/components/Toggle/Toggle";
import { FleetSelectionModal } from "@/container/Transporter/Armada/FleetSelectionModal";
import { toast } from "@/lib/toast";
import { getDriverStatusBadge } from "@/lib/utils/driverStatus";
import { getPhoneNumberStatus } from "@/lib/utils/phoneNumberStatus";
import { useGetDriverDelegationPopupPreference } from "@/services/Transporter/driver-delegation/getPopupPreference";
import { useUpdateDriverDelegationStatus } from "@/services/Transporter/driver-delegation/updateDelegationStatus";
import { unlinkDriver } from "@/services/Transporter/manajemen-armada/unlinkDriver";
import { useGetActiveDriversData } from "@/services/Transporter/manajemen-driver/getActiveDriversData";
import { putNonaktifkanDriver } from "@/services/Transporter/manajemen-driver/nonaktifkanDriver";

const DriverAktif = ({ count, onPageChange, onPerPageChange }) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    sort: "createdAt",
    order: "asc",
  });
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [confirmUnlinkDriver, setConfirmUnlinkDriver] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [nonaktifkanDriver, setNonaktifkanDriver] = useState(false);
  const [confirmDeleteDriver, setConfirmDeleteDriver] = useState(false);

  // 2. Add state to track which dropdown is open, using the row ID as the key
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Fetch drivers data with pagination and filters
  const { data, isLoading, mutate } = useGetActiveDriversData({
    page: currentPage,
    limit: perPage,
    search: searchValue,
    ...filters,
    ...sortConfig,
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
                <button
                  className="text-neutral-700 hover:text-primary-700"
                  onClick={() => {
                    setSelectedDriver(row);
                    setConfirmUnlinkDriver(true);
                  }}
                >
                  <IconComponent size={12} src={"/icons/unlink.svg"} />
                </button>
              </div>
            )}
          </div>
          <div className="text-xxs font-medium">
            {row.fleet ? (
              `${row.fleet.carrierTruck?.name} - ${row.fleet.truckType?.name}`
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
            {row.driverStatus === "ON_DUTY" && row.pendingUpdateDriver && (
              <InfoTooltip
                side="left"
                appearance={{
                  iconClassName: "text-primary-700 mr-1 size-3.5",
                }}
              >
                <p>
                  Driver sedang bertugas. Status akan diperbarui setelah pesanan
                  diselesaikan
                </p>
              </InfoTooltip>
            )}
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
        // 3. Control the dropdown's open state
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
              {/* 4. Conditionally render the icon based on the open state */}
              {openDropdowns[row.id] ? (
                <ChevronUp className="h-4 w-4 text-neutral-700" />
              ) : (
                <ChevronDown className="h-4 w-4 text-neutral-700" />
              )}
            </button>
          </SimpleDropdownTrigger>

          <SimpleDropdownContent className="w-fit" align="end">
            <SimpleDropdownItem onClick={() => {}}>
              Lihat Agenda Driver
            </SimpleDropdownItem>
            {row.driverStatus === "READY_FOR_ORDER" && (
              <SimpleDropdownItem
                onClick={() => {
                  setSelectedDriver(row);
                  setNonaktifkanDriver(true);
                }}
              >
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

  // ... rest of the component remains the same
  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

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
        { key: "driverStatus", label: "Status Driver", searchable: false },
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

  const handleSort = (sort, order) => {
    setSortConfig({ sort, order });
  };

  const handleFleetUpdateSuccess = () => {
    mutate();
    setIsModalOpen(false);
    setSelectedDriver(null);
  };

  const [driverDelegasi, setDriverDelegasi] = useState(false);
  const [showDelegasiModal, setShowDelegasiModal] = useState(false);

  const { data: popupPreference, mutate: mutatePopupPreference } =
    useGetDriverDelegationPopupPreference();

  const { trigger: updateDelegationStatus } = useUpdateDriverDelegationStatus();

  const hasSeenModal = popupPreference?.shouldShowPopup === false;

  const renderDriverDelegasiSwitch = () => {
    return (
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <div className="text-xs font-semibold">Driver Delegasi</div>
          <InfoTooltip side="left">
            <p className="w-[312px]">
              Fitur yang memungkinkan driver mengambil pesanan instan secara
              langsung, sementara pesanan terjadwal tetap dikelola transporter.
            </p>
          </InfoTooltip>
        </div>
        <Toggle
          value={driverDelegasi}
          textActive="Aktif"
          textInactive="Nonaktif"
          onClick={async () => {
            if (!driverDelegasi) {
              setDriverDelegasi(true);
              if (!hasSeenModal) {
                setShowDelegasiModal(true);
              }
            } else {
              setDriverDelegasi(false);
            }
          }}
        />
      </div>
    );
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

  const handleNonaktifkanDriver = async () => {
    setIsUpdating(true);
    try {
      await putNonaktifkanDriver(selectedDriver?.id);
      toast.success("Berhasil menonaktifkan driver");
      setNonaktifkanDriver(false);
      setSelectedDriver(null);
      mutate();
    } catch (error) {
      console.error("Failed to nonaktifkan driver:", error);
      toast.error("Gagal menonaktifkan driver. Silakan coba lagi.");
    } finally {
      setIsUpdating(false);
    }
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
          totalItems={count || 0}
          perPage={data?.pagination?.itemsPerPage || perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          loading={isLoading}
          showPagination
          filterConfig={getFilterConfig()}
          headerActions={renderDriverDelegasiSwitch()}
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
          mutate={mutate}
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

      <ConfirmationModal
        isOpen={nonaktifkanDriver}
        setIsOpen={setNonaktifkanDriver}
        description={{
          text: (
            <>
              Apakah kamu yakin ingin menonaktifkan driver{" "}
              <b>{selectedDriver?.name}</b>?
            </>
          ),
        }}
        confirm={{
          text: "Ya",
          onClick: () => {
            handleNonaktifkanDriver();
          },
          classname: "w-[112px]",
        }}
        cancel={{
          text: "Tidak",
          onClick: () => {
            setNonaktifkanDriver(false);
          },
          classname: "w-[112px]",
        }}
      />

      <DriverDelegasiModal
        open={showDelegasiModal}
        onOpenChange={setShowDelegasiModal}
        onClose={(doNotShowAgain) => {
          if (doNotShowAgain) {
            mutatePopupPreference();
          }
        }}
      />
    </>
  );
};

export default DriverAktif;
