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

// The CustomTooltip remains unchanged as it's already well-styled.
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

// RENAMED and SIMPLIFIED: This shape now *always* applies the top radius.
const RoundedTopBar = (props) => {
  const { radiusValue } = props;
  return <Rectangle {...props} radius={[radiusValue, radiusValue, 0, 0]} />;
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
  barCategoryGap = "35%", // ADDED: Control the gap between bars
  barSize, // ADDED: Set a fixed bar width (overrides responsiveness)
}) => {
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
        // Use the new props here
        barCategoryGap={barCategoryGap}
        barSize={barSize}
      >
        <CartesianGrid vertical={false} stroke="#d9d9d9" />
        <XAxis
          dataKey={xAxisKey}
          axisLine={showXAxisLine ? { stroke: "#d9d9d9" } : false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#7b7b7b", fontWeight: 500 }}
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
        {dataKeys.map((item, barIndex) => {
          const isTopBar = barIndex === dataKeys.length - 1;

          return (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.name}
              stackId="a"
              fill={colors[barIndex % colors.length]}
              maxBarSize={maxBarSize}
              shape={
                isTopBar ? (
                  <RoundedTopBar radiusValue={radiusValue} />
                ) : undefined
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
