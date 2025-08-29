import { useEffect, useRef, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import RadioButton from "@/components/Radio/RadioButton";

import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

const MultilevelSelect = ({ options, value, onChange, disabled }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFirstLevelItem, setActiveFirstLevelItem] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setActiveFirstLevelItem(null); // Reset active item when dropdown closes
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (firstLevelItem, secondLevelItem) => {
    // Only leaf nodes (without children) can be selected
    if (secondLevelItem && !secondLevelItem.children) {
      onChange({
        name: firstLevelItem.key,
        value: secondLevelItem.value,
      });
      setIsOpen(false);
    }
  };

  const handleFirstLevelHover = (option) => setActiveFirstLevelItem(option);

  // Find the children of the active first level item
  const getSecondLevelOptions = () => {
    if (!activeFirstLevelItem) return [];
    const activeItem = options.find(
      (opt) => opt.key === activeFirstLevelItem.key
    );
    return activeItem?.children || [];
  };

  // Find the index of the active first level item
  const getActiveFirstLevelIndex = () => {
    return options.findIndex((opt) => opt.key === activeFirstLevelItem.key);
  };

  // Calculate top position for second level based on active first level index
  const getSecondLevelTopPosition = () => {
    const activeIndex = getActiveFirstLevelIndex();
    // Each item is 32px in height
    return activeIndex * 32;
  };

  // Render first level menu
  const renderFirstLevel = () => {
    return (
      <div
        className="rounded-md border border-neutral-400 bg-neutral-50 shadow-muat"
        style={{
          position: "relative",
          width: "194px",
          zIndex: 1,
        }}
      >
        {options.map((option, key) => {
          const hasChildren = option.children && option.children.length > 0;

          return (
            <div
              key={key}
              className="flex h-8 cursor-pointer items-center justify-between px-2.5 hover:bg-neutral-200"
              onMouseEnter={() => handleFirstLevelHover(option)}
              onClick={() => !hasChildren && handleSelect(option)}
            >
              <div className="max-w-[148px] truncate text-xs font-semibold leading-[14.4px] text-neutral-900">
                {t(`MultilevelSelect.${option.key}`, {}, option.label)}
              </div>
              {hasChildren && <IconComponent src="/icons/chevron-right.svg" />}
            </div>
          );
        })}
      </div>
    );
  };

  // Render second level menu
  const renderSecondLevel = () => {
    // Only render if an item from first level is active
    if (!activeFirstLevelItem) return null;

    const secondLevelOptions = getSecondLevelOptions();
    if (!secondLevelOptions.length) return null;

    // Determine if we need wider width for many items
    const hasMoreThan5Items = secondLevelOptions.length > 5;

    return (
      <div
        className={cn(
          "absolute left-[194px] z-[2] -ml-[1px] max-h-[160px] rounded-md border border-neutral-400 bg-neutral-50 shadow-muat",
          hasMoreThan5Items ? "w-[225px]" : "w-[180px]"
        )}
        style={{
          top: `${getSecondLevelTopPosition()}px`,
        }}
      >
        <div
          className={cn(
            "max-h-[160px] overflow-auto",
            hasMoreThan5Items ? "mr-[3px]" : ""
          )}
          style={{
            top: `${getSecondLevelTopPosition()}px`,
          }}
        >
          {secondLevelOptions.map((option, key) => {
            const isSelected = option.value === value;

            return (
              <div
                key={key}
                className="flex h-8 cursor-pointer items-center pl-2.5 hover:bg-neutral-200"
                onClick={() => handleSelect(activeFirstLevelItem, option)}
              >
                <RadioButton
                  name="statusFilter"
                  label={t(
                    `MultilevelSelect.${activeFirstLevelItem.key}.${option.key}`,
                    {},
                    option.label
                  )}
                  checked={isSelected}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const isActive = useShallowMemo(
    () =>
      options
        .flatMap((item) => item.children || [])
        .some((item) => item.value === value),
    [options, value]
  );

  return (
    <div ref={dropdownRef} style={{ width: "110px", position: "relative" }}>
      {/* Select Button */}
      <button
        className={cn(
          "flex h-8 w-[110px] items-center justify-between rounded-md border bg-neutral-50 px-3",
          isActive ? "border-primary-700" : "border-neutral-600",
          disabled ? "cursor-not-allowed bg-neutral-200" : "cursor-pointer"
        )}
        disabled={disabled}
        onClick={() => {
          // Toggle dropdown and reset active item when closing
          const newIsOpen = !isOpen;
          setIsOpen(newIsOpen);
          if (!newIsOpen) {
            setActiveFirstLevelItem(null);
          }
        }}
        style={{ width: "110px" }}
      >
        <div
          className={cn(
            "truncate text-xs font-medium leading-[14.4px]",
            isActive ? "text-primary-700" : "text-neutral-600"
          )}
        >
          {t("MultilevelSelect.filterButton", {}, "Filter")}
        </div>
        <IconComponent
          className={cn(
            "text-neutral-700",
            isActive && "text-primary-700",
            disabled && "text-neutral-600"
          )}
          src="/icons/filter16.svg"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-[19] mt-1">
          {/* First Level */}
          {renderFirstLevel()}

          {/* Second Level */}
          {renderSecondLevel()}
        </div>
      )}
    </div>
  );
};

export default MultilevelSelect;
