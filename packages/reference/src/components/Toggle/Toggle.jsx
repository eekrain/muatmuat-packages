"use client";

import { useEffect, useState } from "react";

import PropTypes from "prop-types";

const Toggle = ({
  textActive,
  textInactive,
  onClick,
  type = "primary",
  value = false,
  disabled = false,
  ...props
}) => {
  const [getValue, setValue] = useState(value);

  useEffect(() => {
    setValue(value);
  }, [value]);

  const handleValue = () => {
    if (!disabled) {
      const newValue = !getValue;
      setValue(newValue);
      onClick?.(newValue);
    }
  };

  const buttonClasses = [
    "relative w-[40px] h-[24px] rounded-full transition-colors",
    getValue
      ? type === "primary"
        ? "bg-primary-700"
        : "bg-secondary-500"
      : "bg-neutral-800",
    disabled &&
      (getValue ? "disabled:bg-primary-200" : "disabled:bg-neutral-400"),
    "disabled:cursor-not-allowed",
  ]
    .filter(Boolean)
    .join(" ");

  const dotClasses = [
    "absolute inset-[2px] w-[20px] h-[20px] rounded-full bg-white transition-transform",
    getValue ? "translate-x-[16.5px]" : "translate-x-0",
  ].join(" ");

  const textClasses = [
    "text-xs font-medium select-none capitalize",
    disabled ? "text-neutral-600" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex w-fit items-center gap-2" {...props}>
      <button
        className={buttonClasses}
        onClick={handleValue}
        disabled={disabled}
      >
        <span className={dotClasses}></span>
      </button>
      {!!(textActive || textInactive) && (
        <span className={textClasses}>
          {getValue ? textActive : textInactive}
        </span>
      )}
    </div>
  );
};

export default Toggle;

Toggle.propTypes = {
  textActive: PropTypes.string,
  textInactive: PropTypes.string,
  type: PropTypes.oneOf(["primary", "secondary"]),
  onClick: PropTypes.func,
  value: PropTypes.bool,
  disabled: PropTypes.bool,
};
