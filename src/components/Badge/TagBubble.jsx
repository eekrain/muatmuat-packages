import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export const TagBubble = ({
  disabled = false,
  className = "",
  withRemove = null,
  children,
}) => {
  return (
    <div
      className={cn(
        "group box-border flex h-7 max-w-[204px] flex-row items-center gap-1 rounded-2xl border border-blue-600 bg-white px-3 py-1.5 transition-colors duration-150 hover:bg-blue-50",
        className
      )}
    >
      <span className="flex-1 truncate text-xs font-semibold leading-[130%] text-blue-600">
        {children}
      </span>
      {withRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            withRemove?.onRemove?.();
          }}
          disabled={disabled}
          className={cn(
            "flex h-3.5 w-3.5 items-center justify-center rounded-full text-blue-600 transition-colors duration-150 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed"
          )}
          aria-label={`Remove ${tag} tag`}
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};
