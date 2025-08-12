"use client";

import { useEffect, useRef, useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import { ChevronRight, X } from "lucide-react";

import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import Checkbox from "@/components/Form/Checkbox";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import RadioButton from "@/components/Radio/RadioButton";
import { cn } from "@/lib/utils";

const DashboardFilter = ({
  trigger,
  categories = [],
  data = {},
  selectedValues = {},
  onSelectionChange,
  searchPlaceholder = "Search...",
  emptyMessage = "Data Tidak Ditemukan",
  maxHeight = "160px",
  disabled = false,
  dropdownClassName,
  itemClassName,
}) => {
  const [searchQueries, setSearchQueries] = useState({});
  const [openPopovers, setOpenPopovers] = useState({});
  const hoverTimeouts = useRef({});
  const [tempSelectedValues, setTempSelectedValues] = useState(selectedValues);

  useEffect(() => {
    setTempSelectedValues(selectedValues);
  }, [selectedValues]);

  const handleItemToggle = (categoryKey, item, categoryType) => {
    // Corrected Single-Select Logic
    if (categoryType === "radio-single") {
      // If the same item is clicked again, deselect it. Otherwise, select the new one.
      const isAlreadySelected = tempSelectedValues[categoryKey]?.id === item.id;
      if (isAlreadySelected) {
        const newSelectedValues = { ...tempSelectedValues };
        delete newSelectedValues[categoryKey];
        setTempSelectedValues(newSelectedValues);
      } else {
        setTempSelectedValues({ ...tempSelectedValues, [categoryKey]: item });
      }
      return;
    }

    // Multi-Select Logic (remains the same)
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
    if (newCategoryValues.length === 0) {
      delete newSelectedValues[categoryKey];
    }
    setTempSelectedValues(newSelectedValues);
  };

  const isItemSelected = (categoryKey, item, categoryType) => {
    if (categoryType === "radio-single") {
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
    if (!query || !category.searchable) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSearchChange = (categoryKey, value) => {
    setSearchQueries((prev) => ({ ...prev, [categoryKey]: value }));
  };

  const getTotalSelectedCount = () => {
    return Object.keys(tempSelectedValues).reduce((acc, key) => {
      const category = categories.find((c) => c.key === key);
      const categoryType = category?.type || "checkbox-multi";
      if (categoryType === "radio-single") {
        return acc + (tempSelectedValues[key] ? 1 : 0);
      }
      return acc + (tempSelectedValues[key]?.length || 0);
    }, 0);
  };

  const handleMouseEnter = (categoryKey) => {
    if (hoverTimeouts.current[categoryKey])
      clearTimeout(hoverTimeouts.current[categoryKey]);
    setOpenPopovers((prev) => ({ ...prev, [categoryKey]: true }));
  };

  const handleMouseLeave = (categoryKey) => {
    hoverTimeouts.current[categoryKey] = setTimeout(() => {
      setOpenPopovers((prev) => ({ ...prev, [categoryKey]: false }));
    }, 25);
  };

  useEffect(() => {
    return () => {
      Object.values(hoverTimeouts.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
    };
  }, []);

  const renderTrigger = () => {
    const totalSelected = getTotalSelectedCount();
    if (!trigger) {
      return (
        <button
          className={cn(
            "flex h-8 w-[104px] flex-row items-center justify-between gap-2 rounded-md border px-3 transition-colors duration-150 focus:outline-none",
            disabled
              ? "cursor-not-allowed border-neutral-600 bg-neutral-200"
              : totalSelected > 0
                ? "border-primary-700 bg-white hover:border-primary-700 hover:bg-gray-50"
                : "border-neutral-600 bg-white hover:border-primary-700 hover:bg-gray-50"
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
            src="/icons/datatable-filter.svg"
            height={14.33}
            width={14.33}
            className={
              totalSelected > 0 && !disabled
                ? "text-primary-700"
                : "text-neutral-700"
            }
          />
        </button>
      );
    }
    if (typeof trigger === "function") {
      return trigger({ selectedCount: totalSelected, disabled });
    }
    return trigger;
  };

  const handleOpenChange = (open) => {
    if (!open) {
      setSearchQueries({});
      if (
        JSON.stringify(tempSelectedValues) !== JSON.stringify(selectedValues)
      ) {
        onSelectionChange?.(tempSelectedValues);
      }
    } else {
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
          const categoryType = category.type || "checkbox-multi"; // Default to checkbox
          return (
            <Popover.Root
              key={category.key}
              open={openPopovers[category.key] || false}
              onOpenChange={(open) =>
                setOpenPopovers((prev) => ({ ...prev, [category.key]: open }))
              }
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
                  <span className="text-xs font-medium">{category.label}</span>
                  <ChevronRight size={16} className="text-neutral-700" />
                </div>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  side="right"
                  align="start"
                  sideOffset={4}
                  className="z-50 w-full min-w-[194px] overflow-hidden rounded-md border border-neutral-400 bg-white shadow-muat"
                  onMouseEnter={() => handleMouseEnter(category.key)}
                  onMouseLeave={() => handleMouseLeave(category.key)}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  {category.searchable && (
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
                          left: (
                            <IconComponent
                              src="/icons/datatable-search.svg"
                              width={12}
                            />
                          ),
                          right: searchQueries[category.key] ? (
                            <button
                              onClick={() =>
                                handleSearchChange(category.key, "")
                              }
                            >
                              <X className="h-3 w-3" />
                            </button>
                          ) : null,
                        }}
                        appearance={{
                          containerClassName: "h-8",
                          inputClassName: "text-xs font-medium mt-0",
                        }}
                      />
                    </div>
                  )}
                  <div className="overflow-y-auto" style={{ maxHeight }}>
                    {getFilteredItems(category.key, category).length === 0 ? (
                      <div className="py-2 text-center text-xs font-medium">
                        {emptyMessage}
                      </div>
                    ) : (
                      getFilteredItems(category.key, category).map((item) => (
                        <div
                          key={item.id}
                          onClick={() =>
                            handleItemToggle(category.key, item, categoryType)
                          }
                          className={cn(
                            "flex h-8 items-center px-3 hover:cursor-pointer hover:bg-neutral-100",
                            itemClassName
                          )}
                        >
                          {categoryType === "radio-single" ? (
                            <RadioButton
                              checked={isItemSelected(
                                category.key,
                                item,
                                categoryType
                              )}
                              name={`${category.key}-filter`}
                              value={item.id}
                              className="pointer-events-none w-full"
                            >
                              <div className="flex items-center gap-1">
                                {item.icon && (
                                  <IconComponent
                                    src={item.icon}
                                    width={14}
                                    height={14}
                                  />
                                )}
                                <span className="text-xs font-medium">
                                  {item.label}
                                </span>
                              </div>
                            </RadioButton>
                          ) : (
                            <Checkbox
                              checked={isItemSelected(
                                category.key,
                                item,
                                categoryType
                              )}
                              value={item.id}
                              className="pointer-events-none w-full"
                              appearance={{
                                labelClassName:
                                  "text-xs font-medium line-clamp-2 break-all",
                              }}
                            >
                              <div className="flex items-center gap-1">
                                {item.icon && (
                                  <IconComponent
                                    src={item.icon}
                                    width={14}
                                    height={14}
                                  />
                                )}
                                <span>{item.label}</span>
                              </div>
                            </Checkbox>
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

export default DashboardFilter;
