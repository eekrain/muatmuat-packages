"use client";

import { useState } from "react";

import { Info } from "lucide-react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import DataTable from "@/components/DataTable/DataTable";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import Pagination from "@/components/Pagination/Pagination";

export default function Page() {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null);
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);
  const [filters, setFilters] = useState({});

  // Konfigurasi periode
  const periodOptions = [
    {
      name: "Semua Periode (Default)",
      value: "",
      format: "day",
    },
    {
      name: "Hari Ini",
      value: 0,
      format: "day",
    },
    {
      name: "1 Minggu Terakhir",
      value: 7,
      format: "day",
    },
    {
      name: "30 Hari Terakhir",
      value: 30,
      format: "month",
    },
    {
      name: "90 Hari Terakhir",
      value: 90,
      format: "month",
    },
    {
      name: "1 Tahun Terakhir",
      value: 365,
      format: "year",
    },
  ];

  // Summary data
  const summaryData = [
    {
      title: "Total Pendapatan",
      value: "Rp1.400.000",
      bgColor: "bg-[#E3F5ED]",
      textColor: "text-[#00AF6C]",
      icon: "/icons/dashboard/armada.svg",
    },
    {
      title: "Total Dana Belum Dicairkan",
      value: "Rp 31.550.000",
      bgColor: "bg-[#FFF8E1]",
      textColor: "text-[#F57C00]",
      icon: "/icons/dashboard/armada.svg",
    },
    {
      title: "Total Dana Sudah Dicairkan",
      value: "Rp432.452.564",
      bgColor: "bg-[#E3F2FD]",
      textColor: "text-[#1976D2]",
      icon: "/icons/dashboard/armada.svg",
    },
    {
      title: "Pendapatan Bulan Ini",
      value: "Rp432.452.564",
      bgColor: "bg-[#E3F2FD]",
      textColor: "text-[#1976D2]",
      icon: "/icons/dashboard/armada.svg",
    },
  ];

  // Table data
  const tableData = [
    {
      orderNo: "INV/MTR/210504/001/AAA",
      source: "Tambahan Biaya",
      status: "Sudah Dicairkan",
      revenue: "Rp50.000.000",
      undisbursed: "Rp0",
      sourceType: "additional_cost",
    },
    {
      orderNo: "INV/MTR/210504/002/AAA",
      source: "Tambahan Biaya",
      status: "Dicairkan Sebagian",
      revenue: "Rp500.000",
      undisbursed: "Rp250.000",
      sourceType: "additional_cost",
    },
    {
      orderNo: "INV/MTR/210504/003/AAA",
      source: "Penyesuaian Pendapatan",
      status: "Sudah Dicairkan",
      revenue: "Rp50.000.000",
      undisbursed: "Rp0",
      sourceType: "revenue_adjustment",
    },
    {
      orderNo: "INV/MTR/210504/004/AAA",
      source: "Penyesuaian Pendapatan",
      status: "Dicairkan Sebagian",
      revenue: "Rp250.000",
      undisbursed: "Rp200.000",
      sourceType: "revenue_adjustment",
    },
    {
      orderNo: "INV/MTR/210504/005/AAA",
      source: "Pendapatan Pesanan",
      status: "Belum Dicairkan",
      revenue: "Rp50.000.000",
      undisbursed: "Rp50.000.000",
      sourceType: "order_revenue",
    },
  ];

  // Table columns
  const columns = [
    {
      header: "No. Pesanan",
      key: "orderNo",
      sortable: true,
      width: "200px",
    },
    {
      header: "Sumber",
      key: "source",
      sortable: true,
      width: "200px",
      render: (row) => <span>{row.source}</span>,
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      width: "190px",
      render: (row) => {
        let variant = "success";
        if (row.status === "Dicairkan Sebagian") {
          variant = "warning";
        } else if (row.status === "Belum Dicairkan") {
          variant = "error";
        }
        return <BadgeStatus variant={variant}>{row.status}</BadgeStatus>;
      },
    },
    {
      header: "Nominal Pendapatan",
      key: "revenue",
      sortable: true,
      width: "180px",
    },
    {
      header: "Dana Belum Dicairkan",
      key: "undisbursed",
      sortable: true,
      width: "180px",
    },
    {
      header: "Action",
      key: "action",
      sortable: false,
      width: "100px",
      render: (row) => <Button className="h-8 px-4 text-xs">Detail</Button>,
    },
  ];

  // Filter configuration
  const filterConfig = {
    categories: [
      {
        key: "status",
        label: "Status",
        searchable: true,
      },
      {
        key: "source",
        label: "Sumber",
        searchable: true,
      },
    ],
    data: {
      status: [
        { id: "sudah_dicairkan", label: "Sudah Dicairkan" },
        { id: "dicairkan_sebagian", label: "Dicairkan Sebagian" },
        { id: "belum_dicairkan", label: "Belum Dicairkan" },
      ],
      source: [
        { id: "additional_cost", label: "Tambahan Biaya" },
        { id: "revenue_adjustment", label: "Penyesuaian Pendapatan" },
        { id: "order_revenue", label: "Pendapatan Pesanan" },
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

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSort = (sort, order) => {
    console.log("Sort by:", sort, "Order:", order);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (perPageValue) => {
    setPerPage(perPageValue);
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto mt-7 max-w-full px-0">
      <h1 className="mb-5 text-2xl font-bold">Laporan Pendapatan</h1>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((item, index) => (
          <div key={index} className={`${item.bgColor} rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.title}</span>
                {/* Tooltip hanya untuk Total Pendapatan dan Total Dana Belum Dicairkan */}
                {(index === 0 || index === 1) && (
                  <InfoTooltip
                    className="w-80"
                    side="right"
                    trigger={
                      <button className="flex text-neutral-600 hover:text-neutral-800">
                        <Info size={18} />
                      </button>
                    }
                  >
                    {index === 0 && (
                      <>
                        <div className="mb-2 font-semibold">
                          Breakdown Total Pendapatan:
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <span>Pendapatan Pesanan:</span>
                            <span className="font-medium">Rp 10.000</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Penyesuaian Pendapatan:</span>
                            <span className="font-medium">Rp 300.000</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Tambahan Biaya:</span>
                            <span className="font-medium">Rp 200.000</span>
                          </div>
                        </div>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <div className="mb-2 font-semibold">
                          Breakdown Dana Belum Dicairkan:
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <span>Pendapatan Pesanan:</span>
                            <span className="font-medium">Rp 1.100.000</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Penyesuaian Pendapatan:</span>
                            <span className="font-medium">Rp 300.000</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>Tambahan Biaya:</span>
                            <span className="font-medium">Rp 200.000</span>
                          </div>
                        </div>
                      </>
                    )}
                  </InfoTooltip>
                )}
              </div>
            </div>
            <div className={`mt-2 text-2xl font-bold ${item.textColor}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Data Table with Filter */}
      <Card className="border border-none">
        <CardContent className="p-0">
          <div className="p-1 pb-0">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex-1">
                <DataTable
                  data={tableData}
                  columns={columns}
                  searchPlaceholder="Cari Pesanan"
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

      {/* Pagination */}
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
    </div>
  );
}
