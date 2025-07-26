import { forwardRef, useCallback, useEffect, useState } from "react";

import { Minus, Plus } from "lucide-react";
import { NumericFormat } from "react-number-format";

import { cn } from "@/lib/utils";

/**
 * A number input component styled as a quantity selector with different visual states.
 *
 * @typedef {Object} NumberInputProps
 * @property {number} [value] - The controlled value of the component.
 * @property {number} [defaultValue=0] - The initial value for an uncontrolled component.
 * @property {(value: number | undefined) => void} [onValueChange] - Callback fired when the value changes.
 * @property {number} [min=0] - The minimum allowed value. Defaults to 0.
 * @property {number} [max=Infinity] - The maximum allowed value.
 * @property {number} [stepper=1] - The amount to increment or decrement by.
 * @property {string} [className] - Additional classes for the root element.
 * @property {boolean} [disabled=false] - If true, the component is disabled.
 * @property {string} [thousandSeparator] - Character for thousand separator.
 * @property {string} [decimalSeparator] - Character for decimal separator.
 * @property {number} [decimalScale] - Number of decimal places.
 * @property {boolean} [fixedDecimalScale] - If true, always shows decimal places.
 * @property {string} [placeholder] - Placeholder text for the input.
 */

/**
 * @type {React.ForwardRefRenderFunction<HTMLInputElement, NumberInputProps>}
 */
export const NumberInput = forwardRef(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onValueChange,
      onChange,
      min = 0,
      max = Infinity,
      stepper = 1,
      className,
      disabled = false,
      thousandSeparator = ".",
      decimalSeparator = ",",
      decimalScale = 0,
      fixedDecimalScale = false,
      placeholder = "0",
      hideStepper = true,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(
      isControlled ? controlledValue : defaultValue
    );
    const [stringValue, setStringValue] = useState("");
    console.log("🚀 ~ stringValue:", stringValue);
    const [isFocused, setIsFocused] = useState(false);

    const value = isControlled ? controlledValue : internalValue;
    console.log("🚀 ~ value:", value);

    useEffect(() => {
      if (isControlled) {
        setInternalValue(controlledValue);
      }
    }, [controlledValue, isControlled]);

    const triggerChange = (newValue) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      if (onValueChange) {
        onValueChange(newValue);
      }
      if (onChange) {
        onChange({ target: { value: newValue } });
      }
    };

    const handleIncrement = useCallback(() => {
      const currentValue = typeof value === "number" ? value : min;
      const newValue = Math.min(currentValue + stepper, max);
      triggerChange(newValue);
    }, [value, stepper, max, min, onValueChange, isControlled]);

    const handleDecrement = useCallback(() => {
      const currentValue = typeof value === "number" ? value : min;
      const newValue = Math.max(currentValue - stepper, min);
      triggerChange(newValue);
    }, [value, stepper, min, onValueChange, isControlled]);

    const handleChange = (values) => {
      setStringValue(values.value);
      triggerChange(values.floatValue);
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleInputBlur = (e) => {
      setIsFocused(false);

      // If value is empty or below min, set to min.
      if (!Boolean(stringValue) || value < min) {
        console.log("ran");
        triggerChange(min);
      } else if (stringValue > max) {
        triggerChange(max);
      }

      props?.onBlur?.(e);
    };

    return (
      <div
        className={cn(
          "flex h-8 w-[110px] items-center rounded-md border border-neutral-600 bg-neutral-50 px-3 py-2 transition-colors",
          // Disabled State
          disabled && "bg-neutral-100",
          isFocused && "border-primary-700",
          className
        )}
      >
        {!hideStepper && (
          <button
            type="button"
            aria-label="Decrease value"
            onClick={handleDecrement}
            disabled={disabled || value <= min}
            className="disabled:cursor-not-allowed"
          >
            <Minus
              className={cn(
                "h-4 w-4 transition-colors",
                disabled || value <= min
                  ? "text-neutral-500"
                  : isFocused
                    ? "text-primary-700"
                    : "text-neutral-700"
              )}
            />
          </button>
        )}

        <NumericFormat
          value={value}
          onValueChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleInputBlur}
          thousandSeparator={thousandSeparator}
          decimalSeparator={decimalSeparator}
          decimalScale={decimalScale}
          fixedDecimalScale={fixedDecimalScale}
          allowNegative={min < 0}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full flex-grow border-none bg-transparent text-sm font-semibold outline-none focus:ring-0 md:text-xs",
            !hideStepper && "text-center",
            "disabled:cursor-not-allowed disabled:text-neutral-500",
            isFocused ? "text-neutral-900" : "text-neutral-900",
            "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            disabled
              ? "bg-neutral-100"
              : isFocused
                ? "bg-white"
                : "bg-neutral-50"
          )}
          getInputRef={ref}
          {...props}
        />

        {!hideStepper && (
          <button
            type="button"
            aria-label="Increase value"
            onClick={handleIncrement}
            disabled={disabled || value >= max}
            className="disabled:cursor-not-allowed"
          >
            <Plus
              className={cn(
                "h-4 w-4 transition-colors",
                disabled || value >= max
                  ? "text-neutral-500"
                  : isFocused
                    ? "text-primary-700"
                    : "text-neutral-700"
              )}
            />
          </button>
        )}
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
