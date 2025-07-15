import { useEffect, useRef, useState } from "react";

import { ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

const Root = ({ className, children }) => {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden bg-white md:rounded-xl md:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
};

const Header = ({ className, children }) => {
  return (
    <div className={cn("flex items-center md:min-h-[59px] md:px-5", className)}>
      <span className="w-full text-sm font-semibold leading-[1.2] text-neutral-900 md:text-base md:font-bold">
        {children}
      </span>
    </div>
  );
};

const Content = ({ noScroll = false, className, children }) => {
  const containerRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setMaxHeight(containerRef.current.clientHeight);
    }
  }, []);

  if (!maxHeight || noScroll)
    return (
      <div
        ref={containerRef}
        className={cn(
          "flex w-full max-w-sm flex-col gap-5 overflow-x-hidden bg-white pb-4 md:gap-6 md:pl-5",
          noScroll ? "md:pr-5" : "overflow-y-scroll",
          className
        )}
      >
        {children}
      </div>
    );

  return (
    <div className={`md:pr-[8px] md:max-h-[${maxHeight}px]`}>
      <div
        className={cn(
          "flex w-full max-w-sm flex-col gap-6 overflow-x-hidden bg-white md:overflow-y-scroll md:pb-4 md:pl-5 md:pr-[8px]",
          `md:max-h-[${maxHeight}px]`,
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

const ContainerCollapsible = ({ title, className, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={cn("w-full max-w-sm bg-white", className)}>
      {/* Header */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between rounded-sm p-0 outline-none"
        )}
        aria-expanded={isOpen}
        aria-controls="collapsible-content"
      >
        <h3 className="text-sm font-semibold leading-[1.2] text-black">
          {title}
        </h3>
        <div className="flex-shrink-0">
          <ChevronUp
            className={cn(
              "h-4 w-4 text-gray-600 transition-transform duration-300 ease-in-out",
              isOpen ? "rotate-0" : "rotate-180"
            )}
          />
        </div>
      </button>

      <div
        id="collapsible-content"
        className={cn(
          "flex flex-col gap-5 overflow-hidden opacity-100 transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[1000px] pt-3 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};

const ContainerItem = ({ title, className, children }) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h3 className="text-sm font-semibold leading-[1.2] text-black">
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};

const Item = ({
  appearance = {
    labelClassName: "",
    valueClassName: "",
  },
  className,
  label,
  value,
}) => {
  return (
    <div
      className={cn(
        "flex justify-between text-xs font-medium leading-tight",
        className
      )}
    >
      <div
        className={cn("max-w-[190px] text-gray-500", appearance.labelClassName)}
      >
        {label}
      </div>
      <div className={cn("flex gap-2 text-black", appearance.valueClassName)}>
        {value}
      </div>
    </div>
  );
};

const Subtotal = ({ className, label, value }) => {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between text-sm font-semibold leading-[1.2] text-neutral-900",
        className
      )}
    >
      <span>{label}</span>

      <span>{value}</span>
    </div>
  );
};

const FooterTotal = ({ className, label, value, children }) => {
  return (
    <div className="w-full px-5 py-6 shadow-[0px_4px_11px_0px_#41414140]">
      <div
        className={cn(
          "flex justify-between text-base font-bold leading-[1.2] text-neutral-900",
          className
        )}
      >
        <span>{label}</span>
        <span>{value}</span>
      </div>

      {children}
    </div>
  );
};

const CardPayment = {
  Root,
  Header,
  Content,
  ContainerCollapsible,
  ContainerItem,
  Item,
  Subtotal,
  FooterTotal,
};

export default CardPayment;
