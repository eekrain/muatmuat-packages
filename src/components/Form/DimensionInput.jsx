import { useCallback } from "react";

import { NumericFormat } from "react-number-format";

import { cn } from "@/lib/utils";

/**
 * @typedef {Object} ManualInputProps
 * @property {string | number} [value] - Value of the input
 * @property {(value: string | number) => void} [setValue] - Set value of the input
 */

/**
 * DimensionInput component for handling 3D measurements (panjang x lebar x tinggi)
 * Designed to work with react-hook-form Controller
 *
 * @param {Object} props
 * @param {{panjang: ManualInputProps, lebar: ManualInputProps, tinggi: ManualInputProps}} props.manual - Manual input props for panjang, lebar, and tinggi
 * @param {string} [props.className] - Additional class for the container
 * @param {Object} [props.appearance] - Custom appearance options
 * @param {string} [props.appearance.containerClassName] - Additional classes for the input container
 * @param {string} [props.appearance.inputClassName] - Additional classes for the input fields
 */
export const DimensionInput = ({
  manual,
  className,
  appearance = {
    inputClassName: "",
  },
}) => {
  // Common input props
  const getInputProps = useCallback(
    ({ value, setValue }) => {
      return {
        allowNegative: false,
        decimalScale: 2,
        thousandSeparator: ".",
        decimalSeparator: ",",
        className: cn(
          "w-full min-w-0 cursor-pointer text-center text-xs font-medium placeholder:text-neutral-600 focus:outline-none",
          appearance.inputClassName
        ),
        value: value || "",
        onValueChange: (values) => {
          const val = values.floatValue;
          setValue(val === undefined ? "" : val);
        },
      };
    },
    [appearance.inputClassName]
  );

  return (
    <div
      className={cn(
        "grid h-8 w-full grid-cols-[1fr,auto,1fr,auto,1fr] items-center gap-x-1 rounded-md border border-neutral-600 px-3 transition-colors",
        "focus-within:border-primary-700 hover:border-primary-700",
        className
      )}
    >
      <NumericFormat
        {...getInputProps({
          value: manual?.panjang?.value,
          setValue: manual?.panjang?.setValue,
        })}
        placeholder="p"
      />
      <span className="text-xs text-neutral-600">x</span>
      <NumericFormat
        {...getInputProps({
          value: manual?.lebar?.value,
          setValue: manual?.lebar?.setValue,
        })}
        placeholder="l"
      />
      <span className="text-xs text-neutral-600">x</span>
      <NumericFormat
        {...getInputProps({
          value: manual?.tinggi?.value,
          setValue: manual?.tinggi?.setValue,
        })}
        placeholder="t"
      />
    </div>
  );
};
