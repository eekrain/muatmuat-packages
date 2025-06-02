"use client";

import IconComponent from "../IconComponent/IconComponent";
import style from "./Tooltip.module.scss";

const Tooltip = ({
  className,
  text,
  children,
  title,
  icon,
  position = "bottom",
  ...props
}) => {
  return (
    <div
      className="group relative flex cursor-pointer items-center justify-center"
      {...props}
    >
      <div className="absolute hidden w-[312px] group-hover:block">
        <div
          className={`relative flex flex-col-reverse items-center justify-start ${style[`position_${position}`]}`}
        >
          <div
            className={`flex gap-[8px] bg-neutral-50 ${style[`box_shadow_${position}`]} z-[1] cursor-default rounded-[12px] p-[12px]`}
          >
            <div className={"mt-[2px] w-[16px]"}>
              {icon && (
                <IconComponent
                  loader={false}
                  src={{ src: "/icons/info.svg" }}
                  height={16}
                  width={16}
                  className={style.fill_black}
                />
              )}
            </div>
            <div className="flex flex-col gap-[8px]">
              {title && <div className={`${style.title}`}>{title}</div>}
              {text && (
                <div className={`${style.text} ${className}`}>{text}</div>
              )}
            </div>
          </div>
          <div
            className={`absolute h-[15px] w-[15px] bg-neutral-50 ${style[`tooltip_${position}`]}`}
          ></div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Tooltip;
