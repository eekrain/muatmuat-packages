import { useRef } from "react";

import PropTypes from "prop-types";

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
  classname,
  classnameRound,
  classnameLabel,
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
      className={`${style.container_radio} ${classname} flex cursor-pointer items-center gap-[8px]`}
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
        className={`${style.radio_primary} ${classnameRound} ${
          isLabelMissing
            ? "after:top-[4px] sm:after:!top-[5px]"
            : "after:top-[5px]"
        } select-none`}
      ></span>
      {children ? (
        children
      ) : (
        <span
          className={`text-xs font-medium text-neutral-900 ${classnameLabel}`}
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
