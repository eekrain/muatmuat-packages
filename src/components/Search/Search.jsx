import { useCallback, useEffect, useState } from "react";

import { X } from "lucide-react";

import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";

import { cn } from "@/lib/utils";

const Search = ({
  placeholder = "Search...",
  onSearch,
  onFocus,
  debounceTime = 300,
  className,
  disabled = false,
  autoSearch = false,
  showClearButton = true,
  containerClassName,
  inputClassName,
  defaultValue = "",
}) => {
  const [searchValue, setSearchValue] = useState(defaultValue);
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Handle debounced search
  const handleDebouncedSearch = useCallback(
    (value) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        // Global rule: only search if more than 2 characters or empty (for reset)
        if (value.length > 2 || value === "") {
          onSearch?.(value);
        }
      }, debounceTime);

      setDebounceTimer(timer);
    },
    [debounceTimer, debounceTime, onSearch]
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (autoSearch) {
      handleDebouncedSearch(value);
    }
  };

  // Handle search on Enter key
  const handleKeyUp = (e) => {
    if (e.key === "Enter") {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      // Global rule: only search if more than 2 characters or empty (for reset)
      if (searchValue.length > 2 || searchValue === "") {
        onSearch?.(searchValue);
      }
    }
  };

  // Handle clear search
  const handleClear = () => {
    setSearchValue("");
    onSearch?.("");
  };

  return (
    <div className={cn("flex items-center gap-3", containerClassName)}>
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
        onKeyUp={handleKeyUp}
        onFocus={onFocus}
        disabled={disabled}
        icon={{
          left: <IconComponent src="/icons/datatable-search.svg" width={12} />,
          right:
            showClearButton && searchValue.length > 0 ? (
              <button
                onClick={handleClear}
                className="flex items-center justify-center rounded-full p-0.5 hover:bg-neutral-200"
                disabled={disabled}
              >
                <X className="h-3 w-3 text-neutral-600" />
              </button>
            ) : null,
        }}
        appearance={{
          containerClassName: cn("h-8", inputClassName),
          inputClassName: "text-xs font-medium mt-0",
        }}
        className={className}
      />
    </div>
  );
};

export default Search;
