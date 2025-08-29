import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const notificationDotVariants = cva("rounded-full", {
  variants: {
    size: {
      xs: "h-1 w-1",
      sm: "h-1.5 w-1.5",
      md: "h-2 w-2",
      lg: "h-2.5 w-2.5",
      xl: "h-3 w-3",
    },
    color: {
      red: "bg-red-500",
      green: "bg-green-500",
      blue: "bg-blue-500",
      yellow: "bg-yellow-500",
      orange: "bg-orange-500",
      purple: "bg-purple-500",
      gray: "bg-gray-500",
      primary: "bg-primary-500",
      success: "bg-success-500",
      warning: "bg-warning-900",
      error: "bg-error-500",
    },
  },
  defaultVariants: {
    size: "sm",
    color: "red",
  },
});

/**
 * NotificationDot Component
 * @param {Object} props
 * @param {boolean} props.animated - Whether to show the pulsing animation
 * @param {"xs"|"sm"|"md"|"lg"|"xl"} props.size - Size of the dot
 * @param {"red"|"green"|"blue"|"yellow"|"orange"|"purple"|"gray"|"primary"|"success"|"warning"|"error"} props.color - Color of the dot
 * @param {string} props.className - Additional CSS classes
 * @param {"absolute"|"relative"|"fixed"} props.position - Position type
 * @param {string} props.positionClasses - Position classes like "top-0 right-0"
 */
export const NotificationDot = ({
  animated = true,
  size = "sm",
  color = "red",
  className,
  position = "relative",
  positionClasses = "",
}) => {
  const dotClasses = notificationDotVariants({ size, color });

  return (
    <span className={cn(position, positionClasses, className)}>
      <div className="relative flex">
        {animated && (
          <span
            className={cn("absolute inline-flex animate-ping", dotClasses)}
          />
        )}
        <span className={cn("relative inline-flex", dotClasses)} />
      </div>
    </span>
  );
};

export default NotificationDot;
