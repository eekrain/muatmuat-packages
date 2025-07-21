"use client";

import { useRef } from "react";

import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

const Checkbox = ({
  onChange = () => {},
  label = "label",
  value,
  disabled,
  children,
  key,
  className,
  appearance = {
    inputClassName: "",
    labelClassName: "",
  },
  checked = false,
  ...props
}) => {
  const checkedRef = useRef(null);

  const checkedClick = () => {
    if (disabled) {
      return;
    }
    onChange({
      checked: !checked,
      value,
    });
  };

  return (
    <div
      className={cn(
        "relative flex items-center gap-[8px] text-xs text-neutral-900",
        className
      )}
      onClick={checkedClick}
    >
      <input
        key={key}
        type="checkbox"
        ref={checkedRef}
        checked={checked}
        value={value}
        onChange={() => checkedClick()}
        disabled={disabled}
        className="absolute h-0 w-0 cursor-pointer"
        {...props}
      />
      <span
        className={cn(
          // Base styles
          "relative h-[16px] w-[16px] min-w-[16px] cursor-pointer rounded-[4px]",
          "border border-neutral-600 transition-all duration-300 ease-in-out",
          "hover:border-primary-700",
          // Checked state
          checked && "border-primary-700 bg-primary-700",
          // Disabled states
          disabled &&
            checked &&
            "cursor-not-allowed !border-neutral-500 !bg-neutral-400",
          disabled && !checked && "cursor-not-allowed !border-neutral-500",
          // Checkmark styles
          "after:hidden",
          checked && "after:block",
          "after:absolute after:left-[5px] after:top-[2px] after:h-[8px] after:w-[4px]",
          "after:rotate-45 after:border-b after:border-r after:border-white",
          disabled && "after:border-neutral-500"
        )}
      />
      <span
        className={cn(
          "capsize select-none text-sm font-semibold leading-[15.4px] text-neutral-900 md:text-xs md:font-medium md:leading-[14.4px]",
          appearance.labelClassName
        )}
      >
        {children ? children : label}
      </span>
    </div>
  );
};

export default Checkbox;

Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  children: PropTypes.element,
  disabled: PropTypes.bool,
  checked: PropTypes.bool.isRequired,
};
