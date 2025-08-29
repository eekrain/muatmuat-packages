import { cva } from "class-variance-authority";
import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

import IconComponent from "../IconComponent/IconComponent";

/**
 * @typedef {'muattrans-primary' | 'muattrans-primary-secondary' | 'muattrans-error' | 'muattrans-error-secondary' | 'muattrans-warning' | 'muatparts-primary' | 'muatparts-primary-secondary' | 'muatparts-error' | 'muatparts-error-secondary' | 'muatparts-warning'} ButtonVariant
 */

const buttonVariants = cva(
  // Base styles
  "flex h-10 items-center justify-center gap-1 rounded-[24px] py-3 text-sm font-semibold leading-[16.8px] transition-colors md:h-8 md:px-6",
  {
    variants: {
      variant: {
        // MuatTrans variants
        "muattrans-primary":
          "bg-[--muat-trans-primary-400] text-neutral-900 hover:bg-[--muat-trans-primary-500]",
        "muattrans-outline-primary":
          "border border-neutral-900 bg-neutral-50 text-neutral-900",
        "muattrans-primary-secondary":
          "border border-[--muat-trans-secondary-900] bg-neutral-50 text-[--muat-trans-secondary-900] hover:bg-[--muat-trans-secondary-50]",
        "muattrans-error": "bg-error-400 text-neutral-50 hover:bg-error-600",
        "muattrans-error-secondary":
          "border border-error-400 bg-neutral-50 text-error-400 hover:bg-error-50",
        "muattrans-warning":
          "bg-secondary-500 text-primary-700 hover:bg-secondary-300",

        // MuatParts variants
        "muatparts-primary":
          "bg-primary-700 text-neutral-50 hover:bg-primary-800",
        "muatparts-primary-secondary":
          "border border-primary-700 bg-neutral-50 text-primary-700 hover:bg-primary-50",
        "muatparts-error": "bg-error-400 text-neutral-50 hover:bg-error-600",
        "muatparts-error-secondary":
          "border border-error-400 bg-neutral-50 text-error-400 hover:bg-error-50",
        "muatparts-warning":
          "bg-secondary-500 text-primary-700 hover:bg-secondary-300",

        // Link variant
        link: "border-0 bg-transparent p-0 px-0 font-medium text-primary-700 no-underline hover:text-primary-800 md:h-[14px] md:px-0",
      },
      disabled: {
        true: "cursor-not-allowed bg-neutral-200 text-neutral-600 hover:bg-neutral-200",
        "true-secondary":
          "cursor-not-allowed border border-neutral-600 bg-neutral-200 text-neutral-600 hover:bg-neutral-200",
      },
    },
    defaultVariants: {
      variant: "muattrans-primary",
      disabled: false,
    },
  }
);

const iconColorVariants = {
  "muattrans-primary": "text-neutral-900",
  "muattrans-primary-secondary": "text-muat-trans-secondary-900",
  "muattrans-error": "text-white",
  "muattrans-error-secondary": "text-error-400",
  "muattrans-warning": "text-primary-700",
  "muatparts-primary": "text-white",
  "muatparts-primary-secondary": "text-primary-700",
  "muatparts-error": "text-white",
  "muatparts-error-secondary": "text-error-400",
  "muatparts-warning": "text-primary-700",
  link: "text-primary-700",
};

/**
 * Button component with various visual variants for MuatTrans and MuatParts applications
 * @param {Object} props - Component props
 * @param {ButtonVariant} [props.variant='muattrans-primary'] - Visual variant of the button
 * @param {React.ReactNode} [props.children='Button'] - Content to be rendered inside the button
 * @param {string} [props.className] - Additional CSS classes to be applied
 * @param {string | React.ReactNode} [props.iconLeft] - Icon to be rendered on the left side of the content
 * @param {string | React.ReactNode} [props.iconRight] - Icon to be rendered on the right side of the content
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {import('react').ButtonHTMLAttributes<HTMLButtonElement>} props.buttonProps - Native button element props
 * @returns {JSX.Element} Rendered Button component
 */
const Button = ({
  variant = "muattrans-primary",
  children = "Button",
  className,
  iconLeft = null,
  iconRight = null,
  disabled = false,
  keepDisabledStyle = false,
  appearance = {
    iconClassName: "",
  },
  ...buttonProps
}) => {
  const isSecondaryVariant = variant.includes("secondary");
  const disabledVariant = isSecondaryVariant ? "true-secondary" : true;
  const iconColorClass = disabled ? "icon-gray" : iconColorVariants[variant];

  return (
    <button
      disabled={disabled}
      className={cn(
        buttonVariants({
          variant: disabled && !keepDisabledStyle ? undefined : variant,
          disabled: disabled && !keepDisabledStyle ? disabledVariant : false,
          className,
        })
      )}
      {...buttonProps}
    >
      {typeof iconLeft === "string" ? (
        <IconComponent
          loader={false}
          src={iconLeft}
          height={16}
          width={16}
          className={cn(iconColorClass, appearance.iconClassName)}
        />
      ) : (
        iconLeft
      )}
      <span>{children}</span>
      {typeof iconRight === "string" ? (
        <IconComponent
          loader={false}
          src={iconRight}
          height={16}
          width={16}
          className={cn(iconColorClass, appearance.iconClassName)}
        />
      ) : (
        iconRight
      )}
    </button>
  );
};

export default Button;

Button.propTypes = {
  variant: PropTypes.oneOf([
    "muattrans-primary",
    "muattrans-outline-primary",
    "muattrans-primary-secondary",
    "muattrans-error",
    "muattrans-error-secondary",
    "muattrans-warning",
    "muatparts-primary",
    "muatparts-primary-secondary",
    "muatparts-error",
    "muatparts-error-secondary",
    "muatparts-warning",
  ]),
  children: PropTypes.node,
  className: PropTypes.string,
  iconLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconRight: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  disabled: PropTypes.bool,
};
