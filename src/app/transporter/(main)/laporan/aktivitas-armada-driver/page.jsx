"use client";

import { useEffect, useState } from "react";

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
import { useGetCustomPeriods } from "@/services/Transporter/laporan/aktivitas/getCustomPeriods";
import { useGetDriverData } from "@/services/Transporter/laporan/aktivitas/getDriverData";
import { useGetDriverStatusFilters } from "@/services/Transporter/laporan/aktivitas/getFilterArmadaStatus";
import { useGetFleetTypeFilters } from "@/services/Transporter/laporan/aktivitas/getFilterArmadaType";
import { useGetFleetStatusFilters } from "@/services/Transporter/laporan/aktivitas/getFilterDriverStatus";
import { useSaveCustomPeriod } from "@/services/Transporter/laporan/aktivitas/saveCustomPeriod";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("armada");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null);
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    sort: null,
    order: null,
  });
  const [isSearchNoResults, setIsSearchNoResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isPeriodFilterActive, setIsPeriodFilterActive] = useState(false);
  const [isFilterDropdownActive, setIsFilterDropdownActive] = useState(false);

  // Detect tab from URL or sessionStorage when component mounts
  useEffect(() => {
    // Check if there's a stored tab preference from detail page
    const storedTab = sessionStorage.getItem("laporan_selected_tab");
    if (storedTab && (storedTab === "armada" || storedTab === "driver")) {
      setSelectedTab(storedTab);
      // Clean up sessionStorage after reading
      sessionStorage.removeItem("laporan_selected_tab");
    }
  }, []);

  // Get count data for fleet and driver
  const { data: countData, isLoading: countLoading } =
    useGetCountArmadaDriver();

  // Ensure sortConfig is reset to null on component mount
  useEffect(() => {
    setSortConfig({ sort: null, order: null });
  }, []);

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

  // Helper function untuk mendapatkan sort key yang sesuai dengan tab
  const getSortKey = (sortKey) => {
    if (selectedTab === "driver") {
      // Mapping untuk driver: licensePlate -> name, currentStatus -> status
      if (sortKey === "licensePlate") return "name";
      if (sortKey === "currentStatus") return "status";
      return sortKey;
    }
    // Armada: gunakan key asli
    return sortKey;
  };

  // Get fleet activities data - only when armada tab is active
  const fleetParams =
    selectedTab === "armada"
      ? {
          limit: perPage,
          page: currentPage,
          ...(sortConfig.sort !== null &&
            sortConfig.order !== null && {
              sort: sortConfig.sort,
              order: sortConfig.order,
            }),
          search: searchValue.length >= 3 ? searchValue : "",
          ...getFilterParams(), // ✅ Gunakan helper function untuk filter params
          ...getPeriodDates(),
        }
      : null;

  const { data: fleetData, isLoading: fleetLoading } = useGetFleetActivities(
    fleetParams,
    {
      key: `fleet-${JSON.stringify(fleetParams)}`,
    }
  );

  // Get driver activities data - only when driver tab is active
  const driverParams =
    selectedTab === "driver"
      ? {
          limit: perPage,
          page: currentPage,
          ...(sortConfig.sort !== null &&
            sortConfig.order !== null && {
              sort: getSortKey(sortConfig.sort),
              order: sortConfig.order,
            }),
          search: searchValue.length >= 3 ? searchValue : "",
          ...getDriverFilterParams(), // ✅ Gunakan helper function untuk driver filter params
          ...getPeriodDates(),
        }
      : null;

  // Debug log untuk memastikan parameter sort tidak dikirim saat awal
  if (selectedTab === "driver" && driverParams) {
    console.log("Driver API params:", driverParams);
  }

  const { data: driverDataFromAPI, isLoading: driverLoading } =
    useGetDriverData(driverParams, {
      key: `driver-${JSON.stringify(driverParams)}`,
    });

  // Get filter data
  const { data: fleetTypeFilters, isLoading: fleetTypeLoading } =
    useGetFleetTypeFilters();
  const { data: driverStatusFilters, isLoading: driverStatusLoading } =
    useGetDriverStatusFilters();
  const { data: fleetStatusFilters, isLoading: fleetStatusLoading } =
    useGetFleetStatusFilters();

  // Get custom periods from API
  const { data: customPeriodsFromAPI, isLoading: customPeriodsLoading } =
    useGetCustomPeriods({
      module:
        selectedTab === "armada" ? "fleet-activities" : "driver-activities",
    });

  // Custom period save mutation
  const { trigger: saveCustomPeriodTrigger, isMutating: isSavingCustomPeriod } =
    useSaveCustomPeriod();

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

  // Helper function untuk reset sorting berdasarkan tab aktif
  const resetSorting = () => {
    if (selectedTab === "driver") {
      setSortConfig({ sort: null, order: null });
    } else {
      setSortConfig({ sort: null, order: null });
    }
  };
  // Convert API custom periods to dropdown format
  const apiPeriodsAsOptions = (customPeriodsFromAPI || []).map((period) => ({
    name: `${new Date(period.startDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })} - ${new Date(period.endDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`,
    value: period.id,
    startDate: period.startDate,
    endDate: period.endDate,
    isFromAPI: true,
  }));

  // Handler untuk filter periode
  const handleSelectPeriod = (period) => {
    setCurrentPeriodValue(period);
    setCurrentPage(1);
    setIsSearchNoResults(false);

    // Set period filter active state
    setIsPeriodFilterActive(period && period.value !== "");

    // Add to recent selections if not already there
    if (period && !recentPeriodOptions.find((p) => p.value === period.value)) {
      setRecentPeriodOptions((prev) => [period, ...prev.slice(0, 4)]);
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    setCurrentPage(1);

    if (value) {
      // Set searching state
      setIsSearching(true);
      setIsSearchNoResults(false);

      // Check results after a short delay to allow data to update
      setTimeout(() => {
        const currentData = getCurrentData();
        const hasSearchResults = currentData.length > 0;
        setIsSearchNoResults(!hasSearchResults);
        setIsSearching(false);
      }, 100);
    } else {
      // Clear search, reset states
      setIsSearchNoResults(false);
      setIsSearching(false);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setIsSearchNoResults(false);

    // Check if any filter is active
    const hasActiveFilters = Object.keys(newFilters).some(
      (key) => newFilters[key] && newFilters[key] !== ""
    );
    setIsFilterDropdownActive(hasActiveFilters);
  };

  const handleSort = (sort, order) => {
    if (sort && order) {
      setSortConfig({ sort, order });
      setCurrentPage(1); // Reset pagination when sorting changes
    } else {
      // Reset to no sorting
      setSortConfig({ sort: null, order: null });
      setCurrentPage(1);
    }
  };

  // Reset pagination when switching tabs
  const handleTabChange = (newTab) => {
    setSelectedTab(newTab);
    setCurrentPage(1);
    setSearchValue("");
    setCurrentPeriodValue(null);
    setFilters({});
    setIsSearchNoResults(false);
    setIsPeriodFilterActive(false);
    setIsFilterDropdownActive(false);
    // Set default sorting berdasarkan tab yang aktif
    if (newTab === "driver") {
      setSortConfig({ sort: null, order: null });
    } else {
      setSortConfig({ sort: null, order: null });
    }

    // Store the selected tab to sessionStorage for detail page navigation
    sessionStorage.removeItem("laporan_selected_tab");
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
            recentSelections={[...recentPeriodOptions, ...apiPeriodsAsOptions]}
            value={currentPeriodValue}
            disable={
              (getCurrentData().length === 0 &&
                !isLoading &&
                !isPeriodFilterActive &&
                !isFilterDropdownActive) ||
              (isSearchNoResults && !isSearching) ||
              // Disable when search + filter dropdown active but no data
              (getCurrentData().length === 0 &&
                !isLoading &&
                searchValue &&
                isFilterDropdownActive &&
                !isPeriodFilterActive) ||
              // Disable when search alone active but no data
              (getCurrentData().length === 0 &&
                !isLoading &&
                searchValue &&
                !isFilterDropdownActive &&
                !isPeriodFilterActive) ||
              // Disable when filter alone active but no data
              (getCurrentData().length === 0 &&
                !isLoading &&
                !searchValue &&
                isFilterDropdownActive &&
                !isPeriodFilterActive)
            }
          />
          <Button
            onClick={handleDownload}
            iconLeft={<Download size={16} />}
            disabled={
              (getCurrentData().length === 0 && !isLoading) ||
              (isSearchNoResults && !isSearching) ||
              // Disable when filter dropdown active but no data
              (getCurrentData().length === 0 &&
                !isLoading &&
                isFilterDropdownActive &&
                !searchValue) ||
              // Disable when search + period active but no data
              (getCurrentData().length === 0 &&
                !isLoading &&
                searchValue &&
                isPeriodFilterActive &&
                !isFilterDropdownActive) ||
              // Disable when search + filter active but no data
              (getCurrentData().length === 0 &&
                !isLoading &&
                searchValue &&
                isFilterDropdownActive &&
                !isPeriodFilterActive) ||
              // Disable when search alone active but no data
              (getCurrentData().length === 0 &&
                !isLoading &&
                searchValue &&
                !isFilterDropdownActive &&
                !isPeriodFilterActive) ||
              // Disable when filter alone active but no data
              (getCurrentData().length === 0 &&
                !isLoading &&
                !searchValue &&
                isFilterDropdownActive &&
                !isPeriodFilterActive) ||
              // Disable when period alone active but no data
              (getCurrentData().length === 0 &&
                !isLoading &&
                !searchValue &&
                !isFilterDropdownActive &&
                isPeriodFilterActive)
            }
          >
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
              recentPeriodOptions={[
                ...recentPeriodOptions,
                ...apiPeriodsAsOptions,
              ]}
              filterConfig={armadaFilterConfig}
              onFilter={handleFilter}
              onSearch={handleSearch}
              onSort={handleSort}
              searchValue={searchValue}
              filters={filters}
              sortConfig={sortConfig}
              showFilter={true}
              showSearch={true}
              searchPlaceholder="Cari No. Pol atau Kode Pesanan"
              disabledByPeriod={false}
              multiSelect={true} // ✅ Gunakan multi-select untuk filter (checkbox)
              isSearchNoResults={isSearchNoResults}
              isSearching={isSearching}
              isPeriodFilterActive={isPeriodFilterActive}
              isFilterDropdownActive={isFilterDropdownActive}
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
              recentPeriodOptions={[
                ...recentPeriodOptions,
                ...apiPeriodsAsOptions,
              ]}
              filterConfig={driverFilterConfig}
              onFilter={handleFilter}
              onSearch={handleSearch}
              onSort={handleSort}
              searchValue={searchValue}
              filters={filters}
              sortConfig={sortConfig}
              showFilter={true}
              showSearch={true}
              searchPlaceholder="Cari Nama Driver, Rute atau lainnya"
              disabledByPeriod={false}
              multiSelect={true} // ✅ Gunakan multi-select untuk driver filter (checkbox)
              isSearchNoResults={isSearchNoResults}
              isSearching={isSearching}
              isPeriodFilterActive={isPeriodFilterActive}
              isFilterDropdownActive={isFilterDropdownActive}
            />
          )}
        </>
      )}
    </div>
  );
}
