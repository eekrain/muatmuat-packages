"use client";

import { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";

import style from "./Checkbox.module.scss";

const Checkbox = ({
  onChange = () => {},
  label = "label",
  value,
  disabled,
  children,
  key,
  className,
  checked = false,
  ...props
}) => {
  const [checkedState, setChecked] = useState(checked);

  const checkedRef = useRef(null);

  useEffect(() => {
    setChecked(checked);
  }, [checked]);

  const checkedClick = () => {
    if (disabled) {
      return;
    }
    onChange({
      checked: !checkedState,
      value,
    });
    setChecked(!checkedState);
  };
  useEffect(() => {
    setChecked(checked);
  }, [checked]);
  return (
    <div
      className={`${style.container_checkbox} flex items-center gap-[8px] ${className}`}
      onClick={checkedClick}
    >
      <input
        key={key}
        type="checkbox"
        ref={checkedRef}
        checked={checkedState}
        value={value}
        onChange={() => checkedClick()}
        disabled={disabled}
        {...props}
      />
      <span className={`relative ${style.checkbox_primary}`}></span>
      <span className="select-none text-[14px] font-semibold leading-[15.4px] text-neutral-900 md:text-[12px] md:font-medium md:leading-[14.4px]">
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
};
