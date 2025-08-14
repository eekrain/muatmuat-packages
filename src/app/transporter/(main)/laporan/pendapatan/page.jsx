"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import Pagination from "@/components/Pagination/Pagination";
import { ReportSummaryCards } from "@/components/Report";
import LaporanPendapatanTable from "@/components/Report/LaporanPendapatanTable";
import { useTranslation } from "@/hooks/use-translation";

export default function Page() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null);
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);

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
  const summaryData = [
    {
      title: t(
        "LaporanPendapatanPage.summaryCardTotalRevenue",
        {},
        "Total Pendapatan"
      ),
      value: "Rp1.400.000",
      bgColor: "bg-[#E3F5ED]",
      textColor: "text-[#00AF6C]",
      icon: "/icons/dashboard/armada.svg",
    },
    {
      title: t(
        "LaporanPendapatanPage.summaryCardUndisbursedFunds",
        {},
        "Total Dana Belum Dicairkan"
      ),
      value: "Rp 31.550.000",
      bgColor: "bg-[#FFF8E1]",
      textColor: "text-[#F57C00]",
      icon: "/icons/dashboard/armada.svg",
    },
    {
      title: t(
        "LaporanPendapatanPage.summaryCardDisbursedFunds",
        {},
        "Total Dana Sudah Dicairkan"
      ),
      value: "Rp432.452.564",
      bgColor: "bg-[#E3F2FD]",
      textColor: "text-[#1976D2]",
      icon: "/icons/dashboard/armada.svg",
    },
    {
      title: t(
        "LaporanPendapatanPage.summaryCardThisMonthRevenue",
        {},
        "Pendapatan Bulan Ini"
      ),
      value: "Rp432.452.564",
      bgColor: "bg-[#E3F2FD]",
      textColor: "text-[#1976D2]",
      icon: "/icons/dashboard/armada.svg",
    },
  ];

  // Table data
  const tableData = [
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
      key: "orderNo",
      sortable: true,
      width: "200px",
    },
    {
      header: t("LaporanPendapatanPage.tableColumnSource", {}, "Sumber"),
      key: "source",
      sortable: true,
      width: "200px",
      render: (row) => <span>{row.source}</span>,
    },
    {
      header: t("LaporanPendapatanPage.tableColumnStatus", {}, "Status"),
      key: "status",
      sortable: true,
      width: "190px",
      render: (row) => {
        let variant = "success";
        if (
          row.status ===
          t(
            "LaporanPendapatanPage.statusPartiallyDisbursed",
            {},
            "Dicairkan Sebagian"
          )
        ) {
          variant = "warning";
        } else if (
          row.status ===
          t("LaporanPendapatanPage.statusNotDisbursed", {}, "Belum Dicairkan")
        ) {
          variant = "error";
        }
        return <BadgeStatus variant={variant}>{row.status}</BadgeStatus>;
      },
    },
    {
      header: t(
        "LaporanPendapatanPage.tableColumnRevenueAmount",
        {},
        "Nominal Pendapatan"
      ),
      key: "revenue",
      sortable: true,
      width: "180px",
    },
    {
      header: t(
        "LaporanPendapatanPage.tableColumnUndisbursedFunds",
        {},
        "Dana Belum Dicairkan"
      ),
      key: "undisbursed",
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
          id: "sudah_dicairkan",
          label: t(
            "LaporanPendapatanPage.statusDisbursed",
            {},
            "Sudah Dicairkan"
          ),
        },
        {
          id: "dicairkan_sebagian",
          label: t(
            "LaporanPendapatanPage.statusPartiallyDisbursed",
            {},
            "Dicairkan Sebagian"
          ),
        },
        {
          id: "belum_dicairkan",
          label: t(
            "LaporanPendapatanPage.statusNotDisbursed",
            {},
            "Belum Dicairkan"
          ),
        },
      ],
      source: [
        {
          id: "additional_cost",
          label: t(
            "LaporanPendapatanPage.sourceAdditionalCost",
            {},
            "Tambahan Biaya"
          ),
        },
        {
          id: "revenue_adjustment",
          label: t(
            "LaporanPendapatanPage.sourceRevenueAdjustment",
            {},
            "Penyesuaian Pendapatan"
          ),
        },
        {
          id: "order_revenue",
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
  };

  const handleSort = (_sort, _order) => {
    // no-op for now
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (perPageValue) => {
    setPerPage(perPageValue);
    setCurrentPage(1);
  };

  const isRevenueEmpty = !tableData || tableData.length === 0;

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
      <ReportSummaryCards
        items={summaryData}
        renderTooltip={(index) => {
          if (index === 0) {
            return (
              <>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <span>
                      {t(
                        "LaporanPendapatanPage.tooltipOrderRevenue",
                        {},
                        "Pendapatan Pesanan:"
                      )}
                    </span>
                    <span>Rp 10.000</span>
                  </div>
                  <div className="flex items-center">
                    <span>
                      {t(
                        "LaporanPendapatanPage.tooltipRevenueAdjustment",
                        {},
                        "Penyesuaian Pendapatan:"
                      )}
                    </span>
                    <span>Rp 300.000</span>
                  </div>
                  <div className="flex items-center">
                    <span>
                      {t(
                        "LaporanPendapatanPage.tooltipAdditionalCost",
                        {},
                        "Tambahan Biaya:"
                      )}
                    </span>
                    <span>Rp 200.000</span>
                  </div>
                </div>
              </>
            );
          }
          if (index === 1) {
            return (
              <>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <span>
                      {t(
                        "LaporanPendapatanPage.tooltipOrderRevenue",
                        {},
                        "Pendapatan Pesanan:"
                      )}
                    </span>
                    <span>Rp 1.100.000</span>
                  </div>
                  <div className="flex items-center">
                    <span>
                      {t(
                        "LaporanPendapatanPage.tooltipRevenueAdjustment",
                        {},
                        "Penyesuaian Pendapatan:"
                      )}
                    </span>
                    <span>Rp 300.000</span>
                  </div>
                  <div className="flex items-center">
                    <span>
                      {t(
                        "LaporanPendapatanPage.tooltipAdditionalCost",
                        {},
                        "Tambahan Biaya:"
                      )}
                    </span>
                    <span>Rp 200.000</span>
                  </div>
                </div>
              </>
            );
          }
          return null;
        }}
      />

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
