"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";
import { Select } from "../Select/Select";

export const FilterSelect = forwardRef(
  (
    {
      options = [],
      value,
      onChange,
      placeholder = "Select filter...",
      notFoundText = "No options available",
      disabled = false,
      className = "w-full",
      errorMessage = null,
      showNotificationDot = false,
      showNotificationDotWithoutNumber = false,
      itemClassName = "",
      notificationCount = 0,
      icon = null,
      displayValueOverride = null,
      renderItem = null,
      contentClassName = "",
      onFocus,
      isActive,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative flex flex-col gap-2">
        <div className="relative">
          <Select.Root
            value={value}
            onValueChange={onChange}
            disabled={disabled}
            {...props}
          >
            <Select.Trigger
              placeholder={placeholder}
              errorMessage={errorMessage}
              onFocus={onFocus}
              className={cn(
                "h-8 border-neutral-400 text-xs font-medium hover:border-neutral-500 focus:border-primary-700 data-[state=open]:border-primary-700",
                icon && "pl-9",
                className
              )}
              iconClassName={isActive && "!text-primary-700"}
              textClassName={cn(
                isActive && "!text-primary-700",
                disabled && "text-neutral-600"
              )}
            >
              <Select.Value placeholder={placeholder}>
                {displayValueOverride !== null
                  ? displayValueOverride
                  : value
                    ? options.find((option) => option.value === value)?.label ||
                      value
                    : placeholder}
              </Select.Value>
            </Select.Trigger>

            <Select.Content
              ref={ref}
              className={cn("w-auto min-w-[220px]", contentClassName)}
              maxHeight="280px"
            >
              {options.length === 0 ? (
                <Select.Empty>{notFoundText}</Select.Empty>
              ) : (
                options.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    className={cn(
                      "p-2 text-xs font-medium hover:bg-neutral-50 data-[highlighted]:bg-neutral-50 data-[state=checked]:bg-primary-50",
                      itemClassName
                    )}
                  >
                    {renderItem ? (
                      renderItem(option)
                    ) : (
                      <span className="truncate whitespace-nowrap">
                        {option.label}
                      </span>
                    )}
                  </Select.Item>
                ))
              )}
            </Select.Content>
          </Select.Root>

          {icon && (
            <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2">
              <IconComponent
                src={icon}
                width={16}
                height={16}
                className={cn(
                  "flex-shrink-0",
                  disabled ? "text-neutral-400" : "text-neutral-700"
                )}
              />
            </div>
          )}
          {showNotificationDot && notificationCount > 0 && (
            <div className="absolute -right-1 -top-1 z-10">
              <div className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {notificationCount > 99 ? "99+" : notificationCount}
              </div>
            </div>
          )}
          {showNotificationDotWithoutNumber && (
            <div className="absolute -right-[3px] -top-[3px] z-10 flex aspect-square h-2 items-center justify-center rounded-full bg-red-500"></div>
          )}
        </div>
      </div>
    );
  }
);

FilterSelect.displayName = "FilterSelect";
