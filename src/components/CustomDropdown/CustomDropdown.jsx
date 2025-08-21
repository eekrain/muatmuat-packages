"use client";

import { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";

import Checkbox from "../Form/Checkbox";
import IconComponent from "../IconComponent/IconComponent";

const CustomDropdown = ({
  options = [],
  placeholder = "Select value",
  searchPlaceholder = "Search...",
  isMultipleSelected = false,
  onSelected = () => {},
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
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

  // Filter options based on search
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option) => {
    if (isMultipleSelected) {
      const isAlreadySelected = selected.some(
        (item) => item.value === option.value
      );
      let newSelected;

      if (isAlreadySelected) {
        newSelected = selected.filter((item) => item.value !== option.value);
      } else {
        newSelected = [...selected, option];
      }

      setSelected(newSelected);
      onSelected(newSelected);
    } else {
      setSelected([option]);
      onSelected([option]);
      setIsOpen(false);
      setSearch("");
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearch("");
      }
    }
  };

  const getDisplayText = () => {
    if (selected.length === 0) return placeholder;

    if (isMultipleSelected) {
      if (selected.length === 1) {
        return selected[0].name;
      }
      return `${selected[0].name} +${selected.length - 1}`;
    }

    return selected[0].name;
  };

  const isOptionSelected = (option) => {
    return selected.some((item) => item.value === option.value);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`flex h-8 w-full items-center justify-between rounded-md border border-neutral-600 bg-white px-3 text-xs font-medium text-neutral-900 transition-colors duration-200 hover:border-primary-700 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500`}
      >
        <span className="truncate">{getDisplayText()}</span>
        <IconComponent
          src="/icons/chevron-down.svg"
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[212px] overflow-hidden rounded-md border border-neutral-600 bg-white">
          {/* Search Input */}
          <div className="mb-2 mt-2 px-2.5">
            <div className="mb-1 w-full">
              <div className="flex h-[32px] items-center rounded border border-neutral-500 px-3 py-2.5">
                <IconComponent src="/icons/search.svg" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-full w-full flex-1 rounded px-3 py-2 text-xs text-neutral-900 outline-none placeholder:text-neutral-700 focus:outline-none"
                />
                {search && (
                  <IconComponent
                    src="/icons/silang.svg"
                    onClick={(e) => setSearch("")}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-[212px] overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar]:w-1">
            <div className="w-full] mb-3">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`flex cursor-pointer items-center gap-1 px-1 py-2 transition-colors duration-150 hover:bg-neutral-200 ${index === 0 ? "rounded-t-md" : ""} ${index === filteredOptions.length - 1 ? "rounded-b-md" : ""} `}
                  >
                    {isMultipleSelected && (
                      <Checkbox
                        checked={isOptionSelected(option)}
                        onChange={() => handleSelect(option)}
                        value={option.value}
                        label=""
                        className="ms-3 flex-shrink-0"
                      />
                    )}
                    <span className="truncate text-xs font-medium text-neutral-900">
                      {option.name}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-xs text-neutral-500">
                  Tidak ada opsi yang ditemukan
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CustomDropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  isMultipleSelected: PropTypes.bool,
  onSelected: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default CustomDropdown;
