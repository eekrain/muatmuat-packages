"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, Search } from "lucide-react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

// Context for Select state management
const SelectContext = createContext(null);

const useSelect = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within Select.Root");
  }
  return context;
};

// Root component
const SelectRoot = ({
  value,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  disabled = false,
  onSearch,
  children,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  const contextValue = {
    value,
    onValueChange,
    open: isOpen,
    onOpenChange: setIsOpen,
    disabled,
    searchTerm,
    setSearchTerm,
    onSearch,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        {children}
      </Popover.Root>
    </SelectContext.Provider>
  );
};

// Trigger component
const SelectTrigger = ({
  placeholder = "Select option...",
  className,
  children,
  errorMessage,
  isError = false,
  onFocus,
}) => {
  const { value, disabled, open } = useSelect();

  return (
    <div className="w-full">
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          onFocus={onFocus}
          onMouseDown={onFocus}
          className={cn(
            "flex h-8 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-xs font-medium leading-[14.4px] transition-colors duration-200",
            disabled &&
              "cursor-not-allowed border-neutral-400 bg-neutral-100 text-neutral-500",
            open && "border-primary-700 text-neutral-900",
            !open &&
              "border-neutral-600 text-neutral-900 hover:border-primary-700",
            (errorMessage || isError) && "border-error-400",
            className
          )}
        >
          <span
            className={cn("truncate text-left", !value && "text-neutral-600")}
          >
            {children || placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-neutral-700 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </Popover.Trigger>
      {errorMessage && (
        <p className="mt-2 text-xs font-medium leading-[1.2] text-error-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

// Content component
const SelectContent = ({
  children,
  className,
  maxHeight = "238px",
  searchable = false,
  searchPlaceholder = "Search...",
  onAddNew,
  addNewText = "Add new item",
  sideOffset = 4,
  align = "start",
}) => {
  const { searchTerm, setSearchTerm, onSearch } = useSelect();
  const searchInputRef = useRef(null);
  const contentRef = useRef(null);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchable]);

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    // If onSearch is provided, call it with the search term
    // This allows external search handling (e.g., API calls)
    if (onSearch) {
      onSearch(newSearchTerm);
    }
  };

  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew(searchTerm);
      setSearchTerm("");
    }
  };

  return (
    <Popover.Content
      sideOffset={sideOffset}
      align={align}
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
          <div className="flex h-8 items-center gap-2 rounded-md border border-neutral-600 bg-white px-3 focus-within:border-primary-700 hover:border-primary-700">
            <Search className="h-4 w-4 flex-shrink-0 text-neutral-700" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
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
                  src="/icons/close24.svg"
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
      {onAddNew && searchTerm && (
        <div className="px-2.5">
          <button
            type="button"
            onClick={handleAddNew}
            className="flex h-[26px] w-full items-center gap-2 border-b border-neutral-400 hover:bg-neutral-100"
          >
            <IconComponent
              src="/icons/add16.svg"
              width={14}
              height={14}
              className="flex-shrink-0 text-primary-700"
            />
            <span className="text-xs font-medium text-neutral-900">
              {addNewText}
            </span>
          </button>
        </div>
      )}

      {/* Options List */}
      <div
        ref={contentRef}
        className="flex flex-col overflow-y-auto rounded-b-md"
        style={{ maxHeight: `calc(${maxHeight} - 60px)` }}
      >
        {children}
      </div>
    </Popover.Content>
  );
};

// Item component
const SelectItem = ({
  value,
  children,
  className,
  disabled = false,
  textValue,
  showCheckIcon = true,
  // height = "h-8",
}) => {
  const {
    value: selectedValue,
    onValueChange,
    onOpenChange,
    searchTerm,
    onSearch,
  } = useSelect();

  const handleSelect = () => {
    if (!disabled) {
      onValueChange?.(value);
      onOpenChange?.(false);
    }
  };

  // Filter based on search term if provided
  // Only filter internally if onSearch is NOT provided
  const itemText = textValue || (typeof children === "string" ? children : "");
  const shouldShow =
    !searchTerm ||
    onSearch || // If external search is used, always show (filtering handled externally)
    itemText.toLowerCase().includes(searchTerm.toLowerCase());

  if (!shouldShow) {
    return null;
  }

  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      onClick={handleSelect}
      disabled={disabled}
      role="option"
      aria-selected={isSelected ? "true" : "false"}
      className={cn(
        "group",
        "flex w-full cursor-pointer items-center justify-between px-2.5 text-left transition-colors hover:bg-neutral-200",

        disabled && "cursor-not-allowed opacity-50",
        isSelected && "bg-neutral-100",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
      {showCheckIcon && isSelected && (
        <IconComponent
          src="/icons/check-circle16.svg"
          className="ml-2 h-4 w-4 flex-shrink-0 text-primary-700"
        />
      )}
    </button>
  );
};

// Group component for organizing items
const SelectGroup = ({ children, label }) => {
  return (
    <div>
      {label && (
        <div className="px-2.5 py-1.5">
          <span className="text-xs font-semibold text-neutral-700">
            {label}
          </span>
        </div>
      )}
      {children}
    </div>
  );
};

// Separator component
const SelectSeparator = ({ className }) => {
  return <div className={cn("mx-2.5 my-1 h-px bg-neutral-300", className)} />;
};

// Value component for custom display
const SelectValue = ({ placeholder, className, children }) => {
  const { value } = useSelect();

  return (
    <span className={cn("truncate", !value && "text-neutral-600", className)}>
      {children || value || placeholder}
    </span>
  );
};

// Empty state component
const SelectEmpty = ({ children = "No results found.", className }) => {
  return (
    <div
      className={cn(
        "inline-flex h-[42px] w-full items-center justify-center text-xs font-medium text-neutral-900",
        className
      )}
    >
      {children}
    </div>
  );
};

// Export compound component
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  Group: SelectGroup,
  Separator: SelectSeparator,
  Value: SelectValue,
  Empty: SelectEmpty,
};

export default Select;
