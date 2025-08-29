import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "@/lib/utils";

export const SimpleHover = ({ children, ...props }) => (
  <HoverCardPrimitive.Root openDelay={200} closeDelay={100} {...props}>
    {children}
  </HoverCardPrimitive.Root>
);
export const SimpleHoverTrigger = HoverCardPrimitive.Trigger;

export const SimpleHoverContent = ({
  side = "bottom",
  align = "start",
  className,
  children,
}) => {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        className={cn(
          "z-50 mt-1 flex w-[194px] flex-col overflow-hidden rounded-md border border-neutral-300 bg-neutral-50 shadow-muat",
          className
        )}
        side={side}
        align={align}
      >
        {children}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  );
};

export const SimpleHoverItem = ({ className, onClick, children }) => (
  <div
    className={cn(
      "cursor-pointer px-2.5 py-3 text-xs font-medium leading-[1.2] outline-none hover:bg-neutral-100",
      className
    )}
    onClick={onClick}
  >
    {children}
  </div>
);
