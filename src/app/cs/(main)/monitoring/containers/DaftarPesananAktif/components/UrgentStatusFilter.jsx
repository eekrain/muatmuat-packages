// src/components/UrgentStatusFilter/UrgentStatusFilter.jsx

"use client";

// Make sure this path is correct
import { useMemo } from "react";

import Select from "@/components/Select";
// Make sure this path is correct
import { cn } from "@/lib/utils";

// src/components/UrgentStatusFilter/UrgentStatusFilter.jsx

// src/components/UrgentStatusFilter/UrgentStatusFilter.jsx

// src/components/UrgentStatusFilter/UrgentStatusFilter.jsx

// src/components/UrgentStatusFilter/UrgentStatusFilter.jsx

// src/components/UrgentStatusFilter/UrgentStatusFilter.jsx

// src/components/UrgentStatusFilter/UrgentStatusFilter.jsx

/**
 * @description A small visual component for the blinking red dot indicator.
 */
const BlinkingDot = ({ className }) => (
  <div className={className}>
    <span className="relative flex size-1">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error-400 opacity-75"></span>
      <span className="relative inline-flex size-1 rounded-full bg-error-500"></span>
    </span>
  </div>
);

/**
 * @description This component is a specialized select filter for urgent order statuses.
 */
export const UrgentStatusFilter = ({
  availableStatuses,
  value,
  onChange,
  disabled,
  onFocus,
  className,
}) => {
  const { totalCount, showTriggerDot, options } = useMemo(() => {
    const statuses = availableStatuses || {};
    const total =
      (statuses.totalNeedChangeResponse || 0) +
      (statuses.totalNeedConfirmationReady || 0) +
      (statuses.totalNeedAssignVehicle || 0);

    const opts = [
      {
        value: "ALL_STATUS",
        label: "Semua Status (Default)",
        showDot: false,
      },
    ];

    if (statuses.hasNeedChangeResponse) {
      opts.push({
        value: "NEED_CHANGE_RESPONSE",
        label: `Perlu Respon Perubahan (${statuses.totalNeedChangeResponse || 0})`,
        showDot: true,
      });
    }
    if (statuses.hasNeedConfirmationReady) {
      opts.push({
        value: "NEED_CONFIRMATION_READY",
        label: `Perlu Konfirmasi Siap (${statuses.totalNeedConfirmationReady || 0})`,
        showDot: true,
      });
    }
    if (statuses.hasNeedAssignVehicle) {
      opts.push({
        value: "NEED_ASSIGN_VEHICLE",
        label: `Perlu Assign Armada (${statuses.totalNeedAssignVehicle || 0})`,
        showDot: true,
      });
    }

    const triggerDot = total > 0;

    return {
      totalCount: total,
      showTriggerDot: triggerDot,
      options: opts,
    };
  }, [availableStatuses]);

  // **MODIFIED LOGIC HERE**
  // This logic now determines the correct label to display in the trigger.
  const displayLabel = useMemo(() => {
    // if (value === 'ALL_STATUS' || !value) {
    //   return `Status Urgent (${totalCount > 99 ? "99+" : totalCount})`;
    // }
    const selectedOption = options.find((opt) => opt.value === value);
    // Return the label without the count, e.g., "Perlu Respon Perubahan"
    return selectedOption ? selectedOption.label : value;
  }, [value, options, totalCount]);

  const isDisabled = disabled || totalCount === 0;

  return (
    <div className={cn("relative", className)}>
      <Select.Root value={value} onValueChange={onChange} disabled={isDisabled}>
        {/* The trigger now directly renders the calculated displayLabel */}
        <Select.Trigger
          className="w-auto min-w-[150px] max-w-[180px] hover:border-primary-700"
          onFocus={onFocus}
        >
          {displayLabel}
        </Select.Trigger>
        <Select.Content className="w-[208px]">
          {options.map((option) => (
            <Select.Item
              key={option.value}
              value={option.value}
              className="h-8"
            >
              <div className="flex w-full items-center justify-between text-xs">
                <span
                  className={cn(
                    "relative",
                    value === option.value && "font-semibold"
                  )}
                >
                  {option.label}
                  {option.showDot && (
                    <BlinkingDot className="absolute -right-1 top-0" />
                  )}
                </span>
              </div>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      {showTriggerDot && !isDisabled && (
        <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-white bg-error-500" />
      )}
    </div>
  );
};

export default UrgentStatusFilter;
