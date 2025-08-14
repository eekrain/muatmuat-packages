"use client";

import { useMemo } from "react";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import CustomBarChart from "@/components/Chart/BarChart";
import DonutChart from "@/components/Chart/DonutChart";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

// Mock data for the Bar Chart (Weekly Trends)
const barChartData = [
  { name: "1-8 Jan", "Pesanan Terjadwal": 10, "Pesanan Instan": 9 },
  { name: "9-16 Jan", "Pesanan Terjadwal": 18, "Pesanan Instan": 21 },
  { name: "17-23 Jan", "Pesanan Terjadwal": 4, "Pesanan Instan": 26 },
  { name: "24-31 Jan", "Pesanan Terjadwal": 10, "Pesanan Instan": 9 },
];

// Data keys for the Bar Chart
const dataKeys = [
  {
    key: "Pesanan Terjadwal",
    name: "Pesanan Terjadwal",
    shorthand: "Terjadwal",
  },
  { key: "Pesanan Instan", name: "Pesanan Instan", shorthand: "Instan" },
];

// Colors for the bar chart
const colors = ["#1AA0FF", "#0FBB81"];

// Mock data for the Donut Chart (Monthly Summary)
const donutChartData = [
  {
    name: "Selesai",
    value: 3000000,
    unit: "Pesanan",
    percentage: 65,
    color: "#F09D51",
  },
  {
    name: "Berjalan",
    value: 100000,
    unit: "Pesanan",
    percentage: 32,
    color: "#E3C16F",
  },
  {
    name: "Dibatalkan",
    value: 400000,
    unit: "Pesanan",
    percentage: 3,
    color: "#D9534F",
  },
];

const TotalOrders = () => {
  // Calculate total orders from the pie chart data for an accurate monthly total
  const totalOrders = useMemo(() => {
    if (!donutChartData || donutChartData.length === 0) {
      return 0;
    }
    return donutChartData.reduce((total, current) => total + current.value, 0);
  }, []);

  return (
    <Card className="h-[322px] w-[817px] !border-none !p-6">
      <CardHeader className="flex flex-col items-center justify-center border-none !p-0">
        <h1 className="text-2xl font-bold text-neutral-900">
          Total Pesanan: {totalOrders.toLocaleString("id-ID")} Pesanan
        </h1>
        <p className="text-xs font-medium text-neutral-600">Dalam Bulan Ini</p>
      </CardHeader>
      <CardContent className="mt-6 h-full w-full !p-0">
        {barChartData && barChartData.length > 0 ? (
          <div className="flex h-full w-full flex-row">
            {/* Bar Chart Section */}
            <div className="h-[221px] w-[372.5px]">
              <CustomBarChart
                data={barChartData}
                xAxisKey="name"
                dataKeys={dataKeys}
                colors={colors}
              />
            </div>
            {/* Pie Chart Section */}
            <div className="flex h-[221px] w-[372.5px] items-center">
              <DonutChart data={donutChartData} />
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <ImageComponent
              src="/img/dashboard/empty-order.png"
              alt="Total Orders"
              width={95}
              height={95}
            />
            <p className="text-base font-semibold text-neutral-600">
              Belum ada Pesanan
            </p>
            <p className="pt-[2px] text-xs font-medium text-neutral-600">
              Belum ada transaksi yang tercatat
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TotalOrders;
