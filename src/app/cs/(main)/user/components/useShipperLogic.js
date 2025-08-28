import { useState } from "react";

// A lightweight hook to provide the same UI logic contract as useTransporterLogic
// but for shippers. This hook doesn't perform network requests; it only
// manages input/search/filter/sort/pagination states and exposes handlers so
// the container can perform client-side data operations on mock data.
export const useShipperLogic = ({ onPageChange, onPerPageChange } = {}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState(""); // input
  const [searchQuery, setSearchQuery] = useState(""); // actual search to run
  const [filters, setFilters] = useState({}); // raw filter objects
  const [processedFilters, setProcessedFilters] = useState({}); // for matching
  const [sortConfig, setSortConfig] = useState({ sort: null, order: null });
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "",
    data: null,
  });
  const [hubungiModalOpen, setHubungiModalOpen] = useState(false);
  const [selectedShipper, setSelectedShipper] = useState(null);

  // Search handlers - mirror transporter behaviour: wait for Enter or blur
  const handleSearch = (value) => {
    setSearchValue(value);
    // do not immediately set searchQuery here; wait for performSearch
  };

  const performSearch = () => {
    const trimmed = searchValue.trim();
    if (trimmed.length >= 3 || trimmed.length === 0) {
      setSearchQuery(trimmed);
      setCurrentPage(1);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") performSearch();
  };

  const handleSearchBlur = () => performSearch();

  const handleClearSearch = () => {
    setSearchValue("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Filter handlers (keep raw and processed)
  const handleFilter = (newFilters) => {
    setFilters(newFilters);

    const processed = {};
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        processed[key] = value.map((item) =>
          typeof item === "object" && item.id ? item.id : item
        );
      } else if (typeof value === "object" && value?.id) {
        processed[key] = value.id;
      } else {
        processed[key] = value;
      }
    });

    setProcessedFilters(processed);
    setCurrentPage(1);
  };

  const getActiveFilters = () => {
    const active = [];
    Object.entries(filters).forEach(([categoryKey, items]) => {
      if (Array.isArray(items)) {
        items.forEach((item) => {
          active.push({
            id: `${categoryKey}-${item.id || item}`,
            label: item.label || item,
            categoryKey,
            item,
          });
        });
      } else if (items) {
        active.push({
          id: `${categoryKey}-${items.id || items}`,
          label: items.label || items,
          categoryKey,
          item: items,
        });
      }
    });
    return active;
  };

  const handleRemoveFilter = (filter) => {
    const newFilters = { ...filters };
    if (Array.isArray(newFilters[filter.categoryKey])) {
      newFilters[filter.categoryKey] = newFilters[filter.categoryKey].filter(
        (item) => (item.id || item) !== (filter.item.id || filter.item)
      );
      if (newFilters[filter.categoryKey].length === 0)
        delete newFilters[filter.categoryKey];
    } else {
      delete newFilters[filter.categoryKey];
    }

    setFilters(newFilters);

    const newProcessed = { ...processedFilters };
    if (Array.isArray(newProcessed[filter.categoryKey])) {
      newProcessed[filter.categoryKey] = newProcessed[
        filter.categoryKey
      ].filter((item) => item !== (filter.item.id || filter.item));
      if (newProcessed[filter.categoryKey].length === 0)
        delete newProcessed[filter.categoryKey];
    } else {
      delete newProcessed[filter.categoryKey];
    }
    setProcessedFilters(newProcessed);
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setFilters({});
    setProcessedFilters({});
    setCurrentPage(1);
  };

  // Pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handlePerPageChange = (limit) => {
    setPerPage(limit);
    setCurrentPage(1);
    onPerPageChange?.(limit);
  };

  // Sort
  const handleSort = (key) => {
    let order = "asc";
    if (sortConfig.sort === key && sortConfig.order === "asc") order = "desc";
    setSortConfig({ sort: key, order });
    setCurrentPage(1);
  };

  // Modal helpers
  const openModal = (type, data) => setModalState({ isOpen: true, type, data });
  const openHubungiModal = (shipperData) => {
    setSelectedShipper(shipperData);
    setHubungiModalOpen(true);
  };
  const closeHubungiModal = () => {
    setHubungiModalOpen(false);
    setSelectedShipper(null);
  };

  // The hook returns the same contract as useTransporterLogic (subset) so the
  // container can be wired almost one-to-one.
  return {
    // Data placeholders (container will compute actual data from mockData)
    currentPage,
    perPage,
    searchValue,
    searchQuery,
    filters,
    processedFilters,
    sortConfig,
    isLoading: false,
    error: null,
    modalState,
    hubungiModalOpen,
    selectedShipper,

    // States (container derives show/no-data etc)
    showPagination: true,

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
    setModalState,
    performSearch,
  };
};
