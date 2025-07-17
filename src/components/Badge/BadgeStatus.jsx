import { cn } from "@/lib/utils";

const BadgeStatus = ({
  variant = "neutral",
  className,
  children,
  ...props
}) => {
  const variants = {
    primary: "bg-primary-50 text-primary-700 ",
    success: "bg-success-50 text-success-700 ",
    warning: "bg-warning-100 text-warning-900 ",
    error: "bg-error-100 text-error-700 ",
    neutral: "bg-neutral-100 text-neutral-700 ",
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
