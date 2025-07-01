import { useState } from "react";

import { ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

const Root = ({ className, children }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 grid-rows-[59px_1fr_59px] overflow-hidden rounded-xl bg-white shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
};

const Header = ({ className, children }) => {
  return (
    <div className={cn("flex items-center px-5", className)}>
      <span className="w-full text-base font-bold leading-[1.2] text-neutral-900">
        {children}
      </span>
    </div>
  );
};

const Container = ({ className, children }) => {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-sm flex-col gap-6 overflow-y-auto overflow-x-hidden bg-white px-5 pb-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const Collapsible = ({ title, className, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={cn("mx-auto w-full max-w-sm bg-white", className)}>
      {/* Header */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between rounded-sm p-0 outline-none"
        )}
        aria-expanded={isOpen}
        aria-controls="collapsible-content"
      >
        <h3 className="text-sm font-semibold leading-tight text-black">
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
          "flex max-h-96 flex-col gap-4 overflow-hidden pt-3 opacity-100 transition-all duration-300 ease-in-out",
          !isOpen && "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
};

const CollapsibleItem = ({ className, label, value }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between text-xs font-medium leading-tight",
        className
      )}
    >
      <div className="max-w-[190px] text-gray-500">{label}</div>
      <div className="flex gap-2 text-black">{value}</div>
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

const FooterTotal = ({ className, label, value }) => {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between px-5 text-base font-bold leading-[1.2] text-neutral-900 shadow-[0px_4px_11px_0px_#41414140]",
        className
      )}
    >
      <span className="h-[11px]">{label}</span>
      <span className="h-[11px]">{value}</span>
    </div>
  );
};

const CardPayment = {
  Root,
  Header,
  Container,
  Collapsible,
  CollapsibleItem,
  Subtotal,
  FooterTotal,
};

export default CardPayment;
