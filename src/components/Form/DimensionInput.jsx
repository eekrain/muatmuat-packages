import { useCallback } from "react";

import { NumericFormat } from "react-number-format";

import { cn } from "@/lib/utils";

/**
 * DimensionInput component for handling 3D measurements (panjang x lebar x tinggi)
 * Designed to work with react-hook-form
 *
 * @param {Object} props
 * @param {Object} props.registerPanjang - react-hook-form register object for panjang
 * @param {Object} props.registerLebar - react-hook-form register object for lebar
 * @param {Object} props.registerTinggi - react-hook-form register object for tinggi
 * @param {string} [props.className] - Additional class for the container
 * @param {Object} [props.appearance] - Custom appearance options
 * @param {string} [props.appearance.containerClassName] - Additional classes for the input container
 * @param {string} [props.appearance.inputClassName] - Additional classes for the input fields
 */
export const DimensionInput = ({
  registerPanjang,
  registerLebar,
  registerTinggi,
  className,
  appearance = {
    containerClassName: "",
    inputClassName: "",
  },
}) => {
  // Common input props
  const getInputProps = useCallback(
    (register) => {
      // Extract name and ref, and other props from register
      const { name, ref, onChange, ...rest } = register;

      return {
        getInputRef: ref,
        name,
        placeholder: "0",
        allowNegative: false,
        decimalScale: 0,
        className: cn(
          "w-8 cursor-pointer text-center text-xs font-medium placeholder:text-neutral-600 focus:outline-none",
          appearance.inputClassName
        ),
        onValueChange: (values) => {
          const val = values.floatValue;
          // Only call onChange if it exists
          onChange?.({
            target: {
              name,
              value: val === undefined ? "" : val,
            },
          });
        },
        ...rest,
      };
    },
    [appearance.inputClassName]
  );

  return (
    <div
      className={cn(
        "flex h-8 items-center rounded-md border border-neutral-600 bg-neutral-50 px-3 transition-colors",
        "focus-within:border-primary-700 hover:border-primary-700",
        className,
        appearance.containerClassName
      )}
    >
      <NumericFormat {...getInputProps(registerPanjang || {})} />
      <span className="mx-1 text-xs text-neutral-600">x</span>
      <NumericFormat {...getInputProps(registerLebar || {})} />
      <span className="mx-1 text-xs text-neutral-600">x</span>
      <NumericFormat {...getInputProps(registerTinggi || {})} />
    </div>
  );
};
