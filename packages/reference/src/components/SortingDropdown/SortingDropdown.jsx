import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

const SortingDropdown = ({ onChange, options, value, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [wasSelected, setWasSelected] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setWasSelected(true);
  };

  // If initial value is not the default, consider it as selected
  useEffect(() => {
    if (value !== options[0].value) {
      setWasSelected(true);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* LB 006 Ulasan Buyer */}
      <button
        onClick={toggleDropdown}
        disabled={disabled}
        className={`flex h-[32px] items-center justify-between gap-2 rounded-md border px-3 py-2 ${
          disabled
            ? "cursor-default border border-neutral-600 bg-neutral-50 text-[#7b7b7b]"
            : isOpen || wasSelected
              ? "cursor-pointer border border-[#176CF7] text-[#176CF7] hover:border-[#176CF7]"
              : "cursor-pointer border border-neutral-600 text-neutral-700 hover:border-neutral-400"
        } min-w-[120px]`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2">
          <IconComponent
            src={
              isOpen || wasSelected
                ? "/icons/sort-active.svg"
                : "/icons/sort-gray.svg"
            }
            width={16}
            height={16}
            alt="muat"
          />
          <span className="text-sm font-medium">{selectedOption.label}</span>
        </div>
        <IconComponent
          src="/icons/chevron-down24.svg"
          width={16}
          height={16}
          alt="chevron"
          className={cn(
            "text-neutral-700 transition-transform duration-200",
            isOpen && "rotate-180",
            isOpen || wasSelected ? "text-primary-700" : "",
            disabled && "text-neutral-600"
          )}
        />

        {/* LB 006 Ulasan Buyer */}
      </button>

      {isOpen && (
        <ul
          className="absolute left-0 top-full z-10 mt-1 w-full rounded-md border border-neutral-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              className={`cursor-pointer px-3 py-2 text-sm hover:bg-neutral-100 ${value === option.value ? "bg-neutral-50 font-medium text-primary-700" : "text-neutral-700"} `}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortingDropdown;
