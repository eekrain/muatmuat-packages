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
 * Designed to work with react-hook-form
 *
 * @param {Object} props
 * @param {{ panjang: Object, lebar: Object, tinggi: Object }} props.register - react-hook-form register object for panjang, lebar, and tinggi
 * @param {{panjang: ManualInputProps, lebar: ManualInputProps, tinggi: ManualInputProps}} props.manual - Manual input props for panjang, lebar, and tinggi
 * @param {string} [props.className] - Additional class for the container
 * @param {Object} [props.appearance] - Custom appearance options
 * @param {string} [props.appearance.containerClassName] - Additional classes for the input container
 * @param {string} [props.appearance.inputClassName] - Additional classes for the input fields
 */
export const DimensionInput = ({
  register,
  manual,
  className,
  appearance = {
    inputClassName: "",
  },
}) => {
  // Common input props
  const getInputProps = useCallback(
    ({ value, setValue, register }) => {
      const defaultProps = {
        placeholder: "0",
        allowNegative: false,
        decimalScale: 0,
        className: cn(
          "w-full min-w-0 cursor-pointer text-center text-xs font-medium placeholder:text-neutral-600 focus:outline-none",
          appearance.inputClassName
        ),
      };
      if (register) {
        // Extract name and ref, and other props from register
        const { ref, onChange, ...rest } = register;

        return {
          ...defaultProps,
          getInputRef: ref,
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
      }

      return {
        ...defaultProps,
        value,
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
          ...(register?.panjang && { register: register.panjang }),
          ...(manual?.panjang && {
            value: manual.panjang.value,
            setValue: manual.panjang.setValue,
          }),
        })}
      />
      <span className="text-xs text-neutral-600">x</span>
      <NumericFormat
        {...getInputProps({
          ...(register?.lebar && { register: register.lebar }),
          ...(manual?.lebar && {
            value: manual.lebar.value,
            setValue: manual.lebar.setValue,
          }),
        })}
      />
      <span className="text-xs text-neutral-600">x</span>
      <NumericFormat
        {...getInputProps({
          ...(register?.tinggi && { register: register.tinggi }),
          ...(manual?.tinggi && {
            value: manual.tinggi.value,
            setValue: manual.tinggi.setValue,
          }),
        })}
      />
    </div>
  );
};
