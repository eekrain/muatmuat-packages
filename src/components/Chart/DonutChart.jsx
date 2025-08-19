import React, { useMemo } from "react";

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

const CustomRechartsTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="pointer-events-none flex h-[36px] w-[112px] items-center justify-start rounded-lg border border-neutral-200 bg-white p-2 shadow-lg">
        <div className="flex flex-col text-xxs font-semibold text-neutral-900">
          <p className="">{data.name}:</p>
          <p className="">
            {`${data.value.toLocaleString("id-ID")} ${data.unit}`}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ data, showThirdRow }) => (
  <div className="flex flex-col justify-center gap-y-3">
    {data.map((entry, index) => (
      <div key={`item-${index}`} className="flex items-center gap-x-3">
        <div
          className="h-3 w-3 flex-shrink-0"
          style={{ backgroundColor: entry.color }}
        />
        <div className="flex flex-col">
          <p className="text-xxs font-medium text-neutral-900">{`${entry.name} (${entry.percentage}%)`}</p>
          <p className="text-xxs font-bold text-neutral-900">{`${entry.value.toLocaleString(
            "id-ID"
          )} ${entry.unit}`}</p>
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
const DonutChart = ({ data, className, showThirdRow = false }) => {
  const totalValue = useMemo(
    () => data.reduce((sum, entry) => sum + entry.value, 0),
    [data]
  );

  const centerTextValue = totalValue;
  const centerTextLabel = "Pesanan";

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-x-6 p-4", className)}>
        <div className="relative h-[168px] w-[168px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <RechartsTooltip
                content={<CustomRechartsTooltip />}
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
                <p className="text-base font-bold text-neutral-900">
                  {formatNumberShorthand(centerTextValue)}
                </p>
                <p className="text-base font-bold text-neutral-900">
                  {centerTextLabel}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent className="z-50 flex h-[36px] w-[112px] items-center justify-start rounded-lg border border-neutral-200 bg-white p-2 shadow-lg">
              <div className="flex flex-col items-start text-start text-xxs font-semibold text-neutral-900">
                <p>{centerTextValue.toLocaleString("id-ID")}</p>
                <p>{centerTextLabel}</p>
              </div>
            </TooltipContent>
          </RadixTooltip>
        </div>

        <CustomLegend data={data} showThirdRow={showThirdRow} />
      </div>
    </TooltipProvider>
  );
};

export default DonutChart;
