"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import IconComponent from "../IconComponent/IconComponent";

export function InfoTooltip({
  // You can pass a custom trigger element like a <button> or <span>
  trigger = null,
  icon = "/icons/info16.svg",
  content,
  appearance = {
    contentClassName: "",
  },
  side = "top",
  align = "center",
  sideOffset = 8,
}) {
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {trigger ? (
            trigger
          ) : (
            <div className="size-4">
              <IconComponent
                loader={false}
                src={{ src: icon }}
                height={16}
                width={16}
                className="text-neutral-600"
              />
            </div>
          )}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            className={`relative z-50 max-w-sm rounded-xl border border-gray-200 bg-white p-3 text-sm shadow-xl ${appearance.contentClassName}`}
            sideOffset={sideOffset}
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
            }}
          >
            {content}
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
