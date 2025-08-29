"use client";

import { useEffect, useState } from "react";

import { ChevronDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";

// 1. Import Radix-based Popover
import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";
import { idrFormat } from "@/lib/utils/formatters";

/**
 * A dropdown component for selecting shipping couriers, with support for insurance.
 * Refactored to use Radix UI Popover for robust and simplified implementation.
 */
export const DropdownJasaPengiriman = ({
  shippingOptions = [],
  value = null,
  onChange = () => {},
  placeholder = "Pilih Ekspedisi",
  className = "",
  disabled = false,
  insuranceText = "Pakai Asuransi Pengiriman",
  errorMessage = null,
}) => {
  const { t } = useTranslation();

  // Move default props inside component to access t() function
  const defaultPlaceholder =
    placeholder === "Pilih Ekspedisi"
      ? t("DropdownJasaPengiriman.placeholder", {}, "Pilih Ekspedisi")
      : placeholder;

  const defaultInsuranceText =
    insuranceText === "Pakai Asuransi Pengiriman"
      ? t(
          "DropdownJasaPengiriman.insuranceText",
          {},
          "Pakai Asuransi Pengiriman"
        )
      : insuranceText;

  // 2. State is simplified. We only need to manage the open state and the selected data.
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value?.expedition);
  const [hasInsurance, setHasInsurance] = useState(
    value?.hasInsurance || false
  );

  // 3. All manual positioning logic (useEffect, useLayoutEffect, refs) has been removed.

  useEffect(() => {
    if (value) {
      setSelectedOption(value.expedition);
      setHasInsurance(value.hasInsurance || false);
    } else {
      setSelectedOption(null);
      setHasInsurance(false);
    }
  }, [value]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange({
      expedition: option,
      hasInsurance: hasInsurance,
      insurancePrice: option.originalInsurance,
    });
  };

  const handleInsuranceChange = (e) => {
    e.stopPropagation();
    const newInsuranceState = e.target.checked;
    setHasInsurance(newInsuranceState);

    if (selectedOption) {
      onChange({
        expedition: selectedOption,
        hasInsurance: newInsuranceState,
        insurancePrice: selectedOption.originalInsurance,
      });
    }
  };

  // This is the detailed view when an option is selected and the dropdown is closed.
  const SelectedStateDisplay = () => (
    <div className={cn("w-full", className)}>
      <div className="flex h-16 w-full flex-col justify-center gap-2 rounded-md border border-neutral-600 bg-white p-3">
        <div className="flex h-4 items-center gap-2">
          <span className="flex-1 text-xs font-medium leading-[14px] text-neutral-900">
            {selectedOption.courierName || selectedOption.name}
          </span>
          <span className="text-right text-xs font-medium leading-[14px] text-neutral-900">
            {idrFormat(selectedOption.originalCost || selectedOption.price)}
          </span>
          {/* This button becomes the trigger to re-open the popover */}
          <PopoverTrigger
            onClick={() => !disabled && setIsOpen(true)}
            className="flex h-4 w-4 items-center justify-center text-neutral-700 hover:text-neutral-900"
          >
            <ChevronDown className="h-4 w-4" />
          </PopoverTrigger>
        </div>
        <div className="flex h-4 items-center gap-2">
          <input
            type="checkbox"
            id={`insurance-${selectedOption.id}`}
            checked={hasInsurance}
            onChange={handleInsuranceChange}
            className="h-4 w-4 rounded border-neutral-600 text-primary-700 focus:ring-primary-700"
          />
          <label
            htmlFor={`insurance-${selectedOption.id}`}
            className="cursor-pointer text-xs font-medium leading-[14px] text-neutral-900"
          >
            {defaultInsuranceText}{" "}
            <span className="text-primary-700">
              ({idrFormat(selectedOption.originalInsurance)})
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  // This is the default view when no option is selected or the dropdown is open.
  const DefaultTrigger = () => (
    <PopoverTrigger
      asChild
      disabled={disabled}
      className={cn("w-full max-w-[424px]", className)}
    >
      <button
        type="button"
        className={cn(
          "flex h-8 w-full items-center justify-between gap-2 rounded-md border px-3 py-0 text-left text-xs font-medium leading-[120%] text-neutral-600 transition-colors",
          disabled &&
            "cursor-not-allowed border-neutral-300 bg-neutral-200 text-neutral-400",
          !disabled && "hover:border-primary-700",
          isOpen && "border-primary-700 text-neutral-900",
          !isOpen && "border-neutral-600",
          errorMessage && "border-error-500"
        )}
      >
        <span className="flex-1 truncate text-xs leading-[14px]">
          {selectedOption?.courierName || defaultPlaceholder}
        </span>
        <ChevronDown className="h-4 w-4 flex-shrink-0 text-neutral-700" />
      </button>
    </PopoverTrigger>
  );

  return (
    // 4. Wrap the entire component in the Popover root.
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      {selectedOption && !isOpen ? (
        <SelectedStateDisplay />
      ) : (
        <DefaultTrigger />
      )}

      {errorMessage && !isOpen && (
        <span className="mt-2 text-xs text-error-500">{errorMessage}</span>
      )}

      {/* 5. The dropdown content is placed inside PopoverContent. */}
      <PopoverContent
        className="mt-1 max-h-64 overflow-y-auto rounded-md border border-neutral-300 bg-white p-0 shadow-lg"
        style={{ width: "var(--radix-popover-trigger-width)" }}
        align="start"
        sideOffset={4}
      >
        {shippingOptions.length > 0 ? (
          shippingOptions.map((group, groupIndex) => (
            <div key={groupIndex}>
              <div className="border-b border-neutral-200 px-2.5 py-3">
                <span className="text-xs font-bold leading-[14px] text-neutral-900">
                  {group.groupName}
                </span>
              </div>
              {group.expeditions.map((expedition) => (
                <button
                  key={expedition.id}
                  type="button"
                  onClick={() => handleSelect(expedition)}
                  className={cn(
                    "flex w-full items-center justify-between px-2.5 py-3 pl-7 text-left transition-colors hover:bg-neutral-50",
                    selectedOption?.id === expedition.id && "bg-primary-50"
                  )}
                >
                  <span className="flex-1 text-xs font-medium leading-[14px] text-neutral-900">
                    {expedition.courierName}
                  </span>
                  <span className="text-right text-xs font-medium leading-[14px] text-neutral-900">
                    {idrFormat(expedition.originalCost)}
                  </span>
                </button>
              ))}
            </div>
          ))
        ) : (
          <div className="flex h-[66px] items-center justify-center px-2.5">
            <p className="text-center text-xs font-medium leading-[14.4px] text-neutral-900">
              {t(
                "DropdownJasaPengiriman.noShippingMessage",
                {},
                "Saat ini, kami belum bisa mengirim ke alamat tersebut."
              )}
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
