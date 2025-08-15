"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import Pagination from "@/components/Pagination/Pagination";
import { ReportSummaryCards } from "@/components/Report";
import LaporanPendapatanTable from "@/components/Report/LaporanPendapatanTable";
import { useTranslation } from "@/hooks/use-translation";
import {
  useGetTotalRevenueBreakdown,
  useGetUndisbursedFundsBreakdown,
} from "@/services/Transporter/laporan/pendapatan/getBreakdownRevenue";
import { useGetRevenueReportList } from "@/services/Transporter/laporan/pendapatan/getRevenue";
import { useGetRevenueSummary } from "@/services/Transporter/laporan/pendapatan/getSummary";

export default function Page() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null);
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedTransporterId, setSelectedTransporterId] = useState(
    "550e8400-e29b-41d4-a716-446655440001"
  );
  const [filters, setFilters] = useState({
    transporter_id: selectedTransporterId,
    page: 1,
    limit: 10,
    sort: "createdAt",
    order: "desc",
    keyword: "",
    status: ["DISBURSED", "PARTIALLY_DISBURSED"],
    source: ["ORDER_REVENUE"],
    preset: "this_month",
    start_date: "",
    end_date: "",
  });

  const { data: revenueSummary } = useGetRevenueSummary(selectedTransporterId);

  const { data: totalRevenueBreakdown, isLoading: loadingTotalRevenue } =
    useGetTotalRevenueBreakdown(selectedTransporterId);

  const {
    data: undisbursedFundsBreakdown,
    isLoading: loadingUndisbursedFunds,
  } = useGetUndisbursedFundsBreakdown(selectedTransporterId);

  const {
    data: revenueReportList,
    isLoading: loadingRevenueReportList,
    isError: errorRevenueReportList,
  } = useGetRevenueReportList(filters);

  // Konfigurasi periode
  const periodOptions = [
    {
      name: t(
        "LaporanPendapatanPage.periodOptionAllPeriods",
        {},
        "Semua Periode (Default)"
      ),
      value: "",
      format: "day",
    },
    {
      name: t("LaporanPendapatanPage.periodOptionToday", {}, "Hari Ini"),
      value: 0,
      format: "day",
    },
    {
      name: t(
        "LaporanPendapatanPage.periodOptionLastWeek",
        {},
        "1 Minggu Terakhir"
      ),
      value: 7,
      format: "day",
    },
    {
      name: t(
        "LaporanPendapatanPage.periodOptionLastMonth",
        {},
        "30 Hari Terakhir"
      ),
      value: 30,
      format: "month",
    },
    {
      name: t(
        "LaporanPendapatanPage.periodOptionLastQuarter",
        {},
        "90 Hari Terakhir"
      ),
      value: 90,
      format: "month",
    },
    {
      name: t(
        "LaporanPendapatanPage.periodOptionLastYear",
        {},
        "1 Tahun Terakhir"
      ),
      value: 365,
      format: "year",
    },
  ];

  // Summary data
  const defaultSummaryData = [
    {
      key: "totalRevenue",
      title: t(
        "LaporanPendapatanPage.summaryCardTotalRevenue",
        {},
        "Total Pendapatan"
      ),
      value: "Rp0",
      bgColor: "bg-[#E3F5ED]",
      textColor: "text-[#00AF6C]",
      icon: "/icons/dashboard/armada.svg",
    },
    {
      key: "totalUndisbursed",
      title: t(
        "LaporanPendapatanPage.summaryCardUndisbursedFunds",
        {},
        "Total Dana Belum Dicairkan"
      ),
      value: "Rp0",
      bgColor: "bg-[#FFF8E1]",
      textColor: "text-[#F57C00]",
      icon: "/icons/dashboard/armada.svg",
    },
    {
      key: "totalDisbursed",
      title: t(
        "LaporanPendapatanPage.summaryCardDisbursedFunds",
        {},
        "Total Dana Sudah Dicairkan"
      ),
      value: "Rp0",
      bgColor: "bg-[#E3F2FD]",
      textColor: "text-[#1976D2]",
      icon: "/icons/dashboard/armada.svg",
    },
    {
      key: "monthlyRevenue",
      title: t(
        "LaporanPendapatanPage.summaryCardThisMonthRevenue",
        {},
        "Pendapatan Bulan Ini"
      ),
      value: "Rp0",
      bgColor: "bg-[#E3F2FD]",
      textColor: "text-[#1976D2]",
      icon: "/icons/dashboard/armada.svg",
    },
  ];

  // merge API data dengan default
  const summaryData = defaultSummaryData.map((item) => {
    const apiValue = revenueSummary?.[item.key]?.formatted;
    return {
      ...item,
      value: apiValue || item.value, // kalau ada dari API pakai itu, kalau tidak pakai default
    };
  });

  // Table data
  const data = [
    // Sumber: Tambahan Biaya (additional_cost)
    {
      id: 1,
      orderNo: "INV/MTR/210504/001/AAA",
      source: t(
        "LaporanPendapatanPage.sourceAdditionalCost",
        {},
        "Tambahan Biaya"
      ),
      sourceType: "additional_cost",
      status: t("LaporanPendapatanPage.statusDisbursed", {}, "Sudah Dicairkan"),
      statusType: "sudah_dicairkan",
      revenue: "Rp50.000.000",
      undisbursed: "Rp0",
    },
    {
      id: 2,
      orderNo: "INV/MTR/210504/002/AAA",
      source: t(
        "LaporanPendapatanPage.sourceAdditionalCost",
        {},
        "Tambahan Biaya"
      ),
      sourceType: "additional_cost",
      status: t(
        "LaporanPendapatanPage.statusPartiallyDisbursed",
        {},
        "Dicairkan Sebagian"
      ),
      statusType: "dicairkan_sebagian",
      revenue: "Rp500.000",
      undisbursed: "Rp250.000",
    },
    {
      id: 3,
      orderNo: "INV/MTR/210504/003/AAA",
      source: t(
        "LaporanPendapatanPage.sourceAdditionalCost",
        {},
        "Tambahan Biaya"
      ),
      sourceType: "additional_cost",
      status: t(
        "LaporanPendapatanPage.statusNotDisbursed",
        {},
        "Belum Dicairkan"
      ),
      statusType: "belum_dicairkan",
      revenue: "Rp1.000.000",
      undisbursed: "Rp1.000.000",
    },

    // Sumber: Penyesuaian Pendapatan (revenue_adjustment)
    {
      id: 4,
      orderNo: "INV/MTR/210504/004/AAA",
      source: t(
        "LaporanPendapatanPage.sourceRevenueAdjustment",
        {},
        "Penyesuaian Pendapatan"
      ),
      sourceType: "revenue_adjustment",
      status: t("LaporanPendapatanPage.statusDisbursed", {}, "Sudah Dicairkan"),
      statusType: "sudah_dicairkan",
      revenue: "Rp50.000.000",
      undisbursed: "Rp0",
    },
    {
      id: 5,
      orderNo: "INV/MTR/210504/005/AAA",
      source: t(
        "LaporanPendapatanPage.sourceRevenueAdjustment",
        {},
        "Penyesuaian Pendapatan"
      ),
      sourceType: "revenue_adjustment",
      status: t(
        "LaporanPendapatanPage.statusPartiallyDisbursed",
        {},
        "Dicairkan Sebagian"
      ),
      statusType: "dicairkan_sebagian",
      revenue: "Rp250.000",
      undisbursed: "Rp200.000",
    },
    {
      id: 6,
      orderNo: "INV/MTR/210504/006/AAA",
      source: t(
        "LaporanPendapatanPage.sourceRevenueAdjustment",
        {},
        "Penyesuaian Pendapatan"
      ),
      sourceType: "revenue_adjustment",
      status: t(
        "LaporanPendapatanPage.statusNotDisbursed",
        {},
        "Belum Dicairkan"
      ),
      statusType: "belum_dicairkan",
      revenue: "Rp750.000",
      undisbursed: "Rp750.000",
    },

    // Sumber: Pendapatan Pesanan (order_revenue)
    {
      id: 7,
      orderNo: "INV/MTR/210504/007/AAA",
      source: t(
        "LaporanPendapatanPage.sourceOrderRevenue",
        {},
        "Pendapatan Pesanan"
      ),
      sourceType: "order_revenue",
      status: t("LaporanPendapatanPage.statusDisbursed", {}, "Sudah Dicairkan"),
      statusType: "sudah_dicairkan",
      revenue: "Rp2.000.000",
      undisbursed: "Rp0",
    },
    {
      id: 8,
      orderNo: "INV/MTR/210504/008/AAA",
      source: t(
        "LaporanPendapatanPage.sourceOrderRevenue",
        {},
        "Pendapatan Pesanan"
      ),
      sourceType: "order_revenue",
      status: t(
        "LaporanPendapatanPage.statusPartiallyDisbursed",
        {},
        "Dicairkan Sebagian"
      ),
      statusType: "dicairkan_sebagian",
      revenue: "Rp1.500.000",
      undisbursed: "Rp500.000",
    },
    {
      id: 9,
      orderNo: "INV/MTR/210504/009/AAA",
      source: t(
        "LaporanPendapatanPage.sourceOrderRevenue",
        {},
        "Pendapatan Pesanan"
      ),
      sourceType: "order_revenue",
      status: t(
        "LaporanPendapatanPage.statusNotDisbursed",
        {},
        "Belum Dicairkan"
      ),
      statusType: "belum_dicairkan",
      revenue: "Rp3.000.000",
      undisbursed: "Rp3.000.000",
    },
  ];

  // Table columns
  const columns = [
    {
      header: t(
        "LaporanPendapatanPage.tableColumnOrderNumber",
        {},
        "No. Pesanan"
      ),
      key: "invoiceNumber",
      sortable: true,
      width: "200px",
    },
    {
      header: t("LaporanPendapatanPage.tableColumnSource", {}, "Sumber"),
      key: "sourceName",
      sortable: true,
      width: "200px",
      render: (row) => <span>{row.sourceName}</span>,
    },
    {
      header: t("LaporanPendapatanPage.tableColumnStatus", {}, "Status"),
      key: "statusName",
      sortable: true,
      width: "190px",
      render: (row) => {
        let variant = "success";
        if (row.status === "PARTIALLY_DISBURSED") {
          variant = "warning";
        } else if (row.status === "NOT_DISBURSED") {
          variant = "error";
        }
        return <BadgeStatus variant={variant}>{row.statusName}</BadgeStatus>;
      },
    },
    {
      header: t(
        "LaporanPendapatanPage.tableColumnRevenueAmount",
        {},
        "Nominal Pendapatan"
      ),
      key: "revenueFormatted",
      sortable: true,
      width: "180px",
    },
    {
      header: t(
        "LaporanPendapatanPage.tableColumnUndisbursedFunds",
        {},
        "Dana Belum Dicairkan"
      ),
      key: "undisbursedFormatted",
      sortable: true,
      width: "180px",
    },
    {
      header: t("LaporanPendapatanPage.tableColumnAction", {}, "Action"),
      key: "action",
      sortable: false,
      width: "100px",
      render: (row) => (
        <Button
          className="h-8 px-4 text-xs"
          onClick={() => router.push(`/laporan/pendapatan/${row.id}`)}
        >
          {t("LaporanPendapatanPage.buttonDetail", {}, "Detail")}
        </Button>
      ),
    },
  ];

  // Filter configuration
  const filterConfig = {
    categories: [
      {
        key: "status",
        label: t("LaporanPendapatanPage.filterCategoryStatus", {}, "Status"),
        searchable: true,
      },
      {
        key: "source",
        label: t("LaporanPendapatanPage.filterCategorySource", {}, "Sumber"),
        searchable: true,
      },
    ],
    data: {
      status: [
        {
          id: "DISBURSED",
          label: t(
            "LaporanPendapatanPage.statusDisbursed",
            {},
            "Sudah Dicairkan"
          ),
        },
        {
          id: "PARTIALLY_DISBURSED",
          label: t(
            "LaporanPendapatanPage.statusPartiallyDisbursed",
            {},
            "Dicairkan Sebagian"
          ),
        },
        {
          id: "NOT_DISBURSED",
          label: t(
            "LaporanPendapatanPage.statusNotDisbursed",
            {},
            "Belum Dicairkan"
          ),
        },
      ],
      source: [
        {
          id: "ADDITIONAL_COST",
          label: t(
            "LaporanPendapatanPage.sourceAdditionalCost",
            {},
            "Tambahan Biaya"
          ),
        },
        {
          id: "REVENUE_ADJUSTMENT",
          label: t(
            "LaporanPendapatanPage.sourceRevenueAdjustment",
            {},
            "Penyesuaian Pendapatan"
          ),
        },
        {
          id: "ORDER_REVENUE",
          label: t(
            "LaporanPendapatanPage.sourceOrderRevenue",
            {},
            "Pendapatan Pesanan"
          ),
        },
      ],
    },
  };

  // Handler untuk filter periode
  const handleSelectPeriod = (selectedOption) => {
    // For custom date range option
    if (selectedOption?.range) {
      // Update recent selections - only add if not already in the array
      if (
        !recentPeriodOptions?.some((s) => s?.value === selectedOption?.value)
      ) {
        setRecentPeriodOptions((prev) => [...prev, selectedOption]);
      }
      // Update the current period value
      setCurrentPeriodValue(selectedOption);
    }
    // For default "Semua Periode" option
    else if (selectedOption?.value === "") {
      // Update the current period value
      setCurrentPeriodValue(selectedOption);
    }
    // For predefined period options (today, last 7 days, etc.)
    else if (selectedOption?.value !== undefined) {
      // Update the current period value
      setCurrentPeriodValue(selectedOption);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleFilter = (_newFilters) => {
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      status: _newFilters.status || [],
      source: _newFilters.source || [],
      keyword: _newFilters.keyword || "",
      page: 1,
    }));
  };

  const handleSort = (_sort, _order) => {
    const sortedData = [...tableData].sort((a, b) => {
      const isAsc = _order === "asc" ? 1 : -1;

      if (_sort === "orderNo") {
        return a.orderNo.localeCompare(b.orderNo) * isAsc;
      }
      if (_sort === "source") {
        return a.source.localeCompare(b.source) * isAsc;
      }
      if (_sort === "status") {
        return a.status.localeCompare(b.status) * isAsc;
      }
      if (_sort === "revenue") {
        // Remove non-numeric characters (e.g., currency symbols, commas) and convert to numbers
        const revenueA = parseFloat(a.revenue.replace(/[^\d.-]/g, ""));
        const revenueB = parseFloat(b.revenue.replace(/[^\d.-]/g, ""));
        return (revenueA - revenueB) * isAsc;
      }
      if (_sort === "undisbursed") {
        // Remove non-numeric characters (e.g., currency symbols, commas) and convert to numbers
        const undisbursedA = parseFloat(a.undisbursed.replace(/[^\d.-]/g, ""));
        const undisbursedB = parseFloat(b.undisbursed.replace(/[^\d.-]/g, ""));
        return (undisbursedA - undisbursedB) * isAsc;
      }
      return 0;
    });
    // Update state with sorted data
    setTableData(sortedData);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (perPageValue) => {
    setPerPage(perPageValue);
    setCurrentPage(1);
  };

  const isRevenueEmpty = !tableData || tableData.length === 0;

  const revenueData = useMemo(() => {
    return revenueReportList?.reports || [];
  }, [revenueReportList]);

  useEffect(() => {
    // Set initial table data from revenue report list
    if (revenueData) {
      setTableData(revenueData);
    }
  }, [revenueData]);

  const renderTooltip = (index) => {
    if (index === 0) {
      const { orderRevenue, adjustmentRevenue } = totalRevenueBreakdown || {};
      return (
        <div className="space-y-1 text-sm">
          <div className="flex items-center">
            <span>Pendapatan Pesanan:</span>
            <span>{orderRevenue?.formatted || "Rp0"}</span>
          </div>
          <div className="flex items-center">
            <span>Penyesuaian Pendapatan:</span>
            <span>{adjustmentRevenue?.formatted || "Rp0"}</span>
          </div>
        </div>
      );
    }
    if (index === 1) {
      return (
        <div className="space-y-1 text-sm">
          {undisbursedFundsBreakdown?.undisbursedBySource?.map((item, idx) => (
            <div className="flex items-center" key={idx}>
              <span>{item.sourceName}:</span>
              <span>{item.formatted}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mx-auto mt-7 max-w-full px-0">
      <h1 className="mb-5 text-2xl font-bold">
        {t(
          "LaporanPendapatanPage.titleLaporanPendapatan",
          {},
          "Laporan Pendapatan"
        )}
      </h1>

      {/* Summary Cards */}
      <ReportSummaryCards items={summaryData} renderTooltip={renderTooltip} />

      {/* Data Table with Filter or Empty State */}
      {isRevenueEmpty ? (
        <DataEmpty
          title={t(
            "LaporanPendapatanPage.emptyStateTitle",
            {},
            "Belum ada laporan pendapatan"
          )}
          subtitle={t(
            "LaporanPendapatanPage.emptyStateSubtitle",
            {},
            "Saat ini belum tersedia laporan pendapatan. Yuk mulai catat transaksi agar laporan bisa tampil!"
          )}
          className="mb-2 w-full"
        />
      ) : (
        <Card className="border border-none">
          <CardContent className="p-0">
            <div className="p-1 pb-0">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex-1">
                  <LaporanPendapatanTable
                    data={tableData}
                    columns={columns}
                    searchPlaceholder={t(
                      "LaporanPendapatanPage.searchPlaceholder",
                      {},
                      "Cari Pesanan"
                    )}
                    showFilter={true}
                    showSearch={true}
                    showPagination={false}
                    showTotalCount={false}
                    currentPage={currentPage}
                    totalPages={2}
                    totalItems={tableData.length}
                    perPage={perPage}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                    onSort={handleSort}
                    filterConfig={filterConfig}
                    className="border-0"
                    disabledByPeriod={!!currentPeriodValue}
                    headerActions={
                      <DropdownPeriode
                        options={periodOptions}
                        onSelect={handleSelectPeriod}
                        recentSelections={recentPeriodOptions}
                        value={currentPeriodValue}
                      />
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {!isRevenueEmpty && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={2}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
            perPage={perPage}
            variants="muattrans"
          />
        </div>
      )}
    </div>
  );
}
