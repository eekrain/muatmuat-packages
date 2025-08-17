"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import ActiveFiltersBar from "@/components/ActiveFiltersBar/ActiveFiltersBar";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import Pagination from "@/components/Pagination/Pagination";
import { useTranslation } from "@/hooks/use-translation";

import PesananActionBar from "./PesananActionBar";
import PesananCard from "./PesananCard";

export const toYYYYMMDD = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const PesananAktifTab = ({
  useMockData,
  userRole,
  period,
  urgentCounts,
  setIsLoading,
  setHasData,
  setLastAction,
}) => {
  const { t } = useTranslation();

  const [forceFirstTimer, setForceFirstTimer] = useState(false);
  const [forceEmpty, setForceEmpty] = useState(false);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    value: "waktu_muat_terdekat",
    label: "Waktu Muat Terdekat",
  });
  const [urgentStatusFilter, setUrgentStatusFilter] = useState("all");

  const localLastAction = useRef("initial");
  const prevSearch = usePrevious(searchQuery);
  const prevFilters = usePrevious(JSON.stringify(activeFilters));
  const prevPeriod = usePrevious(period);
  const prevUrgent = usePrevious(urgentStatusFilter);

  useEffect(() => {
    let action = localLastAction.current;
    if (searchQuery !== prevSearch) action = "search";
    else if (JSON.stringify(activeFilters) !== prevFilters) action = "filter";
    else if (period !== prevPeriod) action = "period";
    else if (urgentStatusFilter !== prevUrgent) action = "filter";
    localLastAction.current = action;
    setLastAction(action);
  }, [
    searchQuery,
    activeFilters,
    period,
    urgentStatusFilter,
    prevSearch,
    prevFilters,
    prevPeriod,
    prevUrgent,
    setLastAction,
  ]);

  useEffect(() => {
    const fetchOptions = async () => {
      const endpoint = useMockData
        ? "/api/v1/cs/orders/filter-options"
        : "/v1/cs/orders/filter-options";
      try {
        const response = await fetch(endpoint);
        const result = await response.json();
        setFilterOptions(result.Data);
      } catch (err) {
        console.error("Failed to fetch filter options:", err);
      }
    };
    fetchOptions();
  }, [useMockData]);

  useEffect(() => {
    const fetchActiveOrders = async () => {
      setLoading(true);
      setIsLoading(true);
      const endpoint = useMockData
        ? "/api/v1/cs/orders/active"
        : "/v1/cs/orders/active";
      const params = new URLSearchParams({
        page: currentPage,
        limit: perPage,
        search: searchQuery,
        urgentStatus: urgentStatusFilter,
      });

      if (sortConfig.value === "waktu_muat_terlama") {
        params.append("sortBy", "loadingSchedule.startDate");
        params.append("order", "desc");
      } else if (sortConfig.value === "no_pesanan_asc") {
        params.append("sortBy", "orderCode");
        params.append("order", "asc");
      } else if (sortConfig.value === "no_pesanan_desc") {
        params.append("sortBy", "orderCode");
        params.append("order", "desc");
      } else {
        params.append("sortBy", "loadingSchedule.startDate");
        params.append("order", "asc");
      }

      if (period) {
        let dateFrom, dateTo;
        if (period.iso_start_date && period.iso_end_date) {
          dateFrom = toYYYYMMDD(period.iso_start_date);
          dateTo = toYYYYMMDD(period.iso_end_date);
        } else if (typeof period.value === "number") {
          const today = new Date();
          const fromDate = new Date();
          fromDate.setDate(today.getDate() - period.value);
          dateTo = toYYYYMMDD(today);
          dateFrom = toYYYYMMDD(fromDate);
        }
        if (dateFrom && dateTo) {
          params.append("dateFrom", dateFrom);
          params.append("dateTo", dateTo);
        }
      }

      Object.entries(activeFilters).forEach(([key, values]) => {
        if (Array.isArray(values) && values.length > 0) {
          const paramKey = key === "status" ? "status" : `${key}Id`;
          values.forEach((v) => params.append(paramKey, v.id));
        }
      });

      try {
        const response = await fetch(`${endpoint}?${params.toString()}`);
        const result = await response.json();
        setData(result.Data);
        setHasData(result.Data?.orders?.length > 0);
      } catch (err) {
        setError(
          t("daftarPesanan.errorFetch", {}, "Gagal memuat data pesanan.")
        );
        setHasData(false);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };
    if (filterOptions) {
      fetchActiveOrders();
    }
  }, [
    useMockData,
    currentPage,
    perPage,
    searchQuery,
    activeFilters,
    sortConfig,
    urgentStatusFilter,
    period,
    t,
    setIsLoading,
    setHasData,
    filterOptions,
  ]);

  const totalItems = data?.pagination?.totalItems || 0;
  const orders = data?.orders || [];
  const hasActiveFilters = Object.values(activeFilters).some(
    (v) => Array.isArray(v) && v.length > 0
  );
  const isFirstTimer =
    !loading &&
    !error &&
    totalItems === 0 &&
    !searchQuery &&
    !hasActiveFilters &&
    !period;

  const activeFiltersForBar = useMemo(() => {
    const barFilters = [];
    Object.entries(activeFilters).forEach(([categoryKey, items]) => {
      if (Array.isArray(items)) {
        items.forEach((item) =>
          barFilters.push({
            id: `${categoryKey}-${item.id}`,
            label: item.label,
            categoryKey,
            item,
          })
        );
      }
    });
    return barFilters;
  }, [activeFilters]);

  const handleRemoveFilter = (filter) => {
    const newFilters = { ...activeFilters };
    newFilters[filter.categoryKey] = newFilters[filter.categoryKey].filter(
      (item) => item.id !== filter.item.id
    );
    if (newFilters[filter.categoryKey].length === 0)
      delete newFilters[filter.categoryKey];
    setActiveFilters(newFilters);
  };

  const renderContent = () => {
    if (loading)
      return (
        <div className="flex h-[500px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-700 border-t-transparent"></div>
        </div>
      );
    if (error)
      return (
        <div className="flex h-[500px] items-center justify-center p-4 text-center text-error-500">
          {error}
        </div>
      );
    if (forceFirstTimer)
      return (
        <DataEmpty
          title={t("daftarPesanan.firstTimerTitle", {}, "Belum Ada Pesanan")}
          className="h-[500px] !shadow-none"
        />
      );
    if (forceEmpty)
      return (
        <DataEmpty
          title={t(
            "daftarPesanan.emptyActiveTitle",
            {},
            "Daftar Pesanan Aktif Masih Kosong"
          )}
          className="h-[500px] !shadow-none"
        />
      );
    if (isFirstTimer)
      return (
        <DataEmpty
          title={t("daftarPesanan.firstTimerTitle", {}, "Belum Ada Pesanan")}
          className="h-[500px] !shadow-none"
        />
      );

    if (totalItems === 0) {
      if (localLastAction.current === "search")
        return (
          <DataNotFound
            type="search"
            title={t(
              "daftarPesanan.searchNotFoundTitle",
              {},
              "Keyword Tidak Ditemukan"
            )}
            className="h-[500px]"
          />
        );
      if (localLastAction.current === "filter")
        return (
          <DataNotFound className="h-[500px]">
            <p className="w-[257px] text-center text-base font-[600] text-neutral-600">
              {t(
                "daftarPesanan.filterNotFoundTitle",
                {},
                "Data tidak Ditemukan."
              )}
              <br />
              {t(
                "daftarPesanan.filterNotFoundSubtitle",
                {},
                "Mohon coba hapus beberapa filter"
              )}
            </p>
          </DataNotFound>
        );
      if (localLastAction.current === "period")
        return (
          <DataEmpty
            title={t(
              "daftarPesanan.periodNotFoundTitle",
              {},
              "Tidak ada data pada periode ini"
            )}
            className="h-[500px] !shadow-none"
          />
        );
    }

    if (orders.length > 0)
      return (
        <div>
          {orders.map((order) => (
            <PesananCard key={order.id} order={order} userRole={userRole} />
          ))}
        </div>
      );

    return (
      <DataEmpty
        title={t(
          "daftarPesanan.emptyActiveTitle",
          {},
          "Daftar Pesanan Aktif Masih Kosong"
        )}
        className="h-[500px] !shadow-none"
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white shadow-[0px_4px_11px_0px_#41414140]">
        <PesananActionBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
          sortConfig={sortConfig}
          onSortChange={setSortConfig}
          urgentStatusFilter={urgentStatusFilter}
          onUrgentStatusChange={setUrgentStatusFilter}
          urgentCounts={urgentCounts}
          filterOptions={filterOptions}
          loading={loading}
          lastAction={localLastAction.current}
          totalItems={totalItems}
        />
        {hasActiveFilters && (
          <div className="border-neutral-300 px-4">
            <ActiveFiltersBar
              filters={activeFiltersForBar}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={() => setActiveFilters({})}
            />
          </div>
        )}
        <div className="border-neutral-300">{renderContent()}</div>
      </div>
      {!loading && totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={data?.pagination?.totalPages || 1}
          onPageChange={setCurrentPage}
          onPerPageChange={setPerPage}
          perPage={perPage}
        />
      )}
    </div>
  );
};

export default PesananAktifTab;
