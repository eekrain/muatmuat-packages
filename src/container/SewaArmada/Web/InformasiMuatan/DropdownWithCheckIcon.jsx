import { forwardRef, useEffect, useRef, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

const DropdownWithCheckIcon = forwardRef(
  (
    {
      options = [],
      value = "",
      onChange = () => {},
      placeholder = "Select...",
      disabled = false,
      className = "",
      width = "w-20", // default 80px
      error = null,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    const handleSelect = (option) => {
      setIsOpen(false);
      onChange(option.value);
    };

    const getDisplayText = () => {
      if (value) {
        const selected = options.find((opt) => opt.value === value);
        return selected ? selected.label : value;
      }
      return placeholder;
    };

    return (
      <div
        ref={dropdownRef}
        className={cn("relative", width, className)}
        {...props}
      >
        <button
          ref={ref}
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            "flex h-8 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-xs font-medium leading-[14.4px] text-black transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-primary-700/20",
            "cursor-pointer border-neutral-600 hover:border-primary-700 focus:border-primary-700",
            isOpen && "border-primary-700",
            error && "border-red-500 focus:border-red-500",
            disabled && "cursor-not-allowed bg-gray-50 opacity-50"
          )}
        >
          <span className="flex-1 truncate text-left">{getDisplayText()}</span>
          <IconComponent
            src="/icons/chevron-down24.svg"
            width={16}
            height={16}
            className={isOpen ? "rotate-180" : ""}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={cn(
              "absolute left-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-md border border-neutral-300 bg-white shadow-lg",
              width
            )}
          >
            <div className="py-0">
              {options.map((option, index) => {
                const isSelected = value === option.value;
                return (
                  <button
                    key={option.value || index}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2.5 px-2.5 py-3 text-left text-xs leading-[14.4px] transition-colors duration-150",
                      isSelected
                        ? "bg-neutral-200 font-semibold text-black"
                        : "font-medium text-black hover:bg-gray-50",
                      index === 0 && "rounded-t-md",
                      index === options.length - 1 && "rounded-b-md"
                    )}
                  >
                    <span className="flex-1 truncate">{option.label}</span>
                    {isSelected && (
                      <IconComponent
                        src={"/icons/check-circle16.svg"}
                        className="text-[#176CF7]"
                      />
                    )}
                  </button>
                );
              })}

              {options.length === 0 && (
                <div className="px-2.5 py-3 text-xs text-gray-500">
                  No options available
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

DropdownWithCheckIcon.displayName = "DropdownWithCheckIcon";

export { DropdownWithCheckIcon };
