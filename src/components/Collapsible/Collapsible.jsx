import React, { createContext, useContext } from "react";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

import { cn } from "@/lib/utils";

const CollapsibleContext = createContext({});

export const useCollapsible = () => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error(
      "useCollapsible must be used within a Collapsible component"
    );
  }
  return context;
};

export const Collapsible = React.forwardRef(
  ({ children, className, ...props }, ref) => {
    const [open, setOpen] = React.useState(props.defaultOpen || false);

    const contextValue = {
      open: props.open !== undefined ? props.open : open,
      onOpenChange: props.onOpenChange || setOpen,
    };

    return (
      <CollapsibleContext.Provider value={contextValue}>
        <CollapsiblePrimitive.Root
          ref={ref}
          open={contextValue.open}
          onOpenChange={contextValue.onOpenChange}
          className={cn("w-full overflow-hidden", className)}
          {...props}
        >
          {children}
        </CollapsiblePrimitive.Root>
      </CollapsibleContext.Provider>
    );
  }
);

Collapsible.displayName = "Collapsible";

export const CollapsibleTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { open } = useCollapsible();

    return (
      <CollapsiblePrimitive.Trigger
        ref={ref}
        className={cn(
          "flex w-full items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {/* kalau children function, kasih open */}
        {typeof children === "function" ? children({ open }) : children}
      </CollapsiblePrimitive.Trigger>
    );
  }
);

CollapsibleTrigger.displayName = "CollapsibleTrigger";

export const CollapsibleContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <CollapsiblePrimitive.Content
        ref={ref}
        className={cn(
          "overflow-hidden text-sm data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
          className
        )}
        {...props}
      >
        {children}
      </CollapsiblePrimitive.Content>
    );
  }
);

CollapsibleContent.displayName = "CollapsibleContent";
