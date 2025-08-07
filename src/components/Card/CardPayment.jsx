import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { cn } from "@/lib/utils";

const Root = ({ children, className }) => (
  <div
    className={cn(
      "flex w-full flex-col bg-white md:w-[338px] md:overflow-hidden md:rounded-xl md:shadow-md",
      className
    )}
  >
    {children}
  </div>
);

const Header = ({ children, className }) => (
  <div className={cn("py-5 md:px-5 md:py-6", className)}>
    <h1
      className={cn(
        "text-sm font-semibold leading-tight text-neutral-900 md:text-base md:font-bold",
        className
      )}
    >
      {children}
    </h1>
  </div>
);

const Body = ({ children, className }) => (
  <div
    className={cn(
      "flex-1 md:mb-4 md:mr-2 md:overflow-y-auto md:pl-5 md:pr-3",
      className
    )}
  >
    <div className="flex flex-col md:gap-6">{children}</div>
  </div>
);

const CollapsibleSection = ({
  title,
  children,
  className,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={toggleOpen}
        onKeyDown={(e) => e.key === "Enter" && toggleOpen()}
        role="button"
        tabIndex={0}
      >
        <h2 className="text-sm font-semibold leading-tight text-neutral-900">
          {title}
        </h2>
        <IconComponent
          src="/icons/chevron-up.svg"
          className={cn(
            "h-4 w-4 text-neutral-700 transition-transform duration-300",
            !isOpen && "rotate-180"
          )}
          alt="Toggle details visibility"
        />
      </div>
      <div
        className={cn(
          "grid transition-all duration-500 ease-in-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children, className }) => (
  <div className={cn("flex flex-col gap-4 md:gap-3", className)}>
    <h2 className="text-sm font-semibold leading-tight text-neutral-900">
      {title}
    </h2>
    <div className="flex flex-col gap-3">{children}</div>
  </div>
);

const LineItem = ({
  label,
  value,
  children,
  variant,
  valueClassName,
  labelClassName,
  className,
}) => {
  const valueColorClass =
    variant === "danger" ? "text-error-400" : "text-neutral-900";
  return (
    <div className={cn(className)}>
      <div className="flex items-start justify-between gap-3 md:gap-6">
        <span
          className={cn("text-xs font-medium text-neutral-600", labelClassName)}
          dangerouslySetInnerHTML={{ __html: label }}
        />
        <span
          className={cn(
            "whitespace-nowrap text-right text-xs font-medium",
            valueColorClass,
            valueClassName
          )}
        >
          {value}
        </span>
      </div>
      {children}
    </div>
  );
};

const Footer = ({ children, className }) => (
  <div
    className={cn(
      "bg-white py-5 shadow-[0_-4px_11px_rgba(65,65,65,0.08)] md:px-5",
      className
    )}
  >
    {children}
  </div>
);

const Total = ({ label = "Total", value, className }) => (
  <div className={cn("flex items-center justify-between", className)}>
    <p
      className="text-sm font-bold text-neutral-900 md:text-base"
      dangerouslySetInnerHTML={{ __html: label }}
    />
    <p className="text-sm font-bold text-neutral-900 md:text-base">{value}</p>
  </div>
);

const CardPayment = {
  Root,
  Header,
  Body,
  CollapsibleSection,
  Section,
  LineItem,
  Footer,
  Total,
};
export default CardPayment;
