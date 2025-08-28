"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Download, Info } from "lucide-react";

import { exportWithdrawalData } from "@/services/Transporter/laporan/pencairan-dana/exportWithdrawalData";
import { useGetBankAccounts } from "@/services/Transporter/laporan/pencairan-dana/getBankAccountsFilter";
import { useGetPeriodHistory } from "@/services/Transporter/laporan/pencairan-dana/getPeriodSearchHistory";
import { useGetWithdrawalList } from "@/services/Transporter/laporan/pencairan-dana/getWithdrawalList";
import { savePeriodSearch } from "@/services/Transporter/laporan/pencairan-dana/savePeriodSearch";

import Button from "@/components/Button/Button";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import LaporanPencairanDanaTable from "@/components/Report/LaporanPencairanDanaTable/LaporanPencairanDanaTable";

import { useTranslation } from "@/hooks/use-translation";

export default function Page() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null);
  const [filters, setFilters] = useState({});

  // API parameters state
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedAccounts, setSelectedAccounts] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Konfigurasi periode
  const periodOptions = [
    {
      name: t(
        "LaporanPencairanDanaPage.periodOptionAllPeriods",
        {},
        "Semua Periode (Default)"
      ),
      value: "",
      format: "day",
    },
    {
      name: t("LaporanPencairanDanaPage.periodOptionToday", {}, "Hari Ini"),
      value: 0,
      format: "day",
    },
    {
      name: t(
        "LaporanPencairanDanaPage.periodOptionLastWeek",
        {},
        "1 Minggu Terakhir"
      ),
      value: 7,
      format: "day",
    },
    {
      name: t(
        "LaporanPencairanDanaPage.periodOptionLastMonth",
        {},
        "30 Hari Terakhir"
      ),
      value: 30,
      format: "month",
    },
    {
      name: t(
        "LaporanPencairanDanaPage.periodOptionLastQuarter",
        {},
        "90 Hari Terakhir"
      ),
      value: 90,
      format: "month",
    },
    {
      name: t(
        "LaporanPencairanDanaPage.periodOptionLastYear",
        {},
        "1 Tahun Terakhir"
      ),
      value: 365,
      format: "year",
    },
  ];

  // Prepare API parameters
  const apiParams = {
    page: currentPage,
    limit: perPage,
    sort: sortField,
    order: sortOrder,
    accounts: selectedAccounts,
    startDate: startDate,
    endDate: endDate,
  };

  const { withdrawals: tableData } = useGetWithdrawalList(apiParams);
  const { accounts } = useGetBankAccounts();
  const { history: periodHistory } = useGetPeriodHistory();

  console.log("tableData: ", tableData);
  console.log("periodHistory: ", periodHistory);

  function formatDateToWIB(isoString) {
    const date = new Date(isoString);

    const options = {
      timeZone: "Asia/Jakarta",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formatted = new Intl.DateTimeFormat("id-ID", options).format(date);

    return `${formatted.replace(".", ":")} WIB`;
  }

  function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  }

  // Table columns
  const columns = [
    {
      header: t("LaporanPencairanDanaPage.tableColumnDate", {}, "Tanggal"),
      key: "withdrawalDate",
      sortable: true,
      width: "200px",
      render: (row) => <span>{formatDateToWIB(row.withdrawalDate)}</span>,
    },
    {
      header: t(
        "LaporanPencairanDanaPage.tableColumnDisbursementAmount",
        {},
        "Jumlah Pencairan"
      ),
      key: "amount",
      sortable: true,
      width: "180px",
      render: (row) => <span>{formatRupiah(row.amount)}</span>,
    },
    {
      header: t(
        "LaporanPencairanDanaPage.tableColumnDisbursementAccount",
        {},
        "Rekening Pencairan"
      ),
      key: "account",
      sortable: true,
      width: "200px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.bankAccount.logoUrl}
            alt={row.bankAccount.bankCode}
            className="h-6 w-6 object-contain"
          />
          <span>{row.bankAccount.accountNumber}</span>
        </div>
      ),
    },
    {
      header: t("LaporanPencairanDanaPage.tableColumnAction", {}, "Action"),
      key: "action",
      sortable: false,
      width: "100px",
      render: (row) => (
        <Button
          className="h-8 px-4 text-xs"
          onClick={() => router.push(`/laporan/pencairan-dana/${row.id}`)}
        >
          {t("LaporanPencairanDanaPage.buttonDetail", {}, "Detail")}
        </Button>
      ),
    },
  ];

  // Filter configuration
  const filterConfig = {
    categories: [
      {
        key: "bank",
        label: t(
          "LaporanPencairanDanaPage.filterCategoryDisbursementAccount",
          {},
          "Rekening Pencairan"
        ),
        searchable: false,
      },
    ],
    data: {
      bank: accounts.map((acc) => ({
        id: acc.id,
        label: (
          <div className="flex items-center gap-2">
            <img
              src={acc.logoUrl}
              alt={acc.bankName}
              className="h-4 w-4 object-contain"
            />
            <span>{`${acc.bankCode} ${acc.accountNumber}`}</span>
          </div>
        ),
      })),
    },
  };

  // Handler untuk filter periode
  const handleSelectPeriod = async (selectedOption) => {
    // For custom date range option
    if (selectedOption?.range) {
      // Update the current period value
      setCurrentPeriodValue(selectedOption);

      // Set start and end dates for API
      if (selectedOption.startDate && selectedOption.endDate) {
        setStartDate(selectedOption.startDate);
        setEndDate(selectedOption.endDate);

        // Save period search
        try {
          await savePeriodSearch({
            startDate: selectedOption.startDate,
            endDate: selectedOption.endDate,
            displayText:
              selectedOption.displayText ||
              `${selectedOption.startDate} - ${selectedOption.endDate}`,
          });
        } catch (error) {
          console.error("Failed to save period search:", error);
        }
      }
    }
    // For default "Semua Periode" option
    else if (selectedOption?.value === "") {
      // Update the current period value
      setCurrentPeriodValue(selectedOption);
      // Clear date filters
      setStartDate("");
      setEndDate("");
    }
    // For predefined period options (today, last 7 days, etc.)
    else if (selectedOption?.value !== undefined) {
      // Update the current period value
      setCurrentPeriodValue(selectedOption);

      // Calculate date range based on selected period
      const today = new Date();
      let startDate = new Date();

      if (selectedOption.value === 0) {
        // Today
        startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
      } else if (selectedOption.value > 0) {
        // Last N days
        startDate.setDate(today.getDate() - selectedOption.value);
      }

      const startDateStr = startDate.toISOString().split("T")[0];
      const endDateStr = today.toISOString().split("T")[0];

      setStartDate(startDateStr);
      setEndDate(endDateStr);

      // Save period search for predefined periods
      try {
        await savePeriodSearch({
          startDate: startDateStr,
          endDate: endDateStr,
          displayText: selectedOption.name,
        });
      } catch (error) {
        console.error("Failed to save period search:", error);
      }
    }
  };

  // Convert period history to recent period options format
  const recentPeriodOptionsFromHistory = periodHistory.map((item) => ({
    name: item.displayText,
    value: `${item.startDate}-${item.endDate}`,
    startDate: item.startDate,
    endDate: item.endDate,
    displayText: item.displayText,
    range: true,
  }));

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters) => {
    console.log("Filters: ", newFilters);
    setFilters(newFilters);
    setCurrentPage(1);

    // Update accounts filter for API
    if (newFilters.bank && newFilters.bank.length > 0) {
      const accountIds = newFilters.bank.map((item) => item.id).join(",");
      setSelectedAccounts(accountIds);
    } else {
      setSelectedAccounts("");
    }
  };

  const handleSort = (columnKey) => {
    const newSortField = columnKey;
    let newSortOrder = "asc";

    // If clicking the same column, toggle order
    if (sortField === columnKey) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    setSortField(newSortField);
    setSortOrder(newSortOrder);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (perPageValue) => {
    setPerPage(perPageValue);
    setCurrentPage(1);
  };

  const handleDownload = async () => {
    try {
      // Prepare export parameters (same as API params)
      const exportParams = {
        page: currentPage,
        limit: perPage,
        sort: sortField,
        order: sortOrder,
        accounts: selectedAccounts,
        startDate: startDate,
        endDate: endDate,
      };

      const result = await exportWithdrawalData(exportParams);

      if (result.success) {
        // Create a temporary link to download the file
        const link = document.createElement("a");
        link.href = result.data.Data.downloadUrl;
        link.download = result.data.Data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log("Download successful:", result.data.Data.fileName);
      } else {
        console.error("Export failed:", result.data.Message?.Text);
        // You can add toast notification here if needed
      }
    } catch (error) {
      console.error("Download error:", error);
      // You can add toast notification here if needed
    }
  };

  const isDisbursementEmpty = !tableData || tableData.length === 0;

  // Check if any filters or periods are active
  const hasActiveFilters = Object.keys(filters).length > 0;
  const hasActivePeriod = currentPeriodValue && currentPeriodValue.value !== "";
  const hasActiveSearch = searchValue.length > 0;

  // Show DataEmpty only when no data AND no active filters/periods/search
  const shouldShowDataEmpty =
    isDisbursementEmpty &&
    !hasActiveFilters &&
    !hasActivePeriod &&
    !hasActiveSearch;

  // Sort configuration for table
  const sortConfig = {
    sort: sortField,
    order: sortOrder,
  };

  return (
    <div className="mx-auto mt-7 max-w-full px-0">
      {/* Header Section with Title, Tooltip, and Download Button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">
            {t(
              "LaporanPencairanDanaPage.titleLaporanPencairan",
              {},
              "Laporan Pencairan"
            )}
          </h1>
          <InfoTooltip
            className="w-80"
            side="right"
            trigger={
              <button className="flex text-neutral-600 hover:text-neutral-800">
                <Info size={18} />
              </button>
            }
            render={t(
              "LaporanPencairanDanaPage.infoTooltipDescription",
              {},
              "Pantau semua pencairan dana yang sudah kamu terima dengan mudah. Laporan ini mencatat setiap transaksi, lengkap dengan nominal, tanggal, dan rekening pencairan."
            )}
          />
        </div>
        <Button onClick={handleDownload} iconLeft={<Download size={16} />}>
          {t("LaporanPencairanDanaPage.buttonDownload", {}, "Unduh")}
        </Button>
      </div>

      {/* Data Table with Filter or Empty State */}
      {shouldShowDataEmpty ? (
        <DataEmpty
          title={t(
            "LaporanPencairanDanaPage.emptyStateTitle",
            {},
            "Belum ada laporan pencairan"
          )}
          subtitle={t(
            "LaporanPencairanDanaPage.emptyStateSubtitle",
            {},
            "Saat ini belum tersedia laporan pencairan. Setelah ada transaksi pencairan, laporan akan muncul di sini."
          )}
        />
      ) : (
        <LaporanPencairanDanaTable
          data={tableData}
          columns={columns}
          currentPage={currentPage}
          totalPages={2}
          perPage={perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onPeriodChange={handleSelectPeriod}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          onDownload={handleDownload}
          periodOptions={periodOptions}
          currentPeriodValue={currentPeriodValue}
          recentPeriodOptions={recentPeriodOptionsFromHistory}
          filterConfig={filterConfig}
          searchValue={searchValue}
          filters={filters}
          sortConfig={sortConfig}
        />
      )}
    </div>
  );
}
