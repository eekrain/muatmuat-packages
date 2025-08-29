"use client";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

export const MyTextArea = ({
  value,
  errorMessage,
  className,
  appearance = {
    inputClassName: "",
  },
  maxLength,
  withCharCount,
  placeholder = "Placeholder...",
  disabled = false,
  ...inputProps
}) => {
  const { t } = useTranslation();
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <textarea
        {...inputProps}
        className={cn(
          "w-full rounded-[6px] border border-neutral-600 p-3 text-xs font-medium leading-[1.2] text-neutral-900 outline-none placeholder:text-neutral-600 focus-within:border-primary-700 hover:border-primary-700",
          errorMessage && "border-error-400",
          appearance.inputClassName
        )}
        maxLength={maxLength}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
      />

      <div
        className={cn(
          "flex justify-between text-xs font-medium text-neutral-600",
          errorMessage && "text-error-400"
        )}
      >
        <div className="flex-1">{t(errorMessage)}</div>
        {withCharCount && (
          <div>
            {value?.length || 0}/{maxLength || 0}
          </div>
        )}
      </div>
    </div>
  );
};
