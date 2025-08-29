import React from "react";

import {
  Tooltip as RadixTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  Cell,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

import { cn } from "@/lib/utils";
import { formatNumberShorthand } from "@/lib/utils/formatNumberShorthand";

const CustomRechartsTooltip = ({
  active,
  payload,
  tooltipClassname,
  textTooltipClassname,
  textLabel,
  prefixTooltipCenterValue = "",
  showTextLabel = true,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className={cn(
          "pointer-events-none flex h-[36px] w-[112px] items-center justify-start rounded-lg border border-neutral-200 bg-white p-2 shadow-lg",
          tooltipClassname
        )}
      >
        <div
          className={cn(
            "flex flex-col text-xxs font-semibold text-neutral-900",
            textTooltipClassname
          )}
        >
          <p className="">{data.name}:</p>
          <p className="">
            {`${prefixTooltipCenterValue}${data.value.toLocaleString("id-ID")}${showTextLabel ? ` ${textLabel}` : ""}`}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({
  data,
  showThirdRow,
  legendClassname,
  itemLegendClassname,
  secondRowSufix = true,
  sufixValueLegend = "",
}) => (
  <div className={cn("flex flex-col justify-center gap-y-3", legendClassname)}>
    {data.map((entry, index) => (
      <div
        key={`item-${index}`}
        className={cn("flex items-center gap-x-3", itemLegendClassname)}
      >
        <div
          className="h-3 w-3 flex-shrink-0"
          style={{ backgroundColor: entry.color }}
        />
        <div className="flex flex-col">
          <p className="text-xxs font-medium text-neutral-900">{`${entry.name} (${entry.percentage})`}</p>
          <p className="text-xxs font-bold text-neutral-900">{`${sufixValueLegend}${entry.value.toLocaleString(
            "id-ID"
          )}${secondRowSufix ? ` ${entry.unit}` : ""}`}</p>
          {showThirdRow && entry.price && (
            <p className="text-xxs font-medium text-neutral-900">{`Rp${entry.price.toLocaleString(
              "id-ID"
            )}`}</p>
          )}
        </div>
      </div>
    ))}
  </div>
);

// The main Donut Chart component
const DonutChart = ({
  data,
  className,
  tooltipClassname,
  legendClassname,
  itemLegendClassname,
  chartClassname,
  textTooltipClassname,
  centerTooltipClassname,
  textCenterTooltipClassname,
  centerTextLabelClassname,
  centerTextTitleTooltipClassname,
  prefixTooltipCenterText = "",
  prefixTooltipCenterValue = "",
  showTextLabel = true,
  showThirdRow = false,
  LegendSecondRowSufix = true,
}) => {
  const textLabel = data[0]?.unit || "";
  const centerTextValue = data[0]?.value || 0;
  const centerTextLabel = textLabel;
  // Removed the hardcoded const prefixTooltipCenterValue = ""

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-x-6 p-4", className)}>
        <div
          className={cn(
            "relative h-[168px] w-[168px] flex-shrink-0",
            chartClassname
          )}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <RechartsTooltip
                content={
                  <CustomRechartsTooltip
                    tooltipClassname={tooltipClassname}
                    textLabel={textLabel}
                    textTooltipClassname={textTooltipClassname}
                    prefixTooltipCenterValue={prefixTooltipCenterValue}
                    showTextLabel={showTextLabel}
                  />
                }
                cursor={{ fill: "transparent" }}
                wrapperStyle={{ zIndex: 999 }}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="100%"
                labelLine={false}
                label={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="none"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <RadixTooltip>
            <TooltipTrigger asChild>
              <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-center">
                <p
                  className={cn(
                    "text-base font-bold text-neutral-900",
                    centerTextTitleTooltipClassname
                  )}
                >
                  {formatNumberShorthand(centerTextValue)}
                </p>
                <p
                  className={cn(
                    "text-base font-bold text-neutral-900",
                    centerTextLabelClassname
                  )}
                >
                  {centerTextLabel}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                "z-50 flex h-auto min-h-[36px] w-auto min-w-[112px] items-center justify-start rounded-lg border border-neutral-200 bg-white p-2 shadow-lg",
                centerTooltipClassname
              )}
            >
              <div
                className={cn(
                  "flex flex-col items-start text-start text-xxs font-semibold text-neutral-900",
                  textCenterTooltipClassname
                )}
              >
                <p>
                  {prefixTooltipCenterValue}
                  {centerTextValue.toLocaleString("id-ID")}
                </p>
                <div className="flex flex-row gap-x-[2px]">
                  {prefixTooltipCenterText && <p>{prefixTooltipCenterText}</p>}
                  <p>{centerTextLabel}</p>
                </div>
              </div>
            </TooltipContent>
          </RadixTooltip>
        </div>

        <CustomLegend
          data={data}
          showThirdRow={showThirdRow}
          legendClassname={legendClassname}
          itemLegendClassname={itemLegendClassname}
          secondRowSufix={LegendSecondRowSufix}
          sufixValueLegend={prefixTooltipCenterValue}
        />
      </div>
    </TooltipProvider>
  );
};

export default DonutChart;
