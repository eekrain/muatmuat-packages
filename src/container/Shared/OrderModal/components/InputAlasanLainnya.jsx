"use client";

import Input from "@/components/Form/Input";

import { cn } from "@/lib/utils";

const InputAlasanLainnya = ({
  value,
  onChange,
  disabled = false,
  isError = false,
  className,
  maxLength = 80,
}) => {
  return (
    <div className={cn("flex w-full flex-col gap-y-2 pl-6", className)}>
      <Input
        type="text"
        placeholder="Masukkan alasan pembatalan"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={maxLength}
        errorMessage={isError ? "Alasan lainnya wajib diisi" : ""}
        hideErrorMessage={true}
        className="gap-y-1"
        appearance={{
          containerClassName: cn(
            "h-8 rounded-md",
            isError && "border-error-400"
          ),
          inputClassName: "text-sm font-medium",
        }}
      />
      <div className="flex w-full items-center">
        {isError && (
          <span className="text-xs font-medium text-error-400">
            Alasan lainnya wajib diisi
          </span>
        )}
        <span className="ml-auto text-xs font-medium text-neutral-600">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export default InputAlasanLainnya;
