import { useRef } from "react";

import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

import style from "./RadioButton.module.scss";

const RadioButton = ({
  onClick = () => {},
  name,
  label,
  checked,
  onChange,
  value,
  disabled,
  children,
  className,
  classNameRound,
  classNameLabel,
  ...props
}) => {
  const radioRef = useRef(null);
  const isLabelMissing = !label && !children;

  const checkedClick = () => {
    if (disabled) {
      return;
    }
    onClick({
      checked: !checked,
      value,
    });
  };

  return (
    <div
      className={cn(
        style.container_radio,
        "flex cursor-pointer items-center gap-[8px]",
        className
      )}
      onClick={checkedClick}
    >
      <input
        type="radio"
        ref={radioRef}
        checked={checked}
        name={name}
        onChange={checkedClick}
        value={value}
        disabled={disabled}
        {...props}
      />
      {/* LB - 0242 - 25.03 */}
      <span
        className={`${style.radio_primary} ${classNameRound} ${
          isLabelMissing ? "after:top-[4px]" : "after:top-[5px]"
        } select-none bg-neutral-50`}
      ></span>
      {children ? (
        children
      ) : (
        <span
          className={cn(
            "capsize select-none text-sm font-semibold leading-[15.4px] text-neutral-900 md:text-xs md:font-medium md:leading-[14.4px]",
            classNameLabel
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default RadioButton;

RadioButton.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};
