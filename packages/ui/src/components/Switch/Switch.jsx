import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const switchTrackVariants = cva(
  'relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      size: {
        sm: 'w-8 h-4',
        md: 'w-11 h-6',
        lg: 'w-14 h-7',
      },
      color: {
        primary: 'data-[state=checked]:bg-blue-600',
        secondary: 'data-[state=checked]:bg-gray-600',
        success: 'data-[state=checked]:bg-green-600',
        error: 'data-[state=checked]:bg-red-600',
        warning: 'data-[state=checked]:bg-yellow-600',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      size: 'md',
      color: 'primary',
      disabled: false,
    },
  }
);

const switchThumbVariants = cva(
  'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition-transform',
  {
    variants: {
      size: {
        sm: 'w-3 h-3',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
      },
      checked: {
        true: '',
        false: 'translate-x-0.5',
      },
    },
    compoundVariants: [
      {
        size: 'sm',
        checked: true,
        className: 'translate-x-4',
      },
      {
        size: 'md',
        checked: true,
        className: 'translate-x-5',
      },
      {
        size: 'lg',
        checked: true,
        className: 'translate-x-7',
      },
    ],
    defaultVariants: {
      size: 'md',
      checked: false,
    },
  }
);

/**
 * @typedef {Object} SwitchProps
 * @property {boolean} [checked=false] - Whether the switch is checked
 * @property {(checked: boolean) => void} [onChange] - Callback when switch state changes
 * @property {boolean} [disabled=false] - Whether the switch is disabled
 * @property {'sm'|'md'|'lg'} [size='md'] - Switch size
 * @property {'primary'|'secondary'|'success'|'error'|'warning'} [color='primary'] - Switch color
 * @property {React.ReactNode} [label] - Label text for the switch
 * @property {'left'|'right'} [labelPosition='right'] - Position of the label
 * @property {string} [className] - Additional CSS classes
 */

/**
 * Switch component for toggling between two states
 * @param {SwitchProps & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
const Switch = ({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  color = 'primary',
  label,
  labelPosition = 'right',
  className,
  ...props
}) => {
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled && onChange) {
        onChange(!checked);
      }
    }
  };

  const switchElement = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? 'checked' : 'unchecked'}
      disabled={disabled}
      className={cn(
        switchTrackVariants({ size, color, disabled }),
        !checked && 'bg-gray-200',
        checked ? 'focus:ring-blue-500' : 'focus:ring-gray-500',
        !label && className
      )}
      onClick={() => !disabled && onChange && onChange(!checked)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <span
        className={switchThumbVariants({ size, checked })}
      />
    </button>
  );

  if (!label) {
    return switchElement;
  }

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className
      )}
    >
      {labelPosition === 'left' && (
        <span className="select-none">{label}</span>
      )}
      {switchElement}
      {labelPosition === 'right' && (
        <span className="select-none">{label}</span>
      )}
    </label>
  );
};

export default Switch;