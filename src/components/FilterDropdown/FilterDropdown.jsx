import { useState } from "react";

import * as HoverCard from "@radix-ui/react-hover-card";
import { ChevronRight, Search, SlidersHorizontal } from "lucide-react";

import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
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
  emptyMessage = "No items found",
  maxHeight = "300px",
}) => {
  const [searchQueries, setSearchQueries] = useState({});

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

  const getSelectedCount = (categoryKey) => {
    if (!multiSelect) {
      return selectedValues[categoryKey] ? 1 : 0;
    }
    return selectedValues[categoryKey]?.length || 0;
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

  const renderTrigger = () => {
    const totalSelected = getTotalSelectedCount();

    // Default trigger if none provided
    if (!trigger) {
      return (
        <button className="flex h-8 w-[104px] flex-row items-center justify-between gap-2 rounded-md border border-neutral-600 bg-white px-3 shadow-sm transition-colors duration-150 hover:border-primary-700 hover:bg-gray-50 focus:outline-none">
          <span className="text-xs font-medium text-neutral-600">Filter</span>
          <SlidersHorizontal className="h-4 w-4 text-neutral-700" />
          {totalSelected > 0 && (
            <span className="ml-1 rounded-full bg-primary-700 px-2 py-0.5 text-xs text-white">
              {totalSelected}
            </span>
          )}
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
        className={cn("w-[240px] bg-neutral-50 p-2", dropdownClassName)}
      >
        {categories.map((category) => {
          const selectedCount = getSelectedCount(category.key);

          return (
            <HoverCard.Root key={category.key} openDelay={0} closeDelay={0}>
              <HoverCard.Trigger asChild>
                <div className="flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-neutral-100">
                  <span>{category.label}</span>
                  <div className="flex items-center gap-2">
                    {selectedCount > 0 && showSelectedCount && (
                      <span className="text-xs text-primary-700">
                        ({selectedCount})
                      </span>
                    )}
                    <ChevronRight size={16} className="text-neutral-500" />
                  </div>
                </div>
              </HoverCard.Trigger>
              <HoverCard.Portal>
                <HoverCard.Content
                  side="right"
                  align="start"
                  sideOffset={5}
                  className="z-50 w-[360px] rounded-md border border-neutral-200 bg-white p-4 shadow-lg"
                >
                  <div className="mb-3 text-sm font-medium text-neutral-900">
                    {category.label}
                  </div>

                  {/* Search Input */}
                  {searchable && (
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="text"
                        value={searchQueries[category.key] || ""}
                        onChange={(e) =>
                          handleSearchChange(category.key, e.target.value)
                        }
                        placeholder={searchPlaceholder.replace(
                          "{category}",
                          category.label || ""
                        )}
                        className="w-full rounded-lg border border-neutral-300 py-2 pl-10 pr-4 text-sm focus:border-primary-700 focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Items List */}
                  <div
                    className="space-y-1 overflow-y-auto"
                    style={{ maxHeight }}
                  >
                    {getFilteredItems(category.key).length === 0 ? (
                      <div className="py-4 text-center text-sm text-neutral-500">
                        {emptyMessage}
                      </div>
                    ) : (
                      getFilteredItems(category.key).map((item) => (
                        <label
                          key={item.id}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-neutral-50",
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
                          <span className="text-sm font-medium text-neutral-900">
                            {item.label}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </HoverCard.Content>
              </HoverCard.Portal>
            </HoverCard.Root>
          );
        })}
      </SimpleDropdownContent>
    </SimpleDropdown>
  );
};

export default FilterDropdown;
