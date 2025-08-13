"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ChevronDown } from "lucide-react";

import HubungiModal from "@/app/cs/(main)/user/components/HubungiModal";
import ActiveFiltersBar from "@/components/ActiveFiltersBar/ActiveFiltersBar";
import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import FilterDropdown from "@/components/FilterDropdown";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import Pagination from "@/components/Pagination/Pagination";
import Table from "@/components/Table/Table";
import { toast } from "@/lib/toast";

const TransporterContainer = ({
  onPageChange,
  onPerPageChange,
  _count,
  onDataStateChange,
}) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    data: null,
  });
  const [hubungiModalOpen, setHubungiModalOpen] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);

  const mockData = [
    {
      id: "1",
      companyName: "PT Maju Jaya",
      email: "maju@mail.com",
      picName: "Budi Santoso",
      picPhone: "No. HP : 0821-1234-5678",
      address: "Jalan Sudirman 123, Jakarta Pusat",
      fleetCount: 15,
      status: "Aktif",
    },
    {
      id: "2",
      companyName: "CV Berkah Mandiri",
      email: "berkah@mail.com",
      picName: "Siti Rahayu",
      picPhone: "No. HP : 0822-9876-5432",
      address: "Jalan Thamrin 456, Jakarta Pusat",
      fleetCount: 8,
      status: "Aktif",
    },
    {
      id: "3",
      companyName: "PT Sejahtera Bersama",
      email: "sejahtera@mail.com",
      picName: "Agus Wijaya",
      picPhone: "No. HP : 0823-5555-1111",
      address: "Jalan Gatot Subroto 789, Jakarta Selatan",
      fleetCount: 0,
      status: "Non Aktif",
    },
    {
      id: "4",
      companyName: "CV Bahagia Sentosa",
      email: "bahagia@mail.com",
      picName: "Dewi Lestari",
      picPhone: "No. HP : 0824-2222-3333",
      address: "Jalan HR Rasuna Said 101, Jakarta Selatan",
      fleetCount: 12,
      status: "Dalam Verifikasi",
    },
    {
      id: "5",
      companyName: "CV Moga Jaya Abadi",
      email: "contact.shipper@mail.com",
      picName: "Ahmad Maulana",
      picPhone: "No. HP : 0822-3100-1231",
      address: "Jalan Kedungdoro 101A, Tegalsari, Surabaya",
      fleetCount: 0,
      status: "Dalam Verifikasi",
    },
    {
      id: "6",
      companyName: "PT Karya Utama",
      email: "karya@mail.com",
      picName: "Joko Susilo",
      picPhone: "No. HP : 0825-4444-5555",
      address: "Jalan Diponegoro 202, Bandung",
      fleetCount: 20,
      status: "Verifikasi Ditolak",
    },
    {
      id: "7",
      companyName: "CV Sukses Makmur",
      email: "sukses@mail.com",
      picName: "Rina Permata",
      picPhone: "No. HP : 0826-6666-7777",
      address: "Jalan Asia Afrika 303, Bandung",
      fleetCount: 5,
      status: "Aktif",
    },
    {
      id: "8",
      companyName: "PT Harapan Baru",
      email: "harapan@mail.com",
      picName: "Eko Prasetyo",
      picPhone: "No. HP : 0827-8888-9999",
      address: "Jalan Malioboro 404, Yogyakarta",
      fleetCount: 0,
      status: "Non Aktif",
    },
    {
      id: "9",
      companyName: "CV Mitra Sejati",
      email: "mitra@mail.com",
      picName: "Lina Andriani",
      picPhone: "No. HP : 0828-1111-2222",
      address: "Jalan Pajajaran 505, Bogor",
      fleetCount: 18,
      status: "Aktif",
    },
    {
      id: "10",
      companyName: "PT Teknologi Maju",
      email: "teknologi@mail.com",
      picName: "Bambang Hartono",
      picPhone: "No. HP : 0829-3333-4444",
      address: "Jalan Veteran 606, Malang",
      fleetCount: 7,
      status: "Dalam Verifikasi",
    },
    {
      id: "11",
      companyName: "CV Nusantara Raya",
      email: "nusantara@mail.com",
      picName: "Maya Sari",
      picPhone: "No. HP : 0821-5555-6666",
      address: "Jalan Pemuda 707, Semarang",
      fleetCount: 14,
      status: "Aktif",
    },
    {
      id: "12",
      companyName: "PT Global Logistics",
      email: "global@mail.com",
      picName: "Rizki Ramadan",
      picPhone: "No. HP : 0822-7777-8888",
      address: "Jalan Pahlawan 808, Surabaya",
      fleetCount: 25,
      status: "Verifikasi Ditolak",
    },
  ];

  const openModal = (type, data) => {
    setModalState({ isOpen: true, type, data });
  };

  const openHubungiModal = (transporterData) => {
    setSelectedTransporter(transporterData);
    setHubungiModalOpen(true);
  };

  const closeHubungiModal = () => {
    setHubungiModalOpen(false);
    setSelectedTransporter(null);
  };

  const handleConfirmAction = () => {
    if (!modalState.data) return;

    if (modalState.type === "delete") {
      // console.log("Menghapus transporter:", modalState.data.companyName);
      toast.success("Transporter berhasil dihapus");
    } else if (modalState.type === "resend") {
      // console.log("Mengirim ulang verifikasi untuk:", modalState.data.companyName);
      toast.success("Verifikasi berhasil dikirim ulang");
    } else if (modalState.type === "deactivate") {
      // console.log("Menonaktifkan transporter:", modalState.data.companyName);
      toast.success("Berhasil menonaktifkan Transporter");
    } else if (modalState.type === "activate") {
      // console.log("Mengaktifkan transporter:", modalState.data.companyName);
      toast.success("Berhasil mengaktifkan Transporter");
    }
    setModalState({ isOpen: false, type: "", data: null });
  };

  const getStatusBadge = (status) => {
    let variant = "success";
    if (status === "Verifikasi Ditolak") {
      variant = "error";
    } else if (status === "Dalam Verifikasi") {
      variant = "warning";
    } else if (status === "Non Aktif") {
      variant = "neutral";
    }
    return <BadgeStatus variant={variant}>{status}</BadgeStatus>;
  };

  const renderActionItems = (row) => {
    switch (row.status) {
      case "Aktif":
        return (
          <>
            <SimpleDropdownItem
              onClick={() => router.push(`/user/transporter/${row.id}/detail`)}
            >
              Detail
            </SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => openHubungiModal(row)}>
              Hubungi
            </SimpleDropdownItem>
            <SimpleDropdownItem
              className={"text-red-500"}
              onClick={() => openModal("deactivate", row)}
            >
              Non Aktifkan
            </SimpleDropdownItem>
          </>
        );
      case "Non Aktif":
        return (
          <>
            <SimpleDropdownItem
              onClick={() => router.push(`/user/transporter/${row.id}/detail`)}
            >
              Detail
            </SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => openHubungiModal(row)}>
              Hubungi
            </SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => openModal("activate", row)}>
              Aktifkan
            </SimpleDropdownItem>
          </>
        );
      case "Dalam Verifikasi":
        return (
          <>
            <SimpleDropdownItem
              onClick={() => router.push(`/user/transporter/${row.id}/detail`)}
            >
              Detail
            </SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => openHubungiModal(row)}>
              Hubungi
            </SimpleDropdownItem>
          </>
        );
      case "Verifikasi Ditolak":
        return (
          <>
            <SimpleDropdownItem onClick={() => openModal("resend", row)}>
              Kirim Verifikasi Ulang
            </SimpleDropdownItem>
            <SimpleDropdownItem
              onClick={() => router.push(`/user/transporter/${row.id}/detail`)}
            >
              Detail
            </SimpleDropdownItem>
            <SimpleDropdownItem onClick={() => openHubungiModal(row)}>
              Hubungi
            </SimpleDropdownItem>
            <SimpleDropdownItem
              className={"text-red-500"}
              onClick={() => openModal("delete", row)}
            >
              Hapus
            </SimpleDropdownItem>
          </>
        );
      default:
        return null;
    }
  };

  const renderConfirmationModal = () => {
    if (!modalState.isOpen || !modalState.data) return null;

    const commonProps = {
      isOpen: modalState.isOpen,
      setIsOpen: (val) => setModalState({ ...modalState, isOpen: val }),
      size: "small",
    };

    if (modalState.type === "delete") {
      return (
        <ConfirmationModal
          {...commonProps}
          title={{ text: "Hapus Transporter" }}
          description={{
            text: (
              <>
                Apakah Kamu yakin ingin menghapus Transporter{" "}
                <strong>{modalState.data.companyName}</strong>? Data yang
                dihapus tidak dapat dikembalikan lagi
              </>
            ),
          }}
          confirm={{
            text: "Ya",
            onClick: handleConfirmAction,
            classname:
              "!w-[124px] border border-[--muat-trans-secondary-900] bg-neutral-50 text-[--muat-trans-secondary-900] hover:bg-[--muat-trans-secondary-50]",
          }}
          cancel={{
            text: "Batal",
            classname:
              "!w-[124px] bg-[--muat-trans-primary-400] text-neutral-900 hover:bg-[--muat-trans-primary-500] border-none",
            onClick: () => commonProps.setIsOpen(false),
          }}
        />
      );
    }

    if (modalState.type === "resend") {
      return (
        <ConfirmationModal
          {...commonProps}
          title={{ text: "Kirim Verifikasi Ulang Transporter" }}
          description={{
            text: (
              <>
                <p className="mb-4">
                  Apakah Kamu yakin ingin mengirim ulang verifikasi Transporter{" "}
                  <strong>{modalState.data.companyName}</strong>?
                </p>
                <p>
                  Harap hubungi transporter terkait untuk melanjutkan proses
                  verifikasi melalui pesan email yang dikirim.
                </p>
              </>
            ),
          }}
          confirm={{
            text: "Ya",
            onClick: handleConfirmAction,
            classname:
              "!w-[124px] border border-[--muat-trans-secondary-900] bg-neutral-50 text-[--muat-trans-secondary-900] hover:bg-[--muat-trans-secondary-50]",
          }}
          cancel={{
            text: "Batal",
            classname:
              "!w-[124px] bg-[--muat-trans-primary-400] text-neutral-900 hover:bg-[--muat-trans-primary-500] border-none",
            onClick: () => commonProps.setIsOpen(false),
          }}
        />
      );
    }

    if (modalState.type === "deactivate") {
      return (
        <ConfirmationModal
          {...commonProps}
          title={{ text: "Non Aktifkan Transporter" }}
          description={{
            text: (
              <>
                Apakah kamu yakin ingin menonaktifkan Transporter{" "}
                <strong>{modalState.data.companyName}</strong>?
              </>
            ),
          }}
          confirm={{
            text: "Ya, Non Aktifkan",
            onClick: handleConfirmAction,
            classname:
              " border border-[--muat-trans-secondary-900] bg-neutral-50 text-[--muat-trans-secondary-900] hover:bg-[--muat-trans-secondary-50]",
          }}
          cancel={{
            text: "Kembali",
            classname:
              " bg-[--muat-trans-primary-400] text-neutral-900 hover:bg-[--muat-trans-primary-500] border-none",
            onClick: () => commonProps.setIsOpen(false),
          }}
        />
      );
    }

    if (modalState.type === "activate") {
      return (
        <ConfirmationModal
          {...commonProps}
          title={{ text: "Aktifkan Transporter" }}
          description={{
            text: (
              <>
                Apakah kamu yakin ingin mengaktifkan Transporter{" "}
                <strong>{modalState.data.companyName}</strong>?
              </>
            ),
          }}
          confirm={{
            text: "Ya, Aktifkan",
            onClick: handleConfirmAction,
            classname:
              " border border-[--muat-trans-secondary-900] bg-neutral-50 text-[--muat-trans-secondary-900] hover:bg-[--muat-trans-secondary-50]",
          }}
          cancel={{
            text: "Kembali",
            classname:
              " bg-[--muat-trans-primary-400] text-neutral-900 hover:bg-[--muat-trans-primary-500] border-none",
            onClick: () => commonProps.setIsOpen(false),
          }}
        />
      );
    }

    return null;
  };

  const columns = [
    {
      key: "companyName",
      header: "Nama Perusahaan",
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-5">
          <div className="relative flex aspect-square h-14 w-14 items-center justify-center rounded-md border border-neutral-400 bg-white object-contain p-px">
            <img
              src="/img/jnt.png"
              alt="logo"
              className="rounded-md object-contain"
            />
          </div>
          <div className="space-y-1">
            <div className="line-clamp-1 text-xs font-bold">
              {row.companyName}
            </div>
            <div className="text-xxs font-medium">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "pic",
      header: "PIC Perusahaan",
      sortable: false,
      width: "170px",
      render: (row) => (
        <div className="space-y-1">
          <div className="text-xxs font-semibold">{row.picName}</div>
          <div className="text-xxsfont-medium">{row.picPhone}</div>
        </div>
      ),
    },
    {
      key: "address",
      header: "Alamat Perusahaan",
      sortable: false,
      render: (row) => (
        <div className="text-xxs font-medium">{row.address}</div>
      ),
    },
    {
      key: "fleetCount",
      header: "Jumlah Armada",
      width: "170px",
      sortable: true,
      render: (row) => (
        <div className="text-xxs font-medium">
          {row.fleetCount > 0 ? `${row.fleetCount} Armada` : "Belum Ada"}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "190px",
      sortable: true,
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
            <button className="flex h-8 flex-row items-center justify-between gap-2 rounded-md border border-neutral-400 bg-white px-3 py-2 shadow-sm transition-colors duration-150 hover:border-primary-700 hover:bg-gray-50 focus:outline-none">
              <span className="text-xs font-medium leading-tight text-black">
                Aksi
              </span>
              <ChevronDown className="h-3 w-3 text-neutral-700" />
            </button>
          </SimpleDropdownTrigger>
          <SimpleDropdownContent className="w-[180px]" align="end">
            {renderActionItems(row)}
          </SimpleDropdownContent>
        </SimpleDropdown>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const performSearch = (value) => {
    if (value.length >= 3 || value.length === 0) {
      // Only perform search if value is 3+ characters or empty (to reset)
      setCurrentPage(1);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      performSearch(searchValue);
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    performSearch("");
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
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

  const getFilterConfig = () => {
    return {
      categories: [{ key: "status", label: "Status" }],
      data: {
        status: [
          { id: "Aktif", label: "Aktif" },
          { id: "Non Aktif", label: "Non Aktif" },
          { id: "Dalam Verifikasi", label: "Dalam Verifikasi" },
          { id: "Verifikasi Ditolak", label: "Verifikasi Ditolak" },
        ],
      },
    };
  };

  // Convert selected filters to active filter format
  const getActiveFilters = () => {
    const activeFilters = [];

    Object.entries(filters).forEach(([categoryKey, items]) => {
      if (Array.isArray(items)) {
        // Multi-select
        items.forEach((item) => {
          activeFilters.push({
            id: `${categoryKey}-${item.id}`,
            label: item.label,
            categoryKey,
            item,
          });
        });
      } else if (items) {
        // Single-select - since status is single-select in this case
        activeFilters.push({
          id: `${categoryKey}-${items.id || items}`,
          label: items.label || items,
          categoryKey,
          item: items,
        });
      }
    });

    return activeFilters;
  };

  const handleRemoveFilter = (filter) => {
    const newFilters = { ...filters };

    if (Array.isArray(newFilters[filter.categoryKey])) {
      // Multi-select
      newFilters[filter.categoryKey] = newFilters[filter.categoryKey].filter(
        (item) => (item.id || item) !== (filter.item.id || filter.item)
      );
      if (newFilters[filter.categoryKey].length === 0) {
        delete newFilters[filter.categoryKey];
      }
    } else {
      // Single-select
      delete newFilters[filter.categoryKey];
    }

    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let order = "asc";
    if (sortConfig.sort === key && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ sort: key, order });
    setCurrentPage(1);
  };

  // Calculate pagination
  const getFilteredData = () => {
    let filteredData = [...mockData];

    // Apply search filter only if searchValue is 3+ characters or empty
    if (searchValue.trim() && searchValue.length >= 3) {
      filteredData = filteredData.filter(
        (item) =>
          item.companyName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.picName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.address.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status) {
      filteredData = filteredData.filter(
        (item) => item.status === filters.status
      );
    }

    // Apply sorting
    if (sortConfig.sort && sortConfig.order) {
      filteredData.sort((a, b) => {
        let aValue = a[sortConfig.sort];
        let bValue = b[sortConfig.sort];

        // Handle specific sorting cases
        if (sortConfig.sort === "fleetCount") {
          aValue = Number(aValue) || 0;
          bValue = Number(bValue) || 0;
        } else if (sortConfig.sort === "companyName") {
          aValue = aValue?.toLowerCase() || "";
          bValue = bValue?.toLowerCase() || "";
        } else if (sortConfig.sort === "status") {
          // Define status priority for sorting
          const statusPriority = {
            Aktif: 1,
            "Dalam Verifikasi": 2,
            "Non Aktif": 3,
            "Verifikasi Ditolak": 4,
          };
          aValue = statusPriority[aValue] || 999;
          bValue = statusPriority[bValue] || 999;
        }

        if (aValue < bValue) {
          return sortConfig.order === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.order === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  const filteredData = getFilteredData();
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const showPagination = totalItems >= 10;

  // Determine the current data state
  const hasSearch = searchValue.trim().length > 0;
  const hasFilters = Object.keys(filters).length > 0;
  const hasData = filteredData.length > 0;
  const originalDataExists = mockData.length > 0;

  // Determine what to show
  const showNoDataState = !originalDataExists;
  const showSearchNotFoundState = hasSearch && !hasData && originalDataExists;
  const showFilterNotFoundState =
    hasFilters && !hasData && originalDataExists && !hasSearch;

  // Notify parent about data state changes
  useEffect(() => {
    if (onDataStateChange) {
      onDataStateChange({
        hasData,
        hasSearch,
        hasFilters,
        showSearchNotFoundState,
        showFilterNotFoundState,
        showNoDataState,
        totalItems,
      });
    }
  }, [
    hasData,
    hasSearch,
    hasFilters,
    showSearchNotFoundState,
    showFilterNotFoundState,
    showNoDataState,
    totalItems,
    onDataStateChange,
  ]);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filters, searchValue, sortConfig]);

  return (
    <>
      <div className="min-h-[280px] overflow-hidden rounded-xl bg-white shadow-muat">
        {showNoDataState ? (
          <div className="flex h-[280px] w-full flex-col items-center justify-center">
            <DataNotFound type="data" title="Belum ada Transporter" />
            <Button
              iconLeft={
                <IconComponent
                  src="/icons/plus16.svg"
                  className="fill-black stroke-2"
                />
              }
              className="mt-3"
            >
              Tambah Transporter
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-5 px-6 pb-6 pt-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center gap-3">
                  <Input
                    icon={{
                      left: (
                        <IconComponent
                          src="/icons/search16.svg"
                          className="!text-neutral-700"
                        />
                      ),
                      right: searchValue.length > 0 && (
                        <button onClick={handleClearSearch}>
                          <IconComponent src="/icons/close20.svg" />
                        </button>
                      ),
                    }}
                    appearance={{
                      inputClassName: "!text-xs",
                      containerClassName: "!w-full min-w-[262px]",
                    }}
                    className="!w-full"
                    placeholder="Cari Transporter/PIC Perusahaan"
                    value={searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    disabled={showFilterNotFoundState}
                  />
                  <FilterDropdown
                    triggerClassName={
                      "!w-[165px] hover:!border-neutral-600 hover:!bg-white"
                    }
                    selectedValues={filters}
                    categories={getFilterConfig().categories}
                    data={getFilterConfig().data}
                    onSelectionChange={handleFilter}
                    multiSelect={false}
                    searchable={false}
                    disabled={showSearchNotFoundState}
                  />
                </div>
                <div>
                  <p className="font-semibold">
                    Total: {totalItems} Transporter
                  </p>
                </div>
              </div>
              {/* Active Filters Bar */}
              {Object.keys(filters).length > 0 && (
                <ActiveFiltersBar
                  filters={getActiveFilters()}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={handleClearAllFilters}
                />
              )}
            </div>

            <div className="">
              <Table
                data={paginatedData}
                columns={columns}
                onRowClick={() => {
                  // console.log("Row clicked");
                }}
                emptyComponent={
                  showSearchNotFoundState ? (
                    <DataNotFound
                      type="search"
                      title="Keyword Tidak Ditemukan"
                    />
                  ) : showFilterNotFoundState ? (
                    <DataNotFound
                      type="data"
                      title="Data tidak Ditemukan."
                      subtitle="Mohon coba hapus beberapa filter"
                    />
                  ) : (
                    <DataNotFound
                      className="w-full"
                      title="Tidak ada data ditemukan"
                    />
                  )
                }
                // loading={true}
                onSort={handleSort}
                sortConfig={sortConfig}
              />
              {renderConfirmationModal()}
              <HubungiModal
                isOpen={hubungiModalOpen}
                onClose={closeHubungiModal}
                transporterData={selectedTransporter}
              />
            </div>
          </>
        )}
      </div>
      {showPagination && hasData && (
        <div className="px-6 pb-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            perPage={perPage}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            variants="muatrans"
          />
        </div>
      )}
    </>
  );
};

export default TransporterContainer;
