import { useEffect, useMemo, useRef } from "react";

import { addDays, eachDayOfInterval, format, startOfDay } from "date-fns";
import { id } from "date-fns/locale";

import { useAgendaNavigatorStore } from "./agendaNavigatorStore";

// Custom hook to handle available periods
const useAvailablePeriods = (fallbackPeriods) => {
  const store = useAgendaNavigatorStore();

  const actualAvailablePeriods = useMemo(() => {
    if (store.availablePeriods) {
      return store.availablePeriods;
    }
    return fallbackPeriods;
  }, [store.availablePeriods, fallbackPeriods]);

  // Fetch available periods on mount
  useEffect(() => {
    if (!store.availablePeriods && !store.isLoadingPeriods) {
      store.fetchAvailablePeriods();
    }
  }, [
    store.availablePeriods,
    store.isLoadingPeriods,
    store.fetchAvailablePeriods,
  ]);

  return actualAvailablePeriods;
};

// Custom hook to handle initialization
const useInitialization = (
  isInitialized,
  initialize,
  initialDate,
  initialIntervalDays
) => {
  const hasInitialized = useRef(false);
  const initializeRef = useRef(initialize);

  // Keep initialize function reference updated
  initializeRef.current = initialize;

  useEffect(() => {
    if (!isInitialized && !hasInitialized.current && initializeRef.current) {
      hasInitialized.current = true;
      try {
        initializeRef.current({
          initialDate,
          intervalDays: initialIntervalDays,
        });
      } catch (error) {
        console.error("Initialization failed:", error);
        hasInitialized.current = false; // Reset on error
      }
    }
  }, [isInitialized, initialDate, initialIntervalDays]); // Removed initialize from deps
};

// Custom hook to handle data fetching with better dependency tracking
const useDataFetching = (
  isInitialized,
  status,
  currentStartDate,
  search,
  filterAgendaStatus,
  fetchSchedules
) => {
  const previousDeps = useRef("");

  useEffect(() => {
    if (!isInitialized || status !== "idle") {
      return;
    }

    // Create a stable dependency string
    const depsString = JSON.stringify({
      date: currentStartDate?.toISOString?.() || currentStartDate,
      search,
      filter: filterAgendaStatus,
    });

    // Only fetch if dependencies have actually changed
    if (depsString !== previousDeps.current) {
      previousDeps.current = depsString;
      fetchSchedules();
    }
  }, [
    isInitialized,
    status,
    currentStartDate,
    search,
    filterAgendaStatus,
    fetchSchedules,
  ]);
};

export const useDateNavigator = (options = {}) => {
  const {
    initialDate = new Date(),
    todayDate = new Date(),
    intervalDays: initialIntervalDays = 5,
    availablePeriods = null,
  } = options;

  const store = useAgendaNavigatorStore();
  const actualAvailablePeriods = useAvailablePeriods(availablePeriods);

  const {
    isInitialized,
    initialize,
    fetchSchedules,
    status,
    currentStartDate,
    search,
    filterAgendaStatus,
    currentMonth,
    intervalDays,
    isNavigating,
    previousSchedules,
    lastInteraction,
    isEverHaveScheduled,
  } = store;

  // Handle initialization
  useInitialization(
    isInitialized,
    initialize,
    initialDate,
    initialIntervalDays
  );

  // Handle data fetching with improved dependency tracking
  useDataFetching(
    isInitialized,
    status,
    currentStartDate,
    search,
    filterAgendaStatus,
    fetchSchedules
  );

  const dateRange = useMemo(() => {
    const start = currentStartDate;
    const end = addDays(start, intervalDays - 1);
    return { start, end };
  }, [currentStartDate, intervalDays]);

  const derivedDateState = useMemo(() => {
    if (!isInitialized) {
      return {
        dates: [],
        todayIndex: -1,
        monthYear: "",
        canPrev: false,
        canNext: false,
        isTodayNotInView: true,
      };
    }

    const { start, end } = dateRange;
    const dateInterval = eachDayOfInterval({ start, end });
    const formattedDates = dateInterval.map((date) => ({
      day: format(date, "eeee", { locale: id }),
      date: date.getDate(),
      fullDate: format(date, "yyyy-MM-dd"),
    }));
    const todayFormatted = format(todayDate, "yyyy-MM-dd");
    const todayIndex = formattedDates.findIndex(
      (d) => d.fullDate === todayFormatted
    );
    const formattedMonthYear = format(currentMonth, "MMMM yyyy", {
      locale: id,
    });
    const lastDayInView = new Date(
      start.getFullYear(),
      start.getMonth() + 1,
      0
    );

    return {
      dates: formattedDates,
      todayIndex: todayIndex,
      monthYear:
        formattedMonthYear.charAt(0).toUpperCase() +
        formattedMonthYear.slice(1),
      canPrev: start.getDate() > 1,
      canNext: startOfDay(end) < startOfDay(lastDayInView),
      canPrevMonth: true, // This can be enhanced with availablePeriods if needed
      canNextMonth: true, // This can be enhanced with availablePeriods if needed
      isTodayNotInView: todayIndex === -1,
    };
  }, [isInitialized, dateRange, todayDate, currentMonth]);

  // Keep the exact same return structure as the original
  const finalResult = {
    ...store,
    ...derivedDateState,
    dateRange,
    status, // Expose status for toast notifications
    lastInteraction, // Expose last user interaction for error message logic
    isLoading: status === "loading",
    isLoadingMore: status === "loading-more",
    isError: status === "error",
    isNavigating, // Expose navigation state
    // For display: show previous data only during initial navigation load, otherwise show current data
    displaySchedules:
      isNavigating && status === "loading" && previousSchedules.length > 0
        ? previousSchedules
        : store.schedules,
    // Aliases for backward compatibility
    handleNext: store.nextInterval,
    handlePrev: store.prevInterval,
    displayMonthYear: derivedDateState.monthYear,
    canPrevMonth: derivedDateState.canPrev,
    canNextMonth: derivedDateState.canNext,
    currentDayIndex: derivedDateState.todayIndex,
    displayedDates: derivedDateState.dates, // For backward compatibility
    availablePeriods: actualAvailablePeriods, // Pass through the availablePeriods from API
    todayDate, // Add todayDate for use in components
    isEverHaveScheduled,
  };

  return finalResult;
};
