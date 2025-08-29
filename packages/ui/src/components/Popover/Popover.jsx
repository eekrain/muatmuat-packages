"use client";

import React from "react";

import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverClose = PopoverPrimitive.Close;

export const PopoverArrow = () => (
  <PopoverPrimitive.Arrow
    className="h-[11px] w-4 fill-white"
    style={{
      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
    }}
  />
);

export const PopoverContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        sideOffset={5}
        className={cn(
          "z-[52] rounded-md border bg-white p-4 shadow-md outline-none",

          // --- FULLY CUSTOM ANIMATIONS ---
          // Removed `animate-in` and `animate-out`. We now only use our custom keyframes.

          // OPENING ANIMATIONS
          "data-[side=bottom]:animate-slide-up-and-fade",
          "data-[side=top]:animate-slide-down-and-fade",

          // CLOSING ANIMATIONS
          "data-[state=closed][data-side=bottom]:animate-slide-up-and-fade-out",
          "data-[state=closed][data-side=top]:animate-slide-down-and-fade-out",

          // Anti-glitch fixes are still useful with transform-based animations
          "data-[state=closed]:scrollbar-hide data-[state=closed]:overflow-hidden",

          className
        )}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
);
PopoverContent.displayName = "PopoverContent";
