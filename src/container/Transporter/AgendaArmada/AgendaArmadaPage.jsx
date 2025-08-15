"use client";

import { useCallback, useEffect, useState } from "react";

import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils/dateFormat";
import { useGetAgendaSchedules } from "@/services/Transporter/agenda-armada-driver/getAgendaSchedules";
import { useGetAvailableSchedulePeriods } from "@/services/Transporter/agenda-armada-driver/getAvailableSchedulePeriods";

import { AgendaCalendar } from "./components/AgendaCalendar/AgendaCalendar";
import { DateNavigatorProvider } from "./components/AgendaCalendar/agenda-provider";
import { AgendaNotFound } from "./components/AgendaNotFound";
import RefreshButton from "./components/ButtonRefresh";

const DEBUG_PREFIX = "[AGENDA_DEBUG]";

const AgendaArmadaDriverPage = () => {
  const [agendaStatus, setAgendaStatus] = useState([]);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date("2025-08-28"),
    endDate: new Date("2025-08-28"),
  });
  const [cachedSchedules, setCachedSchedules] = useState([]);
  const [isNavigatingDate, setIsNavigatingDate] = useState(false);

  const { data: periodsData } = useGetAvailableSchedulePeriods();

  const {
    schedules,
    isLoadingMore,
    isReachingEnd,
    size,
    setSize,
    isValidating,
    mutate,
    data,
    isLoadingInitialData,
  } = useGetAgendaSchedules({
    limit: 10,
    view_type: "armada",
    agenda_status: agendaStatus,
    search,
    schedule_date_from: dateRange.startDate,
    schedule_date_to: dateRange.endDate,
  });

  // Update cached schedules when new data arrives
  useEffect(() => {
    if (schedules.length > 0) {
      setCachedSchedules(schedules);
      // Reset navigation state when new data arrives
      setIsNavigatingDate(false);
    }
  }, [schedules]);

  // Determine what data to display
  const displaySchedules = schedules.length > 0 ? schedules : cachedSchedules;

  console.log(
    `${DEBUG_PREFIX} AgendaArmadaDriverPage rendering. Schedules length: ${schedules.length}`
  );

  const lastUpdated =
    data && data.length > 0
      ? data[data.length - 1]?.Data?.lastUpdated || new Date().toISOString()
      : new Date().toISOString();

  const handleLoadMore = () => {
    if (!isLoadingMore && !isReachingEnd) {
      setSize(size + 1);
    }
  };

  const handleRefresh = async () => {
    try {
      const currentLastUpdated = data?.[data.length - 1]?.Data?.lastUpdated;
      const newData = await mutate(undefined, {
        throwOnError: true,
        revalidate: true,
      });
      setSize(1);
      if (!newData || newData.length === 0) {
        throw new Error("No data returned from refresh");
      }
      const newLastUpdated = newData?.[newData.length - 1]?.Data?.lastUpdated;
      if (currentLastUpdated !== newLastUpdated) {
        toast.success("Jadwal berhasil diperbarui!");
      } else {
        toast.success("Jadwal tidak ada perubahan");
      }
    } catch {
      toast.error("Gagal memperbarui jadwal");
    }
  };

  // Handle date range changes from the provider
  const handleDateRangeChange = useCallback(
    (newRange) => {
      console.log(`${DEBUG_PREFIX} Date range changed:`, newRange);
      setIsNavigatingDate(true);
      setDateRange({
        startDate: newRange.startDate,
        endDate: newRange.endDate,
      });
      // Update search and filter if they come from the provider
      if (newRange.search !== undefined) setSearch(newRange.search);
      if (newRange.agendaStatus !== undefined)
        setAgendaStatus(newRange.agendaStatus);

      // Reset pagination and force fresh fetch when date range changes
      setSize(1);
      mutate();
    },
    [setSize, mutate]
  );

  // Functions to update search and filter from components
  const handleSearchChange = useCallback(
    (newSearch) => {
      setSearch(newSearch);
      setIsNavigatingDate(true);
      // Reset pagination when search changes
      setSize(1);
      mutate();
    },
    [setSize, mutate]
  );

  const handleFilterChange = useCallback(
    (newFilter) => {
      setAgendaStatus(Array.isArray(newFilter) ? newFilter : [newFilter]);
      setIsNavigatingDate(true);
      // Reset pagination when filter changes
      setSize(1);
      mutate();
    },
    [setSize, mutate]
  );

  return (
    <div className="flex flex-col gap-4 pt-6">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold text-black">Agenda Armada & Driver</h1>
        <div className="flex items-center gap-3">
          <p className="text-xs font-bold text-black">
            Terakhir di update: {formatDate(lastUpdated)}
          </p>
          <RefreshButton onClick={handleRefresh} disabled={isValidating} />
        </div>
      </div>

      <DateNavigatorProvider
        // initialDate={new Date("2025-08-28")}
        // todayDate={new Date("2025-08-28")}
        availablePeriods={periodsData?.Data}
        onDateRangeChange={handleDateRangeChange}
        search={search}
        filterAgendaStatus={agendaStatus}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
      >
        {displaySchedules.length > 0 ? (
          <div className="relative">
            {(isLoadingInitialData || (isValidating && isNavigatingDate)) && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-md">
                  <img
                    src="/img/loading-animation.webp"
                    width={80}
                    height={80}
                    alt="loading"
                  />
                  <div className="text-sm text-gray-600">Memuat...</div>
                </div>
              </div>
            )}
            <AgendaCalendar
              data={displaySchedules}
              onLoadMore={handleLoadMore}
              isLoadingMore={isLoadingMore}
              isReachingEnd={isReachingEnd}
            />
          </div>
        ) : isLoadingInitialData ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <img
                src="/img/loading-animation.webp"
                width={60}
                height={60}
                alt="loading"
                className="animate-spin"
              />
              <div className="text-sm text-gray-500">Memuat data agenda...</div>
            </div>
          </div>
        ) : (
          <AgendaNotFound />
        )}
      </DateNavigatorProvider>
    </div>
  );
};

export default AgendaArmadaDriverPage;
