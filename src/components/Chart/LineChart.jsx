"use client";

import React from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatNumberShorthand } from "@/lib/utils/formatNumberShorthand";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Create a unique payload by filtering out duplicates based on the dataKey.
    const uniquePayload = Array.from(
      new Map(payload.map((item) => [item.dataKey, item])).values()
    );

    // Get the full date from the payload and format it for display
    const fullDate = payload[0].payload.date;
    const formattedDate = new Date(fullDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return (
      <div className="min-w-[150px] rounded-md bg-white p-3 shadow-muat">
        {/* Date Section - Now shows the full formatted date */}
        <div className="pb-2">
          <p className="text-xxs font-semibold text-neutral-900">
            {formattedDate}
          </p>
        </div>
        <hr className="absolute -ml-3 w-full" />
        {/* Content Section */}
        <div className="pt-2">
          {uniquePayload.map((entry, index) => {
            const formattedValue = `Rp${new Intl.NumberFormat("id-ID").format(entry.value)}`;

            return (
              <div
                key={`item-${index}`}
                className="flex items-center justify-between gap-x-2"
              >
                <p className="text-xxs text-neutral-600">Pendapatan:</p>
                <p className="text-xxs font-semibold text-neutral-900">
                  {formattedValue}
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

const LineChart = ({ data, dataKeys = [] }) => {
  /**
   * Formats the Y-axis tick values from a number to a string like "10JT".
   */
  const yAxisFormatter = (value) => {
    if (value === 0) return "";
    return `${formatNumberShorthand(value)}`;
  };

  return (
    <ResponsiveContainer width="100%" height={182}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis
          dataKey="dateLabel" // Use dateLabel for the X-axis ticks
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#7B7B7B", fontWeight: "500" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickFormatter={yAxisFormatter}
          tick={{ fontSize: 12, fill: "#7B7B7B", fontWeight: "500" }}
        />
        <Area
          type="linear"
          dataKey="income" // Use income for the area value
          stroke="none"
          fill="#FFFBEB"
          fillOpacity={1}
          activeDot={false}
        />
        <CartesianGrid vertical={false} style={{ stroke: "#F1F1F1" }} />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={<CustomTooltip />}
        />
        <Line
          type="linear"
          dataKey="income" // Use income for the line value
          stroke="#FFC217"
          strokeWidth={3}
          dot={false}
          activeDot={{
            r: 6,
            fill: "#FFC217",
            stroke: "none",
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
