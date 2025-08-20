import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import Button from "@/components/Button/Button";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

import DataTable from "./DataTable";
import NoOrderTable from "./NoOrderTable";

const RiwayatTransporterTidakAktif = () => {
  const { t } = useTranslation();
  const router = useRouter();
  // State management for dynamic functionality
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [loading, setLoading] = useState(false);
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null);
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);
  const [filters, setFilters] = useState({});

  const periodOptions = [
    {
      name: `${t("EksekusiTenderIndexSemuaPeriode")} (Default)`,
      value: "",
      format: "day",
    },
    {
      name: t("AppMuatpartsAnalisaProdukHariIni"),
      value: 0,
      format: "day",
    },
    {
      name: t("AppMuatpartsAnalisaProduk1MingguTerakhir"),
      value: 7,
      format: "day",
    },
    {
      name: t("AppMuatpartsAnalisaProduk30HariTerakhir"),
      value: 30,
      format: "month",
    },
    {
      name: t("AppMuatpartsAnalisaProduk90HariTerakhir"),
      value: 90,
      format: "month",
    },
    {
      name: t("AppMuatpartsAnalisaProduk1TahunTerakhir"),
      value: 365,
      format: "year",
    },
  ];

  const conditionFilters = useMemo(
    () => ({
      armadaNonaktif: "Armada Non Aktif Terlalu Banyak",
      adminIdle: "Admin Terdeteksi Sering Idle",
      transporterTidakAktif: "Transporter Tidak Aktif",
    }),
    []
  );

  // Mock data wrapped in useMemo to prevent unnecessary re-renders
  const mockData = useMemo(
    () => [
      {
        date: "10 Jan 2025 10:00 WIB",
        transporter: "PT Siba Surya",
        condition: `${conditionFilters.armadaNonaktif} (10/11)`,
      },
      {
        date: "10 Jan 2025 10:00 WIB",
        transporter:
          "PT Batavia Prosperindo Angkut Teknologi Indonesia Trans Nusantara Sejahtera Abadi Selalu Tbk",
        condition: `${conditionFilters.adminIdle} (5/7 Order)`,
      },
      {
        date: "10 Jan 2025 10:00 WIB",
        transporter: "Transporter AA",
        condition: conditionFilters.transporterTidakAktif,
      },
      {
        date: "10 Jan 2025 10:00 WIB",
        transporter: "PT Siba Surya",
        condition: `${conditionFilters.armadaNonaktif} (10/11)`,
      },
      {
        date: "10 Jan 2025 10:00 WIB",
        transporter:
          "PT Batavia Prosperindo Angkut Teknologi Indonesia Trans Nusantara Sejahtera Abadi Selalu Tbk",
        condition: `${conditionFilters.adminIdle} (5/7 Order)`,
      },
      {
        date: "10 Jan 2025 10:00 WIB",
        transporter: "Transporter AA",
        condition: conditionFilters.transporterTidakAktif,
      },
      {
        date: "10 Jan 2025 10:00 WIB",
        transporter: "PT Siba Surya",
        condition: `${conditionFilters.armadaNonaktif} (10/11)`,
      },
      {
        date: "10 Jan 2025 10:00 WIB",
        transporter:
          "PT Batavia Prosperindo Angkut Teknologi Indonesia Trans Nusantara Sejahtera Abadi Selalu Tbk",
        condition: `${conditionFilters.adminIdle} (5/7 Order)`,
      },
      {
        date: "10 Jan 2025 10:00 WIB",
        transporter: "Transporter AA",
        condition: conditionFilters.transporterTidakAktif,
      },
      {
        date: "10 Jan 2025 10:00 WIB",
        transporter: "PT Siba Surya",
        condition: `${conditionFilters.armadaNonaktif} (10/11)`,
      },
      {
        date: "10 Jan 2025 10:00 WIB",
        transporter:
          "PT Batavia Prosperindo Angkut Teknologi Indonesia Trans Nusantara Sejahtera Abadi Selalu Tbk",
        condition: `${conditionFilters.adminIdle} (5/7 Order)`,
      },
      {
        date: "10 Jan 2025 10:00 WIB",
        transporter: "Transporter AA",
        condition: conditionFilters.transporterTidakAktif,
      },
    ],
    [conditionFilters]
  );

  // Filter and sort the data based on search query, filters, and sort configuration
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...mockData];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.transporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.date.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply condition filter
    if (filters?.condition) {
      const conditionFiltersArray = Array.isArray(filters.condition)
        ? filters.condition
        : [filters.condition];

      filtered = filtered.filter((item) => {
        return conditionFiltersArray.some((filter) => {
          if (filter.id === "armada_nonaktif") {
            return item.condition.includes(
              conditionFilters.armadaNonaktif.split(" ").slice(0, 3).join(" ")
            );
          } else if (filter.id === "admin_idle") {
            return item.condition.includes(
              conditionFilters.adminIdle.split(" ").slice(0, 3).join(" ")
            );
          } else if (filter.id === "transporter_tidak_aktif") {
            return item.condition.includes(
              conditionFilters.transporterTidakAktif
            );
          }
          return false;
        });
      });
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.direction === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [mockData, searchQuery, filters, sortConfig, conditionFilters]);

  // Calculate pagination
  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  // Event handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing per page
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSort = (key, direction) => {
    setSortConfig({ key, direction });
  };

  // Handler untuk filter periode
  const handleSelectPeriod = (selectedOption) => {
    if (selectedOption?.range) {
      if (
        !recentPeriodOptions?.some((s) => s?.value === selectedOption?.value)
      ) {
        setRecentPeriodOptions((prev) => [...prev, selectedOption]);
      }
      setCurrentPeriodValue(selectedOption);
      setCurrentPage(1); // Reset pagination when period changes
    } else if (selectedOption?.value === "") {
      setCurrentPeriodValue(selectedOption);
      setCurrentPage(1); // Reset pagination when period changes
    } else if (selectedOption?.value !== undefined) {
      setCurrentPeriodValue(selectedOption);
      setCurrentPage(1); // Reset pagination when period changes
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleDownload = () => {
    // Implement download functionality here
  };

  // Filter configuration - using conditionFilters object
  const filterConfig = useMemo(
    () => ({
      categories: [
        {
          key: "condition",
          label: "Kondisi",
          searchable: false,
        },
      ],
      data: {
        condition: [
          {
            id: "armada_nonaktif",
            label: conditionFilters.armadaNonaktif,
          },
          {
            id: "admin_idle",
            label: conditionFilters.adminIdle,
          },
          {
            id: "transporter_tidak_aktif",
            label: conditionFilters.transporterTidakAktif,
          },
        ],
      },
    }),
    [conditionFilters]
  );

  const columns = [
    {
      key: "done-date",
      header: "Tanggal Selesai",
      width: "184px",
      className: "align-top !pl-6 !pr-2.5",
      headerClassName: "pl-6 pr-2.5",
      render: (row) => (
        <span className="flex w-[150px] text-xs font-medium">{row.date}</span>
      ),
    },
    {
      key: "transporter",
      header: "Transporter",
      width: "430px",
      className: "align-top !px-2.5",
      headerClassName: "px-2.5",
      render: (row, _index) => (
        <div className="flex w-[430px] gap-5">
          <img
            src="/icons/data-not-found.svg"
            alt=""
            className="size-12 rounded-full border border-neutral-400 p-2"
          />
          <div className="mt-1 flex flex-col gap-y-2">
            <span className="line-clamp-1 text-xs font-bold text-neutral-900">
              {row.transporter}
            </span>

            <div className="flex items-center gap-2 text-xs font-medium text-primary-500 hover:cursor-pointer">
              <IconComponent src={"/icons/call-blue.svg"} />
              <div>Hubungi</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "condition",
      header: "Kondisi",
      width: "430px",
      className: "align-top !px-2.5",
      headerClassName: "px-2.5",
      render: (row, _index) => (
        <span className="flex w-[430px] text-xs font-semibold text-error-400">
          {row.condition}
        </span>
      ),
    },

    {
      key: "action",
      header: "",
      // width: "142px",
      headerClassName: "pl2.5 pr-6",
      className: "align-top !pl-2.5 !pr-6",
      sortable: false,
      render: (_row) => (
        <Button
          className="!px-[36.5px]"
          variant="muattrans-primary"
          onClick={() =>
            router.push(
              `/laporan/riwayat-transporter-tidak-aktif/${"uuid"}/riwayat-transporter`
            )
          }
        >
          Detail
        </Button>
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">
          Laporan Riwayat Transporter Tidak Aktif
        </h1>
        <div className="flex items-center gap-x-3">
          <DropdownPeriode
            options={periodOptions}
            onSelect={handleSelectPeriod}
            recentSelections={recentPeriodOptions}
            value={currentPeriodValue}
          />
          <Button
            iconLeft="/icons/download16.svg"
            variant="muattrans-primary"
            onClick={handleDownload}
          >
            Unduh
          </Button>
        </div>
      </div>
      {mockData.length === 0 ? (
        <NoOrderTable />
      ) : (
        <DataTable
          data={currentData}
          columns={columns}
          searchPlaceholder="Cari Transporter "
          totalCountLabel="Laporan"
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          perPage={perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSearch={handleSearch}
          onSort={handleSort}
          loading={loading}
          showPagination
          showFilter={true}
          filterConfig={filterConfig}
          onFilter={handleFilter}
          searchValue={searchQuery}
          filters={filters}
          sortConfig={sortConfig}
          isSearch={searchQuery}
        />
      )}
    </div>
  );
};

export default RiwayatTransporterTidakAktif;
