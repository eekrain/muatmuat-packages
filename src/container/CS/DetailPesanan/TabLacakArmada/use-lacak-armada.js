import { useParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useTranslation } from "@/hooks/use-translation";
import { OrderStatusTitle } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { useGetAvailableTransportersCS } from "@/services/CS/monitoring/detail-pesanan-cs/getAvailableTransportersCS";
import { useGetFleetTrackingCS } from "@/services/CS/monitoring/detail-pesanan-cs/getFleetTrackingCS";

const Context = createContext(null);

export const LacakArmadaProvider = ({ children }) => {
  const params = useParams();
  const { t } = useTranslation();

  // --- API CALLS ---
  const { data: fleetTrackingData } = useGetFleetTrackingCS(params.orderId);
  const { data: availableTransporters } = useGetAvailableTransportersCS(
    params.orderId
  );

  // --- STATE MANAGEMENT ---
  const [isEdit, setIsEdit] = useState(false);
  const [assignments, setAssignments] = useState({});
  const [selectedTransporters, setSelectedTransporters] = useState(new Set());
  const [selectedStatuses, setSelectedStatuses] = useState(new Set());
  const [transporterSearchQuery, setTransporterSearchQuery] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [mainSearchQuery, setMainSearchQuery] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [changeSummary, setChangeSummary] = useState(null);

  // --- EFFECTS ---
  useEffect(() => {
    if (isEdit && fleetTrackingData) {
      const initialAssignments = {};
      fleetTrackingData.forEach((transporter, transporterIndex) => {
        const unassignedCount =
          transporter.fleetsOrdered - (transporter.fleets?.length || 0);
        if (unassignedCount > 0) {
          for (let i = 0; i < unassignedCount; i++) {
            const unassignedId = `${transporter.transporterId}-${transporterIndex}-unassigned-${i}`;
            initialAssignments[unassignedId] = {
              type: "SAME_TRANSPORTER",
              transporterId: null,
            };
          }
        }
      });
      setAssignments(initialAssignments);
    } else {
      setAssignments({});
    }
  }, [isEdit, fleetTrackingData]);

  const handleAssignmentChange = useCallback((unassignedId, newValue) => {
    setAssignments((prev) => ({
      ...prev,
      [unassignedId]: newValue,
    }));
  }, []);

  const handleSaveChanges = () => {
    const summary = {
      oldTransporters: [],
      newTransporters: [],
      blastCount: 0,
    };

    const oldTransporterMap = new Map();
    const newTransporterMap = new Map();

    Object.entries(assignments).forEach(([key, value]) => {
      const keyParts = key.split("-");
      const transporterId = keyParts.slice(0, 5).join("-");
      const transporterIndex = parseInt(keyParts[5], 10);
      const uniqueMapKey = `${transporterId}-${transporterIndex}`;
      const oldTransporter = fleetTrackingData[transporterIndex];

      if (!oldTransporter) return;

      const processOldTransporter = () => {
        if (!oldTransporterMap.has(uniqueMapKey)) {
          oldTransporterMap.set(uniqueMapKey, {
            name: oldTransporter.companyName,
            picture: oldTransporter.companyPicture,
            phone: oldTransporter.companyPhone,
            units: 0,
          });
        }
        oldTransporterMap.get(uniqueMapKey).units++;
      };

      if (value.type === "REBLAST") {
        summary.blastCount += 1;
        processOldTransporter();
      }

      if (value.type === "CHOOSE_TRANSPORTER" && value.transporterId) {
        processOldTransporter();
        const newTransporter = availableTransporters.find(
          (t) => t.value === value.transporterId
        );

        if (newTransporter && !newTransporterMap.has(newTransporter.value)) {
          newTransporterMap.set(newTransporter.value, {
            ...newTransporter,
            units: 0,
          });
        }
        if (newTransporter) newTransporterMap.get(newTransporter.value).units++;
      }
    });

    summary.oldTransporters = Array.from(oldTransporterMap.values());
    summary.newTransporters = Array.from(newTransporterMap.values());

    setChangeSummary(summary);
    setIsConfirmModalOpen(true);
  };

  const executeSaveChanges = () => {
    console.log(
      "CONFIRMED: Saving changes for unassigned fleets:",
      assignments
    );
    alert(
      t(
        "useLacakArmada.alertPerubahanTelahDikirim",
        {},
        "Perubahan telah dikirim! (Lihat console untuk detail)"
      )
    );
    setIsConfirmModalOpen(false);
    setIsEdit(false);
    setChangeSummary(null);
  };

  // --- FILTER HANDLERS ---

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

  // --- DERIVED STATE & MEMOS ---
  const totalArmada =
    fleetTrackingData?.reduce((total, transporter) => {
      return total + (transporter?.fleets?.length || 0);
    }, 0) || 0;

  const totalSos =
    fleetTrackingData?.reduce((total, transporter) => {
      const sosCount =
        transporter?.fleets?.filter((fleet) => fleet?.sosStatus?.hasSOS)
          ?.length || 0;
      return total + sosCount;
    }, 0) || 0;

  const filterOptions = useMemo(() => {
    const transporter = fleetTrackingData?.map((item) => ({
      label: item?.companyName,
      value: item?.transporterId,
    }));
    const status = new Set();
    fleetTrackingData?.forEach((element) => {
      element?.fleets?.forEach((fleet) => {
        status.add(fleet?.orderStatus);
      });
    });
    return {
      transporter,
      status: [...status].map((s) => ({
        label: OrderStatusTitle[s],
        value: s,
      })),
    };
  }, [fleetTrackingData]);

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

  const appliedFilters = useMemo(() => {
    const filters = [];
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

  const hasActiveFilters =
    selectedTransporters.size > 0 || selectedStatuses.size > 0;
  const hasActiveSearch = mainSearchQuery.trim().length > 0;

  const filteredDataByFilters = useMemo(() => {
    if (!hasActiveFilters) {
      return fleetTrackingData || [];
    }
    return (fleetTrackingData || [])
      .map((transporter) => {
        if (
          selectedTransporters.size > 0 &&
          !selectedTransporters.has(transporter.transporterId)
        ) {
          return { ...transporter, fleets: [] };
        }
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
        return selectedTransporters.size === 0 || transporter.fleets.length > 0;
      });
  }, [
    fleetTrackingData,
    selectedTransporters,
    selectedStatuses,
    hasActiveFilters,
  ]);

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

  // --- CONTEXT VALUE ---
  const value = {
    data: fleetTrackingData,
    isEdit,
    setIsEdit,
    assignments,
    handleAssignmentChange,
    handleSaveChanges,
    availableTransporters: availableTransporters || [],
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    changeSummary,
    executeSaveChanges,
    filteredDataByFilters,
    totalArmada,
    totalSos,
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
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
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
