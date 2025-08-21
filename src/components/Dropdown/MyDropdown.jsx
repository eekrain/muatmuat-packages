import * as React from "react";

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

// 1. Root Component (Popover Wrapper)
const Root = PopoverPrimitive.Root;
const Trigger = PopoverPrimitive.Trigger;

const FilterTrigger = React.forwardRef(
  ({ isActive = false, disabled = false, children, ...props }, ref) => (
    <Trigger ref={ref} {...props} asChild>
      <button
        className={cn(
          "flex h-8 w-[104px] items-center gap-2 rounded-md border border-neutral-600 bg-neutral-50 p-3",
          isActive && "border-primary-700",
          disabled && "bg-neutral-200"
        )}
      >
        <span
          className={cn(
            `flex-grow text-left text-xs font-medium text-neutral-600`,
            isActive && "text-primary-700"
          )}
        >
          Filter
        </span>
        <IconComponent
          src="/icons/filter16.svg"
          className={cn(
            `size-4 shrink-0 text-neutral-600`,
            isActive && "text-primary-700"
          )}
        />
      </button>
    </Trigger>
  )
);
FilterTrigger.displayName = "FilterTrigger";

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
const HoverRoot = ({ title, children }) => (
  <HoverCardPrimitive.Root openDelay={100} closeDelay={100}>
    <HoverCardPrimitive.Trigger asChild>
      <div
        className="flex cursor-pointer items-center justify-between px-3 py-2 text-xs font-medium hover:bg-neutral-200 focus:outline-none"
        tabIndex={0}
      >
        <span>{title}</span>
        <IconComponent
          src="/icons/chevron-right.svg"
          className="h-4 w-4 text-neutral-400"
          alt={`Open submenu for ${title}`}
        />
      </div>
    </HoverCardPrimitive.Trigger>
    {children}
  </HoverCardPrimitive.Root>
);

// 5. SubContent Component (The second-level dropdown content that appears on hover)
const HoverContent = React.forwardRef(
  (
    {
      className,
      appearance = {
        wrapperClassName: "",
      },
      align = "start",
      sideOffset = 2,
      side = "right",
      ...props
    },
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
        <div
          className={cn(
            "flex max-h-48 flex-col overflow-y-auto",
            appearance.wrapperClassName
          )}
        >
          {props.children}
        </div>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  )
);
HoverContent.displayName = HoverCardPrimitive.Content.displayName;

// 6. SubItem Component (A clickable item within the SubContent)
const HoverItem = React.forwardRef(
  ({ children, onClick, className, asChild = false, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        ref,
        onClick,
        className: cn(
          children.props.className, // keep child's classes
          className // add parent classes
        ),
      });
    }
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex h-8 w-full items-center rounded px-2.5 text-left text-xs font-medium text-neutral-900 hover:bg-neutral-100 focus:outline-none focus-visible:bg-neutral-100",
          className
        )}
      >
        {children}
      </button>
    );
  }
);
HoverItem.displayName = "HoverItem";

const MyDropdown = {
  Root,
  Trigger,
  FilterTrigger,
  Content,

  HoverRoot,
  HoverContent,
  HoverItem,
};

export default MyDropdown;
