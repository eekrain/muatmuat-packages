"use client";

import { useCallback, useMemo } from "react";

import { formatDate } from "@/lib/utils/dateFormat";
import { useGetAvailableSchedulePeriods } from "@/services/Transporter/agenda-armada-driver/getAvailableSchedulePeriods";

import { AgendaCalendar } from "./components/AgendaCalendar/AgendaCalendar";
import { useDateNavigator } from "./components/AgendaCalendar/use-date-navigator";
import { AgendaNotFound } from "./components/AgendaNotFound";
import RefreshButton from "./components/ButtonRefresh";

const AgendaArmadaDriverPage = () => {
  const { data: periodsData } = useGetAvailableSchedulePeriods();

  const {
    // Data state
    displaySchedules, // New: schedules that should be displayed (previous during navigation)
    isLoading,
    isLoadingMore,
    isError,
    hasNextPage,
    isNavigating, // New: track navigation state
    // Actions
    fetchNextPage,
    fetchSchedules,
    setSearch,
    setFilterAgendaStatus,
    // UI state
    displayMonthYear,
    displayedDates,
    search,
    filterAgendaStatus,
    availablePeriods,
  } = useDateNavigator({
    availablePeriods: periodsData?.Data,
  });

  const handleLoadMore = useCallback(() => {
    console.log("📊 handleLoadMore called:", {
      hasNextPage,
      isLoadingMore,
      schedulesLength: displaySchedules.length,
      timestamp: new Date().toLocaleTimeString(),
    });

    if (hasNextPage && !isLoadingMore) {
      console.log("🚀 Calling fetchNextPage...");
      fetchNextPage();
    } else {
      console.log("🛑 Not calling fetchNextPage:", {
        hasNextPage,
        isLoadingMore,
      });
    }
  }, [hasNextPage, isLoadingMore, fetchNextPage, displaySchedules.length]);

  const handleRefresh = useCallback(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleSearchChange = useCallback(
    (newSearch) => {
      setSearch(newSearch);
    },
    [setSearch]
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilterAgendaStatus(newFilters);
    },
    [setFilterAgendaStatus]
  );

  const lastUpdated = useMemo(() => {
    return new Date();
  }, []);

  // Show overlay loading during navigation with existing data
  const shouldShowOverlay =
    isNavigating && isLoading && displaySchedules.length > 0;

  // Show initial loading when there's no data at all
  const isLoadingInitialData =
    isLoading && !isNavigating && displaySchedules.length === 0;

  return (
    <div className="flex flex-col gap-4 pt-6">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold text-black">Agenda Armada & Driver</h1>
        <div className="flex items-center gap-3">
          <p className="text-xs font-bold text-black">
            Terakhir di update: {formatDate(lastUpdated)}
          </p>
          <RefreshButton onClick={handleRefresh} disabled={isLoading} />
        </div>
      </div>

      {isLoadingInitialData ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <img
              src="/img/loading-animation.webp"
              width={80}
              height={80}
              alt="loading"
            />
            <div className="text-sm text-gray-600">Memuat agenda...</div>
          </div>
        </div>
      ) : displaySchedules.length > 0 ? (
        <AgendaCalendar
          data={displaySchedules}
          onLoadMore={handleLoadMore}
          isLoadingMore={isLoadingMore}
          isReachingEnd={!hasNextPage}
          displayedDates={displayedDates}
          displayMonthYear={displayMonthYear}
          search={search}
          filterAgendaStatus={filterAgendaStatus}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          availablePeriods={availablePeriods}
          shouldShowOverlay={shouldShowOverlay}
        />
      ) : isError ? (
        <div className="flex items-center justify-center py-12">
          <div className="rounded-md bg-red-100 p-4 text-center text-red-700">
            <p>Gagal memuat data. Silakan coba lagi nanti.</p>
            <button
              onClick={handleRefresh}
              className="mt-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      ) : (
        <AgendaNotFound />
      )}
    </div>
  );
};

export default AgendaArmadaDriverPage;
