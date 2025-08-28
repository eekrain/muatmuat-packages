"use client";

import { useEffect, useRef, useState } from "react";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

export const ExpandableTextArea = ({
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
  const textareaRef = useRef(null);
  const [isGrow, setIsGrow] = useState(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to get the correct scrollHeight
      textarea.style.height = "12px";

      // Calculate new height
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 12), 100);
      setIsGrow(newHeight > 16);
      textarea.style.height = `${newHeight}px`;
    }
  }, [value]);

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <div
        className={cn(
          "flex max-h-[100px] min-h-[32px] w-full items-center rounded-[6px] border border-neutral-600",
          isGrow ? "p-3" : "px-3",
          errorMessage && "border-error-400",
          "focus-within:border-primary-700 hover:border-primary-700",
          disabled && "bg-neutral-200"
        )}
      >
        <textarea
          {...inputProps}
          ref={textareaRef}
          className={cn(
            "my-auto max-h-[76px] min-h-[12px] w-full resize-none overflow-y-auto text-sm font-semibold leading-[1.1] text-neutral-900 outline-none placeholder:text-neutral-600 md:text-xs md:font-medium md:leading-[1.2]",
            appearance.inputClassName
          )}
          maxLength={maxLength}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            height: "12px",
          }}
        />
      </div>

      {withCharCount || errorMessage ? (
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
      ) : null}
    </div>
  );
};
