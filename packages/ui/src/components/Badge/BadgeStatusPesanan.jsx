import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

const badgeVariants = {
  primary: "bg-primary-50 text-primary-700",
  warning: "bg-warning-100 text-[#FF7A00]",
  error: "bg-error-50 text-error-400",
  success: "bg-success-50 text-success-400",
  muted: "text-neutral-600 bg-neutral-200",
};

/**
 * BadgeStatusPesanan component displays a status badge with optional icon and custom styles.
 *
 * @param {Object} props - Component props.
 * @param {"primary"|"secondary"|"success"|"warning"|"error"|"muted"} [props.variant="primary"] - The visual style of the badge. Autocomplete: "primary", "secondary", "success", "warning", "danger".
 * @param {string} [props.className] - Additional CSS classes to apply to the badge.
 * @param {{ iconLeft: string }} [props.icon={ iconLeft: "" }] - Icon configuration object. `iconLeft` is the source URL or path for the left icon.
 * @param {React.ReactNode} props.children - The content to display inside the badge.
 * @returns {JSX.Element} The rendered badge component.
 */
export const BadgeStatusPesanan = ({
  variant = "primary",
  className,
  icon = { iconLeft: "" },
  children,
}) => {
  return (
    <div
      className={cn(
        "inline-flex h-6 w-[176px] items-center justify-center gap-1 rounded-[6px] px-2 text-sm font-semibold leading-[1.2] md:text-xs",
        badgeVariants[variant],
        className
      )}
    >
      {typeof icon.iconLeft === "string" && (
        <IconComponent src={icon.iconLeft} width={14} height={14} />
      )}
      <div>{children}</div>
    </div>
  );
};
