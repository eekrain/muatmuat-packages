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

// The CustomTooltip now accepts a 'dataKeys' prop
const CustomTooltip = ({ active, payload, label, dataKeys }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);
    return (
      <div className="h-[84px] w-[136px] rounded-md bg-white p-2 shadow-muat">
        <p className="text-xxs font-bold text-neutral-900">{`${label}`}</p>
        <p className="mb-1 text-xxs font-bold text-neutral-900">{`(${total} Pesanan)`}</p>
        <hr className="-ml-2 w-[136px]" />

        {/* This parent div now controls the layout and spacing of the items below */}
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

// Custom shape for conditional radius (no changes)
const ConditionalRadiusBar = (props) => {
  const { index, radiusDataLimit, radiusValue } = props;
  if (index < radiusDataLimit) {
    return <Rectangle {...props} radius={[radiusValue, radiusValue, 0, 0]} />;
  }
  return <Rectangle {...props} />;
};

// New custom component to render the Legend with rounded icons (no changes)
const CustomLegend = (props) => {
  const { payload } = props;

  return (
    <div
      className="flex items-center justify-center"
      style={{ paddingBottom: "20px" }}
    >
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
  radiusDataLimit = 4,
  radiusValue = 4,
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
        barCategoryGap="35%"
        // REMOVED incorrect style prop from here
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
        <Legend verticalAlign="top" content={<CustomLegend />} />
        {dataKeys.map((item, barIndex) => {
          const isTopBar = barIndex === dataKeys.length - 1;
          return (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.name}
              stackId="a"
              fill={colors[barIndex % colors.length]}
              shape={
                isTopBar ? (
                  <ConditionalRadiusBar
                    radiusDataLimit={radiusDataLimit}
                    radiusValue={radiusValue}
                  />
                ) : undefined
              }
              // THIS IS THE CORRECT WAY TO REMOVE THE OUTLINE
              activeBar={false}
              // REMOVED incorrect style prop from here
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
