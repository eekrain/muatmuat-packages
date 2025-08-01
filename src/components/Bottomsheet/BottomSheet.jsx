"use client";

import React from "react";

import { Drawer as BottomSheetPrimitive } from "vaul";

import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

/**
 * @param {import("vaul").DrawerProps} props
 */
export const BottomSheet = ({ shouldScaleBackground = true, ...props }) => (
  <BottomSheetPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
BottomSheet.displayName = " BottomSheet";

export const BottomSheetTrigger = BottomSheetPrimitive.Trigger;

export const BottomSheetContent = React.forwardRef(
  /**
   * @param {React.ComponentProps<typeof BottomSheetPrimitive.Content>} props
   */
  ({ className, children, ...props }, ref) => (
    <BottomSheetPrimitive.Portal>
      <BottomSheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20" />
      <BottomSheetPrimitive.Content
        ref={ref}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex h-auto flex-col rounded-t-[16px] bg-white shadow-[0px_2px_20px_rgba(0,0,0,0.25)]",
          className
        )}
        {...props}
      >
        <hr className="mx-auto mt-1 h-1 w-[38px] rounded-full bg-[#DDDDDD]" />
        {children}
      </BottomSheetPrimitive.Content>
    </BottomSheetPrimitive.Portal>
  )
);
BottomSheetContent.displayName = BottomSheetPrimitive.Content.displayName;

export const BottomSheetClose = React.forwardRef(
  /**
   * @param {React.HTMLAttributes<HTMLDivElement>} props
   */
  (
    {
      className,
      icon = "/icons/close24.svg",
      appearance = { iconClassname: "" },
    },
    ref
  ) => (
    <BottomSheetPrimitive.Close asChild>
      <button
        type="button"
        className={cn(
          "absolute left-4 top-1/2 -translate-y-[calc(50%+5px)]",
          "rounded-sm opacity-70 ring-offset-white transition-opacity",
          "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:pointer-events-none",
          className
        )}
        aria-label="Close"
      >
        <IconComponent
          src={icon}
          className={cn("h-6 w-6 text-primary-600", appearance.iconClassname)}
        />
        <span className="sr-only">Close</span>
      </button>
    </BottomSheetPrimitive.Close>
  )
);
BottomSheetClose.displayName = "BottomSheetClose";

export const BottomSheetHeader = React.forwardRef(
  /**
   * @param {React.HTMLAttributes<HTMLDivElement>} props
   */
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex items-center justify-center p-4 pb-6 text-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
BottomSheetHeader.displayName = "BottomSheetHeader";

/**
 * @param {React.HTMLAttributes<HTMLDivElement>} props
 */
export const BottomSheetFooter = ({ className, ...props }) => (
  <div className={cn("mt-auto w-full p-4 pb-6", className)} {...props} />
);
BottomSheetFooter.displayName = "BottomSheetFooter";

export const BottomSheetTitle = React.forwardRef(
  /**
   * @param {React.ComponentProps<typeof BottomSheetPrimitive.Title>} props
   */
  ({ className, ...props }, ref) => (
    <BottomSheetPrimitive.Title
      ref={ref}
      className={cn(
        "text-center text-base font-bold leading-tight text-neutral-900",
        className
      )}
      {...props}
    />
  )
);
BottomSheetTitle.displayName = BottomSheetPrimitive.Title.displayName;
