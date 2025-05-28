import { cva } from "class-variance-authority";

import { cn } from "@/lib/cn";

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
          "top-1 size-[12px] border-[4px] border-[#461B02] bg-white",
        "bullet-active":
          "top-1 size-[12px] border-[4px] border-[#FFC217] bg-[#461B02]",
        "number-muat": "top-0 size-4 bg-[#FFC217] text-[#461B02]",
        "number-bongkar": "top-0 size-4 bg-[#461B02] text-white",
        "field-muat": "top-[2px] size-4 bg-[#FFC217] text-[#461B02]",
        "field-bongkar": "top-[2px] size-4 bg-[#461B02] text-white",
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
          {variant !== "bullet" && index + 1}
        </span>
      </div>
      <div className="min-w-0">{children}</div>
      {withSeparator && <hr />}
    </li>
  );
};

export const TimelineContentWithButton = ({
  title,
  subtitle,
  onSubtitleClick,
  className,
}) => {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div
        className={cn(
          "text-base font-semibold leading-tight text-gray-700",
          className
        )}
      >
        {title}
      </div>
      <button
        onClick={onSubtitleClick}
        className="w-fit text-sm text-[#176CF7]"
      >
        {subtitle}
      </button>
    </div>
  );
};

export const TimelineContentAddress = ({ title, className }) => {
  return (
    <div
      className={cn(
        "w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap pb-4 text-base font-semibold leading-tight text-gray-700",
        className
      )}
    >
      {title}
    </div>
  );
};
