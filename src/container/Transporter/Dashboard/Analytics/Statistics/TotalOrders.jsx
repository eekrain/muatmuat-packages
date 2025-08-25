"use client";

import { useMemo } from "react";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import CustomBarChart from "@/components/Chart/BarChart";
import DonutChart from "@/components/Chart/DonutChart";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import { useGetDashboardAnalyticsOrders } from "@/services/Transporter/dashboard/analytics/getDashboardAnalyticsOrder";
import { useAnalyticsStore } from "@/store/Transporter/analyticStore";

const dataKeys = [
  { key: "Pesanan Instan", name: "Pesanan Instan", shorthand: "Instan" },
  {
    key: "Pesanan Terjadwal",
    name: "Pesanan Terjadwal",
    shorthand: "Terjadwal",
  },
];

const colorsBarChart = ["#0FBB81", "#1AA0FF"];
const colorsDonutChart = ["#E9C46A", "#F4A261", "#E76F51"];

const TotalOrders = () => {
  const { startDate, endDate, label } = useAnalyticsStore();
  const { data, isLoading } = useGetDashboardAnalyticsOrders({
    startDate,
    endDate,
  });

  // Memoize and transform the bar chart data from the API response
  const barChartData = useMemo(() => {
    if (!data?.barChartData) return [];
    return data.barChartData.map((item) => ({
      name: item.dateLabel,
      "Pesanan Terjadwal": item.scheduledOrders,
      "Pesanan Instan": item.instantOrders,
    }));
  }, [data]);

  // Memoize and transform the donut chart data from the API response
  const donutChartData = useMemo(() => {
    if (!data?.doughnutChartData?.segments) return [];
    return data.doughnutChartData.segments.map((segment, index) => ({
      name: segment.label,
      value: segment.count,
      unit: "Pesanan",
      percentage: segment.percentage,
      color: colorsDonutChart[index % colorsDonutChart.length],
    }));
  }, [data]);

  // Dynamically calculate barSize based on the number of data points
  const barSize = useMemo(() => {
    const dataLength = barChartData?.length || 0;
    if (dataLength === 12) return 20;
    if (dataLength > 4) return 17;
    return null;
  }, [barChartData]);

  // Display a loading indicator while data is being fetched
  if (isLoading) {
    return (
      <Card className="flex h-[322px] w-[817px] items-center justify-center !border-none !p-6">
        <LoadingStatic />
      </Card>
    );
  }

  // ✅ **FIX: Condition now correctly checks totalOrders to determine if data exists.**
  const hasData = data && data.totalOrders > 0;
  console.log("selected period:", label);
  return (
    <Card className="h-[322px] w-[817px] !border-none !p-6">
      <CardHeader className="flex flex-col items-center justify-center border-none !p-0">
        <h1 className="text-2xl font-bold text-neutral-900">
          Total Pesanan:{" "}
          {/* ✅ **FIX: Safely access totalOrders only when data is available.** */}
          {(data?.totalOrders ?? 0).toLocaleString("id-ID")} Pesanan
        </h1>
        <p className="text-xs font-medium text-neutral-600">
          {label || "Tidak ada data"}
        </p>
      </CardHeader>
      <CardContent className="mt-6 h-full w-full !p-0">
        {hasData ? (
          <div className="flex h-full w-full flex-row">
            {/* Bar Chart Section */}
            <div className="h-[221px] w-[372.5px]">
              <CustomBarChart
                data={barChartData}
                xAxisKey="name"
                dataKeys={dataKeys}
                colors={colorsBarChart}
                barSize={barSize}
              />
            </div>
            {/* Donut Chart Section */}
            <div className="flex h-[221px] w-[372.5px] items-center">
              <DonutChart data={donutChartData} />
            </div>
          </div>
        ) : (
          <DataEmpty
            isResponsive={false}
            subtitleClassname="max-w-full"
            titleClassname="pb-2"
            className="bg-transparent"
            title="Belum Ada Total Pesanan"
            subtitle="Total pesanan yang diterima muatrans akan ditampilkan disini"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TotalOrders;
