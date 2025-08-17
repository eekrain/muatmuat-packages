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
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { toast } from "@/lib/toast";
import { getDriverStatusBadge } from "@/lib/utils/driverStatus";
import { deleteDriver } from "@/services/Transporter/manajemen-driver/deleteDriver";
import { useGetProcessDriversData } from "@/services/Transporter/manajemen-driver/getProcessDriversData";

const DriverProses = ({
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
  const [confirmDeleteDriver, setConfirmDeleteDriver] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Fetch drivers data with pagination, filters and status
  const { data, isLoading, mutate } = useGetProcessDriversData({
    page: currentPage,
    limit: perPage,
    search: searchValue,
    status: selectedStatus,
    ...filters,
    ...sortConfig,
  });

  const getStatusBadge = (status) => {
    const statusConfig = getDriverStatusBadge(status);
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
      key: "phoneNumber",
      header: "No. Whatsapp",
      render: (row) => (
        <div className="text-xxs font-semibold">{row.phoneNumber || "-"}</div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: false,
      width: "170px",
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
            <SimpleDropdownItem
              onClick={() =>
                router.push(`/manajemen-driver/${row.id}/detail?from=process`)
              }
            >
              Detail
            </SimpleDropdownItem>
            {row.driverStatus === "REJECTED" && (
              <>
                <SimpleDropdownItem
                  onClick={() =>
                    router.push(`/manajemen-driver/${row.id}/ubah?from=process`)
                  }
                >
                  Ubah
                </SimpleDropdownItem>
                <SimpleDropdownItem
                  className="text-error-400"
                  onClick={() => {
                    setSelectedDriver(row);
                    setConfirmDeleteDriver(true);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handlePerPageChange = (limit) => {
    setPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing items per page
    onPerPageChange?.(limit);
  };

  const handleSort = (sorr, order) => {
    setSortConfig({ sorr, order });
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

    if (!data?.dataFilter?.driverStatus?.length > 0) {
      // No status data available in dataFilter
      return null;
    }

    // Map status IDs to summary keys
    const getCountFromSummary = (statusId) => {
      if (!data?.summary) return 0;

      switch (statusId) {
        case "IN_PROGRESS":
          return data.summary.underReview || 0;
        case "REJECTED":
          return data.summary.rejected || 0;
        default:
          return 0;
      }
    };

    const statusOptions = data.dataFilter.driverStatus.map((item) => {
      const count = getCountFromSummary(item.id);
      return {
        value: item.id,
        label:
          item.value === "IN_PROGRESS"
            ? "Dalam Tinjauan"
            : item.value === "REJECTED"
              ? "Ditolak"
              : item.value,
        count: count,
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

  const handleDeleteDriver = async () => {
    setIsDeleting(true);
    try {
      await deleteDriver(selectedDriver?.id);
      toast.success("Berhasil menghapus driver");
      setConfirmDeleteDriver(false);
      setSelectedDriver(null);
      mutate();
    } catch (error) {
      console.error("Failed to delete driver:", error);
      toast.error("Gagal menghapus driver. Silakan coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="h-[calc(100vh-300px)]">
        <DataTable
          data={data?.drivers || []}
          columns={columns}
          searchPlaceholder="Cari Nama / No. Whatsapp Driver"
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
          showDisplayView={true}
          displayOptions={getDisplayOptions()}
        />
      </div>

      <ConfirmationModal
        isOpen={confirmDeleteDriver}
        setIsOpen={setConfirmDeleteDriver}
        description={{
          text: (
            <p className="text-center">
              Apakah kamu yakin ingin menghapus driver
              <br />
              <b>{selectedDriver?.name}</b>?
            </p>
          ),
        }}
        confirm={{
          text: "Ya",
          onClick: handleDeleteDriver,
          disabled: isDeleting,
          classname: "w-[112px]",
        }}
        cancel={{
          text: "Tidak",
          onClick: () => {
            setConfirmDeleteDriver(false);
            setSelectedDriver(null);
          },
          classname: "w-[112px]",
        }}
      />
    </>
  );
};

export default DriverProses;
