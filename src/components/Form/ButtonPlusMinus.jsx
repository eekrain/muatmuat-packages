"use client";

import IconComponent from "@/components/IconComponent/IconComponent";

import { cn } from "@/lib/utils";

const ButtonPlusMinus = ({
  value = 0,
  onChange,
  onIncrement,
  onDecrement,
  minValue = 0,
  maxValue,
  disabled = false,
}) => {
  // Ensure value is always a number
  const numericValue = isNaN(value) ? 0 : Number(value);
  const disabledDecrement = disabled || numericValue === minValue;
  const disabledIncrement = disabled || numericValue === maxValue;

  const handleDecrement = () => {
    if (disabledDecrement || numericValue <= minValue) {
      return;
    }

    const newValue = numericValue - 1;
    onChange?.(newValue);
    onDecrement?.(newValue);
  };

  const handleIncrement = () => {
    if (
      disabledIncrement ||
      (maxValue !== undefined && numericValue >= maxValue)
    ) {
      return;
    }

    const newValue = numericValue + 1;
    onChange?.(newValue);
    onIncrement?.(newValue);
  };

  const handleInputChange = (e) => {
    if (disabled) return;

    const inputValue = e.target.value;

    // Only allow numeric values
    if (/^\d*$/.test(inputValue)) {
      const newValue =
        inputValue === ""
          ? 0
          : parseInt(inputValue.replace(/^0+/, "") || "0", 10);
      onChange?.(newValue);
    }
  };

  const handleInputBlur = (e) => {
    if (disabled) return;

    let newValue = parseInt(e.target.value, 10);

    // Apply constraints
    if (isNaN(newValue)) newValue = 0;
    if (maxValue !== undefined && newValue > maxValue) newValue = maxValue;
    if (newValue < minValue) newValue = minValue;

    onChange?.(newValue);
  };

  return (
    <div
      className={`flex h-8 w-[110px] items-center justify-between rounded-md border border-neutral-600 px-3 ${disabled ? "bg-neutral-200" : ""}`}
    >
      <button
        className="disabled:cursor-not-allowed"
        onClick={handleDecrement}
        disabled={disabledDecrement}
      >
        <IconComponent
          className={disabledDecrement ? "icon-stroke-neutral-500" : ""}
          src="/icons/minus16.svg"
        />
      </button>

      <input
        type="number"
        className={cn(
          "w-full max-w-4 select-none text-xs font-medium leading-[14.4px] outline-none",
          disabled ? "text-neutral-500" : "text-neutral-900"
        )}
        value={numericValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        disabled={disabled}
      />

      <button
        className="disabled:cursor-not-allowed"
        onClick={handleIncrement}
        disabled={disabledIncrement}
      >
        <IconComponent
          className={disabledIncrement ? "icon-stroke-neutral-500" : ""}
          src="/icons/plus16.svg"
        />
      </button>
    </div>
  );
};

export default ButtonPlusMinus;
