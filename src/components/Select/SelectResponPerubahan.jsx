"use client";

import IconComponent from "@/components/IconComponent/IconComponent";
import { Select } from "@/components/Select/Select";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

const SelectResponPerubahan = ({
  value,
  onChange,
  options = [],
  placeholder = "Pilih Respon Perubahan",
  disabled = false,
  className,
  error,
  contentWidth,
}) => {
  const { t } = useTranslation();
  const selectedOption = options.find((opt) => opt.value === value);

  // Map option values to their corresponding icons
  const getOptionIcon = (optionValue) => {
    const iconMap = {
      accept: "/icons/monitoring/respon-perubahan/accept.svg",
      change: "/icons/monitoring/respon-perubahan/change.svg",
      reject: "/icons/monitoring/respon-perubahan/reject.svg",
    };
    return (
      iconMap[optionValue] || "/icons/monitoring/respon-perubahan/check.svg"
    );
  };

  return (
    <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
      <Select.Trigger placeholder={placeholder} isError={error}>
        <Select.Value placeholder={placeholder} className={className}>
          {selectedOption?.label}
        </Select.Value>
      </Select.Trigger>

      <Select.Content
        className={cn("!z-[9999]", contentWidth && "!w-auto")}
        style={contentWidth ? { width: contentWidth } : undefined}
      >
        {options.length > 0 ? (
          options.map((option) => (
            <Select.Item
              key={option.value}
              value={option.value}
              textValue={option.label}
              className="h-10 overflow-hidden py-2.5"
            >
              <div className="flex items-center gap-1">
                <IconComponent
                  src={getOptionIcon(option.value)}
                  className="h-4 w-4"
                />
                <span className="text-xs font-medium">{option.label}</span>
              </div>
            </Select.Item>
          ))
        ) : (
          <Select.Empty>
            {t("SelectResponPerubahan.noOptions", {}, "Tidak ada pilihan")}
          </Select.Empty>
        )}
      </Select.Content>
    </Select.Root>
  );
};

export default SelectResponPerubahan;
