"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Download, Info } from "lucide-react";

import Button from "@/components/Button/Button";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import LaporanPencairanDanaTable from "@/components/LaporanPencairanDanaTable/LaporanPencairanDanaTable";

export default function Page() {
  const router = useRouter();
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

  // Table data
  const tableData = [
    {
      id: 1,
      date: "06 Nov 2024 13:00 WIB",
      amount: "Rp1.000.000",
      account: "BRI 1234567890",
      bankLogo: "/icons/payment/va_bri.svg",
      bankName: "BRI",
    },
    {
      id: 2,
      date: "05 Nov 2024 13:00 WIB",
      amount: "Rp1.000.000",
      account: "BCA 1234567890",
      bankLogo: "/icons/payment/va_bca.svg",
      bankName: "BCA",
    },
    {
      id: 3,
      date: "04 Nov 2024 13:00 WIB",
      amount: "Rp3.000.000",
      account: "BCA 1234567890",
      bankLogo: "/icons/payment/va_bca.svg",
      bankName: "BCA",
    },
    {
      id: 4,
      date: "03 Nov 2024 13:00 WIB",
      amount: "Rp500.000",
      account: "BCA 1234567890",
      bankLogo: "/icons/payment/va_bca.svg",
      bankName: "BCA",
    },
    {
      id: 5,
      date: "02 Nov 2024 13:00 WIB",
      amount: "Rp1.000.000",
      account: "BCA 1234567890",
      bankLogo: "/icons/payment/va_bca.svg",
      bankName: "BCA",
    },
  ];

  // Table columns
  const columns = [
    {
      header: "Tanggal",
      key: "date",
      sortable: true,
      width: "200px",
    },
    {
      header: "Jumlah Pencairan",
      key: "amount",
      sortable: true,
      width: "180px",
    },
    {
      header: "Rekening Pencairan",
      key: "account",
      sortable: true,
      width: "200px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.bankLogo}
            alt={row.bankName}
            className="h-6 w-6 object-contain"
          />
          <span>{row.account}</span>
        </div>
      ),
    },
    {
      header: "Action",
      key: "action",
      sortable: false,
      width: "100px",
      render: (row) => (
        <Button
          className="h-8 px-4 text-xs"
          onClick={() => router.push(`/laporan/pencairan-dana/${row.id}`)}
        >
          Detail
        </Button>
      ),
    },
  ];

  // Filter configuration
  const filterConfig = {
    categories: [
      {
        key: "bank",
        label: "Rekening Pencairan",
        searchable: true,
      },
    ],
    data: {
      bank: [
        { id: "bri", label: "BRI 1234567890" },
        { id: "bca", label: "BCA 1234567890" },
        { id: "bni", label: "BNI 1234567890" },
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

  const handleDownload = () => {
    console.log("Downloading disbursement report...");
    // TODO: Implement download functionality
  };

  return (
    <div className="mx-auto mt-7 max-w-full px-0">
      {/* Header Section with Title, Tooltip, and Download Button */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Laporan Pencairan</h1>
          <InfoTooltip
            className="w-80"
            side="right"
            trigger={
              <button className="flex text-neutral-600 hover:text-neutral-800">
                <Info size={18} />
              </button>
            }
          >
            Pantau semua pencairan dana yang sudah kamu terima dengan mudah.
            Laporan ini mencatat setiap transaksi, lengkap dengan nominal,
            tanggal, dan rekening pencairan.
          </InfoTooltip>
        </div>
        <Button onClick={handleDownload} iconLeft={<Download size={16} />}>
          Unduh
        </Button>
      </div>

      {/* Data Table with Filter */}
      <LaporanPencairanDanaTable
        data={tableData}
        columns={columns}
        currentPage={currentPage}
        totalPages={2}
        perPage={perPage}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        onDownload={handleDownload}
        periodOptions={periodOptions}
        currentPeriodValue={currentPeriodValue}
        recentPeriodOptions={recentPeriodOptions}
        filterConfig={filterConfig}
        searchValue={searchValue}
        filters={filters}
        sortConfig={{ sort: null, order: null }}
      />
    </div>
  );
}
