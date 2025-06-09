import PropTypes from "prop-types";

import { cn } from "@/lib/cn";

import IconComponent from "../IconComponent/IconComponent";
import style from "./Button.module.scss";

const Button = ({
  color = "primary",
  children = "Button",
  name,
  onClick,
  className,
  iconLeft = null,
  iconRight = null,
  disabled = false,
  type = "muatparts",
}) => {
  /*
    @params color = ['primary', 'primary_secondary', 'error', 'error_secondary', 'warning']

    @params disabled = true or false
  */

  let disabledProp = "";
  let colorIcon;

  if (!color.includes("secondary")) {
    colorIcon = style["fill_white"];
  } else {
    colorIcon = style[`fill_${color.split("_")[0]}`];
  }

  if (disabled && color.includes("secondary")) {
    disabledProp = style["btn_disabled_secondary"];
  } else if (disabled) {
    disabledProp = style["btn_disabled"];
  }

  return (
    <button
      name={name}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h:10 flex items-center justify-center gap-[4px] rounded-[24px] px-[24px] py-[12px] text-[14px] !font-semibold leading-[16.8px] transition-colors lg:h-8",
        `${disabledProp} ${style.btn}`,
        className,
        style[`btn_${type}_${color}`]
      )}
      type="submit"
    >
      {typeof iconLeft === "string" ? (
        <IconComponent
          loader={false}
          src={iconLeft}
          height={16}
          width={16}
          className={disabled ? style["fill_disabled"] : colorIcon}
        />
      ) : (
        iconLeft
      )}
      {children}
      {typeof iconRight === "string" ? (
        <IconComponent
          loader={false}
          src={iconRight}
          height={16}
          width={16}
          className={disabled ? style["fill_disabled"] : colorIcon}
        />
      ) : (
        iconRight
      )}
    </button>
  );
};

export default Button;

Button.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "primary_secondary",
    "error",
    "error_secondary",
    "warning",
  ]),
  name: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  disabled: PropTypes.bool,
};
