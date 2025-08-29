"use client";

import { useEffect, useState } from "react";

import PropTypes from "prop-types";

import style from "./TextArea.module.scss";

const TextArea = ({
  name,
  type = "text",
  placeholder = "Placeholder",
  disabled = false,
  status = null,
  value = "",
  supportiveText = { title: "", desc: "" },
  width = { width: "", maxWidth: "", minWidth: "" },
  ref = null,
  resize = "",
  onChange = () => {},
  onBlur = () => {},
  maxLength = null,
  hasCharCount = true,
  height,
  classInput,
}) => {
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    onChange(e);
  };

  const handleBlur = (e) => {
    setCharCount(e.target.value.length);
    onBlur(e);
  };

  useEffect(() => {
    // for add null checking only
    setCharCount(value?.length);
    // LBM, pengecekan value title null
  }, [value?.length]);

  return (
    <div
      className={"flex flex-col gap-[4px]"}
      style={{
        width: width.width,
        maxWidth: width.maxWidth,
        minWidth: width.minWidth,
      }}
    >
      <div
        className={`flex w-full gap-[8px] p-12 ${
          disabled && style.input_disabled
        } ${style.input_style} ${
          status === "error"
            ? style.border_red
            : status === "success"
              ? style.border_success
              : ""
        }`}
      >
        <textarea
          onChange={handleChange}
          onBlur={handleBlur}
          ref={ref}
          type={type}
          name={name}
          placeholder={placeholder}
          className={`grow ${style.input} ${classInput} text-sm font-semibold leading-[15.4px] text-neutral-900 placeholder:text-neutral-600 lg:text-xs lg:font-medium lg:leading-[14.4px]`}
          disabled={disabled}
          style={{ resize: resize, minHeight: height ? height : "80px" }}
          maxLength={maxLength}
          value={value}
        />
      </div>
      {
        <div
          className={`flex items-center justify-between ${style.supportive_text} ${
            status === "error"
              ? style.text_danger
              : status === "success"
                ? style.text_success
                : ""
          }`}
        >
          {(supportiveText.title || supportiveText.desc) && (
            <>
              <span>{supportiveText.title}</span>
              <span>{supportiveText.desc}</span>
            </>
          )}

          {hasCharCount && (
            <div className="ml-auto">
              {charCount}
              {maxLength ? `/${maxLength}` : ""}
            </div>
          )}
        </div>
      }
    </div>
  );
};

export default TextArea;

TextArea.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(["text", "number", "email"]),
  name: PropTypes.string,
  supportiveText: PropTypes.object,
  disabled: PropTypes.bool,
  status: PropTypes.oneOf(["success", "error"]),
  width: PropTypes.object,
  resize: PropTypes.string,
  maxLength: PropTypes.number,
  hasCharCount: PropTypes.bool,
  height: PropTypes.number,
};
