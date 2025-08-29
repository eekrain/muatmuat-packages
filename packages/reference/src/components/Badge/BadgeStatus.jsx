import { cn } from "@/lib/utils";

const BadgeStatus = ({
  variant = "neutral",
  className,
  children,
  ...props
}) => {
  const variants = {
    primary: "bg-primary-50 text-primary-700 ",
    success: "bg-success-50 text-success-400 ",
    warning: "bg-warning-100 text-warning-900 ",
    error: "bg-error-50 text-error-400 ",
    neutral: "bg-neutral-200 text-neutral-600 ",
    outlineSecondary:
      "border border-neutral-900 bg-transparent text-neutral-900",
    outlineWarning: "border border-error-400 bg-transparent text-error-400",
  };

  return (
    <span
      className={cn(
        "inline-flex w-full items-center justify-center rounded-md px-3 py-1.5 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default BadgeStatus;
