"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

export function InfoTooltip({
  // You can pass a custom trigger element like a <button> or <span>
  trigger = null,
  icon = "/icons/info16.svg",
  side = "top",
  align = "center",
  sideOffset = 8,
  className,
  appearance = {
    iconClassName: "text-neutral-600",
  },
  children,
  render,
}) {
  // console.log(
  //   "🔍 ~ InfoTooltip ~ src/components/Form/InfoTooltip.jsx:23 ~ appearance:",
  //   appearance
  // );

  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root>
        {/* <TooltipPrimitive.Root open={true}> */}
        <TooltipPrimitive.Trigger asChild>
          {trigger ? (
            trigger
          ) : (
            <div
              className={cn("h-4 w-4 cursor-pointer", appearance.iconClassName)}
            >
              <IconComponent
                loader={false}
                src={{ src: icon }}
                className={cn("h-4 w-4", appearance.iconClassName)}
              />
            </div>
          )}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            className={cn(
              "relative z-[52] max-w-sm rounded-xl border border-gray-200 bg-white p-3 text-sm leading-[1.2] shadow-xl",
              className
            )}
            sideOffset={sideOffset}
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
            }}
          >
            {/* Styles in globals.scss */}
            {render ? (
              <div
                className="info-tooltip-content"
                dangerouslySetInnerHTML={{ __html: render }}
              />
            ) : (
              <div className="info-tooltip-content">{children}</div>
            )}

            <TooltipPrimitive.Arrow
              className="h-[11px] w-4 fill-white"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
              }}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
