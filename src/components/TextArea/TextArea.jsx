"use client";
import React, { useEffect, useState } from "react";
import style from "./TextArea.module.scss";
import PropTypes from "prop-types";

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
  changeEvent = () => {},
  blurEvent = () => {},
  maxLength = null,
  hasCharCount = true,
  height,
  classInput,
}) => {
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    changeEvent(e);
  };

  const handleBlur = (e) => {
    setCharCount(e.target.value.length);
    blurEvent(e);
  };

  useEffect(() => {
    // for add null checking only
    setCharCount(value?.length)
    // LBM, pengecekan value title null
  }, [value?.length])

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
        className={`flex w-full p-12 gap-[8px] ${
          disabled && style.input_disabled
        } ${style.input_style}
            ${
              status == "error"
                ? style.border_red
                : status == "success"
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
          className={`grow ${style.input} ${classInput} text-[12px] leading-[14.4px] font-medium text-neutral-900 sm:text-[14px] sm:leading-[15.4px] sm:font-semibold placeholder:text-neutral-600`}
          disabled={disabled}
          style={{ resize: resize,minHeight:height?height:'80px' }}
          maxLength={maxLength}
          value={value}
        />
      </div>
      {
        <div
          className={`flex justify-between ${style.supportive_text}
                ${
                  status == "error"
                    ? style.text_danger
                    : status == "success"
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
  supportiveText: PropTypes.object,
  width: PropTypes.object,
  resize: PropTypes.string,
  maxLength: PropTypes.number,
  hasCharCount: PropTypes.bool,
  height:PropTypes.number
};
