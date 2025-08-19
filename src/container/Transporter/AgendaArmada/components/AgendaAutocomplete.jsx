import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";
import { cn } from "@/lib/utils";
import { useGetSearchSuggestions } from "@/services/agenda-armada-driver/getSearchSuggestions";

import { useAgendaNavigatorStore } from "./AgendaCalendar/agendaNavigatorStore";

const AutocompleteContext = createContext(null);

const useAutocomplete = () => {
  const context = useContext(AutocompleteContext);
  if (!context) {
    throw new Error(
      "Autocomplete components must be rendered within an Autocomplete.Root"
    );
  }
  return context;
};

const Root = ({
  children,
  items = [],
  onSelect,
  itemToString: propItemToString,
  useStoreSearch = false, // Enable store integration
  useApiSuggestions = false, // New prop to enable API suggestions
  viewType = "armada", // API parameter: 'armada' or 'driver'
  limit = 5, // API parameter: max suggestions
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);

  // Get search from store if enabled
  const storeSearch = useAgendaNavigatorStore((state) => state.search);
  const setSearch = useAgendaNavigatorStore((state) => state.setSearch);
  const schedules = useAgendaNavigatorStore((state) => state.schedules);

  // Always use local inputValue for typing, not store search
  // Only update store search when user selects a suggestion

  // Fetch search suggestions from API using local input value
  const { data: suggestionsData, isLoading } = useGetSearchSuggestions(
    useApiSuggestions ? inputValue : null,
    viewType,
    limit
  );

  // Extract API suggestions
  const apiSuggestions = useMemo(() => {
    if (!useApiSuggestions || !suggestionsData?.suggestions) return [];
    return suggestionsData.suggestions;
  }, [useApiSuggestions, suggestionsData]);

  // Extract unique license plates and driver names from schedules for fallback
  const scheduleItems = useMemo(() => {
    if (!useStoreSearch || !schedules?.length) return [];

    const licensePlates = new Set();
    const driverNames = new Set();

    schedules.forEach((schedule) => {
      if (schedule.vehicle?.license_plate) {
        licensePlates.add(schedule.vehicle.license_plate);
      }
      if (schedule.driver?.name) {
        driverNames.add(schedule.driver.name);
      }
    });

    return [...licensePlates, ...driverNames];
  }, [useStoreSearch, schedules]);

  // Determine which items to use based on configuration
  const searchItems = useMemo(() => {
    if (useApiSuggestions) {
      return apiSuggestions;
    } else if (useStoreSearch) {
      return scheduleItems;
    } else {
      return items;
    }
  }, [useApiSuggestions, apiSuggestions, useStoreSearch, scheduleItems, items]);

  const itemToString = useCallback(
    (item) => {
      if (propItemToString) return propItemToString(item);
      // Handle API suggestion objects
      if (typeof item === "object" && item.label) {
        return item.label;
      }
      return String(item);
    },
    [propItemToString]
  );

  // For API suggestions, use the raw suggestions; for other modes, filter by search
  const filteredItems = useMemo(() => {
    if (useApiSuggestions) {
      // API already returns filtered results
      return searchItems;
    } else {
      // Filter locally for non-API modes using inputValue
      if (inputValue.length === 0) return [];
      return searchItems.filter((item) =>
        itemToString(item).toLowerCase().includes(inputValue.toLowerCase())
      );
    }
  }, [useApiSuggestions, searchItems, inputValue, itemToString]);

  const isPopoverVisible = isOpen && filteredItems.length > 0;

  const selectItem = (item) => {
    const itemString = itemToString(item);
    // For API suggestions, use the value property if available
    const searchValue =
      typeof item === "object" && item.value ? item.value : itemString;

    // Always update local input value
    setInputValue(searchValue);

    // Only update store search when user selects a suggestion (this triggers schedule refetch)
    if (useStoreSearch) {
      setSearch(searchValue);
    }

    setIsOpen(false);
    setActiveIndex(-1);
    if (onSelect) onSelect(item);
    inputRef.current?.blur();
  };

  // Initialize input value with store search on mount only
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (useStoreSearch && storeSearch && !hasInitialized.current) {
      setInputValue(storeSearch);
      hasInitialized.current = true;
    }
  }, [useStoreSearch, storeSearch]);
  const value = {
    isOpen,
    setIsOpen,
    inputValue,
    setInputValue,
    activeIndex,
    setActiveIndex,
    filteredItems,
    selectItem,
    itemToString,
    inputRef,
    useStoreSearch,
    useApiSuggestions,
    isLoading: useApiSuggestions ? isLoading : false,
  };
  return (
    <AutocompleteContext.Provider value={value}>
      <Popover open={isPopoverVisible} onOpenChange={setIsOpen}>
        {children}
      </Popover>
    </AutocompleteContext.Provider>
  );
};

const Trigger = ({ children }) => (
  <PopoverTrigger asChild>{children}</PopoverTrigger>
);

// 2. Wrap the Input component with forwardRef
const Input = forwardRef(({ placeholder }, ref) => {
  const {
    isOpen,
    setIsOpen,
    inputValue,
    setInputValue,
    activeIndex,
    setActiveIndex,
    filteredItems,
    selectItem,
    inputRef,
    useStoreSearch,
  } = useAutocomplete();

  // Get clear function from store if needed
  const clearSearch = useAgendaNavigatorStore((state) => state.clearSearch);
  const setSearch = useAgendaNavigatorStore((state) => state.setSearch);

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Always update local input value for typing and suggestions
    setInputValue(value);
    if (!isOpen) setIsOpen(true);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setInputValue("");
    setIsOpen(false);
    setActiveIndex(-1);
    // Also clear the store search if connected
    if (useStoreSearch && clearSearch) {
      clearSearch();
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        if (filteredItems.length > 0) {
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % filteredItems.length);
        }
        break;
      case "ArrowUp":
        if (filteredItems.length > 0) {
          e.preventDefault();
          setActiveIndex(
            (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
          );
        }
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && filteredItems.length > 0) {
          // Select the active suggestion
          selectItem(filteredItems[activeIndex]);
        } else if (inputValue.trim().length > 0) {
          // Search with current input value even if no suggestions are active
          if (useStoreSearch) {
            setSearch(inputValue.trim());
            // Keep the input value as what the user searched for
            setInputValue(inputValue.trim());
          }
          setIsOpen(false);
          setActiveIndex(-1);
          inputRef.current?.blur();
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      // 3. Attach the forwarded ref to the main element
      ref={ref}
      onClick={() => inputRef.current?.focus()}
      className={cn(
        "flex h-8 w-[262px] cursor-text items-center gap-2 rounded-md border border-neutral-600 bg-white p-3 focus-within:border-primary-700 hover:border-primary-700"
      )}
    >
      <IconComponent
        src="/icons/search.svg"
        className="size-4 shrink-0 text-neutral-700"
      />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        className="flex-grow cursor-text bg-transparent text-xs font-medium text-black outline-none placeholder:text-neutral-500"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen && filteredItems.length > 0}
        aria-controls="autocomplete-list"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="flex size-4 shrink-0 items-center justify-center rounded-full hover:bg-neutral-100"
          aria-label="Clear search"
        >
          <IconComponent
            src="/icons/close20.svg"
            className="size-4 text-neutral-700"
          />
        </button>
      )}
    </div>
  );
});
Input.displayName = "AutocompleteInput"; // Best practice for forwardRef

const PopoverPanel = ({ children, className }) => {
  return (
    <PopoverContent
      align="start"
      sideOffset={4}
      onOpenAutoFocus={(e) => e.preventDefault()}
      className={cn(
        "w-[262px] rounded-md border border-neutral-400 bg-white p-0 shadow-[0px_4px_11px_rgba(65,65,65,0.25)]",
        className
      )}
    >
      {children}
    </PopoverContent>
  );
};

const List = ({ children }) => {
  const { filteredItems, isLoading, useApiSuggestions, inputValue } =
    useAutocomplete();

  // Show loading state for API suggestions
  if (useApiSuggestions && isLoading && inputValue.length >= 2) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary-700 border-t-transparent"></div>
          Mencari...
        </div>
      </div>
    );
  }

  // Show no results message for API suggestions
  if (
    useApiSuggestions &&
    !isLoading &&
    inputValue.length >= 2 &&
    filteredItems.length === 0
  ) {
    return (
      <div className="flex items-center justify-center p-4">
        <span className="text-xs text-neutral-500">
          Tidak ada hasil ditemukan
        </span>
      </div>
    );
  }

  if (filteredItems.length === 0) return null;

  return (
    <ul
      id="autocomplete-list"
      role="listbox"
      className="max-h-[160px] overflow-y-auto"
    >
      {filteredItems.map(children)}
    </ul>
  );
};

const Item = ({ index, item }) => {
  const {
    activeIndex,
    setActiveIndex,
    selectItem,
    itemToString,
    useApiSuggestions,
  } = useAutocomplete();
  const isActive = index === activeIndex;

  // Handle API suggestion object vs simple string
  const displayText =
    useApiSuggestions && typeof item === "object"
      ? item.label
      : itemToString(item);

  // Get icon and type label for API suggestions
  const getIcon = () => {
    if (!useApiSuggestions || typeof item !== "object") return null;

    switch (item.type) {
      case "LICENSE_PLATE":
        return (
          <IconComponent
            src="/icons/box16.svg"
            className="size-3 text-neutral-600"
          />
        );
      case "DRIVER_NAME":
        return (
          <IconComponent
            src="/icons/carrier16.svg"
            className="size-3 text-neutral-600"
          />
        );
      default:
        return (
          <IconComponent
            src="/icons/search.svg"
            className="size-3 text-neutral-600"
          />
        );
    }
  };

  const getTypeLabel = () => {
    if (!useApiSuggestions || typeof item !== "object") return null;

    switch (item.type) {
      case "LICENSE_PLATE":
        return "Nomor Polisi";
      case "DRIVER_NAME":
        return "Driver";
      default:
        return null;
    }
  };

  const icon = getIcon();
  const typeLabel = getTypeLabel();

  return (
    <li
      id={`autocomplete-item-${index}`}
      role="option"
      aria-selected={isActive}
      className={cn(
        "flex cursor-pointer items-center gap-3 px-[10px] py-3 text-xs font-medium text-black hover:bg-neutral-50",
        isActive && "bg-neutral-100"
      )}
      onClick={() => selectItem(item)}
      onMouseMove={() => setActiveIndex(index)}
    >
      {icon && <div className="flex-shrink-0">{icon}</div>}
      <div className="flex-grow">
        <div className="font-medium">{displayText}</div>
        {typeLabel && (
          <div className="text-xs text-neutral-500">{typeLabel}</div>
        )}
      </div>
    </li>
  );
};

export const AgendaAutocomplete = {
  Root,
  Trigger,
  Input,
  Popover: PopoverPanel,
  List,
  Item,
};
