import { useEffect, useRef, useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, Plus } from "lucide-react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

const SelectFilterRadix = ({
  options = [],
  value = null,
  onChange = () => {},
  onAddNew = null,
  addLabel = "Tambah Data Baru",
  placeholder = "Pilih...",
  className = "",
  disabled = false,
  searchable = true,
  maxHeight = "238px",
  errorMessage = null,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState(value);
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!open) setSearchTerm("");
  }, [open, searchable]);

  // Update selected option when value prop changes
  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option.value);
    onChange(option.value);
    setOpen(false);
    setSearchTerm("");
  };

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew(searchTerm);
      setOpen(false);
      setSearchTerm("");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-8 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-xs font-medium leading-[14.4px] transition-colors duration-200",
            disabled &&
              "cursor-not-allowed border-neutral-400 bg-neutral-100 text-neutral-500",
            open && "border-primary-700 text-neutral-900",
            !open &&
              "border-neutral-600 text-neutral-900 hover:border-primary-700",
            errorMessage && "border-red-500",
            className
          )}
        >
          <span
            className={cn(
              "truncate",
              !options.find((opt) => opt.value === selectedOption)?.label &&
                "text-neutral-600"
            )}
          >
            {options.find((opt) => opt.value === selectedOption)?.label ||
              placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-neutral-700 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </Popover.Trigger>
      <Popover.Content
        sideOffset={4}
        align="start"
        className={cn(
          "z-50 flex w-[var(--radix-popover-trigger-width)] flex-col rounded-md border border-neutral-400 bg-white shadow-lg",
          className
        )}
        side="bottom"
        avoidCollisions={false}
        style={{ maxHeight }}
      >
        {/* Search Input */}
        {searchable && (
          <div className="p-2.5">
            <div className="flex h-8 items-center gap-2 rounded-md border border-primary-700 bg-white px-3 focus-within:border-primary-700 hover:border-primary-700">
              <svg
                className="h-4 w-4 flex-shrink-0 text-primary-700"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  d="M8.5 15.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm4.5-2 3 3"
                  stroke="#176CF7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={placeholder.replace("Pilih ", "Cari ")}
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
        {/* Options List */}
        <div className="flex flex-col overflow-y-auto rounded-b-md">
          {onAddNew && (
            <button type="button" onClick={handleAddNew} className="px-2.5">
              <div className="flex h-[26px] gap-2 border-b border-neutral-400">
                <Plus className="h-3.5 w-3.5 flex-shrink-0 text-primary-700" />
                <span className="h-[8px] text-xs font-medium text-neutral-900">
                  {addLabel}
                </span>
              </div>
            </button>
          )}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <button
                key={option.value || index}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className={cn(
                  "flex h-8 w-full cursor-pointer items-center justify-between px-2.5 text-left transition-colors hover:bg-neutral-200"
                )}
              >
                <span className="truncate text-xs font-medium text-neutral-900">
                  {option.label}
                </span>
                {selectedOption && selectedOption === option.value ? (
                  <IconComponent
                    src={"/icons/check-circle16.svg"}
                    className="ml-2 text-primary-700"
                    width={16}
                    height={16}
                  />
                ) : null}
              </button>
            ))
          ) : (
            <div className="inline-flex h-[42px] w-full items-center justify-center text-xs font-semibold text-neutral-900">
              Data Tidak Ditemukan
            </div>
          )}
        </div>
      </Popover.Content>
      {errorMessage && (
        <p className="mt-2 text-xs font-medium leading-[1.2] text-red-500">
          {errorMessage}
        </p>
      )}
    </Popover.Root>
  );
};

export default SelectFilterRadix;
