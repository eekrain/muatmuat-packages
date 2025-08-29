"use client";

import { forwardRef } from "react";

import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";

import IconComponent from "../IconComponent/IconComponent";
import style from "./Input.module.scss";

const Input = forwardRef(
  (
    {
      name,
      type = "text",
      placeholder = "Placeholder",
      disabled = false,
      status = null,
      icon = { left: "", right: "" },
      text = { left: "", right: "" },
      supportiveText = { title: "", desc: "" },
      width = { width: "", maxWidth: "", minWidth: "" },
      className,
      classInput,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={`inputClassName flex w-full flex-col gap-y-2 ${className}`}
        style={{
          width: width.width,
          maxWidth: width.maxWidth,
          minWidth: width.minWidth,
        }}
      >
        <div
          className={`flex h-8 w-full cursor-pointer items-center rounded-md border border-neutral-600 px-3 ${disabled && style.input_disabled} ${style.input_style} ${
            status === "error"
              ? style.border_red
              : status === "success"
                ? style.border_success
                : ""
          } bg-neutral-50`}
        >
          {icon.left ? (
            <div className="mr-2 flex items-center">
              {typeof icon.left === "string" ? (
                <IconComponent
                  loader={false}
                  src={{ src: icon.left }}
                  height={16}
                  width={16}
                  className={`${status === "error" ? style.icon_danger : status === "success" ? style.icon_success : ""}`}
                />
              ) : (
                icon.left
              )}
            </div>
          ) : null}
          {text.left ? (
            <span className="mr-3 text-xs font-medium leading-[14.4px] text-neutral-900 max-[600px]:text-sm max-[600px]:font-semibold max-[600px]:leading-[15.4px]">
              {text.left}
            </span>
          ) : null}
          <input
            {...props}
            type={type}
            ref={ref}
            name={name}
            placeholder={placeholder}
            className={`w-full min-w-[0px] ${style.input} ${classInput} text-xs font-medium leading-[14.4px] text-neutral-900 placeholder:text-neutral-600 max-[600px]:text-sm max-[600px]:font-semibold max-[600px]:leading-[15.4px]`}
            disabled={disabled}
          />
          {!isEmpty(icon.right) ? (
            <div className="ml-2 flex items-center">
              {typeof icon.right === "string" ? (
                <IconComponent
                  loader={false}
                  src={{ src: icon.right }}
                  height={16}
                  width={16}
                  className={`${status === "error" ? style.icon_danger : status === "success" ? style.icon_success : ""}`}
                />
              ) : (
                icon.right
              )}
            </div>
          ) : null}
          {text.right ? (
            <span className="ml-3 text-xs font-medium leading-[14.4px] text-neutral-900 max-[600px]:text-sm max-[600px]:font-semibold max-[600px]:leading-[15.4px]">
              {text.right}
            </span>
          ) : null}
        </div>
        {(supportiveText.title || supportiveText.desc) && (
          <div
            className={`flex items-center justify-between ${style.supportive_text} ${
              status === "error"
                ? style.text_danger
                : status === "success"
                  ? style.text_success
                  : ""
            }`}
          >
            <span>{supportiveText.title}</span>
            <span>{supportiveText.desc}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(["text", "number", "email", "password"]),
  name: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  status: PropTypes.oneOf(["success", "error"]),
  icon: PropTypes.object,
  text: PropTypes.object,
  supportiveText: PropTypes.object,
  width: PropTypes.object,
};

export default Input;
