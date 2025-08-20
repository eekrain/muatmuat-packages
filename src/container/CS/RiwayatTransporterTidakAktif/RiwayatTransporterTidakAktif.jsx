import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import Button from "@/components/Button/Button";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { TransporterInactiveTypeEnum } from "@/lib/constants/Transporter/laporan/transporterInactive.enum";
import { formatDate } from "@/lib/utils/dateFormat";
import { useGetTransporterInactive } from "@/services/Transporter/laporan/riwayat-transporter-tidak-aktif/getTransporterInactive";

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
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null);
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);
  const [filters, setFilters] = useState({});

  // Use the transporter inactive service
  const params = {
    page: currentPage,
    limit: perPage,
    ...(searchQuery && { search: searchQuery }),
    ...(currentPeriodValue &&
      currentPeriodValue.value !== "" && {
        // Add period filtering logic here based on your API requirements
        startDate: currentPeriodValue.startDate,
        endDate: currentPeriodValue.endDate,
      }),
    // Apply condition filter to API params
    ...(filters?.condition && {
      condition: Array.isArray(filters.condition)
        ? filters.condition[0]?.id
        : filters.condition?.id,
    }),
  };

  const {
    data: apiData,
    isLoading,
    isError,
  } = useGetTransporterInactive(params);

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

  // Filter and sort the data based on search query, filters, and sort configuration
  const filteredAndSortedData = useMemo(() => {
    // For server-side filtering, we use the data as-is since filtering is handled by the API
    // However, we can still apply client-side sorting if needed
    const filtered = [...(apiData?.items || [])];

    // Apply sorting (client-side sorting for enhanced UX)
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
  }, [apiData?.items, sortConfig]);

  // Use API pagination data
  const totalItems = apiData?.pagination?.totalItems || 0;
  const totalPages = apiData?.pagination?.totalPages || 1;
  const currentData = filteredAndSortedData;

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
    setCurrentPage(1); // Reset pagination when filtering
  };

  const handleDownload = () => {
    // Implement download functionality here
  };

  const filterConfig = {
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
          id: "INACTIVE_FLEET_TOO_MANY",
          label: TransporterInactiveTypeEnum.INACTIVE_FLEET_TOO_MANY,
        },
        {
          id: "ADMIN_IDLE_DETECTED",
          label: TransporterInactiveTypeEnum.ADMIN_IDLE_DETECTED,
        },
        {
          id: "TRANSPORTER_INACTIVE",
          label: TransporterInactiveTypeEnum.TRANSPORTER_INACTIVE,
        },
      ],
    },
  };

  const columns = [
    {
      key: "done-date",
      header: "Tanggal Selesai",
      width: "184px",
      className: "align-top !pl-6 !pr-2.5",
      headerClassName: "pl-6 pr-2.5",
      render: (row) => (
        <span className="flex w-[150px] text-xs font-medium">
          {formatDate(row.dateCompleted)}
        </span>
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
              {row.transporterName}
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
          {row.conditionText}
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
      render: (row) => (
        <Button
          className="!px-[36.5px]"
          variant="muattrans-primary"
          onClick={() =>
            router.push(
              `/laporan/riwayat-transporter-tidak-aktif/${row.transporterId}/riwayat-transporter`
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
      {isError ? (
        <div className="flex items-center justify-center p-8">
          <span className="text-error-500">
            Terjadi kesalahan saat memuat data. Silakan coba lagi.
          </span>
        </div>
      ) : !apiData?.items && !isLoading ? (
        <NoOrderTable />
      ) : (
        <DataTable
          data={currentData}
          columns={columns}
          searchPlaceholder="Cari Transporter "
          totalCountLabel="Laporan"
          currentPage={apiData?.pagination?.currentPage || currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          perPage={apiData?.pagination?.itemsPerPage || perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSearch={handleSearch}
          onSort={handleSort}
          loading={isLoading}
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
