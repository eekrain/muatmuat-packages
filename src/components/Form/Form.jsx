import { cn } from "@/lib/utils";

export const FormContainer = ({ children, className }) => (
  <div
    className={cn(
      "grid grid-cols-1 items-start gap-4 bg-white md:grid-cols-[174px_1fr] md:gap-8",
      className
    )}
  >
    {children}
  </div>
);

export const FormLabel = ({
  variant = "big",
  required = false,
  optional = false,
  className,
  children,
  tooltip,
}) => (
  <div
    className={cn(
      "flex w-full items-center gap-1 text-sm font-semibold leading-[1.1] text-neutral-900 md:h-4 md:w-[174px] md:text-xs md:font-medium md:leading-[1.2] md:text-neutral-600",
      variant === "big" && "md:h-8",
      className
    )}
  >
    {typeof children === "string" ? (
      <label className="mt-[2px]">
        {children}
        {required && <span>*</span>}
        {optional && (
          <>
            &nbsp;
            <span className="text-xxs md:text-xs md:font-medium md:italic md:text-neutral-500">
              (Opsional)
            </span>
          </>
        )}
      </label>
    ) : (
      children
    )}

    {/* If you need to add like InfoTooltip, you can add via tooltip props */}
    <div className="flex-shrink-0">{tooltip}</div>
  </div>
);
