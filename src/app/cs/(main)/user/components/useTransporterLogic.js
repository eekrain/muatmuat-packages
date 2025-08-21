import { useEffect, useState } from "react";

import { toast } from "@/lib/toast";
import { useGetCSTransportersWithParams } from "@/services/CS/transporters/getCSTransporters";
import { usePatchCSTransporterStatus } from "@/services/CS/transporters/patchCSTransporterStatus";

export const useTransporterLogic = ({
  onPageChange,
  onPerPageChange,
  onDataStateChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState(""); // Input value
  const [searchQuery, setSearchQuery] = useState(""); // Actual search query sent to API
  const [filters, setFilters] = useState({}); // Raw filters for FilterDropdown (objects with id/label)
  const [processedFilters, setProcessedFilters] = useState({}); // Processed filters for API (string values)
  const [lastAction, setLastAction] = useState(null); // Track last user action: 'search' | 'filter'
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    data: null,
  });
  const [hubungiModalOpen, setHubungiModalOpen] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);

  const { data, error, isLoading } = useGetCSTransportersWithParams({
    page: currentPage,
    limit: perPage,
    search: searchQuery,
    ...processedFilters,
    ...sortConfig,
  });

  const { trigger: patchTransporterStatus, isMutating: isPatchingStatus } =
    usePatchCSTransporterStatus();

  const transportersData = data?.Data?.transporters || [];
  const paginationData = data?.Data?.pagination || {};
  const totalItems = paginationData.totalItems || 0;
  const totalPages = paginationData.totalPages || 0;

  // Modal handlers
  const openModal = (type, data) => {
    setModalState({ isOpen: true, type, data });
  };

  const openHubungiModal = (transporterData) => {
    setSelectedTransporter(transporterData);
    setHubungiModalOpen(true);
  };

  const closeHubungiModal = () => {
    setHubungiModalOpen(false);
    setSelectedTransporter(null);
  };

  const handleConfirmAction = async () => {
    if (!modalState.data) return;

    // Handle status change actions (activate/deactivate)
    if (modalState.type === "activate" || modalState.type === "deactivate") {
      try {
        const isActive = modalState.type === "activate";
        const reason = isActive
          ? "Aktivasi transporter"
          : "Deaktivasi transporter";

        await patchTransporterStatus({
          id: modalState.data.id,
          data: {
            isActive: isActive,
          },
        });

        toast.success(
          isActive
            ? "Berhasil mengaktifkan Transporter"
            : "Berhasil menonaktifkan Transporter"
        );
      } catch {
        toast.error("Gagal mengubah status transporter");
      }
    } else if (modalState.type === "delete") {
      toast.success("Transporter berhasil dihapus");
    } else if (modalState.type === "resend") {
      toast.success("Verifikasi berhasil dikirim ulang");
    }

    setModalState({ isOpen: false, type: "", data: null });
  };

  // Search handlers
  const handleSearch = (value) => {
    setSearchValue(value);
    // Don't automatically trigger search, wait for Enter key
  };

  const performSearch = () => {
    // Only perform search if length > 3 or if clearing search
    if (searchValue.trim().length > 3 || searchValue.trim().length === 0) {
      setSearchQuery(searchValue.trim());
      setLastAction("search");
      setCurrentPage(1);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  const handleSearchBlur = () => {
    performSearch();
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSearchQuery("");
    setLastAction("search");
    setCurrentPage(1);
  };

  // Filter handlers
  const handleFilter = (newFilters) => {
    setFilters(newFilters); // Keep raw filters for FilterDropdown

    const processedFilterValues = {};
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        processedFilterValues[key] = value.map((item) =>
          typeof item === "object" && item.key ? item.key : item
        );
      } else if (typeof value === "object" && value?.key) {
        processedFilterValues[key] = value.key;
      } else {
        processedFilterValues[key] = value;
      }
    });
    setProcessedFilters(processedFilterValues); // Set processed filters for API
    setLastAction("filter");
    setCurrentPage(1);
  };

  // Convert selected filters to active filter format
  const getActiveFilters = () => {
    const activeFilters = [];

    Object.entries(filters).forEach(([categoryKey, items]) => {
      if (Array.isArray(items)) {
        // Multi-select
        items.forEach((item) => {
          activeFilters.push({
            id: `${categoryKey}-${item.id}`,
            label: item.label,
            categoryKey,
            item,
          });
        });
      } else if (items) {
        // Single-select - since status is single-select in this case
        activeFilters.push({
          id: `${categoryKey}-${items.id || items}`,
          label: items.label || items,
          categoryKey,
          item: items,
        });
      }
    });

    return activeFilters;
  };

  const handleRemoveFilter = (filter) => {
    const newFilters = { ...filters };

    if (Array.isArray(newFilters[filter.categoryKey])) {
      // Multi-select
      newFilters[filter.categoryKey] = newFilters[filter.categoryKey].filter(
        (item) => (item.id || item) !== (filter.item.id || filter.item)
      );
      if (newFilters[filter.categoryKey].length === 0) {
        delete newFilters[filter.categoryKey];
      }
    } else {
      // Single-select
      delete newFilters[filter.categoryKey];
    }

    setFilters(newFilters);

    // Update processed filters
    const newProcessedFilters = { ...processedFilters };
    if (Array.isArray(newProcessedFilters[filter.categoryKey])) {
      newProcessedFilters[filter.categoryKey] = newProcessedFilters[
        filter.categoryKey
      ].filter((item) => item !== (filter.item.id || filter.item));
      if (newProcessedFilters[filter.categoryKey].length === 0) {
        delete newProcessedFilters[filter.categoryKey];
      }
    } else {
      delete newProcessedFilters[filter.categoryKey];
    }
    setProcessedFilters(newProcessedFilters);

    setLastAction("filter");
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setFilters({});
    setProcessedFilters({});
    setLastAction("filter");
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handlePerPageChange = (limit) => {
    setPerPage(limit);
    setCurrentPage(1);
    onPerPageChange?.(limit);
  };

  // Sort handler
  const handleSort = (key) => {
    let order = "asc";
    if (sortConfig.sort === key && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ sort: key, order });
    setCurrentPage(1);
  };

  // Calculate data state based on API response
  const hasSearch = searchQuery.trim().length > 0;
  const hasFilters = Object.keys(processedFilters).length > 0;
  const hasData = transportersData.length > 0;
  const originalDataExists =
    !isLoading && (hasData || (!hasSearch && !hasFilters));
  const showPagination = totalItems >= 10;

  // Determine what to show based on last action priority
  const showNoDataState =
    !isLoading && !originalDataExists && !hasSearch && !hasFilters;

  // When both search and filter are active, prioritize based on last action
  const showSearchNotFoundState =
    !isLoading &&
    hasSearch &&
    !hasData &&
    !error &&
    (!hasFilters || lastAction === "search");

  const showFilterNotFoundState =
    !isLoading &&
    hasFilters &&
    !hasData &&
    !error &&
    (!hasSearch || lastAction === "filter");

  // Notify parent about data state changes
  useEffect(() => {
    if (onDataStateChange) {
      onDataStateChange({
        hasData,
        hasSearch,
        hasFilters,
        showSearchNotFoundState,
        showFilterNotFoundState,
        showNoDataState,
        totalItems,
        isLoading,
        error,
      });
    }
  }, [
    hasData,
    hasSearch,
    hasFilters,
    showSearchNotFoundState,
    showFilterNotFoundState,
    showNoDataState,
    totalItems,
    isLoading,
    error,
    onDataStateChange,
  ]);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [processedFilters, searchQuery, sortConfig]);

  return {
    // Data
    transportersData,
    totalItems,
    totalPages,
    currentPage,
    perPage,
    searchValue,
    filters,
    sortConfig,
    isLoading,
    isPatchingStatus,
    error,
    modalState,
    hubungiModalOpen,
    selectedTransporter,

    // States
    showNoDataState,
    showSearchNotFoundState,
    showFilterNotFoundState,
    showPagination,
    hasData,

    // Handlers
    handleSearch,
    handleSearchKeyDown,
    handleSearchBlur,
    handleClearSearch,
    handleFilter,
    getActiveFilters,
    handleRemoveFilter,
    handleClearAllFilters,
    handlePageChange,
    handlePerPageChange,
    handleSort,
    openModal,
    openHubungiModal,
    closeHubungiModal,
    handleConfirmAction,
    setModalState,
  };
};
