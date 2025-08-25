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
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { DriverSelectionModal } from "@/container/Transporter/Driver/DriverSelectionModal";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { getArmadaStatusBadgeWithTranslation } from "@/lib/utils/armadaStatus";
import { deactivateVehicle } from "@/services/Transporter/manajemen-armada/deactivateVehicle";
import { useGetActiveVehiclesData } from "@/services/Transporter/manajemen-armada/getActiveVehiclesData";
import { unlinkDriver } from "@/services/Transporter/manajemen-armada/unlinkDriver";

const ArmadaAktif = ({ onPageChange, onPerPageChange, count }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [confirmUnlinkDriver, setConfirmUnlinkDriver] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [nonaktifkanArmada, setNonaktifkanArmada] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Fetch vehicles data with pagination and filters
  const { data, isLoading, mutate } = useGetActiveVehiclesData({
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
      key: "vehicle",
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
          <div className="flex items-end gap-3">
            <div className="line-clamp-1 h-3 flex-1 break-all text-xxs font-semibold">
              {row.assignedDriver?.fullName || "-"}
            </div>

            {row.assignedDriver && (
              <div className="flex gap-1">
                <button
                  className="text-neutral-700 hover:text-primary-700"
                  onClick={() => {
                    setSelectedVehicle(row);
                    setIsModalOpen(true);
                  }}
                >
                  <IconComponent size={12} src={"/icons/pencil-outline.svg"} />
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
            )}
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
      key: "brand",
      header: "Merek Kendaraan",
      render: (row) => row.vehicleBrand?.name || "-",
      width: "180px",
    },
    {
      key: "type",
      header: "Tipe Kendaraan",
      render: (row) => row.vehicleType?.name || "-",
      width: "170px",
    },
    {
      key: "status",
      header: "Status",
      sortable: false,
      width: "200px",
      render: (row) => {
        const statusConfig = getArmadaStatusBadgeWithTranslation(row.status, t);
        return (
          <BadgeStatus variant={statusConfig.variant}>
            {row.status === "ON_DUTY" && row.pendingUpdateDriver && (
              <InfoTooltip
                side="left"
                appearance={{
                  iconClassName: "text-primary-700 mr-1 size-3.5",
                }}
              >
                <p>
                  Armada sedang bertugas. Status akan diperbarui setelah pesanan
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
            <SimpleDropdownItem onClick={() => {}}>
              Lihat Agenda Driver
            </SimpleDropdownItem>
            {row.status === "READY_FOR_ORDER" && (
              <SimpleDropdownItem
                onClick={() => {
                  setSelectedVehicle(row);
                  setNonaktifkanArmada(true);
                }}
              >
                Nonaktifkan
              </SimpleDropdownItem>
            )}
            <SimpleDropdownItem
              onClick={() =>
                router.push(`/manajemen-armada/${row.id}/detail?from=active`)
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
    // Apply filters - extract only the ID values
    const processedFilters = {};

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // If it's an array of objects with id property, extract just the ids
        processedFilters[key] = value.map((item) =>
          typeof item === "object" && item.id ? item.id : item
        );
      } else if (typeof value === "object" && value?.id) {
        // If it's a single object with id property, extract just the id
        processedFilters[key] = value.id;
      } else {
        // Otherwise keep the value as is
        processedFilters[key] = value;
      }
    });

    console.log("Processed filters:", processedFilters);

    setFilters(processedFilters);
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
        { key: "status", label: "Status", searchable: false },
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
    if (sort || order) {
      setSortConfig({ sort, order });
    } else {
      setSortConfig();
    }
  };

  const handleDriverUpdateSuccess = () => {
    // Refresh the vehicles data to reflect the change
    mutate();

    // Close modal and reset state
    setIsModalOpen(false);
    setSelectedVehicle(null);
  };

  return (
    <>
      <div className="h-[calc(100vh-300px)]">
        <DataTable
          data={data?.vehicles || []}
          columns={columns}
          searchPlaceholder="Cari No. Polisi, Jenis Truk atau lainnya"
          totalCountLabel="Armada"
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
        isOpen={nonaktifkanArmada}
        setIsOpen={setNonaktifkanArmada}
        description={{
          text: (
            <p>
              Apakah kamu yakin ingin menonaktifkan armada <br />
              <b>No. Polisi: {selectedVehicle?.licensePlate}</b> ?
            </p>
          ),
        }}
        confirm={{
          text: "Ya",
          onClick: async () => {
            setIsUpdating(true);
            try {
              await deactivateVehicle(selectedVehicle?.id);
              toast.success("Armada berhasil dinonaktifkan");
              mutate();
              setNonaktifkanArmada(false);
              setSelectedVehicle(null);
            } catch (error) {
              toast.error("Gagal menonaktifkan armada");
            } finally {
              setIsUpdating(false);
            }
          },
          classname: "w-[112px]",
        }}
        cancel={{
          text: "Tidak",
          onClick: () => {
            setNonaktifkanArmada(false);
            setSelectedVehicle(null);
          },
          classname: "w-[112px]",
        }}
      />
    </>
  );
};

export default ArmadaAktif;
