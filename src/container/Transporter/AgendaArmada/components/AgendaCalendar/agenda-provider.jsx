import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  addDays,
  addMonths,
  eachDayOfInterval,
  format,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { id } from "date-fns/locale";

const DateNavigatorContext = createContext(null);
const DEBUG_PREFIX = "[AGENDA_DEBUG]";

export const DateNavigatorProvider = ({
  children,
  initialDate = new Date(),
  todayDate = new Date(),
  intervalDays = 5,
  availablePeriods = null,
  onDateRangeChange = null, // Callback when date range changes
  search = "",
  filterAgendaStatus = [], // Changed to array to match API spec
  onSearchChange = null, // Callback when search changes
  onFilterChange = null, // Callback when filter changes
}) => {
  console.log(`${DEBUG_PREFIX} --------------------------------`);
  console.log(`${DEBUG_PREFIX} Provider Render/Re-render`);

  // Use refs to store the latest callback functions to avoid re-renders
  const onSearchChangeRef = useRef(onSearchChange);
  const onFilterChangeRef = useRef(onFilterChange);

  // Update refs when callbacks change
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  const getCenteredStartDate = useCallback(
    (date) => {
      const offset = Math.floor(intervalDays / 2);
      return subDays(date, offset);
    },
    [intervalDays]
  );

  const [currentMonth, setCurrentMonth] = useState(() => {
    const newMonth = startOfMonth(initialDate);
    console.log(`${DEBUG_PREFIX} Initializing state 'currentMonth':`, newMonth);
    return newMonth;
  });
  const [currentStartDate, setCurrentStartDate] = useState(() => {
    const newStartDate = getCenteredStartDate(initialDate);
    console.log(
      `${DEBUG_PREFIX} Initializing state 'currentStartDate':`,
      newStartDate
    );
    return newStartDate;
  });

  const isInitialMount = useRef(true);
  const isDateSetAction = useRef(false);

  console.log(`${DEBUG_PREFIX} Current State on this render:`, {
    currentMonth: currentMonth,
    currentStartDate: currentStartDate,
  });

  useEffect(() => {
    console.log(
      `${DEBUG_PREFIX} useEffect for month sync is running. Is initial mount?`,
      isInitialMount.current
    );
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isDateSetAction.current) {
      console.log(
        `${DEBUG_PREFIX} ---> Skipping effect because it was triggered by setDate.`
      );
      isDateSetAction.current = false; // Reset the flag
      return;
    }

    console.log(
      `${DEBUG_PREFIX} ---> Month has changed. Resetting start date to beginning of:`,
      currentMonth
    );
    setCurrentStartDate(startOfMonth(currentMonth));
  }, [currentMonth]);

  // Effect to notify parent about date range changes
  useEffect(() => {
    if (onDateRangeChange) {
      const start = currentStartDate;
      const end = addDays(start, intervalDays - 1);
      onDateRangeChange({
        startDate: start,
        endDate: end,
        search,
        agendaStatus: filterAgendaStatus,
      });
    }
  }, [
    currentStartDate,
    search,
    filterAgendaStatus,
    intervalDays,
    onDateRangeChange,
  ]);

  const handleNext = useCallback(() => {
    console.log(`${DEBUG_PREFIX} ACTION: handleNext (5-day) called`);
    setCurrentStartDate((prevDate) => {
      const potentialNewStartDate = addDays(prevDate, intervalDays);
      const potentialNewEndDate = addDays(
        potentialNewStartDate,
        intervalDays - 1
      );
      if (potentialNewEndDate.getMonth() !== prevDate.getMonth()) {
        const lastDayOfCurrentMonth = new Date(
          prevDate.getFullYear(),
          prevDate.getMonth() + 1,
          0
        );
        return subDays(lastDayOfCurrentMonth, intervalDays - 1);
      }
      return potentialNewStartDate;
    });
  }, [intervalDays]);

  const handlePrev = useCallback(() => {
    console.log(`${DEBUG_PREFIX} ACTION: handlePrev (5-day) called`);
    setCurrentStartDate((prevDate) => {
      const potentialNewStartDate = subDays(prevDate, intervalDays);
      if (potentialNewStartDate.getMonth() !== prevDate.getMonth()) {
        return new Date(prevDate.getFullYear(), prevDate.getMonth(), 1);
      }
      return potentialNewStartDate;
    });
  }, [intervalDays]);

  const handleNextMonth = useCallback(() => {
    console.log(`${DEBUG_PREFIX} ACTION: handleNextMonth called`);
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
  }, []);

  const handlePrevMonth = useCallback(() => {
    console.log(`${DEBUG_PREFIX} ACTION: handlePrevMonth called`);
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
  }, []);

  const setDate = useCallback(
    (date) => {
      console.log(`${DEBUG_PREFIX} ACTION: setDate called with:`, date);
      const validDate = date instanceof Date ? date : new Date();
      isDateSetAction.current = true;
      setCurrentMonth(startOfMonth(validDate));
      setCurrentStartDate(getCenteredStartDate(validDate));
    },
    [getCenteredStartDate]
  );

  const setMonth = useCallback((year, month) => {
    console.log(`${DEBUG_PREFIX} ACTION: setMonth called with:`, {
      year,
      month,
    });
    setCurrentMonth(startOfMonth(new Date(year, month - 1)));
  }, []);

  const value = useMemo(() => {
    console.log(`${DEBUG_PREFIX} Recalculating memoized context value.`);
    const start = currentStartDate;
    const end = addDays(start, intervalDays - 1);
    const dateInterval = eachDayOfInterval({ start, end });
    const dates = dateInterval.map((date) => ({
      day: format(date, "eeee", { locale: id }),
      date: date.getDate(),
      fullDate: format(date, "yyyy-MM-dd"),
    }));
    const todayFormatted = format(todayDate, "yyyy-MM-dd");
    const todayIndex = dates.findIndex((d) => d.fullDate === todayFormatted);
    const monthYear = format(currentMonth, "MMMM yyyy", { locale: id });
    const capitalizedMonthYear =
      monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
    const canPrev = start.getDate() > 1;
    const lastDayOfCurrentMonthForView = new Date(
      start.getFullYear(),
      start.getMonth() + 1,
      0
    );
    const canNext = startOfDay(end) < startOfDay(lastDayOfCurrentMonthForView);
    const isMonthAvailable = (date) => {
      if (!availablePeriods?.availableMonths) return true;
      const year = date.getFullYear().toString();
      const month = date.getMonth() + 1;
      return availablePeriods.availableMonths[year]?.includes(month) ?? false;
    };
    const prevMonthDate = subMonths(currentMonth, 1);
    const nextMonthDate = addMonths(currentMonth, 1);
    const canPrevMonth = isMonthAvailable(prevMonthDate);
    const canNextMonth = isMonthAvailable(nextMonthDate);
    const isTodayNotInView = todayIndex === -1;

    return {
      startDate: start,
      endDate: end,
      displayedDates: dates,
      displayMonthYear: capitalizedMonthYear,
      handleNext,
      handlePrev,
      handleNextMonth,
      handlePrevMonth,
      setDate,
      setMonth,
      currentDayIndex: todayIndex,
      isCanPrev: canPrev,
      isCanNext: canNext,
      isCanPrevMonth: canPrevMonth,
      isCanNextMonth: canNextMonth,
      isTodayNotInView,
      todayDate,
      search,
      filterAgendaStatus,
      onSearchChange: onSearchChangeRef.current,
      onFilterChange: onFilterChangeRef.current,
    };
  }, [
    currentStartDate,
    currentMonth,
    intervalDays,
    todayDate,
    availablePeriods,
    handleNext,
    handlePrev,
    handleNextMonth,
    handlePrevMonth,
    setDate,
    setMonth,
    search,
    filterAgendaStatus,
    // Intentionally excluding onSearchChange and onFilterChange to prevent re-renders
  ]);

  return (
    <DateNavigatorContext.Provider value={value}>
      {children}
    </DateNavigatorContext.Provider>
  );
};

export const useDateNavigator = () => {
  const context = useContext(DateNavigatorContext);
  if (!context) {
    throw new Error(
      "useDateNavigator must be used within a DateNavigatorProvider"
    );
  }
  return context;
};
