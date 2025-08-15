import * as React from "react";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

// 1. Root Component (Popover Wrapper)
const Root = PopoverPrimitive.Root;

// 2. Trigger Component (Opens the main dropdown)
const Trigger = React.forwardRef(({ children, ...props }, ref) => (
  <PopoverPrimitive.Trigger ref={ref} {...props} asChild>
    {children}
  </PopoverPrimitive.Trigger>
));
Trigger.displayName = PopoverPrimitive.Trigger.displayName;

// 3. Content Component (The first-level dropdown content)
const Content = React.forwardRef(
  ({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-48 overflow-hidden rounded-md border border-neutral-400 bg-neutral-50 shadow-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
);
Content.displayName = PopoverPrimitive.Content.displayName;

// 4. Item Component (An item in the first-level dropdown that triggers a sub-menu on hover)
const Item = ({ children, subContent }) => (
  <HoverCardPrimitive.Root openDelay={100} closeDelay={100}>
    <HoverCardPrimitive.Trigger asChild>
      <div
        className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-xs font-medium hover:bg-neutral-200 focus:outline-none focus-visible:bg-neutral-700"
        tabIndex={0}
      >
        <span>{children}</span>
        <IconComponent
          src="/icons/chevron-right.svg"
          className="h-4 w-4 text-neutral-400"
          alt={`Open submenu for ${children}`}
        />
      </div>
    </HoverCardPrimitive.Trigger>
    {/* This renders the SubContent component passed via props */}
    {subContent}
  </HoverCardPrimitive.Root>
);

// 5. SubContent Component (The second-level dropdown content that appears on hover)
const SubContent = React.forwardRef(
  (
    { className, align = "start", sideOffset = 2, side = "right", ...props },
    ref
  ) => (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        side={side}
        className={cn(
          "z-50 w-48 overflow-hidden rounded-md border border-neutral-400 bg-white text-neutral-900 shadow-lg outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      >
        {/* Wrapper for fixed height and scrolling */}
        <div className="flex max-h-48 flex-col overflow-y-auto">
          {props.children}
        </div>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  )
);
SubContent.displayName = HoverCardPrimitive.Content.displayName;

// 6. SubItem Component (A clickable item within the SubContent)
const SubItem = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full rounded px-3 py-2 text-left text-xs font-medium text-neutral-900 hover:bg-neutral-100 focus:outline-none focus-visible:bg-neutral-100",
      className
    )}
  >
    {children}
  </button>
);

const NestedDropdown = {
  Root,
  Trigger,
  Content,
  Item,
  SubContent,
  SubItem,
};

export default NestedDropdown;
