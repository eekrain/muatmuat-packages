import { useEffect, useRef, useState } from "react";

import { Check, ChevronDown, Plus, Search } from "lucide-react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

export const DropdownSearch = ({
  placeholder = "Pilih Muatan",
  options = [],
  value = null,
  onChange = () => {},
  onAddNew = null,
  addNewText = "Tambah Nama Muatan",
  className = "",
  disabled = false,
  searchable = true,
  maxHeight = "238px",
  errorMessage = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState(value);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Update selected option when value prop changes
  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm("");
    }
  };

  const handleOptionSelect = (option) => {
    console.log("🚀 ~ handleOptionSelect ~ option:", option);
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew(searchTerm);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div ref={dropdownRef} className={cn("relative inline-block", className)}>
      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={handleToggleDropdown}
        disabled={disabled}
        className={cn(
          "flex h-8 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-xs font-medium leading-[14.4px] transition-colors duration-200",
          disabled &&
            "cursor-not-allowed border-neutral-400 bg-neutral-100 text-neutral-500",
          isOpen && "border-primary-700 text-neutral-900",
          !isOpen &&
            "border-neutral-600 text-neutral-900 hover:border-primary-700",
          errorMessage && "border-red-500"
        )}
      >
        <span
          className={cn(
            "truncate",
            !selectedOption?.label && "text-neutral-600"
          )}
        >
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-neutral-700 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full overflow-y-auto rounded-md border border-neutral-400 bg-white shadow-lg"
          style={{ maxHeight }}
        >
          <div className="flex flex-col">
            {/* Search Input */}
            {searchable && (
              <div className="p-2.5">
                <div className="flex h-8 items-center gap-2 rounded-md border border-neutral-600 bg-white px-3">
                  <Search className="h-4 w-4 flex-shrink-0 text-neutral-700" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Cari Nama Muatan"
                    className="min-w-0 flex-1 bg-transparent text-xs font-medium placeholder-neutral-600 outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="flex-shrink-0 rounded hover:bg-neutral-100"
                      type="button"
                      aria-label="Clear search"
                    >
                      <IconComponent
                        src="/icons/silang.svg"
                        width={16}
                        height={16}
                        className="fill-neutral-700"
                      />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Add New Option */}
            {onAddNew && (
              <div className="">
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="flex w-full items-center gap-2 px-2.5 py-3 text-left transition-colors hover:bg-neutral-50"
                >
                  <div className="flex w-full items-center gap-2 border-b border-neutral-400 px-0 pb-3">
                    <Plus className="h-3.5 w-3.5 flex-shrink-0 text-primary-700" />
                    <span className="text-xs font-medium text-neutral-900">
                      {addNewText}
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Options List */}
            <div>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value || index}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className={cn(
                      "flex w-full items-center justify-between px-2.5 py-3 text-left transition-colors hover:bg-neutral-50"
                    )}
                  >
                    <span className="truncate text-xs font-medium text-neutral-900">
                      {option.label}
                    </span>
                    {selectedOption?.value &&
                    selectedOption.value === option.value ? (
                      <Check className="ml-2 h-4 w-4 flex-shrink-0 text-primary-700" />
                    ) : selectedOption.label === option.label ? (
                      <Check className="ml-2 h-4 w-4 flex-shrink-0 text-primary-700" />
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="px-2.5 py-3 text-center text-xs font-medium text-neutral-600">
                  Data Tidak Ditemukan
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {errorMessage && (
        <p className="mt-2 text-xs font-medium leading-[1.2] text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
};
