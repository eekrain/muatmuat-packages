"use client";

import { useRouter } from "next/navigation";

import PropTypes from "prop-types";

import IconComponent from "../IconComponent/IconComponent";
import style from "./BreadCrumb.module.scss";

const BreadCrumb = ({
  data,
  onclick = () => {},
  onActive = () => {},
  classname,
  disableActive = false,
  disableClick = false,
  maxWidth,
}) => {
  const router = useRouter();
  function handleClick(val) {
    if (val) {
      if (val.id == "home") {
        router.push("/");
        return;
      }
      if (disableClick) return;
      onclick(val);
      onActive(data[data.length - 1]);
    }
  }

  return (
    <div className={`${style.main} ${style.breadcrumb} ${classname}`}>
      {data?.map((val, idx) => {
        return (
          <div className="flex items-center gap-[5px]" key={idx}>
            <div
              style={{ maxWidth: maxWidth ? `${maxWidth}` : "86px" }}
              className={`${`${style.list} hover:text-primary-700`} ${
                idx === data.length - 1
                  ? "!max-w-none"
                  : "overflow-hidden text-ellipsis whitespace-nowrap"
              } ${disableActive ? "" : "last:text-primary-700"} select-none ${!disableClick ? "cursor-pointer" : ""}`}
              key={idx}
              onClick={() => handleClick(val)}
            >
              {val.name}
            </div>
            {idx !== data.length - 1 && (
              <IconComponent
                src={"/icons/chevron-right.svg"}
                classname={style.Icon}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BreadCrumb;
BreadCrumb.propTypes = {
  data: PropTypes.array,
  onclick: PropTypes.func,
  onActive: PropTypes.func,
  classname: PropTypes.string,
  disableActive: PropTypes.bool,
  maxWidth: PropTypes.number,
};
