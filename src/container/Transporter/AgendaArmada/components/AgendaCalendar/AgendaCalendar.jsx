import { useEffect, useMemo, useRef } from "react";

import DataNotFound from "@/components/DataNotFound/DataNotFound";

import { useClientWidth } from "@/hooks/use-client-width";
import { useTranslation } from "@/hooks/use-translation";

import { AgendaRowItem } from "./AgendaRowItem";
import { CalendarHeader1 } from "./CalendarHeader1";
import { CalendarHeader2 } from "./CalendarHeader2";
import { useAgendaNavigatorStore } from "./agendaNavigatorStore";
import { useDateNavigator } from "./use-date-navigator";

export const AgendaCalendar = ({
  data = [],
  onLoadMore,
  isLoadingMore,
  isReachingEnd,
  search,
  onSearchChange,
  filterAgendaStatus,
  onFilterChange,
  availablePeriods,
  shouldShowOverlay,
  mutate,
}) => {
  const viewType = useAgendaNavigatorStore((state) => state.viewType);
  const { availablePeriods: storeAvailablePeriods } = useAgendaNavigatorStore();
  const { t } = useTranslation();
  const navigator = useDateNavigator();

  // Use store data if available, otherwise fallback to props
  const actualAvailablePeriods = useMemo(() => {
    if (storeAvailablePeriods) {
      return storeAvailablePeriods;
    }
    return availablePeriods;
  }, [storeAvailablePeriods, availablePeriods]);
  const {
    displayedDates,
    displaySchedules,
    selectedDate,
    navigateToDate,
    goToPrevious,
    goToNext,
    isLoading,
    isNavigating,
    hasNextPage,
    isLoadingMore: hookIsLoadingMore,
    setSearch,
    setFilterAgendaStatus,
    searchValue,
    filterValue,
  } = navigator;

  const clientWidth = useClientWidth();
  const loadMoreRef = useRef(null);

  // Memoize calendar dates to prevent unnecessary recalculations
  const calendarDates = useMemo(() => {
    if (!displayedDates || displayedDates.length === 0) return [];

    return displayedDates.map((dateStr) => {
      const date = new Date(dateStr);
      const dayName = date.toLocaleDateString("id-ID", { weekday: "short" });
      const dayNumber = date.getDate();
      const monthName = date.toLocaleDateString("id-ID", { month: "short" });

      return {
        date: dateStr,
        dayName,
        dayNumber,
        monthName,
        isSelected: dateStr === selectedDate,
      };
    });
  }, [displayedDates, selectedDate]);

  // Get schedules for selected date
  const selectedDateSchedules = useMemo(() => {
    if (!displaySchedules || displaySchedules.length === 0) return [];

    // Process the new API structure where schedules are nested
    const processedSchedules = displaySchedules
      .map((armadaItem) => {
        // Check if this armada has schedules for the selected date
        const matchingSchedules =
          armadaItem.schedule?.filter((scheduleItem) => {
            return scheduleItem.scheduleDate === selectedDate;
          }) || [];

        if (matchingSchedules.length > 0) {
          // Return the armada item with filtered schedules
          return {
            ...armadaItem,
            schedule: matchingSchedules,
          };
        }

        return null;
      })
      .filter(Boolean); // Remove null items

    console.log("🔍 selectedDateSchedules processed:", {
      selectedDate,
      selectedDateType: typeof selectedDate,
      totalArmadas: displaySchedules.length,
      matchingArmadas: processedSchedules.length,
      sampleScheduleDates: displaySchedules.slice(0, 2).map((item) => ({
        licensePlate: item.licensePlate,
        scheduleDates: item.schedule?.map((s) => s.scheduleDate) || [],
      })),
      schedules: processedSchedules.map((item) => ({
        licensePlate: item.licensePlate,
        scheduleCount: item.schedule.length,
        scheduleDates: item.schedule.map((s) => s.scheduleDate),
      })),
    });

    return processedSchedules;
  }, [displaySchedules, selectedDate]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isIntersecting = entry.isIntersecting;
        const isReachingEnd = !hasNextPage;

        console.log("🔍 Intersection Observer Effect:", {
          isIntersecting,
          isLoadingMore,
          isReachingEnd,
          hasOnLoadMore: !!onLoadMore,
          dataLength: displaySchedules?.length || 0,
          timestamp: new Date().toLocaleTimeString(),
        });

        if (isIntersecting && !isLoadingMore && !isReachingEnd && onLoadMore) {
          console.log("✅ Triggering onLoadMore...");
          onLoadMore();
        } else {
          console.log("❌ Not triggering onLoadMore:", {
            isIntersecting,
            isLoadingMore,
            isReachingEnd,
            hasOnLoadMore: !!onLoadMore,
          });
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isLoadingMore, onLoadMore, displaySchedules?.length]);

  // Force scroll check after navigation
  useEffect(() => {
    if (!isNavigating && !isLoading && displaySchedules?.length > 0) {
      const timeoutId = setTimeout(() => {
        if (loadMoreRef.current) {
          const rect = loadMoreRef.current.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

          console.log("🔄 Post-navigation check:", {
            isVisible,
            hasNextPage,
            isLoadingMore,
            dataLength: displaySchedules?.length,
            rect: { top: rect.top, bottom: rect.bottom },
            windowHeight: window.innerHeight,
            timestamp: new Date().toLocaleTimeString(),
          });

          if (isVisible && hasNextPage && !isLoadingMore && onLoadMore) {
            console.log("🚀 Force triggering onLoadMore after navigation...");
            onLoadMore();
          }
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [
    isNavigating,
    isLoading,
    displaySchedules?.length,
    hasNextPage,
    isLoadingMore,
    onLoadMore,
  ]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-white shadow-[0px_4px_11px_rgba(65,65,65,0.25)]">
      {(shouldShowOverlay || isNavigating) && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="pointer-events-auto flex flex-col items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-md">
            <img
              src="/img/loading-animation.webp"
              width={80}
              height={80}
              alt={t("AgendaCalendar.altLoading", {}, "loading")}
            />
            <div className="text-sm text-gray-600">
              {t("AgendaCalendar.labelMemuat", {}, "Memuat...")}
            </div>
          </div>
        </div>
      )}
      <CalendarHeader1
        selectedDate={selectedDate}
        goToPrevious={goToPrevious}
        goToNext={goToNext}
        setSearch={setSearch}
        setFilterAgendaStatus={setFilterAgendaStatus}
        searchValue={searchValue}
        filterValue={filterValue}
        search={search}
        onSearchChange={onSearchChange}
        _filterAgendaStatus={filterAgendaStatus}
        onFilterChange={onFilterChange}
        availablePeriods={actualAvailablePeriods}
      />
      <CalendarHeader2
        calendarDates={calendarDates}
        selectedDate={selectedDate}
        navigateToDate={navigateToDate}
        clientWidth={clientWidth}
      />

      <Content
        data={data}
        displaySchedules={displaySchedules}
        selectedDateSchedules={selectedDateSchedules}
        onLoadMore={onLoadMore}
        isLoadingMore={isLoadingMore || hookIsLoadingMore}
        isReachingEnd={isReachingEnd}
        hasNextPage={hasNextPage}
        loadMoreRef={loadMoreRef}
        mutate={mutate}
      />
    </div>
  );
};

export const Content = ({
  data,
  displaySchedules,
  selectedDateSchedules,
  onLoadMore,
  isLoadingMore,
  isReachingEnd,
  hasNextPage,
  loadMoreRef,
  mutate,
}) => {
  const { t } = useTranslation();
  const navigator = useDateNavigator();
  const { currentDayIndex } = navigator;
  const { width: containerWidth, ref } = useClientWidth();
  const viewType = useAgendaNavigatorStore((state) => state.viewType);

  const SIDEBAR_WIDTH = 202;
  const DAY_COLUMNS = 5;
  const cellWidth =
    containerWidth > SIDEBAR_WIDTH
      ? (containerWidth - SIDEBAR_WIDTH) / DAY_COLUMNS - 1
      : 0;

  // Get search state to determine what empty state to show
  const { search, filterAgendaStatus, lastInteraction } = useDateNavigator();

  // Check if all items are placeholders (meaning no real data found)
  const isSearching = search && search.trim().length > 0;
  // Filter is active when it's an array with specific filters (not empty array which means all enabled)
  const isFiltering =
    Array.isArray(filterAgendaStatus) && filterAgendaStatus.length > 0;

  // Use data if provided, otherwise use selectedDateSchedules
  // When searching or filtering, we want to show all matching data from API, not just for selected date
  const dataToRender =
    data?.length > 0
      ? data
      : (isSearching || isFiltering
          ? displaySchedules // Use API data when searching/filtering
          : selectedDateSchedules) || [];
  const dataLength = dataToRender.length;

  console.log("🔍 Content dataToRender:", {
    dataLength,
    isSearching,
    isFiltering,
    displaySchedulesLength: displaySchedules?.length || 0,
    selectedDateSchedulesLength: selectedDateSchedules?.length || 0,
    searchValue: search,
    filterValue: filterAgendaStatus,
    lastInteraction,
    dataToRenderSample: dataToRender.slice(0, 2).map((item) => ({
      licensePlate: item.licensePlate,
      scheduleCount: item.schedule?.length || 0,
      scheduleDates: item.schedule?.map((s) => s.scheduleDate) || [],
    })),
  });
  const hasOnlyPlaceholders =
    dataToRender.length > 0 && dataToRender.every((item) => item.isPlaceholder);

  // Determine the appropriate error message based on last interaction when both search and filter are active
  const getErrorMessage = () => {
    // Check if we have no data and user is searching or filtering
    if (dataToRender.length === 0 && (isSearching || isFiltering)) {
      // If both search and filter are active, use last interaction to determine message
      if (isSearching && isFiltering) {
        if (lastInteraction === "search") {
          return "search_filter"; // User searched within filtered results (LDF-26)
        } else if (lastInteraction === "filter") {
          return "filter_search"; // User filtered within search results (LDF-27)
        }
      }

      // If only one is active, show appropriate message
      if (isSearching) return "search"; // LDF-24
      if (isFiltering) return "filter"; // LDF-20
    }

    // Check for placeholder items (legacy logic)
    if (hasOnlyPlaceholders) {
      if (isSearching && isFiltering) {
        if (lastInteraction === "search") {
          return "search_filter";
        } else if (lastInteraction === "filter") {
          return "filter_search";
        }
      }
      if (isSearching) return "search";
      if (isFiltering) return "filter";
    }

    return null;
  };

  // Get the final error message type, handling the case when data is empty
  const getFinalErrorMessageType = () => {
    const errorType = getErrorMessage();
    if (errorType) return errorType;

    // If no error type but we have no data and user is searching/filtering
    if (dataToRender.length === 0 && (isSearching || isFiltering)) {
      if (isSearching && isFiltering) {
        return lastInteraction === "search" ? "search_filter" : "filter_search";
      }
      if (isSearching) return "search";
      if (isFiltering) return "filter";
    }

    return null;
  };

  const errorMessageType = getFinalErrorMessageType();
  const shouldShowNotFound = errorMessageType !== null;

  if (!dataLength && !isLoadingMore && !shouldShowNotFound) {
    // Default empty state when not searching and truly no data
    return (
      <div className="flex h-[calc(100dvh-295px)] items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="mb-2 text-lg font-semibold text-gray-700">
            {t(
              "AgendaCalendar.titleBelumAdaAgendaArmadaDriver",
              {},
              "Belum ada Agenda Armada & Driver"
            )}
          </h3>
          <p className="text-sm text-gray-500">
            {t(
              "AgendaCalendar.messageTungguPesananMasuk",
              {},
              "Tunggu pesanan masuk untuk membuat agenda"
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-295px)] bg-neutral-50 pr-0.5">
      <div ref={ref} className="relative h-full w-full">
        <div className="absolute inset-0 overflow-y-auto bg-white">
          {dataToRender.map((item, index) => (
            <AgendaRowItem
              key={`${item.licensePlate || item.id || index}-${item.schedule?.[0]?.scheduleDate || index}-${index}`}
              data={item}
              cellWidth={cellWidth}
              mutate={mutate}
              viewType={viewType}
            />
          ))}

          {hasNextPage && !isReachingEnd && (
            <div
              key="load-more-trigger"
              ref={loadMoreRef}
              className="h-4 w-full bg-white"
            >
              {isLoadingMore && (
                <div className="flex items-center justify-center py-4">
                  <div className="text-sm text-gray-500">
                    {t(
                      "AgendaCalendar.labelLoadingMore",
                      {},
                      "Loading more..."
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {shouldShowNotFound && (
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: SIDEBAR_WIDTH + (2 * cellWidth + cellWidth / 2),
            }}
          >
            <DataNotFound
              type="search"
              title={
                errorMessageType === "search" ? (
                  <span>
                    {t(
                      "AgendaCalendar.titleSearchTidakDitemukan",
                      {},
                      "Pencarian Tidak Ditemukan"
                    )}
                  </span>
                ) : errorMessageType === "filter" ? (
                  <span>
                    {t(
                      "AgendaCalendar.titleFilterTidakDitemukan",
                      {},
                      "Data tidak Ditemukan."
                    )}
                    <br />
                    {t(
                      "AgendaCalendar.messageHapusFilter",
                      {},
                      "Mohon coba hapus beberapa filter"
                    )}
                  </span>
                ) : errorMessageType === "search_filter" ? (
                  <span>
                    {t(
                      "AgendaCalendar.titleSearchFilterTidakDitemukan",
                      {},
                      "Pencarian dalam filter tidak ditemukan"
                    )}
                  </span>
                ) : errorMessageType === "filter_search" ? (
                  <span>
                    {t(
                      "AgendaCalendar.titleFilterSearchTidakDitemukan",
                      {},
                      "Filter dalam pencarian tidak ditemukan"
                    )}
                  </span>
                ) : (
                  <span>
                    {t(
                      "AgendaCalendar.titleDataTidakDitemukan",
                      {},
                      "Data tidak Ditemukan."
                    )}
                  </span>
                )
              }
            />
          </div>
        )}

        {currentDayIndex >= 0 && (
          <>
            <div
              className="absolute top-0 -translate-x-1/2"
              style={{
                left:
                  SIDEBAR_WIDTH + (currentDayIndex * cellWidth + cellWidth / 2),
              }}
            >
              <svg
                width="30"
                height="6"
                viewBox="0 0 30 6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M 0 0 L 6 0 L 12 3.75 Q 15 6 18 3.75 L 24 0 L 30 0 Z"
                  fill="#1E73DC"
                />
              </svg>
            </div>
            <div
              className="absolute top-0 h-px bg-primary-700"
              style={{
                width: cellWidth,
                left: SIDEBAR_WIDTH + currentDayIndex * cellWidth,
              }}
            />
            <div
              className="absolute top-0 h-full w-px -translate-x-1/2 bg-primary-700"
              style={{
                left:
                  SIDEBAR_WIDTH + currentDayIndex * cellWidth + cellWidth / 2,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};
