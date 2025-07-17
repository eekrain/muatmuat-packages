import { useEffect, useRef, useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import { ChevronRight, Search, SlidersHorizontal } from "lucide-react";

import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import Input from "@/components/Form/Input";
import { cn } from "@/lib/utils";

const FilterDropdown = ({
  trigger,
  categories = [],
  data = {},
  selectedValues = {},
  onSelectionChange,
  searchable = true,
  multiSelect = true,
  showSelectedCount = true,
  dropdownClassName,
  itemClassName,
  searchPlaceholder = "Search...",
  emptyMessage = "Data Tidak Ditemukan",
  maxHeight = "160px",
}) => {
  const [searchQueries, setSearchQueries] = useState({});
  const [openPopovers, setOpenPopovers] = useState({});
  const hoverTimeouts = useRef({});

  const handleItemToggle = (categoryKey, item) => {
    if (!multiSelect) {
      // Single select mode
      onSelectionChange?.({ [categoryKey]: item });
      return;
    }

    // Multi select mode
    const currentCategoryValues = selectedValues[categoryKey] || [];
    const isSelected = currentCategoryValues.some(
      (selected) => selected.id === item.id
    );

    let newCategoryValues;
    if (isSelected) {
      newCategoryValues = currentCategoryValues.filter(
        (selected) => selected.id !== item.id
      );
    } else {
      newCategoryValues = [...currentCategoryValues, item];
    }

    const newSelectedValues = {
      ...selectedValues,
      [categoryKey]: newCategoryValues,
    };

    // Remove empty arrays
    if (newCategoryValues.length === 0) {
      delete newSelectedValues[categoryKey];
    }

    onSelectionChange?.(newSelectedValues);
  };

  const isItemSelected = (categoryKey, item) => {
    if (!multiSelect) {
      return selectedValues[categoryKey]?.id === item.id;
    }
    return (
      selectedValues[categoryKey]?.some(
        (selected) => selected.id === item.id
      ) || false
    );
  };

  const getFilteredItems = (categoryKey) => {
    const items = data[categoryKey] || [];
    const query = searchQueries[categoryKey] || "";
    if (!query || !searchable) return items;

    return items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSearchChange = (categoryKey, value) => {
    setSearchQueries((prev) => ({
      ...prev,
      [categoryKey]: value,
    }));
  };

  const getTotalSelectedCount = () => {
    if (!showSelectedCount) return 0;

    return Object.keys(selectedValues).reduce((acc, key) => {
      if (multiSelect) {
        return acc + (selectedValues[key]?.length || 0);
      }
      return acc + (selectedValues[key] ? 1 : 0);
    }, 0);
  };

  const handleMouseEnter = (categoryKey) => {
    // Clear any pending close timeout
    if (hoverTimeouts.current[categoryKey]) {
      clearTimeout(hoverTimeouts.current[categoryKey]);
    }

    // Open the popover
    setOpenPopovers((prev) => ({ ...prev, [categoryKey]: true }));
  };

  const handleMouseLeave = (categoryKey) => {
    // Set a timeout to close the popover
    hoverTimeouts.current[categoryKey] = setTimeout(() => {
      setOpenPopovers((prev) => ({ ...prev, [categoryKey]: false }));
    }, 0); // Small delay to allow moving to the content
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(hoverTimeouts.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
    };
  }, []);

  const renderTrigger = () => {
    const totalSelected = getTotalSelectedCount();

    // Default trigger if none provided
    if (!trigger) {
      return (
        <button
          className={cn(
            "flex h-8 w-[104px] flex-row items-center justify-between gap-2 rounded-md border bg-white px-3 transition-colors duration-150 hover:border-primary-700 hover:bg-gray-50 focus:outline-none",
            totalSelected > 0 ? "border-primary-700" : "border-neutral-600"
          )}
        >
          <span
            className={cn(
              "text-xs font-medium",
              totalSelected > 0 ? "text-primary-700" : "text-neutral-600"
            )}
          >
            Filter
          </span>
          <SlidersHorizontal
            className={cn(
              "h-4 w-4",
              totalSelected > 0 ? "text-primary-700" : "text-neutral-700"
            )}
          />
        </button>
      );
    }

    if (typeof trigger === "function") {
      return trigger({
        selectedCount: totalSelected,
      });
    }

    return trigger;
  };

  // Clear search queries when dropdown closes
  const handleOpenChange = (open) => {
    if (!open) {
      setSearchQueries({});
    }
  };

  return (
    <SimpleDropdown onOpenChange={handleOpenChange}>
      <SimpleDropdownTrigger asChild>{renderTrigger()}</SimpleDropdownTrigger>

      <SimpleDropdownContent
        className={cn(
          "w-[194px] overflow-hidden border-neutral-400 bg-neutral-50",
          dropdownClassName
        )}
      >
        {categories.map((category) => {
          return (
            <Popover.Root
              key={category.key}
              open={openPopovers[category.key] || false}
              onOpenChange={(open) => {
                setOpenPopovers((prev) => ({ ...prev, [category.key]: open }));
              }}
            >
              <Popover.Trigger asChild>
                <div
                  className="flex h-8 cursor-pointer items-center justify-between px-2.5 text-left transition-colors hover:bg-neutral-100"
                  onMouseEnter={() => handleMouseEnter(category.key)}
                  onMouseLeave={() => handleMouseLeave(category.key)}
                >
                  <span className="text-xs font-medium">{category.label}</span>
                  <div className="flex items-center gap-2">
                    <ChevronRight size={16} className="text-neutral-700" />
                  </div>
                </div>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  side="right"
                  align="start"
                  sideOffset={4}
                  className="shadow-muat z-50 w-[194px] rounded-md border border-neutral-400 bg-white p-2.5"
                  onMouseEnter={() => handleMouseEnter(category.key)}
                  onMouseLeave={() => handleMouseLeave(category.key)}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  {/* Search Input */}
                  {searchable && (
                    <Input
                      type="text"
                      value={searchQueries[category.key] || ""}
                      onChange={(e) =>
                        handleSearchChange(category.key, e.target.value)
                      }
                      placeholder={searchPlaceholder.replace(
                        "{category}",
                        category.label || ""
                      )}
                      icon={{
                        left: <Search className="h-4 w-4 text-neutral-500" />,
                      }}
                      appearance={{
                        containerClassName: "h-8 mb-2.5",
                        inputClassName: "text-xs font-medium",
                      }}
                    />
                  )}

                  {/* Items List */}
                  <div className="overflow-y-auto" style={{ maxHeight }}>
                    {getFilteredItems(category.key).length === 0 ? (
                      <div className="py-2 text-center text-xs font-medium">
                        {emptyMessage}
                      </div>
                    ) : (
                      getFilteredItems(category.key).map((item) => (
                        <label
                          key={item.id}
                          className={cn(
                            "flex h-8 cursor-pointer items-center gap-3 transition-colors hover:bg-neutral-50",
                            itemClassName
                          )}
                        >
                          <input
                            type={multiSelect ? "checkbox" : "radio"}
                            name={category.key}
                            checked={isItemSelected(category.key, item)}
                            onChange={() =>
                              handleItemToggle(category.key, item)
                            }
                            className="h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-700"
                          />
                          <span className="text-xs font-medium">
                            {item.label}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          );
        })}
      </SimpleDropdownContent>
    </SimpleDropdown>
  );
};

export default FilterDropdown;
