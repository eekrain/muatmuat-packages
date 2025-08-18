import { createContext, useContext } from "react";

import Checkbox from "@/components/Form/Checkbox";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Popover/Popover";
import { cn } from "@/lib/utils";

// 1. Create Context for state management
const FilterPopoverContext = createContext(null);

const useFilterPopoverContext = () => {
  const context = useContext(FilterPopoverContext);
  if (!context) {
    throw new Error(
      "FilterPopover components must be used within a FilterPopover.Root provider"
    );
  }
  return context;
};

// 2. Define the Compound Components
const Root = ({ children, filters, onFiltersChange, onApplyFilters }) => {
  const handleReset = () => {
    const resetState = {};
    for (const category in filters) {
      resetState[category] = Object.keys(filters[category]).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {}
      );
    }
    onFiltersChange(resetState);
  };

  const handleApply = () => {
    if (onApplyFilters) onApplyFilters(filters);
  };

  const value = {
    filters,
    onFiltersChange,
    handleReset,
    handleApply,
  };

  return (
    <FilterPopoverContext.Provider value={value}>
      <Popover>{children}</Popover>
    </FilterPopoverContext.Provider>
  );
};

const Trigger = ({ children }) => (
  <PopoverTrigger asChild>{children}</PopoverTrigger>
);

const Content = ({ children, className }) => (
  <PopoverContent
    align="center"
    className={cn(
      "w-[500px] rounded-xl border-none bg-transparent p-0 drop-shadow-[0px_4px_11px_rgba(65,65,65,0.25)]",
      className
    )}
  >
    <div className="relative">
      <div className="relative z-10 flex flex-col gap-5 rounded-xl bg-white py-6">
        {children}
      </div>
    </div>
    <PopoverArrow />
  </PopoverContent>
);

const CloseButton = ({ className }) => (
  <PopoverClose
    className={cn(
      "absolute right-4 top-[18px] z-20 text-neutral-500 hover:text-neutral-800",
      className
    )}
    aria-label="Close"
  >
    <IconComponent src="/icons/close.svg" className="h-5 w-5" />
  </PopoverClose>
);

const Section = ({ title, children, className }) => (
  <section className={cn("flex flex-col gap-4 px-6", className)}>
    <h3 className="text-xs font-semibold leading-tight text-black">{title}</h3>
    <div className="flex flex-row flex-wrap gap-3">{children}</div>
  </section>
);

const CheckboxItem = ({ category, id, label, count, color }) => {
  const { filters, onFiltersChange } = useFilterPopoverContext();
  const isChecked = filters[category]?.[id] ?? false;

  return (
    <div className="flex w-[220px] items-center gap-2">
      <Checkbox
        id={`filter-${category}-${id}`}
        checked={isChecked}
        onChange={() => onFiltersChange(category, id)}
        className="size-4 flex-1"
      >
        <div className="flex items-center gap-2">
          {color && (
            <div
              className={cn("h-3 w-6 shrink-0 rounded-[4px]", color.className)}
            />
          )}
          <label
            htmlFor={`filter-${category}-${id}`}
            className="cursor-pointer text-xs font-medium leading-tight text-black"
          >
            {`${label} (${count})`}
          </label>
        </div>
      </Checkbox>
    </div>
  );
};

const Footer = ({ children, className }) => (
  <footer
    className={cn(
      "flex flex-row items-start justify-end gap-2 border-t border-[#C4C4C4] px-4 pt-5",
      className
    )}
  >
    {children}
  </footer>
);

const ResetButton = ({ children, className }) => {
  const { handleReset } = useFilterPopoverContext();
  return (
    <button
      onClick={handleReset}
      className={cn(
        "flex h-8 min-w-[112px] items-center justify-center rounded-full border border-[#461B02] bg-white px-6 text-sm font-semibold leading-tight text-[#461B02]",
        className
      )}
    >
      {children}
    </button>
  );
};

const ApplyButton = ({ children, className }) => {
  const { handleApply } = useFilterPopoverContext();
  return (
    <PopoverClose asChild>
      <button
        onClick={handleApply}
        className={cn(
          "flex h-8 min-w-[112px] items-center justify-center rounded-full bg-[#FFC217] px-6 text-sm font-semibold leading-tight text-[#461B02]",
          className
        )}
      >
        {children}
      </button>
    </PopoverClose>
  );
};

// 3. Attach all parts to the main component object
export const AgendaFilterPopover = {
  Root,
  Trigger,
  Content,
  CloseButton,
  Section,
  CheckboxItem,
  Footer,
  ResetButton,
  ApplyButton,
};
