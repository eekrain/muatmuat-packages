"use client";

import { forwardRef } from "react";

import Input from "@/components/Form/Input";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

/**
 * Wrapper untuk menampilkan char count di atas error message,
 * tanpa memodifikasi komponen Input asli.
 *
 * Catatan:
 * - Tidak meneruskan errorMessage ke Input agar tidak muncul error text bawaan,
 *   sehingga kita bisa menaruh char count di atas error dengan urutan yang benar.
 * - Border merah & icon merah tetap diberikan melalui appearance.*.
 *
 * Props tambahan:
 * @property {boolean} [withCharCount=true] - Menampilkan char count
 * @property {string} [counterClassName] - Kelas tambahan untuk baris char count
 */
const InputWithCharCount = forwardRef(
  (
    {
      withCharCount = true,
      value = "",
      maxLength,
      errorMessage,
      className,
      counterClassName = "",
      appearance = {},
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation();
    const hasError = Boolean(errorMessage);
    const mergedAppearance = {
      ...appearance,
      containerClassName: cn(
        appearance?.containerClassName,
        hasError && "border-error-400"
      ),
      iconClassName: cn(
        appearance?.iconClassName,
        hasError && "text-error-400"
      ),
    };

    return (
      <div className={cn("flex w-full flex-col gap-y-2", className)}>
        <Input
          {...props}
          ref={ref}
          value={value}
          maxLength={maxLength}
          appearance={mergedAppearance}
        />
        <div
          className={cn(
            "flex w-full justify-between text-xs font-medium text-neutral-600",
            hasError && "text-error-400",
            counterClassName
          )}
        >
          {hasError && (
            <span className="text-xs font-medium text-error-400">
              {t(errorMessage)}
            </span>
          )}
          {withCharCount && (
            <div className="ml-auto mr-0">
              {value?.length ?? 0}/{maxLength ?? 0}
            </div>
          )}
        </div>
      </div>
    );
  }
);

InputWithCharCount.displayName = "InputWithCharCount";
export default InputWithCharCount;
