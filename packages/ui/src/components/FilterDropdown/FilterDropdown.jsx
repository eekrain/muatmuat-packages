import { useEffect, useRef, useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import { ChevronRight } from "lucide-react";

import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import Checkbox from "@/components/Form/Checkbox";
import Input from "@/components/Form/Input";

import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";
import RadioButton from "../Radio/RadioButton";

const FilterDropdown = ({
  trigger,
  categories = [],
  data = {},
  selectedValues = {},
  onSelectionChange,
  searchable = true,
  multiSelect = true,
  showSelectedCount = true,
  triggerClassName,
  dropdownClassName,
  itemClassName,
  searchPlaceholder = "Search...",
  emptyMessage = "Data Tidak Ditemukan",
  maxHeight = "160px",
  disabled = false,
}) => {
  const [searchQueries, setSearchQueries] = useState({});
  const [openPopovers, setOpenPopovers] = useState({});
  const hoverTimeouts = useRef({});
  const [tempSelectedValues, setTempSelectedValues] = useState(selectedValues);

  // Sync tempSelectedValues when selectedValues prop changes
  useEffect(() => {
    setTempSelectedValues(selectedValues);
  }, [selectedValues]);

  const handleItemToggle = (categoryKey, item) => {
    if (!multiSelect) {
      // Single select mode
      const newSelectedValues = { [categoryKey]: item };
      setTempSelectedValues(newSelectedValues);

      // Close the popover and apply the filter immediately
      setOpenPopovers((prev) => ({ ...prev, [categoryKey]: false }));
      onSelectionChange?.(newSelectedValues);
      return;
    }

    // Multi select mode
    const currentCategoryValues = tempSelectedValues[categoryKey] || [];
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
      ...tempSelectedValues,
      [categoryKey]: newCategoryValues,
    };

    // Remove empty arrays
    if (newCategoryValues.length === 0) {
      delete newSelectedValues[categoryKey];
    }

    setTempSelectedValues(newSelectedValues);
  };

  const isItemSelected = (categoryKey, item) => {
    if (!multiSelect) {
      return tempSelectedValues[categoryKey]?.id === item.id;
    }
    return (
      tempSelectedValues[categoryKey]?.some(
        (selected) => selected.id === item.id
      ) || false
    );
  };

  const getFilteredItems = (categoryKey, category) => {
    const items = data[categoryKey] || [];
    const query = searchQueries[categoryKey] || "";
    // Check if search is enabled for this category (defaults to global searchable prop)
    const isCategorySearchable =
      category.searchable !== undefined ? category.searchable : searchable;
    if (!query || !isCategorySearchable) return items;

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

    return Object.keys(tempSelectedValues).reduce((acc, key) => {
      if (multiSelect) {
        return acc + (tempSelectedValues[key]?.length || 0);
      }
      return acc + (tempSelectedValues[key] ? 1 : 0);
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
    }, 25); // Small delay to allow moving to the content
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
            "flex h-8 min-w-[104px] flex-row items-center justify-between gap-2 rounded-md border px-3 transition-colors duration-150 focus:outline-none",
            triggerClassName,
            disabled
              ? "cursor-not-allowed border-neutral-600 bg-neutral-200"
              : totalSelected > 0
                ? "border-primary-700 bg-neutral-50"
                : "border-neutral-600 bg-neutral-50"
          )}
          disabled={disabled}
        >
          <span
            className={cn(
              "text-xs font-medium",
              totalSelected > 0 && !disabled
                ? "text-primary-700"
                : "text-neutral-600"
            )}
          >
            Filter
          </span>
          <IconComponent
            className={cn(
              "text-neutral-700",
              totalSelected > 0 && !disabled
                ? "text-primary-700"
                : "text-neutral-600"
            )}
            src="/icons/filter16.svg"
          />
        </button>
      );
    }

    if (typeof trigger === "function") {
      return trigger({
        selectedCount: totalSelected,
        disabled: disabled,
      });
    }

    return trigger;
  };

  // Clear search queries and apply selection when dropdown closes
  const handleOpenChange = (open) => {
    if (!open) {
      setSearchQueries({});
      // Only fire onSelectionChange if values have changed
      if (
        JSON.stringify(tempSelectedValues) !== JSON.stringify(selectedValues)
      ) {
        onSelectionChange?.(tempSelectedValues);
      }
    } else {
      // Reset temp values when opening
      setTempSelectedValues(selectedValues);
    }
  };

  return (
    <SimpleDropdown onOpenChange={handleOpenChange} disabled={disabled}>
      <SimpleDropdownTrigger asChild disabled={disabled}>
        {renderTrigger()}
      </SimpleDropdownTrigger>

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
                  className={cn(
                    "flex h-8 cursor-pointer items-center justify-between px-2.5 text-left transition-all hover:bg-neutral-100",
                    openPopovers[category.key] && "bg-neutral-100"
                  )}
                  onMouseEnter={() => handleMouseEnter(category.key)}
                  onMouseLeave={() => handleMouseLeave(category.key)}
                >
                  <span
                    className={cn(
                      "text-xs",
                      selectedValues?.[category.key]
                        ? "font-semibold"
                        : "font-medium"
                    )}
                  >
                    {category.label}
                  </span>
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
                  className="z-50 w-fit overflow-hidden rounded-md border border-neutral-400 bg-white shadow-muat"
                  onMouseEnter={() => handleMouseEnter(category.key)}
                  onMouseLeave={() => handleMouseLeave(category.key)}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  {/* Search Input */}
                  {(category.searchable !== undefined
                    ? category.searchable
                    : searchable) && (
                    <div className="p-2.5">
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
                          left: "/icons/search16.svg",
                          right: searchQueries[category.key] ? (
                            // && searchQueries[category.key].length > 2
                            <IconComponent
                              src="/icons/silang16.svg"
                              onClick={() =>
                                handleSearchChange(category.key, "")
                              }
                            />
                          ) : null,
                        }}
                        appearance={{
                          containerClassName: "h-8 w-[166px]",
                          inputClassName: "text-xs font-medium mt-0",
                        }}
                      />
                    </div>
                  )}

                  {/* Items List */}
                  <div
                    className="w-[193px] overflow-y-auto"
                    style={{ maxHeight }}
                  >
                    {getFilteredItems(category.key, category).length === 0 ? (
                      <div className="flex h-[42px] w-full items-center justify-center">
                        <span className="text-center text-xs font-medium">
                          {emptyMessage}
                        </span>
                      </div>
                    ) : (
                      getFilteredItems(category.key, category).map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "flex h-8 items-center px-3 hover:cursor-pointer hover:bg-neutral-100",
                            itemClassName
                          )}
                        >
                          {multiSelect ? (
                            <Checkbox
                              checked={isItemSelected(category.key, item)}
                              onChange={() =>
                                handleItemToggle(category.key, item)
                              }
                              value={item.id}
                              label={item.label}
                              appearance={{
                                labelClassName:
                                  "text-xs font-medium line-clamp-2 break-all",
                              }}
                            />
                          ) : (
                            <RadioButton
                              checked={isItemSelected(category.key, item)}
                              onClick={() =>
                                handleItemToggle(category.key, item)
                              }
                              value={item.id}
                              label={item.label}
                              appearance={{
                                labelClassName:
                                  "text-xs font-medium line-clamp-2 break-all",
                              }}
                            />
                          )}
                        </div>
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
