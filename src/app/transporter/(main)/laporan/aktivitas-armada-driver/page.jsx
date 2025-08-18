"use client";

import { useState } from "react";

import { Download } from "lucide-react";

import Button from "@/components/Button/Button";
import DropdownPeriode from "@/components/DropdownPeriode/DropdownPeriode";
import LaporanAktivitasArmadaTable from "@/components/Report/LaporanAktivitasArmadaTable";
import LaporanAktivitasDriverTable from "@/components/Report/LaporanAktivitasDriverTable";
import {
  Tabs,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import { useGetFleetActivities } from "@/services/Transporter/laporan/aktivitas/getArmadaData";
import { useGetCountArmadaDriver } from "@/services/Transporter/laporan/aktivitas/getCountArmadaDriver";
import { useGetDriverData } from "@/services/Transporter/laporan/aktivitas/getDriverData";
import { useGetDriverStatusFilters } from "@/services/Transporter/laporan/aktivitas/getFilterArmadaStatus";
import { useGetFleetTypeFilters } from "@/services/Transporter/laporan/aktivitas/getFilterArmadaType";
import { useGetFleetStatusFilters } from "@/services/Transporter/laporan/aktivitas/getFilterDriverStatus";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("armada");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null);
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);
  const [filters, setFilters] = useState({});

  // Get count data for fleet and driver
  const { data: countData, isLoading: countLoading } =
    useGetCountArmadaDriver();

  // Helper function untuk mendapatkan startDate dan endDate dari periode
  const getPeriodDates = () => {
    if (!currentPeriodValue) return { startDate: "", endDate: "" };

    // Handle custom date range (dari modal)
    if (currentPeriodValue?.range && currentPeriodValue?.iso_start_date) {
      // console.log("Using custom date range:", {
      //   startDate: currentPeriodValue.iso_start_date,
      //   endDate: currentPeriodValue.iso_end_date,
      // });
      return {
        startDate: currentPeriodValue.iso_start_date,
        endDate: currentPeriodValue.iso_end_date,
      };
    }

    // Handle predefined options
    if (currentPeriodValue?.startDate && currentPeriodValue?.endDate) {
      // console.log("Using predefined date range:", {
      //   startDate: currentPeriodValue.startDate,
      //   endDate: currentPeriodValue.endDate,
      // });
      return {
        startDate: currentPeriodValue.startDate,
        endDate: currentPeriodValue.endDate,
      };
    }

    // console.log("No date range selected");
    return { startDate: "", endDate: "" };
  };

  // Helper function untuk mengkonversi filter data ke format yang sesuai dengan API
  const getFilterParams = () => {
    const apiFilters = {};

    // Handle status filter
    if (filters?.status) {
      if (Array.isArray(filters.status)) {
        // Multi-select: ambil semua id yang dipilih
        apiFilters.status = filters.status.map((item) => item.id).join(",");
      } else {
        // Single-select: ambil id langsung
        apiFilters.status = filters.status.id || "";
      }
    }

    // Handle fleetType filter
    if (filters?.fleetType) {
      if (Array.isArray(filters.fleetType)) {
        // Multi-select: ambil semua id yang dipilih
        apiFilters.fleetType = filters.fleetType
          .map((item) => item.id)
          .join(",");
      } else {
        // Single-select: ambil id langsung
        apiFilters.fleetType = filters.fleetType.id || "";
      }
    }

    // Debug log untuk melihat format data
    // console.log("Raw filters:", filters);
    // console.log("API filter params:", apiFilters);

    return apiFilters;
  };

  // Helper function untuk mengkonversi driver filter data ke format yang sesuai dengan API
  const getDriverFilterParams = () => {
    const apiFilters = {};

    // Handle currentStatus filter (driver status)
    if (filters?.currentStatus) {
      if (Array.isArray(filters.currentStatus)) {
        // Multi-select: ambil semua id yang dipilih
        apiFilters.status = filters.currentStatus
          .map((item) => item.id)
          .join(",");
      } else {
        // Single-select: ambil id langsung
        apiFilters.status = filters.currentStatus.id || "";
      }
    }

    // Debug log untuk melihat format data
    // console.log("Raw driver filters:", filters);
    // console.log("Driver API filter params:", apiFilters);

    return apiFilters;
  };

  // Get fleet activities data - only when armada tab is active
  const { data: fleetData, isLoading: fleetLoading } = useGetFleetActivities(
    selectedTab === "armada"
      ? {
          limit: perPage,
          page: currentPage,
          sort: "licensePlate",
          order: "asc",
          search: searchValue.length >= 3 ? searchValue : "",
          ...getFilterParams(), // ✅ Gunakan helper function untuk filter params
          ...getPeriodDates(),
        }
      : null
  );

  // Get driver activities data - only when driver tab is active
  const { data: driverDataFromAPI, isLoading: driverLoading } =
    useGetDriverData(
      selectedTab === "driver"
        ? {
            limit: perPage,
            page: currentPage,
            sort: "name",
            order: "desc",
            search: searchValue.length >= 3 ? searchValue : "",
            ...getDriverFilterParams(), // ✅ Gunakan helper function untuk driver filter params
            ...getPeriodDates(),
          }
        : null
    );

  // Get filter data
  const { data: fleetTypeFilters, isLoading: fleetTypeLoading } =
    useGetFleetTypeFilters();
  const { data: driverStatusFilters, isLoading: driverStatusLoading } =
    useGetDriverStatusFilters();
  const { data: fleetStatusFilters, isLoading: fleetStatusLoading } =
    useGetFleetStatusFilters();

  // Konfigurasi periode dengan startDate dan endDate
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
      startDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      endDate: new Date().toISOString().split("T")[0],
    },
    {
      name: "1 Minggu Terakhir",
      value: 7,
      format: "day",
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
    {
      name: "30 Hari Terakhir",
      value: 30,
      format: "month",
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
    {
      name: "90 Hari Terakhir",
      value: 90,
      format: "month",
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
    {
      name: "1 Tahun Terakhir",
      value: 365,
      format: "year",
      startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
    },
  ];

  // Get fleet activities data from API
  const armadaData = fleetData.activities || [];

  // Get driver activities data from API
  const driverData = driverDataFromAPI.activities || [];

  // Filter configuration for Armada
  const armadaFilterConfig = {
    categories: [
      {
        key: "status",
        label: "Status",
        searchable: false,
      },
      {
        key: "fleetType",
        label: "Jenis Armada",
        searchable: false,
      },
    ],
    data: {
      status: fleetStatusFilters.map((item) => ({
        id: item.status,
        label:
          item.status === "READY_FOR_ORDER"
            ? "Siap Menerima Order"
            : item.status === "NOT_PAIRED"
              ? "Belum Dipasangkan"
              : item.status === "ON_DUTY"
                ? "Bertugas"
                : item.status === "WAITING_LOADING_TIME"
                  ? "Akan Muat Hari Ini"
                  : item.status === "INACTIVE"
                    ? "Nonaktif"
                    : item.status,
      })),
      fleetType: fleetTypeFilters.map((item) => ({
        id: item.id,
        label: item.name,
      })),
    },
  };

  // Filter configuration for Driver
  const driverFilterConfig = {
    categories: [
      {
        key: "currentStatus",
        label: "Status",
        searchable: false,
      },
    ],
    data: {
      currentStatus: driverStatusFilters.map((item) => ({
        id: item.status,
        label:
          item.status === "READY_FOR_ORDER"
            ? "Siap Order"
            : item.status === "NOT_PAIRED"
              ? "Belum Dipasangkan"
              : item.status === "ON_DUTY"
                ? "Sedang Bertugas"
                : item.status === "NON_ACTIVE"
                  ? "Non Aktif"
                  : item.status,
      })),
    },
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

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    // API will automatically re-fetch due to SWR dependency on filters
  };

  const handleSort = (_sort, _order) => {};

  // Reset pagination when switching tabs
  const handleTabChange = (newTab) => {
    setSelectedTab(newTab);
    setCurrentPage(1); // Reset to page 1 when switching tabs

    // Reset search values, period, and filters when switching tabs
    setSearchValue("");
    setCurrentPeriodValue(null);
    setFilters({});
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // API will automatically re-fetch due to SWR dependency on currentPage
  };

  const handlePerPageChange = (perPageValue) => {
    setPerPage(perPageValue);
    setCurrentPage(1);
    // API will automatically re-fetch due to SWR dependency on perPage
  };

  const handleDownload = () => {};

  const getCurrentData = () => {
    return selectedTab === "armada" ? armadaData : driverData;
  };

  const isLoading = selectedTab === "armada" ? fleetLoading : driverLoading;

  return (
    <div className="mx-auto mt-7 max-w-full px-0">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Laporan Aktivitas</h1>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex items-center justify-between">
        <Tabs
          className="w-full"
          value={selectedTab}
          onValueChange={handleTabChange}
        >
          <TabsList className="w-1/2">
            <TabsTriggerWithSeparator value="armada" activeColor="primary-700">
              Aktivitas Armada ({countLoading ? "..." : countData.fleet || 0})
            </TabsTriggerWithSeparator>
            <TabsTriggerWithSeparator value="driver" activeColor="primary-700">
              Aktivitas Driver ({countLoading ? "..." : countData.driver || 0})
            </TabsTriggerWithSeparator>
          </TabsList>
        </Tabs>

        {/* Right side controls - only Unduh and Dropdown Periode */}
        <div className="flex items-center gap-3">
          <DropdownPeriode
            options={periodOptions}
            onSelect={handleSelectPeriod}
            recentSelections={recentPeriodOptions}
            value={currentPeriodValue}
          />
          <Button onClick={handleDownload} iconLeft={<Download size={16} />}>
            Unduh
          </Button>
        </div>
      </div>

      {/* Data Table - Always show table, only state UI changes */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <>
          {selectedTab === "armada" ? (
            <LaporanAktivitasArmadaTable
              data={getCurrentData()}
              currentPage={fleetData.pagination?.page || 1}
              totalPages={fleetData.pagination?.totalPages || 1}
              perPage={fleetData.pagination?.limit || 10}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              onPeriodChange={handleSelectPeriod}
              onDownload={handleDownload}
              periodOptions={periodOptions}
              currentPeriodValue={currentPeriodValue}
              recentPeriodOptions={recentPeriodOptions}
              filterConfig={armadaFilterConfig}
              onFilter={handleFilter}
              onSearch={handleSearch}
              onSort={handleSort}
              searchValue={searchValue}
              filters={filters}
              sortConfig={{ sort: null, order: null }}
              showFilter={true}
              showSearch={true}
              searchPlaceholder="Cari No. Pol atau Kode Pesanan"
              disabledByPeriod={false}
              multiSelect={true} // ✅ Gunakan multi-select untuk filter (checkbox)
            />
          ) : (
            <LaporanAktivitasDriverTable
              data={getCurrentData()}
              currentPage={driverDataFromAPI.pagination?.page || 1}
              totalPages={driverDataFromAPI.pagination?.totalPages || 1}
              perPage={driverDataFromAPI.pagination?.limit || 10}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
              onPeriodChange={handleSelectPeriod}
              onDownload={handleDownload}
              periodOptions={periodOptions}
              currentPeriodValue={currentPeriodValue}
              recentPeriodOptions={recentPeriodOptions}
              filterConfig={driverFilterConfig}
              onFilter={handleFilter}
              onSearch={handleSearch}
              onSort={handleSort}
              searchValue={searchValue}
              filters={filters}
              sortConfig={{ sort: null, order: null }}
              showFilter={true}
              showSearch={true}
              searchPlaceholder="Cari Nama Driver, Rute atau lainnya"
              disabledByPeriod={false}
              multiSelect={true} // ✅ Gunakan multi-select untuk driver filter (checkbox)
            />
          )}
        </>
      )}
    </div>
  );
}
