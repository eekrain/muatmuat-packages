import { cva } from 'class-variance-authority';

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    },
    color: {
      primary: 'text-blue-600',
      secondary: 'text-gray-600',
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-yellow-600',
      white: 'text-white',
      current: 'text-current',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});

/**
 * @typedef {Object} SpinnerProps
 * @property {'xs'|'sm'|'md'|'lg'|'xl'} [size] - Spinner size
 * @property {'primary'|'secondary'|'success'|'error'|'warning'|'white'|'current'} [color] - Spinner color
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Spinner component for loading states
 * @param {SpinnerProps & React.SVGAttributes<SVGElement>} props
 */
const Spinner = ({
  size,
  color,
  className,
  ...props
}) => {
  return (
    <svg
      className={spinnerVariants({ size, color, className })}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export default Spinner;