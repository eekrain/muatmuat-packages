import React from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// The CustomTooltip remains unchanged.
const CustomTooltip = ({ active, payload, label, dataKeys }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);
    return (
      <div className="h-[84px] w-[136px] rounded-md bg-white p-2 shadow-muat">
        <p className="text-xxs font-bold text-neutral-900">{`${label}`}</p>
        <p className="mb-1 text-xxs font-bold text-neutral-900">{`(${total} Pesanan)`}</p>
        <hr className="-ml-2 w-[136px]" />
        <div className="mt-1.5 flex flex-col gap-y-1.5">
          {payload.map((entry, index) => {
            const dataKeyInfo = dataKeys.find((dk) => dk.key === entry.dataKey);
            const shorthand = dataKeyInfo ? dataKeyInfo.shorthand : entry.name;

            return (
              <div
                key={`item-${index}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-x-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <p className="text-xxs font-medium text-neutral-600">{`${shorthand} :`}</p>
                </div>
                <p className="text-xxs font-semibold text-neutral-900">
                  {entry.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

// ✅ ADDED: New shape component with dynamic rounding logic.
// This component checks which bar is visibly on top for each stack and applies the radius.
const DynamicRoundedBar = (props) => {
  const {
    payload,
    dataKeys,
    currentDataKey,
    radiusValue,
    ...rest // Recharts props like x, y, width, height, fill
  } = props;

  // Find the key of the topmost bar that has a value > 0 for this data point
  let topVisibleKey = null;
  // Iterate from the top of the stack downwards
  for (let i = dataKeys.length - 1; i >= 0; i--) {
    const key = dataKeys[i].key;
    if (payload[key] > 0) {
      topVisibleKey = key;
      break; // Found the highest visible bar, stop searching
    }
  }

  // Apply rounding only if the current bar segment is the topmost visible one
  const shouldBeRounded = currentDataKey === topVisibleKey;

  if (shouldBeRounded) {
    return <Rectangle {...rest} radius={[radiusValue, radiusValue, 0, 0]} />;
  }

  // Otherwise, render a standard, non-rounded rectangle
  return <Rectangle {...rest} />;
};

// The CustomLegend remains unchanged.
const CustomLegend = (props) => {
  const { payload } = props;
  return (
    <div className="ml-8 flex items-center justify-center pb-6">
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="mr-4 flex items-center last:mr-0">
          <div
            className="mr-2 h-3 w-3"
            style={{
              backgroundColor: entry.color,
              borderRadius: "3px",
            }}
          />
          <span className="text-xs font-medium text-neutral-600">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomBarChart = ({
  data,
  xAxisKey,
  dataKeys,
  colors,
  showXAxisLine = true,
  radiusValue = 6,
  maxBarSize = 60,
  barCategoryGap = "35%",
  barSize,
}) => {
  const tickFontSize = data && data.length > 3 ? 10 : 12;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 10,
          left: -20,
          bottom: 5,
        }}
        barCategoryGap={barCategoryGap}
        barSize={barSize}
      >
        <CartesianGrid vertical={false} stroke="#d9d9d9" />
        <XAxis
          dataKey={xAxisKey}
          axisLine={showXAxisLine ? { stroke: "#d9d9d9" } : false}
          tickLine={false}
          tick={{ fontSize: tickFontSize, fill: "#7b7b7b", fontWeight: 500 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#7b7b7b", fontWeight: 500 }}
        />
        <Tooltip
          content={<CustomTooltip dataKeys={dataKeys} />}
          cursor={{ fill: "transparent" }}
        />
        <Legend verticalAlign="top" align="center" content={<CustomLegend />} />
        {dataKeys.map((item) => {
          const barColor =
            item.key === "Pesanan Instan" ? colors[0] : colors[1];

          return (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.name}
              stackId="a"
              fill={barColor}
              maxBarSize={maxBarSize}
              // ✅ UPDATED: Use the new dynamic shape component for every bar segment.
              shape={
                <DynamicRoundedBar
                  dataKeys={dataKeys}
                  currentDataKey={item.key}
                  radiusValue={radiusValue}
                />
              }
              activeBar={false}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
