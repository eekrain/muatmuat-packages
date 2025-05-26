"use client";

import React, { useRef, useState, useEffect } from "react";
import style from "./Checkbox.module.scss";
import PropTypes from "prop-types";

const Checkbox = ({
  onChange = () => {},
  label = "label",
  value,
  disabled,
  children,
  key,
  classname,
  checked = false,
  ...props
}) => {
  const [checkedState, setChecked] = useState(checked);

  const checkedRef = useRef(null);

  useEffect(() => {
    setChecked(checked)
  }, [checked])

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
  useEffect(()=>{
    setChecked(checked)
  },[checked])
  return (
    <div
      className={`${style.container_checkbox} flex gap-[8px] items-center ${classname}`}
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
      <span className="select-none sm:text-[12px] font-medium">
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
