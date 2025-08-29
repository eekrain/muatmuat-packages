"use client";

import { Info } from "lucide-react";

import { InfoTooltip } from "@/components/Form/InfoTooltip";

export default function ReportSummaryCards({
  items = [],
  className = "mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
  renderTooltip,
}) {
  return (
    <div className={className}>
      {items.map((item, index) => {
        const tooltipContent =
          typeof renderTooltip === "function"
            ? renderTooltip(index, item)
            : null;
        return (
          <div key={index} className={`${item?.bgColor ?? ""} rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item?.title}</span>
                {tooltipContent ? (
                  <InfoTooltip
                    className="w-80"
                    side="right"
                    trigger={
                      <button className="flex text-neutral-600 hover:text-neutral-800">
                        <Info size={18} />
                      </button>
                    }
                  >
                    {tooltipContent}
                  </InfoTooltip>
                ) : null}
              </div>
            </div>
            <div className={`mt-2 text-2xl font-bold ${item?.textColor ?? ""}`}>
              {item?.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
