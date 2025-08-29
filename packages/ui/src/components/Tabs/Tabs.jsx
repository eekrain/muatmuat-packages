"use client";

import { createContext, useContext, useState } from "react";

import { cn } from "@/lib/utils";

// Context for managing tab state
const TabsContext = createContext();

// Custom hook to use tabs context
export const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tab components must be used within a Tabs provider");
  }
  return context;
};

// Main Tabs component
export const Tabs = ({
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const handleValueChange = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
      }}
    >
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// TabsList component - container for tab triggers
export const TabsList = ({ className, children, ...props }) => {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
};

// TabsTrigger component - individual tab button
export const TabsTrigger = ({
  value,
  className,
  children,
  disabled = false,
  activeColor = "muat-trans-secondary-900",
  ...props
}) => {
  const { value: selectedValue, onValueChange } = useTabs();
  const isActive = selectedValue === value;

  return (
    <button
      className={cn(
        // Base styles
        "flex flex-1 items-center justify-center px-4 py-2 text-sm font-semibold transition-colors focus:outline-none",
        // Inactive state
        `text-neutral-700 hover:text-${activeColor}`,
        // Active state
        isActive &&
          `border-b-2 border-${activeColor} font-bold text-${activeColor}`,
        // Disabled state
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={() => !disabled && onValueChange(value)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// TabsContent component - content for each tab
export const TabsContent = ({ value, className, children, ...props }) => {
  const { value: selectedValue } = useTabs();

  if (selectedValue !== value) {
    return null;
  }

  return (
    <div
      className={cn(
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Enhanced TabsTrigger with separator support (based on your design)
export const TabsTriggerWithSeparator = ({
  value,
  className,
  children,
  disabled = false,
  showSeparator = true,
  activeColor = "muat-trans-secondary-900",
  ...props
}) => {
  const { value: selectedValue, onValueChange } = useTabs();
  const isActive = selectedValue === value;

  return (
    <>
      <button
        className={cn(
          // Base styles
          "mt-1 flex h-9 flex-1 items-center justify-center border-b-2 border-transparent px-4 text-sm font-semibold transition-colors duration-300 focus:outline-none",
          // Inactive state
          `text-neutral-700 hover:text-${activeColor}`,
          // Active state
          // Disabled state
          disabled && "cursor-not-allowed opacity-50",
          className,
          isActive && ` border-${activeColor} font-bold text-${activeColor}`
        )}
        onClick={() => !disabled && onValueChange(value)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
      {showSeparator && <div className="mx-1 h-5 w-px bg-neutral-400" />}
    </>
  );
};
