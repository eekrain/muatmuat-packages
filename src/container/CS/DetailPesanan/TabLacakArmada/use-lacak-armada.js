import { useParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { OrderStatusTitle } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { useGetFleetTrackingCS } from "@/services/CS/monitoring/detail-pesanan-cs/getFleetTracking";

const Context = createContext(null);

export const LacakArmadaProvider = ({ children }) => {
  const params = useParams();
  const { data } = useGetFleetTrackingCS(params.orderId);

  // State for managing filter selections
  const [selectedTransporters, setSelectedTransporters] = useState(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState(new Set());
  const [transporterSearchQuery, setTransporterSearchQuery] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [mainSearchQuery, setMainSearchQuery] = useState("");

  // Calculate total armada by summing all fleets from all transporters
  const totalArmada =
    data?.reduce((total, transporter) => {
      return total + (transporter?.fleets?.length || 0);
    }, 0) || 0;

  // Calculate total SOS by checking sosStatus in each fleet of each transporter
  const totalSos =
    data?.reduce((total, transporter) => {
      const sosCount =
        transporter?.fleets?.filter((fleet) => fleet?.sosStatus?.hasSOS)
          ?.length || 0;
      return total + sosCount;
    }, 0) || 0;

  const filterOptions = useMemo(() => {
    const transporter = data?.map((item) => ({
      label: item?.companyName,
      value: item?.transporterId,
    }));

    const status = new Set();
    data?.forEach((element) => {
      element?.fleets?.forEach((fleet) => {
        status.add(fleet?.orderStatus);
      });
    });

    return {
      transporter,
      status: [...status].map((status) => ({
        label: OrderStatusTitle[status],
        value: status,
      })),
    };
  }, [data]);

  // Filtered transporters based on search query
  const filteredTransporters = useMemo(() => {
    if (!transporterSearchQuery.trim()) {
      return filterOptions.transporter || [];
    }

    return (filterOptions.transporter || []).filter((transporter) =>
      transporter.label
        ?.toLowerCase()
        .includes(transporterSearchQuery.toLowerCase())
    );
  }, [filterOptions.transporter, transporterSearchQuery]);

  // Filter functions
  const toggleTransporterFilter = (transporterId) => {
    setSelectedTransporters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(transporterId)) {
        newSet.delete(transporterId);
      } else {
        newSet.add(transporterId);
      }
      return newSet;
    });
  };

  const toggleStatusFilter = (status) => {
    setSelectedStatuses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(status)) {
        newSet.delete(status);
      } else {
        newSet.add(status);
      }
      return newSet;
    });
  };

  const clearAllFilters = () => {
    setSelectedTransporters(new Set());
    setSelectedStatuses(new Set());
  };

  // Individual remove filter functions
  const removeTransporterFilter = useCallback((transporterId) => {
    setSelectedTransporters((prev) => {
      const newSet = new Set(prev);
      newSet.delete(transporterId);
      return newSet;
    });
  }, []);

  const removeStatusFilter = useCallback((status) => {
    setSelectedStatuses((prev) => {
      const newSet = new Set(prev);
      newSet.delete(status);
      return newSet;
    });
  }, []);

  // Get applied filters with labels for display
  const appliedFilters = useMemo(() => {
    const filters = [];

    // Add selected transporters
    selectedTransporters.forEach((transporterId) => {
      const transporter = filterOptions.transporter?.find(
        (t) => t.value === transporterId
      );
      if (transporter) {
        filters.push({
          type: "transporter",
          value: transporterId,
          label: transporter.label,
          onRemove: { onRemove: () => removeTransporterFilter(transporterId) },
        });
      }
    });

    // Add selected statuses
    selectedStatuses.forEach((status) => {
      const statusOption = filterOptions.status?.find(
        (s) => s.value === status
      );
      if (statusOption) {
        filters.push({
          type: "status",
          value: status,
          label: statusOption.label,
          onRemove: { onRemove: () => removeStatusFilter(status) },
        });
      }
    });

    return filters;
  }, [
    selectedTransporters,
    selectedStatuses,
    filterOptions,
    removeTransporterFilter,
    removeStatusFilter,
  ]);

  // Check if any filters are active
  const hasActiveFilters =
    selectedTransporters.size > 0 || selectedStatuses.size > 0;

  // Check if search is active
  const hasActiveSearch = mainSearchQuery.trim().length > 0;

  // Filtered data based on selected filters (without search)
  const filteredDataByFilters = useMemo(() => {
    if (!hasActiveFilters) {
      return data || [];
    }

    return (data || [])
      .map((transporter) => {
        // If transporter filter is active and this transporter is not selected, exclude it
        if (
          selectedTransporters.size > 0 &&
          !selectedTransporters.has(transporter.transporterId)
        ) {
          return { ...transporter, fleets: [] };
        }

        // Filter fleets by status if status filter is active
        if (selectedStatuses.size > 0) {
          const filteredFleets =
            transporter.fleets?.filter((fleet) =>
              selectedStatuses.has(fleet.orderStatus)
            ) || [];
          return { ...transporter, fleets: filteredFleets };
        }

        return transporter;
      })
      .filter((transporter) => {
        // Remove transporters with no fleets if transporter filter is not active
        // or if they have at least one fleet
        return selectedTransporters.size === 0 || transporter.fleets.length > 0;
      });
  }, [data, selectedTransporters, selectedStatuses, hasActiveFilters]);

  // Final data with search applied
  const finalData = useMemo(() => {
    if (!mainSearchQuery.trim() || !filteredDataByFilters) {
      return filteredDataByFilters;
    }

    const searchLower = mainSearchQuery.toLowerCase();

    return filteredDataByFilters
      .map((transporter) => {
        const filteredFleets = transporter.fleets.filter((fleet) => {
          return (
            fleet.licensePlate?.toLowerCase().includes(searchLower) ||
            fleet.driverInfo?.driverName?.toLowerCase().includes(searchLower) ||
            transporter.companyName?.toLowerCase().includes(searchLower)
          );
        });

        return {
          ...transporter,
          fleets: filteredFleets,
        };
      })
      .filter((transporter) => transporter.fleets.length > 0);
  }, [mainSearchQuery, filteredDataByFilters]);
  // Check if search has no results
  const hasNoSearchResults = useMemo(() => {
    return (
      hasActiveSearch &&
      (!finalData ||
        finalData.length === 0 ||
        finalData.every(
          (transporter) =>
            !transporter.fleets || transporter.fleets.length === 0
        ))
    );
  }, [hasActiveSearch, finalData]);

  const [isEdit, setIsEdit] = useState(false);

  return (
    <Context.Provider
      value={{
        totalArmada,
        totalSos,
        data: finalData,
        filteredDataByFilters,
        filterOptions,
        filteredTransporters,
        selectedTransporters,
        selectedStatuses,
        transporterSearchQuery,
        setTransporterSearchQuery,
        searchInputValue,
        setSearchInputValue,
        mainSearchQuery,
        setMainSearchQuery,
        toggleTransporterFilter,
        toggleStatusFilter,
        clearAllFilters,
        appliedFilters,
        hasActiveFilters,
        hasActiveSearch,
        hasNoSearchResults,

        isEdit,
        setIsEdit,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useLacakArmadaContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useLacakArmadaContext must be used within a LacakArmadaProvider"
    );
  }
  return context;
};
