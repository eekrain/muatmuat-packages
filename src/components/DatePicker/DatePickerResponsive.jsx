import { useRef } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

const DatePickerResponsive = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  appearance = {
    containerClassName: "",
    inputClassName: "",
  },
  errorMessage,
  max,
  min,
}) => {
  const datePickerRef = useRef(null);

  const handleChange = (e) => {
    const newDate = e.target.value;
    if (onChange) {
      onChange(newDate);
    }
  };

  const handleClick = () => {
    if (!disabled && datePickerRef.current) {
      datePickerRef.current.showPicker();
    }
  };

  // Format date for display (if needed)
  const formatDate = (date) => {
    if (!date) return "";
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const [year, month, day] = date.split("-");
    // Subtract 1 from month to correctly index the months array (1-12 → 0-11)
    return `${day} ${months[Number(month) - 1]} ${year}`;
  };

  // Display placeholder or formatted date if available
  const displayText = value ? formatDate(value) : placeholder;

  return (
    <div
      className={cn(
        "relative flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 px-3",
        errorMessage && "border-error-400",
        disabled
          ? "cursor-not-allowed bg-neutral-200"
          : "cursor-pointer bg-neutral-50",
        appearance.containerClassName
      )}
      onClick={handleClick}
    >
      <IconComponent src="/icons/calendar16.svg" />
      <span
        className={cn(
          "text-sm font-semibold leading-[1.1]",
          // 25. 18 - Web - LB - 0279
          disabled || !value ? "text-neutral-600" : "text-neutral-900"
        )}
      >
        {displayText}
      </span>
      <input
        className={cn(
          "absolute -top-[314px] opacity-0",
          appearance.inputClassName
        )}
        type="date"
        onChange={handleChange}
        ref={datePickerRef}
        disabled={disabled}
        max={max}
        min={min}
      />
    </div>
  );
};

export default DatePickerResponsive;
