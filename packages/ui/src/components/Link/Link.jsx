import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const linkVariants = cva(
  'inline-flex items-center transition-colors cursor-pointer',
  {
    variants: {
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
      },
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
      color: {
        primary: 'text-blue-600 hover:text-blue-800',
        secondary: 'text-gray-600 hover:text-gray-800',
        success: 'text-green-600 hover:text-green-800',
        error: 'text-red-600 hover:text-red-800',
        warning: 'text-yellow-600 hover:text-yellow-800',
        inherit: 'text-inherit',
        current: 'text-current',
      },
      underline: {
        none: 'no-underline',
        hover: 'no-underline hover:underline',
        always: 'underline',
      },
      disabled: {
        true: 'text-gray-400 cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      size: 'base',
      weight: 'normal',
      color: 'primary',
      underline: 'hover',
      disabled: false,
    },
  }
);

/**
 * @typedef {Object} LinkProps
 * @property {string} [href] - URL destination
 * @property {React.ElementType} [as='a'] - The HTML element or component to render
 * @property {'xs'|'sm'|'base'|'lg'|'xl'|'2xl'} [size] - Link text size
 * @property {'normal'|'medium'|'semibold'|'bold'} [weight] - Font weight
 * @property {'primary'|'secondary'|'success'|'error'|'warning'|'inherit'|'current'} [color] - Link color
 * @property {'none'|'hover'|'always'} [underline] - Underline style
 * @property {boolean} [external=false] - Whether this is an external link
 * @property {boolean} [disabled=false] - Whether the link is disabled
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} [children] - Child elements
 * @property {(e: React.MouseEvent) => void} [onClick] - Click handler
 */

/**
 * Link component for navigation
 * @param {LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>} props
 */
const Link = ({
  href,
  as: Component = 'a',
  size,
  weight,
  color,
  underline,
  external = false,
  disabled = false,
  className,
  children,
  onClick,
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  const linkProps = {
    href: disabled ? undefined : href,
    onClick: handleClick,
    className: cn(
      linkVariants({ size, weight, color, underline, disabled }),
      className
    ),
    ...props,
  };

  if (external && !disabled) {
    linkProps.target = '_blank';
    linkProps.rel = 'noopener noreferrer';
  }

  return (
    <Component {...linkProps}>
      {children}
      {external && !disabled && (
        <svg
          className="ml-1 w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      )}
    </Component>
  );
};

export default Link;