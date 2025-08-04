"use client";

import React, { useRef } from "react";

import { Drawer as BottomSheetPrimitive } from "vaul";

import { useStackManager } from "@/hooks/use-stack-manager";
import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

/**
 * The root component that provides context for the bottom sheet, powered by Vaul.
 * @param {import("vaul").DrawerProps} props
 */
export const BottomSheet = (props) => <BottomSheetPrimitive.Root {...props} />;

/**
 * A component that triggers the opening of the bottom sheet.
 * @param {React.ComponentProps<typeof BottomSheetPrimitive.Trigger>} props
 */
export const BottomSheetTrigger = (props) => (
  <BottomSheetPrimitive.Trigger {...props} />
);

/**
 * The main content container for the bottom sheet. It integrates with the stacking manager.
 * @param {React.ComponentProps<typeof BottomSheetPrimitive.Content>} props
 */
export const BottomSheetContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const stackRef = useRef(null);
    // This hook runs on mount and cleans up on unmount to manage stacking.
    useStackManager(stackRef, true);

    return (
      <BottomSheetPrimitive.Portal>
        <BottomSheetPrimitive.Overlay
          // --- THIS IS THE FIX ---
          // The stackRef is now correctly attached to the overlay.
          ref={stackRef}
          data-stack-item="true"
          className="fixed inset-0 z-50 bg-black/30"
        />
        <BottomSheetPrimitive.Content
          ref={ref}
          data-stack-content="true"
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-[16px] bg-white",
            className
          )}
          {...props}
        >
          <div className="mx-auto mt-1 h-1 w-12 flex-shrink-0 rounded-full bg-neutral-300" />
          {children}
        </BottomSheetPrimitive.Content>
      </BottomSheetPrimitive.Portal>
    );
  }
);
BottomSheetContent.displayName = "BottomSheetContent";

/**
 * A container for the bottom sheet's header content.
 * @param {React.HTMLAttributes<HTMLDivElement>} props
 */
export const BottomSheetHeader = ({ className, children, ...props }) => (
  <div className={cn("relative p-4 pb-6 text-center", className)} {...props}>
    {children}
  </div>
);
BottomSheetHeader.displayName = "BottomSheetHeader";

/**
 * A component for the title within the bottom sheet header.
 * @param {React.ComponentProps<typeof BottomSheetPrimitive.Title>} props
 */
export const BottomSheetTitle = React.forwardRef((props, ref) => (
  <BottomSheetPrimitive.Title
    ref={ref}
    className={cn("text-base font-bold text-neutral-900", props.className)}
    {...props}
  />
));
BottomSheetTitle.displayName = "BottomSheetTitle";

/**
 * A pre-styled button that closes the bottom sheet.
 * @param {object} props
 * @param {string} [props.className] - Additional classes for the button.
 */
export const BottomSheetClose = ({ className }) => (
  <BottomSheetPrimitive.Close asChild>
    <button
      type="button"
      className={cn("absolute left-4 top-1/2 -translate-y-1/2", className)}
      aria-label="Close"
    >
      <IconComponent
        src="/icons/close24.svg"
        className="h-6 w-6 text-primary-600"
      />
    </button>
  </BottomSheetPrimitive.Close>
);
BottomSheetClose.displayName = "BottomSheetClose";

/**
 * A container for the bottom sheet's footer content.
 * @param {React.HTMLAttributes<HTMLDivElement>} props
 */
export const BottomSheetFooter = ({ className, ...props }) => (
  <div className={cn("mt-auto w-full p-4 pb-6", className)} {...props} />
);
BottomSheetFooter.displayName = "BottomSheetFooter";
