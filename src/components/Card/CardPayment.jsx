import { useState } from "react";

import { ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

const Root = ({ className, children }) => {
  return (
    <div
      className={cn(
        "grid grid-rows-[59px_1fr_59px] overflow-hidden rounded-xl bg-white shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
};

const Header = ({ className, children }) => {
  return (
    <div className={cn("flex min-h-[59px] items-center px-5", className)}>
      <span className="w-full text-base font-bold leading-[1.2] text-neutral-900">
        {children}
      </span>
    </div>
  );
};

const Content = ({ noScroll = false, className, children }) => {
  return (
    <div className="h-full overflow-hidden">
      <div
        className={cn(
          "flex h-full w-full flex-col gap-6 overflow-y-auto bg-white pb-4 pl-5 pr-[8px]",
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
    <div className={cn("w-full bg-white", className)}>
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
          "flex flex-col gap-6 overflow-hidden opacity-100 transition-all duration-300 ease-in-out",
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
    <div className={cn("flex flex-col gap-3", className)}>
      <h3 className="text-sm font-semibold leading-[1.2] text-black">
        {title}
      </h3>
      {children}
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
    <div className="flex w-full items-center justify-between px-5 text-base font-bold leading-[1.2] text-neutral-900 shadow-[0px_4px_11px_0px_#41414140]">
      <span>{label}</span>
      <span>{value}</span>

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
