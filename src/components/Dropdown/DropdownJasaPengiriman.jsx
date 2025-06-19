import { useEffect, useRef, useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { idrFormat } from "@/lib/utils/formatters";

export const DropdownJasaPengiriman = ({
  shippingOptions = [], // New prop for grouped shipping options
  value = null,
  onChange = () => {},
  placeholder = "Pilih Ekspedisi",
  className = "",
  disabled = false,
  insuranceText = "Pakai Asuransi Pengiriman",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);
  const [hasInsurance, setHasInsurance] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update selected option when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedOption(value.expedition);
      setHasInsurance(value.hasInsurance || false);
    }
  }, [value]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);

    // Call onChange with both expedition and insurance data
    onChange({
      expedition: option,
      hasInsurance: hasInsurance,
      insurancePrice: option.originalInsurance,
    });
  };

  const handleInsuranceChange = (e) => {
    e.stopPropagation(); // Prevent dropdown from closing
    const newInsuranceState = e.target.checked;
    setHasInsurance(newInsuranceState);

    // Call onChange with updated insurance state
    if (selectedOption) {
      onChange({
        expedition: selectedOption,
        hasInsurance: newInsuranceState,
        insurancePrice: selectedOption.originalInsurance,
      });
    }
  };

  // Render selected state
  if (selectedOption && !isOpen) {
    return (
      <div className={`w-full ${className}`} ref={dropdownRef}>
        <div className="flex h-16 w-full flex-col justify-center gap-2 rounded-md border border-neutral-600 bg-white p-3">
          {/* First row - Expedition name, price, and chevron */}
          <div className="flex h-4 items-center gap-2">
            <span className="flex-1 text-xs font-medium leading-[14px] text-neutral-900">
              {selectedOption.courierName || selectedOption.name}
            </span>
            <span className="text-right text-xs font-medium leading-[14px] text-neutral-900">
              {idrFormat(selectedOption.originalCost || selectedOption.price)}
            </span>
            <button
              onClick={handleToggle}
              className="flex h-4 w-4 items-center justify-center text-neutral-700 hover:text-neutral-900"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Second row - Insurance checkbox */}
          <div className="flex h-4 items-center gap-2">
            <input
              type="checkbox"
              id="insurance"
              checked={hasInsurance}
              onChange={handleInsuranceChange}
              className="h-4 w-4 rounded border border-neutral-600 text-primary-700 focus:ring-2 focus:ring-primary-700 focus:ring-opacity-20"
            />
            <label
              htmlFor="insurance"
              className="cursor-pointer text-xs font-medium leading-[14px] text-neutral-900"
            >
              {insuranceText}{" "}
              <span className="text-primary-700">
                ({idrFormat(selectedOption.originalInsurance)})
              </span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  const displayText = selectedOption
    ? selectedOption.courierName || selectedOption.name
    : placeholder;

  return (
    <div
      className={`relative w-full max-w-[424px] ${className}`}
      ref={dropdownRef}
    >
      {/* Main Field */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`flex h-8 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-0 text-left text-xs font-medium leading-[120%] transition-colors ${
          disabled
            ? "cursor-not-allowed border-neutral-300 text-neutral-400"
            : isOpen
              ? "border-primary-700 text-neutral-900"
              : "border-primary-700 text-neutral-600 hover:text-neutral-900"
        } focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-opacity-20`}
      >
        <span className="flex-1 truncate text-xs leading-[14px]">
          {displayText}
        </span>
        <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-neutral-700" />
          ) : (
            <ChevronDown className="h-4 w-4 text-neutral-700" />
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1">
          <div className="overflow-hidden rounded-md border border-neutral-300 bg-white shadow-lg">
            {/* Use shippingOptions if available, otherwise fall back to options */}
            <div className="max-h-64 overflow-y-auto">
              {shippingOptions?.map((group, groupIndex) => (
                <div key={groupIndex}>
                  {/* Group Header */}
                  <div className="border-b border-neutral-200 px-2.5 py-3">
                    <span className="text-xs font-bold leading-[14px] text-neutral-900">
                      {group.groupName}
                    </span>
                  </div>

                  {/* Group Options */}
                  {group.expeditions.map((expedition) => (
                    <button
                      key={expedition.id}
                      type="button"
                      onClick={() => handleSelect(expedition)}
                      className={`flex w-full items-center justify-between px-2.5 py-3 pl-7 text-left transition-colors hover:bg-neutral-50 ${selectedOption?.id === expedition.id ? "bg-primary-50" : ""} `}
                    >
                      <div className="flex-1">
                        <span className="text-xs font-medium leading-[14px] text-neutral-900">
                          {expedition.courierName}
                        </span>
                      </div>
                      <div className="flex-1 text-right">
                        <span className="text-xs font-medium leading-[14px] text-neutral-900">
                          {idrFormat(expedition.originalCost)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Scrollbar Indicator */}
            <div className="absolute bottom-0 right-0.5 top-0 w-2 rounded-sm bg-neutral-200">
              <div className="ml-0.5 mt-1 h-1 w-1 rounded-sm bg-neutral-500"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
