"use client";

import Image from "next/image";
import { createContext, useContext, useState } from "react";

import { cn } from "@/lib/utils";

// Context for managing tab state
const MonitoringTabsContext = createContext();

// Custom hook to use tabs context
export const useMonitoringTabs = () => {
  const context = useContext(MonitoringTabsContext);
  if (!context) {
    throw new Error(
      "MonitoringTab components must be used within a MonitoringTabs provider"
    );
  }
  return context;
};

// Main MonitoringTabs component
export const MonitoringTabs = ({
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
    <MonitoringTabsContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
      }}
    >
      <div className={cn("flex h-full flex-col", className)} {...props}>
        {children}
      </div>
    </MonitoringTabsContext.Provider>
  );
};

// MonitoringTabsList component - container for tab triggers
export const MonitoringTabsList = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "flex h-12 w-full flex-row items-start bg-white",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// MonitoringTabTrigger component - individual tab button with icon
export const MonitoringTabTrigger = ({
  value,
  className,
  children,
  icon,
  iconAlt,
  disabled = false,
  activeColor = "muat-trans-primary-400",
  activeBg = "muat-trans-primary-50",
  position = "left", // left, middle, right
  ...props
}) => {
  const { value: selectedValue, onValueChange } = useMonitoringTabs();
  const isActive = selectedValue === value;

  // Determine border classes based on position
  const getBorderClasses = () => {
    if (position === "left") {
      return "border-r";
    }
    if (position === "right") {
      return "border-l";
    }
    return "border-l border-r";
  };

  // Build active classes
  const getActiveClasses = () => {
    if (isActive) {
      if (activeColor === "red-500") {
        return "border-b-2 border-b-red-500 bg-white text-red-600";
      }
      return `border-b-2 border-b-${activeColor} bg-${activeBg}`;
    }
    return "bg-gray-50 text-gray-600 hover:bg-gray-100";
  };

  return (
    <button
      className={cn(
        "flex h-full flex-1 items-center justify-center border-b-2 transition-colors",
        getBorderClasses(),
        getActiveClasses(),
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      onClick={() => !disabled && onValueChange(value)}
      disabled={disabled}
      {...props}
    >
      <div className="flex h-2 flex-row items-center gap-2">
        {icon && (
          <Image src={icon} alt={iconAlt || ""} width={20} height={20} />
        )}
        <span
          className="text-xs font-bold leading-[120%] text-black"
          style={{
            fontFamily: "Avenir Next LT Pro",
          }}
        >
          {children}
        </span>
      </div>
    </button>
  );
};

// MonitoringTabsContent component - content for each tab
export const MonitoringTabsContent = ({
  value,
  className,
  children,
  ...props
}) => {
  const { value: selectedValue } = useMonitoringTabs();

  if (selectedValue !== value) {
    return null;
  }

  return (
    <div className={cn("flex-1 overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
};
