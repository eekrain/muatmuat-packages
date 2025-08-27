import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

import { resPaymentInstruction } from "./resPaymentInstruction";

export const PaymentInstruction = () => {
  const { t } = useTranslation();
  const [expandedItem, setExpandedItem] = useState(0); // First item expanded by default

  const toggleAccordion = (index) => {
    setExpandedItem(expandedItem === index ? -1 : index);
  };

  return (
    <div
      className="flex h-auto w-full flex-col gap-6 rounded-xl bg-white p-6"
      style={{
        boxShadow: "0px 4px 11px rgba(65, 65, 65, 0.25)",
      }}
    >
      {/* Header */}
      <h2 className="text-base font-bold leading-[19.2px] text-black">
        {t("Cara Pembayaran")}
      </h2>

      {/* Accordion Container */}
      <div className="flex h-auto w-full flex-col">
        {resPaymentInstruction.Data.map((instruction, index) => (
          <div key={index} className="w-full">
            {/* Accordion Header */}
            <div
              className={cn(
                "flex cursor-pointer flex-row items-center justify-center gap-2.5 border-b border-[#C4C4C4] bg-white px-4 py-3 transition-all duration-300 ease-in-out",
                expandedItem === index && "border-b-0"
              )}
              onClick={() => toggleAccordion(index)}
            >
              <span className="flex-1 text-sm font-medium leading-[16.8px] text-black">
                {t(instruction.category)}
              </span>

              {/* Icon */}
              <div className="flex h-6 w-6 items-center justify-center">
                <ChevronDown
                  className={cn(
                    "h-3 w-3 border-black transition-all duration-300 ease-in-out",
                    expandedItem === index && "rotate-180"
                  )}
                  style={{
                    transformOrigin: "center",
                  }}
                />
              </div>
            </div>

            {/* Accordion Content */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                expandedItem === index
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              )}
            >
              <div
                className={cn(
                  "border-b border-[#C4C4C4] bg-white",
                  index === resPaymentInstruction.Data.length - 1 &&
                    "border-b-0"
                )}
              >
                <div className="px-4 pb-4 pr-11 pt-3">
                  <div className="text-xs font-normal leading-[14.4px] text-[#1B1B1B]">
                    {t(instruction.guide)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
