import { forwardRef, useCallback, useEffect, useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";
import { NumericFormat } from "react-number-format";

import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

/**
 * NumberInput component with increment/decrement buttons and number formatting.
 * Uses Tailwind CSS for styling and cn for class composition.
 *
 * @typedef {Object} NumberInputProps
 * @property {number} [stepper] - The amount to increment/decrement by
 * @property {string} [thousandSeparator] - Character to use as thousand separator
 * @property {string} [placeholder] - Input placeholder text
 * @property {number} [defaultValue] - Default value for uncontrolled component
 * @property {number} [min] - Minimum allowed value
 * @property {number} [max] - Maximum allowed value
 * @property {number} [value] - Controlled value
 * @property {string} [suffix] - String to append after the number
 * @property {string} [prefix] - String to prepend before the number
 * @property {(value: number | undefined) => void} [onValueChange] - Callback when value changes
 * @property {boolean} [fixedDecimalScale] - Whether to always show decimal places
 * @property {number} [decimalScale] - Number of decimal places to show
 * @property {Object} [appearance] - Custom appearance options
 * @property {string} [appearance.containerClassName] - Additional classes for container
 * @property {string} [appearance.inputClassName] - Additional classes for input
 * @property {string} [className] - Additional classes for the root element
 * @property {string} [errorMessage] - Error message to display
 * @property {boolean} [hideErrorMessage] - Whether to hide error message
 */

/**
 * NumberInput component implementation
 * @type {React.ForwardRefRenderFunction<HTMLInputElement, NumberInputProps>}
 */
export const NumberInput = forwardRef(
  (
    {
      stepper = 1,
      thousandSeparator,
      placeholder = "Enter a number",
      defaultValue,
      min = -Infinity,
      max = Infinity,
      onChange,
      onValueChange,
      fixedDecimalScale = false,
      decimalScale = 0,
      suffix,
      prefix,
      value: controlledValue,
      appearance = {
        containerClassName: "",
        inputClassName: "",
      },
      className,
      errorMessage,
      hideErrorMessage = false,
      hideStepper = true,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation();
    const [value, setValue] = useState(controlledValue ?? defaultValue);

    const handleIncrement = useCallback(() => {
      setValue((prev) =>
        prev === undefined ? stepper : Math.min(prev + stepper, max)
      );
    }, [stepper, max]);

    const handleDecrement = useCallback(() => {
      setValue((prev) =>
        prev === undefined ? -stepper : Math.max(prev - stepper, min)
      );
    }, [stepper, min]);

    useEffect(() => {
      const handleKeyDown = (e) => {
        if (document.activeElement === ref?.current) {
          if (e.key === "ArrowUp") {
            handleIncrement();
          } else if (e.key === "ArrowDown") {
            handleDecrement();
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleIncrement, handleDecrement, ref]);

    useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue);
      }
    }, [controlledValue]);

    const handleChange = (values) => {
      const newValue =
        values.floatValue === undefined ? undefined : values.floatValue;
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      } else if (onValueChange) {
        onValueChange(newValue);
      }
    };

    const handleBlur = () => {
      if (value !== undefined) {
        if (value < min) {
          setValue(min);
          ref.current.value = String(min);
        } else if (value > max) {
          setValue(max);
          ref.current.value = String(max);
        }
      }
    };

    return (
      <div className={cn("flex w-full flex-col gap-y-2", className)}>
        <div
          className={cn(
            "flex h-8 w-full items-center rounded-md border border-neutral-600 bg-neutral-50 px-3 transition-colors",
            "focus-within:border-primary-700 hover:border-primary-700",
            errorMessage && "border-error-400",
            appearance.containerClassName
          )}
        >
          <NumericFormat
            value={value}
            onValueChange={handleChange}
            thousandSeparator={thousandSeparator}
            decimalScale={decimalScale}
            fixedDecimalScale={fixedDecimalScale}
            allowNegative={min < 0}
            valueIsNumericString
            onBlur={handleBlur}
            max={max}
            min={min}
            suffix={suffix}
            prefix={prefix}
            placeholder={placeholder}
            className={cn(
              "mt-[2px] w-full min-w-0 border-none border-transparent bg-transparent text-left text-xs font-medium leading-[14.4px] text-neutral-900 outline-none placeholder:text-neutral-600 max-[600px]:text-sm max-[600px]:font-semibold max-[600px]:leading-[15.4px]",
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              appearance.inputClassName
            )}
            getInputRef={ref}
            {...props}
          />
          {!hideStepper && (
            <div className="flex flex-col border-l border-neutral-600">
              <button
                type="button"
                aria-label="Increase value"
                className={cn(
                  "flex h-4 w-8 items-center justify-center border-b border-neutral-600 transition-colors hover:bg-neutral-100",
                  value === max && "cursor-not-allowed opacity-50"
                )}
                onClick={handleIncrement}
                disabled={value === max}
              >
                <ChevronUp size={12} className="text-neutral-900" />
              </button>
              <button
                type="button"
                aria-label="Decrease value"
                className={cn(
                  "flex h-4 w-8 items-center justify-center transition-colors hover:bg-neutral-100",
                  value === min && "cursor-not-allowed opacity-50"
                )}
                onClick={handleDecrement}
                disabled={value === min}
              >
                <ChevronDown size={12} className="text-neutral-900" />
              </button>
            </div>
          )}
        </div>
        {!hideErrorMessage && errorMessage && (
          <div className="flex items-center justify-between text-xs font-medium text-error-400">
            <span>{t(errorMessage)}</span>
          </div>
        )}
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
