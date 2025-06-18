import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/formatters";

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
  "absolute left-1/2 inline-flex -translate-x-1/2 items-center justify-center rounded-full text-[10px] font-bold",
  {
    variants: {
      variant: {
        "bullet-inactive":
          "top-0 size-[16px] border-[4px] border-[#461B02] bg-white",
        "bullet-active":
          "top-0 size-[16px] border-[4px] border-[#FFC217] bg-[#461B02]",
        "number-muat": "top-0 size-4 bg-[#FFC217] text-[#461B02]",
        "number-bongkar": "top-0 size-4 bg-[#461B02] text-white",
        "field-muat": "top-[2px] size-4 bg-[#FFC217] text-[#461B02]",
        "field-bongkar": "top-[2px] size-4 bg-[#461B02] text-white",
        "bullet-driver-status-inactive":
          "top-0 size-[16px] border-[4px] border-neutral-200 bg-neutral-600",
        "bullet-driver-status-active":
          "top-0 size-[16px] border-[4px] border-[#FFC217] bg-[#461B02]",
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
              })
            )}
          />
        )}
        <span
          className={cn(
            bulletVariants({
              variant: getVariant().bullet,
            })
          )}
        >
          {!variant.startsWith("bullet") && (
            <div className="mt-[4px]">{index + 1}</div>
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
}) => {
  return (
    <div className={cn("flex items-center justify-between pb-5", className)}>
      <div className="flex flex-col gap-2">
        <span className="line-clamp-1 text-xs font-medium leading-[1.2] text-neutral-900">
          {title}
        </span>
        {withButton && (
          <button
            onClick={withButton.onClick}
            className="w-fit text-xs font-medium leading-[1.2] text-primary-700"
          >
            {withButton.label}
          </button>
        )}
      </div>

      {withDate && (
        <span className="block text-xs font-medium leading-[1.2] text-neutral-500">
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
        "w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap pb-4 text-base font-semibold leading-tight text-gray-700",
        className
      )}
      {...props}
    >
      {title}
    </div>
  );
};
