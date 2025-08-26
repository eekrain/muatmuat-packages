import { useEffect, useMemo } from "react";

import { addDays, eachDayOfInterval, format, startOfDay } from "date-fns";
import { id } from "date-fns/locale";

import { useAgendaNavigatorStore } from "./agendaNavigatorStore";

export const useDateNavigator = (options = {}) => {
  const {
    initialDate = new Date(),
    todayDate = new Date(),
    intervalDays: initialIntervalDays = 5,
    availablePeriods = null,
  } = options;

  const store = useAgendaNavigatorStore();
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
  } = store;

  useEffect(() => {
    if (!isInitialized) {
      initialize({ initialDate, intervalDays: initialIntervalDays });
    }
  }, [isInitialized, initialize, initialDate, initialIntervalDays]);

  // This effect is the reactive "glue" that triggers a refetch whenever
  // the date range, search, or filters change.
  useEffect(() => {
    console.log("🔄 useDateNavigator effect triggered:", {
      isInitialized,
      status,
      search,
      filterAgendaStatus,
      timestamp: new Date().toLocaleTimeString(),
    });

    if (isInitialized && status === "idle") {
      console.log("✅ Calling fetchSchedules from useDateNavigator");
      fetchSchedules();
    } else {
      console.log("❌ Not calling fetchSchedules:", {
        isInitialized,
        status,
      });
    }
  }, [
    isInitialized,
    status,
    currentStartDate,
    search,
    filterAgendaStatus,
    fetchSchedules,
  ]);

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
    availablePeriods, // Pass through the availablePeriods option
    todayDate, // Add todayDate for use in components
  };

  return finalResult;
};
