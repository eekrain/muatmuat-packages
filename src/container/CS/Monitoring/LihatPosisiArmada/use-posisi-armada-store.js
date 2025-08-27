import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

import { create, useStore } from "zustand";
import { devtools } from "zustand/middleware";

import { fetcherOrdersMultiFleetTracking } from "@/services/CS/monitoring/lacak-armada/getOrdersMultiFleetTracking";

import { OrderStatusTitle } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";

// Create context
const PosisiArmadaContext = createContext(null);

// Create store factory function
const createPosisiArmadaStore = (props = {}) =>
  create(
    devtools(
      (set, get) => ({
        // Data state
        data: null,
        isLoading: false,
        error: null,
        lastFetch: null,
        orderId: props.orderId || null,

        // Filter state
        activeFilters: {
          transporters: [],
          statuses: [],
        },
        filterOptions: {
          transporters: [],
          statuses: [],
        },

        // Search state
        inputSearchTerm: "",
        confirmedSearchTerm: "",

        // UI state
        expandedVehicles: {},
        sosPopoverData: null,

        // Actions
        setOrderId: (orderId) => set({ orderId }),

        setInputSearchTerm: (term) => set({ inputSearchTerm: term }),

        setConfirmedSearchTerm: (term) => set({ confirmedSearchTerm: term }),

        clearSearchOnEmpty: () => {
          const { inputSearchTerm } = get();
          if (!inputSearchTerm.trim()) {
            set({ confirmedSearchTerm: "" });
          }
        },

        setActiveFilters: (filters) => {
          const { activeFilters: currentFilters } = get();
          // Only update if filters actually changed to prevent unnecessary re-renders
          if (JSON.stringify(currentFilters) !== JSON.stringify(filters)) {
            set({ activeFilters: filters });
          }
        },

        removeFilter: (filterType, value) => {
          const { activeFilters } = get();
          const newFilters = { ...activeFilters };

          if (filterType === "transporter") {
            newFilters.transporters = activeFilters.transporters.filter(
              (t) => t !== value
            );
          } else if (filterType === "status") {
            newFilters.statuses = activeFilters.statuses.filter(
              (s) => s !== value
            );
          }

          set({ activeFilters: newFilters });
        },

        clearAllFilters: () =>
          set({
            activeFilters: { transporters: [], statuses: [] },
          }),

        toggleVehicle: (vehicleId) => {
          const { expandedVehicles } = get();
          set({
            expandedVehicles: {
              ...expandedVehicles,
              [vehicleId]: !expandedVehicles[vehicleId],
            },
          });
        },

        setSosPopoverData: (data) => set({ sosPopoverData: data }),

        // Fetch data
        fetchData: async (orderId, t) => {
          if (!orderId) return;

          set({ isLoading: true, error: null });

          try {
            const data = await fetcherOrdersMultiFleetTracking(orderId);

            // Generate filter options from data
            const filterOptions = generateFilterOptions(data, t);

            set({
              data,
              filterOptions,
              isLoading: false,
              lastFetch: Date.now(),
              error: null,
            });
          } catch (error) {
            set({
              error: "Failed to fetch data",
              isLoading: false,
            });
          }
        },

        // Refresh data (for polling)
        refreshData: async (t) => {
          const { orderId, isLoading } = get();
          if (!orderId || isLoading) return;

          try {
            const data = await fetcherOrdersMultiFleetTracking(orderId);
            const filterOptions = generateFilterOptions(data, t);

            set({
              data,
              filterOptions,
              lastFetch: Date.now(),
              error: null,
            });
          } catch (error) {
            console.error("Error refreshing fleet tracking data:", error);
            // Don't update error state on refresh failures to avoid UI disruption
          }
        },

        // Computed selectors
        getFilteredVehicles: () => {
          const { data, confirmedSearchTerm, activeFilters } = get();

          if (!data?.vehicles) return [];

          let filtered = data.vehicles;

          // Apply search filter
          if (confirmedSearchTerm.trim()) {
            const searchLower = confirmedSearchTerm.toLowerCase();
            filtered = filtered.filter((vehicle) => {
              const matchesLicensePlate = vehicle.licensePlate
                ?.toLowerCase()
                .includes(searchLower);
              const matchesDriverName = vehicle.driverName
                ?.toLowerCase()
                .includes(searchLower);
              const matchesTransporterName = vehicle.transporterName
                ?.toLowerCase()
                .includes(searchLower);

              return (
                matchesLicensePlate ||
                matchesDriverName ||
                matchesTransporterName
              );
            });
          }

          // Apply transporter filter
          if (activeFilters.transporters.length > 0) {
            filtered = filtered.filter((vehicle) =>
              activeFilters.transporters.includes(vehicle.transporterName)
            );
          }

          // Apply status filter
          if (activeFilters.statuses.length > 0) {
            filtered = filtered.filter((vehicle) =>
              activeFilters.statuses.includes(vehicle.driverStatus?.mainStatus)
            );
          }

          return filtered;
        },

        hasActiveFilters: () => {
          const { activeFilters } = get();
          return (
            activeFilters.transporters.length > 0 ||
            activeFilters.statuses.length > 0
          );
        },

        // Reset store
        reset: () =>
          set({
            data: null,
            isLoading: false,
            error: null,
            lastFetch: null,
            orderId: null,
            activeFilters: { transporters: [], statuses: [] },
            filterOptions: { transporters: [], statuses: [] },
            inputSearchTerm: "",
            confirmedSearchTerm: "",
            expandedVehicles: {},
            sosPopoverData: null,
          }),
      }),
      {
        name: "posisi-armada-store",
      }
    )
  );

// Provider wrapper component
export function PosisiArmadaProvider({ children, ...props }) {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = createPosisiArmadaStore(props);
  }
  return (
    <PosisiArmadaContext.Provider value={storeRef.current}>
      {children}
    </PosisiArmadaContext.Provider>
  );
}

// Custom hook to access the store
function usePosisiArmadaContext(selector) {
  const store = useContext(PosisiArmadaContext);
  if (!store) {
    throw new Error("Missing PosisiArmadaProvider in the component tree");
  }
  return useStore(store, selector);
}

// Helper function to generate filter options from data
const generateFilterOptions = (data, t) => {
  if (!data?.vehicles) return { transporters: [], statuses: [] };

  const transporters = [...new Set(data.vehicles.map((v) => v.transporterName))]
    .filter(Boolean)
    .map((name) => ({ label: name, value: name }));

  const statuses = [
    ...new Set(data.vehicles.map((v) => v.driverStatus?.mainStatus)),
  ]
    .filter(Boolean)
    .map((status) => ({
      label: t(OrderStatusTitle[status]),
      value: status,
    }));

  return { transporters, statuses };
};

export const usePosisiArmada = (orderId, t) => {
  const intervalRef = useRef(null);

  // Get store instance from context using the custom hook
  const store = usePosisiArmadaContext((state) => state);

  // Extract only what we need for effects and handlers
  const {
    data,
    setOrderId,
    fetchData,
    refreshData,
    reset,
    inputSearchTerm,
    setInputSearchTerm,
    setConfirmedSearchTerm,
    clearSearchOnEmpty,
    setActiveFilters,
    removeFilter,
    clearAllFilters,
    toggleVehicle,
    setSosPopoverData,
    getFilteredVehicles,
    hasActiveFilters,
  } = store;

  // Initialize and fetch data when orderId changes
  useEffect(() => {
    if (orderId) {
      setOrderId(orderId);
      fetchData(orderId, t);
    } else {
      reset();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [orderId, setOrderId, fetchData, reset, t]);

  // Set up polling for data refresh
  useEffect(() => {
    if (orderId && data) {
      intervalRef.current = setInterval(() => {
        refreshData(t);
      }, 10000); // Refresh every 10 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [orderId, data, refreshData, t]);

  // Handlers
  const handleSearchInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInputSearchTerm(value);
      clearSearchOnEmpty();
    },
    [setInputSearchTerm, clearSearchOnEmpty]
  );

  const handleSearchKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        setConfirmedSearchTerm(inputSearchTerm);
      }
    },
    [inputSearchTerm, setConfirmedSearchTerm]
  );

  const handleFilterChange = useCallback(
    (filters) => {
      setActiveFilters(filters);
    },
    [setActiveFilters]
  );

  const handleRemoveFilter = useCallback(
    (filterType, value) => {
      removeFilter(filterType, value);
    },
    [removeFilter]
  );

  const handleClearAllFilters = useCallback(() => {
    clearAllFilters();
  }, [clearAllFilters]);

  const handleToggleVehicle = useCallback(
    (vehicleId) => {
      toggleVehicle(vehicleId);
    },
    [toggleVehicle]
  );

  const handleViewSos = useCallback(
    (sosData) => {
      setSosPopoverData(sosData);
    },
    [setSosPopoverData]
  );

  const handleCloseSos = useCallback(() => {
    setSosPopoverData(null);
  }, [setSosPopoverData]);

  // Get computed values
  const filteredVehicles = getFilteredVehicles();
  const hasFilters = hasActiveFilters();

  return {
    // Pass through all store state
    ...store,

    // Override with computed values
    filteredVehicles,
    hasActiveFilters: hasFilters,

    // Handlers
    handleSearchInputChange,
    handleSearchKeyDown,
    handleFilterChange,
    handleRemoveFilter,
    handleClearAllFilters,
    handleToggleVehicle,
    handleViewSos,
    handleCloseSos,

    // Actions (already available from store spread but keeping for clarity)
    refreshData,
    reset,
  };
};
