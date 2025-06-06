import { cn } from "@/lib/cn";

export const FormContainer = ({ children, className }) => (
  <div className={cn("flex w-full items-start gap-8", className)}>
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
      "flex h-4 w-[174px] items-center gap-1 text-xs font-medium leading-[1.2] text-neutral-600",
      variant === "big" && "h-8",
      className
    )}
  >
    <label>
      {children}
      {required ? "*" : " (Opsional)"}
    </label>

    {/* If you need to add like InfoTooltip, you can add via tooltip props */}
    <div className="flex-shrink-0">{tooltip}</div>
  </div>
);
