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
        "group box-border flex h-7 max-w-[204px] flex-row items-center gap-1 rounded-2xl border border-primary-700 bg-white px-3 py-1.5 transition-colors duration-150 hover:bg-blue-50",
        className
      )}
    >
      <span className="flex-1 truncate text-xxs font-semibold leading-[13px] text-primary-700">
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
            "flex h-3.5 w-3.5 items-center justify-center rounded-full text-primary-700 transition-colors duration-150 hover:bg-primary-700 hover:text-white focus:outline-none focus:ring-1 focus:ring-primary-700 disabled:cursor-not-allowed"
          )}
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};
