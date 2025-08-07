import { useClientHeight } from "@/hooks/use-client-height";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";

import IconComponent from "../IconComponent/IconComponent";

const lineStyles = {
  inactive: "border-neutral-400",
  active: "border-muat-trans-primary-400",
};

const bulletStyles = {
  "bullet-inactive": {
    outer: "bg-muat-trans-secondary-900",
    inner: "bg-neutral-50",
  },
  "bullet-active": {
    outer: "bg-muat-trans-primary-400",
    inner: "bg-muat-trans-secondary-900",
  },
  "number-muat": {
    outer: "bg-muat-trans-primary-400 text-muat-trans-secondary-900",
    inner: "",
  },
  "number-bongkar": {
    outer: "bg-muat-trans-secondary-900 text-white",
    inner: "",
  },
  "field-muat": {
    outer: "bg-muat-trans-primary-400 text-muat-trans-secondary-900",
    inner: "",
  },
  "field-bongkar": {
    outer: "bg-muat-trans-secondary-900 text-white",
    inner: "",
  },
  "bullet-driver-status-inactive": {
    outer: "bg-neutral-200 ",
    inner: "bg-neutral-600",
  },
  "bullet-driver-status-active": {
    outer: "bg-muat-trans-primary-400",
    inner: "bg-muat-trans-secondary-900",
  },
};

const getVariant = ({ variant, index, activeIndex }) => {
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
export const TimelineContainer = ({ children, className }) => {
  return <ul className={className}>{children}</ul>;
};

export const NewTimelineItem = ({
  variant,
  index,
  activeIndex,
  onClick,
  title,
  isLast,
  timestamp,
  className,
  appearance = {
    contentClassname: "",
    titleClassname: "",
    timestampClassname: "",
  },
  buttonDetail = null,
  buttonRemove = null,
  withDivider = false,
}) => {
  const variantStyles = getVariant({ variant, index, activeIndex });

  const { ref: containerRef, height: containerHeight } = useClientHeight();
  const { ref: contentRef, height: contentHeight } = useClientHeight();

  return (
    <div
      ref={containerRef}
      className={cn(
        "grid grid-cols-[16px_1fr] items-center gap-x-2 pb-5",
        buttonDetail && "items-start pb-4",
        className,
        isLast && "pb-0"
      )}
    >
      <div className="relative flex justify-center">
        {!isLast && (
          <div
            className={cn(
              "absolute left-1/2 top-0 h-[20px] w-px flex-1 -translate-x-1/2 border-l-2 border-dashed",
              lineStyles?.[variantStyles.line]
            )}
            style={{
              height: `${containerHeight - contentHeight / 2 + 4}px`,
              top: `${contentHeight / 2}px`,
            }}
          />
        )}

        <div
          className={cn(
            "relative flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full font-bold",
            bulletStyles?.[variantStyles.bullet].outer
          )}
        >
          {!variant.startsWith("bullet") ? (
            <div className="mt-[1.5px] text-xxs md:mt-[0.5px]">{index + 1}</div>
          ) : (
            <div
              className={cn(
                "absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                bulletStyles?.[variantStyles.bullet].inner
              )}
            />
          )}
        </div>
      </div>

      <div
        ref={contentRef}
        className={cn(
          "flex w-full items-center justify-between",
          appearance.contentClassname
        )}
      >
        <div className="relative">
          <span
            onClick={onClick}
            className={cn(
              "line-clamp-2 text-sm font-semibold text-neutral-900 md:mt-0.5",
              buttonDetail && "-mt-[1px] line-clamp-1 break-all md:mt-0",
              onClick && "cursor-pointer",
              appearance.titleClassname
            )}
          >
            {title}
          </span>
          {buttonDetail && <div className="mt-1">{buttonDetail}</div>}
        </div>

        {buttonRemove ? (
          buttonRemove
        ) : timestamp ? (
          <span
            className={cn(
              "max-w-20 text-right text-xs font-medium text-neutral-600 md:w-fit",
              appearance.timestampClassname
            )}
          >
            {formatDate(timestamp)}
          </span>
        ) : null}
      </div>

      {withDivider && (
        <>
          <div />
          <hr className="my-3 block border-[#C4C4C4]" />
        </>
      )}
    </div>
  );
};

export const TimelinePICData = ({
  title,
  data = {
    address: "",
    details: "",
    picName: "",
    picPhone: "",
  },
  variant,
  index,
  activeIndex,
  className,
  isLast,
}) => {
  const variantStyles = getVariant({ variant, index, activeIndex });

  const { ref: containerRef, height: containerHeight } = useClientHeight();
  const { ref: contentRef, height: contentHeight } = useClientHeight();

  return (
    <div ref={containerRef} className="grid grid-cols-[16px_1fr] gap-x-3">
      <div className="relative flex justify-center">
        {!isLast && (
          <div
            className={cn(
              "absolute left-1/2 top-0 h-[20px] w-px flex-1 -translate-x-1/2 border-l-2 border-dashed",
              lineStyles.inactive
            )}
            style={{
              height: `${containerHeight - 16}px`,
              top: "16px",
            }}
          />
        )}

        <div
          className={cn(
            "relative flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full font-bold",
            bulletStyles?.[variantStyles.bullet].outer
          )}
        >
          {!variant.startsWith("bullet") ? (
            <div className="ml-[0.5px] mt-[1px] text-xxs">{index + 1}</div>
          ) : (
            <div
              className={cn(
                "absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                bulletStyles?.[variantStyles.bullet].inner
              )}
            />
          )}
        </div>
      </div>

      <div
        ref={contentRef}
        className={cn("flex w-full flex-col pb-3", title && "-mt-5", className)}
      >
        {title && (
          <div className="h-5 text-xs font-medium text-neutral-600">
            {title}
          </div>
        )}
        {/* Detail items */}
        <div className="mt-0.5 grid grid-cols-[166px_1fr] gap-2">
          <div className="col-span-2 text-xs font-medium text-neutral-900">
            {data.address}
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
          <span className="text-xs font-medium text-neutral-900">
            {data.details}
          </span>

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
          <span className="text-xs font-medium text-neutral-900">
            {data.picName}
          </span>

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
          <span className="text-xs font-medium text-neutral-900">
            {data.picPhone}
          </span>
        </div>
      </div>
    </div>
  );
};
