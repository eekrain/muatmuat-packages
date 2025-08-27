import { addDays, addMonths, startOfMonth, subDays, subMonths } from "date-fns";
import { create } from "zustand";

import { getAgendaSchedules } from "@/services/Transporter/agenda-armada-driver/getAgendaSchedules";
import { getAvailablePeriods } from "@/services/Transporter/agenda-armada-driver/getAvailablePeriods";

// Make sure the path to your services file is correct

const getCenteredStartDate = (date, intervalDays) => {
  // If the date is the first day of the month, don't center it - use it as the start date
  if (date.getDate() === 1) {
    return date;
  }

  // Get the last day of the current month
  const lastDayOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  // Only apply special end-of-month logic if it's the actual last day of the month
  if (date.getDate() === lastDayOfMonth) {
    // Calculate start date so that we show the last `intervalDays` of the month
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      lastDayOfMonth - intervalDays + 1
    );
  }

  // Otherwise, center around the given date
  const offset = Math.floor(intervalDays / 2);
  return subDays(date, offset);
};
export const useAgendaNavigatorStore = create((set, get) => ({
  // --- UI & Filter State ---
  isInitialized: false,
  currentMonth: new Date(),
  currentStartDate: new Date(),
  intervalDays: 5,
  search: "",
  filterAgendaStatus: [],
  viewType: "armada", // Track current view type: 'armada' | 'driver'
  isNavigating: false, // Track if user is navigating dates
  lastInteraction: null, // Track last user interaction: 'search' | 'filter' | null

  // --- Data & Fetching State ---
  schedules: [],
  previousSchedules: [], // Keep previous data during navigation
  summary: null, // Summary data including countPerDay and countConflictedPerDay
  page: 1,
  totalPages: 1,
  hasNextPage: false,
  status: "idle", // 'idle' | 'loading' | 'loading-more' | 'success' | 'error'
  error: null,

  // --- Available Periods State ---
  availablePeriods: null,
  isLoadingPeriods: false,

  // --- ACTIONS ---

  initialize: ({ initialDate, intervalDays }) =>
    set((state) => {
      if (state.isInitialized) return {};
      return {
        isInitialized: true,
        currentMonth: startOfMonth(initialDate),
        currentStartDate: getCenteredStartDate(initialDate, intervalDays),
        intervalDays,
      };
    }),

  _resetDataState: (newState, isNavigation = false) => {
    const currentState = get();
    set({
      ...newState,
      page: 1,
      schedules: isNavigation ? currentState.schedules : [], // Keep schedules during navigation
      previousSchedules: isNavigation ? currentState.schedules : [], // Store previous data
      status: "idle", // Set to idle to trigger the fetch effect in the hook
      hasNextPage: false, // Always reset hasNextPage - will be set correctly after fetch
      isNavigating: isNavigation,
    });
  },

  setSearch: (search) =>
    get()._resetDataState({ search, lastInteraction: "search" }, false),
  clearSearch: () =>
    get()._resetDataState({ search: "", lastInteraction: null }, false),
  setFilterAgendaStatus: (filters) =>
    get()._resetDataState(
      { filterAgendaStatus: filters, lastInteraction: "filter" },
      false
    ),
  setViewType: (viewType) => get()._resetDataState({ viewType }, false),

  // Available Periods Actions
  setAvailablePeriods: (periods) => set({ availablePeriods: periods }),
  setLoadingPeriods: (loading) => set({ isLoadingPeriods: loading }),

  nextInterval: () => {
    const { currentStartDate, intervalDays } = get();
    const newStartDate = addDays(currentStartDate, intervalDays);
    const newEndDate = addDays(newStartDate, intervalDays - 1);
    if (newEndDate.getMonth() !== currentStartDate.getMonth()) {
      const lastDay = new Date(
        currentStartDate.getFullYear(),
        currentStartDate.getMonth() + 1,
        0
      );
      get()._resetDataState(
        {
          currentStartDate: subDays(lastDay, intervalDays - 1),
        },
        true
      );
    } else {
      get()._resetDataState({ currentStartDate: newStartDate }, true);
    }
  },

  prevInterval: () => {
    const { currentStartDate, intervalDays } = get();
    const newStartDate = subDays(currentStartDate, intervalDays);
    if (newStartDate.getMonth() !== currentStartDate.getMonth()) {
      get()._resetDataState(
        {
          currentStartDate: startOfMonth(currentStartDate),
        },
        true
      );
    } else {
      get()._resetDataState({ currentStartDate: newStartDate }, true);
    }
  },

  nextMonth: () => {
    const newMonth = addMonths(get().currentMonth, 1);
    get()._resetDataState(
      {
        currentMonth: newMonth,
        currentStartDate: newMonth,
      },
      true
    );
  },

  prevMonth: () => {
    const newMonth = subMonths(get().currentMonth, 1);
    get()._resetDataState(
      {
        currentMonth: newMonth,
        currentStartDate: newMonth,
      },
      true
    );
  },

  setDate: (date) => {
    get()._resetDataState(
      {
        currentMonth: startOfMonth(date),
        currentStartDate: getCenteredStartDate(date, get().intervalDays),
      },
      true
    );
  },

  setMonth: (year, month) => {
    const newMonth = startOfMonth(new Date(year, month - 1));
    get()._resetDataState(
      {
        currentMonth: newMonth,
        currentStartDate: newMonth,
      },
      true
    );
  },

  // --- Async Data Fetching Actions ---
  fetchSchedules: async () => {
    if (get().status === "loading") return;
    set({ status: "loading", error: null });

    try {
      const {
        search,
        filterAgendaStatus,
        currentStartDate,
        intervalDays,
        viewType,
      } = get();
      const dateRange = {
        start: currentStartDate,
        end: addDays(currentStartDate, intervalDays),
      };
      const params = {
        page: 1,
        limit: 10,
        search: search || undefined,
        agendaStatus:
          filterAgendaStatus.length > 0 ? filterAgendaStatus : undefined,
        scheduleDateFrom: dateRange.start.toISOString().split("T")[0],
        scheduleDateTo: dateRange.end.toISOString().split("T")[0],
        viewType: viewType,
      };

      console.log("📡 fetchSchedules API call:", {
        search,
        filterAgendaStatus,
        params,
        timestamp: new Date().toLocaleTimeString(),
      });

      const response = await getAgendaSchedules(params);
      const { schedules, pagination, summary } = response;

      console.log("📊 fetchSchedules success:", {
        schedulesCount: schedules.length,
        pagination,
        hasNextPage: pagination.currentPage < pagination.totalPages,
        timestamp: new Date().toLocaleTimeString(),
      });

      set({
        schedules,
        summary, // Store the summary data
        previousSchedules: [], // Clear previous data on successful fetch
        page: pagination.currentPage,
        totalPages: pagination.totalPages,
        hasNextPage: pagination.currentPage < pagination.totalPages,
        status: "success",
        isNavigating: false, // Clear navigation state
      });
    } catch (error) {
      set({
        status: "error",
        error: error,
        hasNextPage: false,
        isNavigating: false,
      });
    }
  },

  fetchNextPage: async () => {
    const { hasNextPage, status, page, schedules } = get();
    console.log("📈 fetchNextPage called:", {
      hasNextPage,
      status,
      currentPage: page,
      currentSchedulesCount: schedules.length,
      timestamp: new Date().toLocaleTimeString(),
    });

    if (!hasNextPage || status === "loading" || status === "loading-more") {
      console.log("⏹️ fetchNextPage early return:", { hasNextPage, status });
      return;
    }

    console.log("📡 Setting status to loading-more...");
    set({ status: "loading-more" });

    try {
      const {
        search,
        filterAgendaStatus,
        currentStartDate,
        intervalDays,
        viewType,
      } = get();
      const nextPage = page + 1;
      const dateRange = {
        start: currentStartDate,
        end: addDays(currentStartDate, intervalDays),
      };
      const params = {
        page: nextPage,
        limit: 10,
        search: search || undefined,
        agendaStatus:
          filterAgendaStatus.length > 0 ? filterAgendaStatus : undefined,
        scheduleDateFrom: dateRange.start.toISOString().split("T")[0],
        scheduleDateTo: dateRange.end.toISOString().split("T")[0],
        viewType: viewType,
      };

      const response = await getAgendaSchedules(params);
      const { schedules: newSchedules, pagination } = response;

      console.log("📥 fetchNextPage success:", {
        newSchedulesCount: newSchedules.length,
        pagination,
        totalSchedulesAfter: schedules.length + newSchedules.length,
        timestamp: new Date().toLocaleTimeString(),
      });

      set({
        schedules: [...schedules, ...newSchedules],
        page: pagination.currentPage,
        hasNextPage: pagination.currentPage < pagination.totalPages,
        status: "success",
      });
    } catch (error) {
      console.log("❌ fetchNextPage error:", error);
      set({ status: "error", error: error, hasNextPage: false });
    }
  },

  fetchAvailablePeriods: async () => {
    const { setAvailablePeriods, setLoadingPeriods } = get();

    console.log("🌐 Fetching available periods...");
    setLoadingPeriods(true);

    try {
      const periods = await getAvailablePeriods();
      console.log("✅ Available periods fetched successfully:", periods);
      setAvailablePeriods(periods);
    } catch (error) {
      console.error("❌ Failed to fetch available periods:", error);
      setAvailablePeriods(null);
    } finally {
      setLoadingPeriods(false);
    }
  },
}));
