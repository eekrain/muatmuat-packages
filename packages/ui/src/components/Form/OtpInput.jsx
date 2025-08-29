"use client";

import * as React from "react";

import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} [props.containerClassName]
 * @param {import("input-otp").OTPInputProps} props
 */
function InputOTP({ className, containerClassName, ...props }) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "has-disabled:opacity-50 flex items-center gap-3", // Increased gap from gap-2 to gap-3
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

/**
 * @param {React.ComponentPropsWithoutRef<"div">} props
 */
function InputOTPGroup({ className, ...props }) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-2", className)} // Added gap-3 for consistent spacing
      {...props}
    />
  );
}

/**
 * @param {React.ComponentPropsWithoutRef<"div"> & { index: number }} props
 */
function InputOTPSlot({ index, className, ...props }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        // Base styling - larger size and rounded corners
        "relative flex size-[30px] items-center justify-center p-0 text-center text-sm font-bold leading-[16.8px]",
        // Border and background
        "rounded-lg border border-[#868686] bg-white outline-none",
        // Active state
        "data-[active=true]:border-blue-500 data-[active=true]:ring-2 data-[active=true]:ring-blue-500/20",
        // Focus and hover states
        "transition-all duration-200 ease-in-out",
        "hover:border-gray-400",
        // Error states
        "aria-invalid:border-red-500 data-[active=true]:aria-invalid:border-red-500 data-[active=true]:aria-invalid:ring-red-500/20",
        // Remove default shadcn styling
        "shadow-sm",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

/**
 * @param {React.ComponentPropsWithoutRef<"div">} props
 */
function InputOTPSeparator({ ...props }) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className="mx-2"
      {...props}
    >
      <MinusIcon className="h-4 w-4 text-gray-400" />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
