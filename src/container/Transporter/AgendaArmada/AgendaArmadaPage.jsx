"use client";

import { useCallback, useEffect, useState } from "react";

import { useGetAvailableSchedulePeriods } from "@/services/Transporter/agenda-armada-driver/getAvailableSchedulePeriods";

import { useTranslation } from "@/hooks/use-translation";

import { isDev } from "@/lib/constants/is-dev";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils/dateFormat";

import { AgendaCalendar } from "./components/AgendaCalendar/AgendaCalendar";
import { useDateNavigator } from "./components/AgendaCalendar/use-date-navigator";
import { AgendaNotFound } from "./components/AgendaNotFound";
import RefreshButton from "./components/ButtonRefresh";

const AgendaArmadaDriverPage = () => {
  const { t } = useTranslation();
  const { data: periodsData } = useGetAvailableSchedulePeriods();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    // Data state
    displaySchedules, // New: schedules that should be displayed (previous during navigation)
    isLoading,
    isLoadingMore,
    isError,
    hasNextPage,
    isNavigating, // New: track navigation state
    status, // Add status to track fetch results
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
    isEverHaveScheduled,
  } = useDateNavigator({
    availablePeriods: periodsData?.Data,
  });

  // Watch for status changes to show toast notifications only during manual refresh
  useEffect(() => {
    if (isRefreshing) {
      if (status === "success") {
        toast.success(
          t(
            "AgendaArmadaPage.messageSuccessJadwalBerhasilDiperbarui",
            {},
            "Jadwal berhasil diperbarui!"
          )
        );
        setLastUpdated(new Date());
        setIsRefreshing(false);
      } else if (status === "error") {
        toast.error(
          t(
            "AgendaArmadaPage.messageErrorJadwalTidakAdaPerubahan",
            {},
            "Jadwal tidak ada perubahan"
          )
        );
        setIsRefreshing(false);
      }
    }
  }, [status, isRefreshing]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoadingMore) {
      fetchNextPage();
    }
  }, [hasNextPage, isLoadingMore, fetchNextPage]);

  const handleRefresh = useCallback(() => {
    // toast.error("Jadwal tidak ada perubahan")
    setIsRefreshing(true);
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

  // Show overlay loading during navigation with existing data
  const shouldShowOverlay =
    isNavigating && isLoading && displaySchedules.length > 0;

  // Show initial loading when there's no data at all
  const isLoadingInitialData =
    isLoading && !isNavigating && displaySchedules.length === 0;

  return (
    <>
      <div className="flex flex-col gap-4 pt-6">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl font-bold text-black">
            {t(
              "AgendaArmadaPage.titleAgendaArmadaDriver",
              {},
              "Agenda Armada-Driver"
            )}
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-xs font-bold text-black">
              {t(
                "AgendaArmadaPage.labelTerakhirDiUpdate",
                {},
                "Terakhir di update:"
              )}{" "}
              {formatDate(lastUpdated)}
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
                alt={t("AgendaArmadaPage.altLoading", {}, "loading")}
              />
              <div className="text-sm text-gray-600">
                {t(
                  "AgendaArmadaPage.labelMemuatAgenda",
                  {},
                  "Memuat agenda..."
                )}
              </div>
            </div>
          </div>
        ) : isEverHaveScheduled ? (
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
        ) : (
          <AgendaNotFound />
        )}
      </div>

      {isDev && (
        <>
          <pre>{JSON.stringify(displaySchedules, null, 2)}</pre>
        </>
      )}
    </>
  );
};

export default AgendaArmadaDriverPage;
