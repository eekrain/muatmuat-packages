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
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { toast } from "@/lib/toast";

const TransporterContainer = ({ onPageChange, onPerPageChange, count }) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({});
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    data: null,
  });

  const mockData = [
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
      companyName: "CV Moga Jaya Abadi",
      email: "contact.shipper@mail.com",
      picName: "Ahmad Maulana",
      picPhone: "No. HP : 0822-3100-1231",
      address: "Jalan Kedungdoro 101A, Tegalsari, Surabaya",
      fleetCount: 0,
      status: "Verifikasi Ditolak",
    },
  ];

  const openModal = (type, data) => {
    setModalState({ isOpen: true, type, data });
  };

  const handleConfirmAction = () => {
    if (!modalState.data) return;

    if (modalState.type === "delete") {
      console.log("Menghapus transporter:", modalState.data.companyName);
      toast.success("Transporter berhasil dihapus");
    } else if (modalState.type === "resend") {
      console.log(
        "Mengirim ulang verifikasi untuk:",
        modalState.data.companyName
      );
      toast.success("Verifikasi berhasil dikirim ulang");
    }
    setModalState({ isOpen: false, type: "", data: null });
  };

  const getStatusBadge = (status) => {
    let variant = "success";
    if (status === "Non Aktif" || status === "Verifikasi Ditolak") {
      variant = "error";
    } else if (status === "Dalam Verifikasi") {
      variant = "warning";
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
            <SimpleDropdownItem onClick={() => {}}>Hubungi</SimpleDropdownItem>
            <SimpleDropdownItem className={"text-red-500"} onClick={() => {}}>
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
            <SimpleDropdownItem onClick={() => {}}>Hubungi</SimpleDropdownItem>
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
            <SimpleDropdownItem onClick={() => {}}>Hubungi</SimpleDropdownItem>
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
            <SimpleDropdownItem onClick={() => {}}>Hubungi</SimpleDropdownItem>
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

    return null;
  };

  const columns = [
    {
      key: "companyName",
      header: "Nama Perusahaan",
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
    onPageChange?.(page);
  };

  const handlePerPageChange = (limit) => {
    setPerPage(limit);
    setCurrentPage(1);
    onPerPageChange?.(limit);
  };

  const handleSort = (sort, order) => {
    if (sort || order) {
      setSortConfig({ sort, order });
    } else {
      setSortConfig();
    }
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

  return (
    <div className="h-[calc(100vh-300px)]">
      <DataTable
        data={mockData}
        columns={columns}
        searchPlaceholder="Cari nama perusahaan, PIC, alamat..."
        totalCountLabel="Transporters"
        currentPage={currentPage}
        totalPages={Math.ceil(mockData.length / perPage)}
        totalItems={count || mockData.length}
        perPage={perPage}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        loading={false}
        showPagination
        filterConfig={getFilterConfig()}
      />
      {renderConfirmationModal()}
    </div>
  );
};

export default TransporterContainer;
