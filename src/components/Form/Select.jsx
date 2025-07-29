"use client";

import { forwardRef } from "react";

import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDownIcon } from "lucide-react";

import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

/**
 * @param {React.ComponentProps<typeof SelectPrimitive.Item> & { className?: string, children: React.ReactNode }} props
 */
const SelectItem = ({ className, children, ...props }) => {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-2.5 px-2.5 py-3 text-left text-xs leading-[14.4px] transition-colors duration-150",
        "font-medium text-black outline-none hover:border-none hover:bg-neutral-200 hover:outline-none",
        "data-[state=checked]:bg-neutral-50 data-[state=checked]:font-semibold data-[state=checked]:text-black",
        className
      )}
      {...props}
    >
      <span className="absolute right-2.5 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <IconComponent
            src={"/icons/check-circle16.svg"}
            className="text-[#176CF7]"
            width={16}
            height={16}
          />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
};

export const Select = forwardRef(
  (
    {
      options = [],
      value,
      onChange,
      placeholder = "Select item...",
      notFoundText = "No options available",
      disabled = false,
      className = "w-full",
      errorMessage = null,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation();
    return (
      <div className="relative flex flex-col gap-2">
        <SelectPrimitive.Root
          data-slot="select"
          value={value}
          onValueChange={onChange}
          disabled={disabled}
          {...props}
        >
          <SelectPrimitive.Trigger
            data-slot="select-trigger"
            data-size={"sm"}
            className={cn(
              "flex h-8 items-center justify-between gap-2 rounded-md border px-3 text-xs font-medium leading-[14.4px] transition-colors duration-200",
              "bg-white text-black focus:outline-none focus:ring-1 focus:ring-primary-700/20",
              "border-neutral-600 hover:border-primary-700 data-[state=open]:border-primary-700",
              errorMessage && "border-red-500 focus:border-red-500",
              disabled && "cursor-not-allowed bg-gray-50 opacity-50",
              !value && "text-neutral-600",
              className
            )}
          >
            <SelectPrimitive.Value
              data-slot="select-value"
              placeholder={placeholder}
              className="flex-1 truncate text-left placeholder:text-neutral-600"
            />
            <SelectPrimitive.Icon asChild>
              <ChevronDownIcon className="size-4 opacity-50 transition-transform duration-200 data-[state=open]:rotate-180" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              ref={ref}
              data-slot="select-content"
              className={cn(
                "z-50 overflow-hidden rounded-md border border-neutral-300 bg-white text-xs font-medium shadow-lg",
                "max-h-64"
              )}
              position="popper"
              sideOffset={4}
            >
              <SelectPrimitive.Viewport
                className={cn(
                  "w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1 p-0"
                )}
              >
                {options.length === 0 ? (
                  <div className="px-2.5 py-3 text-xs text-gray-500">
                    {notFoundText}
                  </div>
                ) : (
                  options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                )}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        {errorMessage && (
          <span className="text-xs font-medium text-error-400">
            {t(errorMessage)}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
