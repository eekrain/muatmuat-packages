import { cn } from "@/lib/utils";

export const FormContainer = ({ children, className }) => (
  <div
    className={cn(
      "flex w-full flex-col items-start gap-4 bg-white px-4 py-5 md:flex-row md:gap-8 md:bg-transparent md:p-0",
      className
    )}
  >
    {children}
  </div>
);

export const FormLabel = ({
  variant = "big",
  required = false,
  className,
  children,
  tooltip,
}) => (
  <div
    className={cn(
      "flex h-4 w-full items-center gap-1 text-sm font-bold leading-[1.1] text-neutral-900 md:w-[174px] md:text-xs md:font-medium md:leading-[1.2] md:text-neutral-600",
      variant === "big" && "h-8",
      className
    )}
  >
    <label className="mt-[2px]">
      {children}
      {required ? "*" : " (Opsional)"}
    </label>

    {/* If you need to add like InfoTooltip, you can add via tooltip props */}
    <div className="flex-shrink-0">{tooltip}</div>
  </div>
);
