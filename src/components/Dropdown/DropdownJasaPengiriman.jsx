import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Portal } from "@radix-ui/react-portal";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { idrFormat } from "@/lib/utils/formatters";

import { useRegisterModalPortalNode } from "../Modal/useRegisterModalPortalNode";

export const DropdownJasaPengiriman = ({
  shippingOptions = [], // New prop for grouped shipping options
  value = null,
  onChange = () => {},
  placeholder = "Pilih Ekspedisi",
  className = "",
  disabled = false,
  insuranceText = "Pakai Asuransi Pengiriman",
  errorMessage = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const scrollParentRef = useRef(null);

  // Get the callback ref from the hook
  const setDropdownRef = useRegisterModalPortalNode(dropdownRef, [isOpen]);

  // Function to find the first scrollable parent
  const getScrollParent = useCallback((node) => {
    if (node == null) {
      return document.documentElement;
    }
    const { overflow, overflowY } = window.getComputedStyle(node);
    const isScrollable =
      overflow.includes("auto") ||
      overflow.includes("scroll") ||
      overflowY.includes("auto") ||
      overflowY.includes("scroll");

    if (isScrollable && node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      if (node.parentNode === document.body) {
        return document.documentElement;
      }
      return getScrollParent(node.parentNode);
    }
  }, []);

  useEffect(() => {
    if (buttonRef.current) {
      scrollParentRef.current = getScrollParent(buttonRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Function to update dropdown position
  const updateDropdownPosition = () => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const scrollParent = scrollParentRef.current || document.documentElement;
      const scrollParentRect = scrollParent.getBoundingClientRect();

      // Check if the button is outside the scrollable parent's viewport
      if (
        buttonRect.bottom < scrollParentRect.top ||
        buttonRect.top > scrollParentRect.bottom
      ) {
        setIsOpen(false);
        return;
      }

      setDropdownStyle({
        position: "fixed",
        top: buttonRect.bottom,
        left: buttonRect.left,
        width: buttonRect.width,
        zIndex: 9999,
      });
    }
  };

  // Calculate position and width for the dropdown
  useLayoutEffect(() => {
    updateDropdownPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Update dropdown position on scroll and resize
  useEffect(() => {
    if (!isOpen) return;

    const scrollParent = scrollParentRef.current || window;

    const handleScrollOrResize = () => {
      updateDropdownPosition();
    };
    scrollParent.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      scrollParent.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Click outside handler
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
      <div className={`w-full ${className}`}>
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
              ref={buttonRef}
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

  // Dropdown content
  const dropdown = (
    <div
      ref={setDropdownRef}
      style={dropdownStyle}
      className="mt-1 overflow-hidden rounded-md border border-neutral-300 bg-white shadow-lg"
    >
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
                className={`flex w-full items-center justify-between px-2.5 py-3 pl-7 text-left transition-colors hover:bg-neutral-50 ${
                  selectedOption?.id === expedition.id ? "bg-primary-50" : ""
                } `}
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
  );

  return (
    <div className={`relative w-full max-w-[424px] ${className}`}>
      {/* Main Field */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          "flex h-8 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 py-0 text-left text-xs font-medium leading-[120%] transition-colors",
          disabled && "cursor-not-allowed border-neutral-300 text-neutral-400",
          isOpen && "border-primary-700 text-neutral-900",
          !isOpen &&
            "border-primary-700 text-neutral-600 hover:text-neutral-900",
          errorMessage && "border-red-500 focus:border-red-500"
        )}
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

      {errorMessage && (
        <span className="mt-2 text-xs text-red-500">{errorMessage}</span>
      )}

      {/* Portal Dropdown */}
      {isOpen && dropdownStyle && (
        <Portal>
          <div>{dropdown}</div>
        </Portal>
      )}
    </div>
  );
};
