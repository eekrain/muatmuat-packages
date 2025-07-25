import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";

import IconComponent from "../IconComponent/IconComponent";

export const lineVariants = cva(
  "absolute left-1/2 top-1 block h-full -translate-x-1/2 border-l-[2px] border-dashed",
  {
    variants: {
      variant: {
        inactive: "border-[#E5E5E5]",
        active: "border-[#FFC217]",
      },
    },
    defaultVariants: {
      variant: "inactive",
    },
  }
);

export const bulletVariants = cva(
  "absolute left-1/2 inline-flex -translate-x-1/2 items-center justify-center rounded-full font-bold",
  {
    variants: {
      variant: {
        "bullet-inactive":
          "top-0 box-content size-[7px] border-[5px] border-[#461B02] bg-white",
        "bullet-active":
          "top-0 box-content size-[7px] border-[5px] border-[#FFC217] bg-[#461B02]",
        "number-muat": "top-0 size-4 bg-[#FFC217] text-[#461B02]",
        "number-bongkar": "top-0 size-4 bg-[#461B02] text-white",
        "field-muat": "top-0 size-4 bg-[#FFC217] text-[#461B02]",
        "field-bongkar": "top-0 size-4 bg-[#461B02] text-white",
        "bullet-driver-status-inactive":
          "top-0 box-content size-[7px] border-[5px] border-neutral-200 bg-neutral-600",
        "bullet-driver-status-active":
          "top-0 box-content size-[7px] border-[5px] border-[#FFC217] bg-[#461B02]",
      },
    },
    defaultVariants: {
      variant: "bullet-inactive",
    },
  }
);

export const TimelineContainer = ({ children, className }) => {
  return <ul className={className}>{children}</ul>;
};

/**
 * @typedef {Object} TimelineItemProps
 * @property {"bullet" | "number-muat" | "number-bongkar"} variant
 * @property {number} totalLength
 * @property {number} index
 * @property {number} activeIndex
 * @property {string} className
 * @property {React.ReactNode} children
 */
/**
 * @param {TimelineItemProps} props
 */
export const TimelineItem = ({
  variant,
  totalLength,
  index,
  activeIndex,
  className,
  children,
  withSeparator = false,
  appearance = {
    lineClassname: "",
    bulletClassname: "",
  },
}) => {
  const getVariant = () => {
    const selected = {};

    if (variant === "bullet")
      selected.line = index <= activeIndex - 1 ? "active" : "inactive";
    else selected.line = "inactive";

    // setting bullet variant
    if (variant === "bullet")
      selected.bullet =
        index <= activeIndex ? "bullet-active" : "bullet-inactive";
    else if (variant === "bullet-driver-status")
      selected.bullet =
        index <= activeIndex
          ? "bullet-driver-status-active"
          : "bullet-driver-status-inactive";
    else selected.bullet = variant;

    return selected;
  };

  return (
    <li className={cn("grid grid-cols-[14px_1fr] gap-4", className)}>
      <div className="relative">
        {index !== totalLength - 1 && (
          <span
            className={cn(
              lineVariants({
                variant: getVariant().line,
              }),
              appearance.lineClassname
            )}
          />
        )}
        <span
          className={cn(
            bulletVariants({
              variant: getVariant().bullet,
            }),
            appearance.bulletClassname
          )}
        >
          {!variant.startsWith("bullet") && (
            <div className="md:-ml=[1px] -mt-[1px] text-xxs md:mt-[1px]">
              {index + 1}
            </div>
          )}
        </span>
      </div>
      <div className="min-w-0">{children}</div>
      {withSeparator && <hr />}
    </li>
  );
};

export const TimelineContentWithButtonDate = ({
  title,
  className,
  withButton = null,
  withDate = null,
  appearance = {
    titleClassname: "",
    dateClassname: "",
    buttonClassname: "",
  },
}) => {
  return (
    <div
      className={cn(
        "flex items-start justify-between pb-5 md:items-center",
        className
      )}
    >
      <div className="flex flex-col gap-[2px]">
        <span
          className={cn(
            "line-clamp-2 text-sm font-semibold leading-[1.2] text-neutral-900 md:line-clamp-1 md:font-medium",
            appearance?.titleClassname
          )}
        >
          {title}
        </span>
        {withButton && (
          <button
            onClick={withButton.onClick}
            className={cn(
              "h-2 w-fit text-xs font-semibold leading-[1.2] text-primary-700 md:font-medium",
              appearance?.buttonClassname
            )}
          >
            {withButton.label}
          </button>
        )}
      </div>

      {withDate && (
        <span
          className={cn(
            "block w-20 text-right text-xs font-medium leading-[1.2] text-neutral-500 md:w-fit",
            appearance?.dateClassname
          )}
        >
          {formatDate(withDate)}
        </span>
      )}
    </div>
  );
};

export const TimelineContentAddress = ({ title, className, ...props }) => {
  return (
    <div
      className={cn(
        "w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap pb-4 text-sm font-semibold leading-[1.2] text-neutral-900 md:text-xs md:font-medium",
        className
      )}
      {...props}
    >
      {title}
    </div>
  );
};

export const TimelinePICData = ({
  title = null,
  address = "",
  details = "",
  picName = "",
  picPhone = "",
  className,
  setHeight,
}) => {
  return (
    <div className={cn("flex w-full flex-col pb-3", className)}>
      {title && (
        <div className="h-5 text-xs font-medium text-neutral-600">{title}</div>
      )}
      {/* Detail items */}
      <div className="grid grid-cols-[166px_1fr] gap-2">
        <div className="col-span-2 text-xs font-medium text-neutral-900">
          {address}
        </div>

        <div className="flex items-center gap-2">
          <IconComponent
            src="/icons/topik-amandemen16.svg"
            width={16}
            height={16}
            classname="text-[#461B02]"
          />
          <span className="text-xs font-medium text-neutral-600">
            Detail Lokasi:
          </span>
        </div>
        <span className="text-xs font-medium text-neutral-900">{details}</span>

        <div className="flex items-center gap-2">
          <IconComponent
            src="/icons/profile16.svg"
            width={16}
            height={16}
            classname="text-[#461B02]"
          />
          <span className="text-xs font-medium text-neutral-600">
            Nama PIC Lokasi Muat:
          </span>
        </div>
        <span className="text-xs font-medium text-neutral-900">{picName}</span>

        <div className="flex items-center gap-2">
          <IconComponent
            src="/icons/call16.svg"
            width={16}
            height={16}
            classname="text-[#461B02]"
          />
          <span className="text-xs font-medium text-neutral-600">
            No. HP PIC Lokasi Muat:
          </span>
        </div>
        <span className="text-xs font-medium text-neutral-900">{picPhone}</span>
      </div>
    </div>
  );
};
