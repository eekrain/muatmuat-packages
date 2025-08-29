"use client";

import Link from "next/link";

import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

const BreadCrumb = ({
  data = [],
  className,
  disableActive = false,
  disableClick = false,
  maxWidth,
}) => {
  const getItemClasses = (idx) =>
    cn(
      "text-xs font-medium capitalize text-neutral-600",
      "hover:text-primary-700",
      idx === data.length - 1
        ? "!max-w-none"
        : "overflow-hidden text-ellipsis whitespace-nowrap",
      !disableActive && idx === data.length - 1 && "text-primary-700",
      !disableClick && idx !== data.length - 1 && "cursor-pointer"
    );

  return (
    <div className={cn("flex items-center gap-[5px]", className)}>
      {data?.map((val, idx) => (
        <div className="flex items-center gap-[5px]" key={idx}>
          {val.href ? (
            <Link href={val.href} className={getItemClasses(idx)}>
              {val.name}
            </Link>
          ) : (
            <div
              style={{ maxWidth: maxWidth ? `${maxWidth}px` : "" }}
              className={getItemClasses(idx)}
            >
              {val.name}
            </div>
          )}
          {idx !== data.length - 1 && (
            <IconComponent
              src="/icons/chevron-right.svg"
              className="[&>path]:stroke-[2px]"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default BreadCrumb;

BreadCrumb.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ),
  className: PropTypes.string,
  disableActive: PropTypes.bool,
  maxWidth: PropTypes.number,
};
