import { cva } from 'class-variance-authority';

const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
    },
    weight: {
      thin: 'font-thin',
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
    color: {
      inherit: '',
      primary: 'text-primary',
      secondary: 'text-secondary',
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600',
      muted: 'text-gray-500',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    transform: {
      none: '',
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
    },
    decoration: {
      none: '',
      underline: 'underline',
      'line-through': 'line-through',
    },
    lineHeight: {
      none: 'leading-none',
      tight: 'leading-tight',
      snug: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    },
  },
  defaultVariants: {
    size: 'base',
    weight: 'normal',
    color: 'inherit',
    align: 'left',
    transform: 'none',
    decoration: 'none',
    lineHeight: 'normal',
  },
});

/**
 * @typedef {Object} TextProps
 * @property {React.ElementType} [as='span'] - The HTML element or component to render
 * @property {'xs'|'sm'|'base'|'lg'|'xl'|'2xl'|'3xl'|'4xl'|'5xl'} [size] - Text size
 * @property {'thin'|'light'|'normal'|'medium'|'semibold'|'bold'|'extrabold'} [weight] - Font weight
 * @property {'inherit'|'primary'|'secondary'|'success'|'error'|'warning'|'info'|'muted'} [color] - Text color
 * @property {'left'|'center'|'right'|'justify'} [align] - Text alignment
 * @property {'none'|'uppercase'|'lowercase'|'capitalize'} [transform] - Text transformation
 * @property {'none'|'underline'|'line-through'} [decoration] - Text decoration
 * @property {'none'|'tight'|'snug'|'normal'|'relaxed'|'loose'} [lineHeight] - Line height
 * @property {string} [className] - Additional CSS classes
 * @property {React.ReactNode} [children] - Child elements
 */

/**
 * Text component for displaying typography with various styles
 * @param {TextProps & React.HTMLAttributes<HTMLElement>} props
 */
const Text = ({
  as: Component = 'span',
  size,
  weight,
  color,
  align,
  transform,
  decoration,
  lineHeight,
  className,
  children,
  ...props
}) => {
  const Element = Component;
  
  return (
    <Element
      className={textVariants({
        size,
        weight,
        color,
        align,
        transform,
        decoration,
        lineHeight,
        className,
      })}
      {...props}
    >
      {children}
    </Element>
  );
};

export default Text;