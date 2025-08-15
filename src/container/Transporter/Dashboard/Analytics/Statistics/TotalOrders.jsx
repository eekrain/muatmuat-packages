"use client";

import { useMemo } from "react";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import CustomBarChart from "@/components/Chart/BarChart";
import DonutChart from "@/components/Chart/DonutChart";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import { useGetDashboardAnalyticsOrders } from "@/services/Transporter/dashboard/analytics/getDashboardAnalyticsOrder";

const dataKeys = [
  {
    key: "Pesanan Terjadwal",
    name: "Pesanan Terjadwal",
    shorthand: "Terjadwal",
  },
  { key: "Pesanan Instan", name: "Pesanan Instan", shorthand: "Instan" },
];

// Colors for the charts
const colorsBarChart = ["#1AA0FF", "#0FBB81"];
const colorsDonutChart = ["#E9C46A", "#F4A261", "#E76F51"];

const TotalOrders = () => {
  // Fetch analytics data using the custom SWR hook
  const { data, isLoading } = useGetDashboardAnalyticsOrders();

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
    if (!data?.donutChartData?.segments) return [];
    // ✅ **Use the local colorsDonutChart array**
    return data.donutChartData.segments.map((segment, index) => ({
      name: segment.label,
      value: segment.count,
      unit: "Pesanan",
      percentage: segment.percentage,
      // Assign color from the local array based on the segment's index
      color: colorsDonutChart[index % colorsDonutChart.length],
    }));
  }, [data]);

  // Dynamically calculate barSize based on the number of data points
  const barSize = useMemo(() => {
    const dataLength = barChartData?.length || 0;
    if (dataLength === 12) return 20;
    if (dataLength > 4) return 17;
    return null; // Let the chart decide the bar size for fewer items
  }, [barChartData]);

  // Display a loading indicator while data is being fetched
  if (isLoading) {
    return (
      <Card className="flex h-[322px] w-[817px] items-center justify-center !border-none !p-6">
        <LoadingStatic />
      </Card>
    );
  }

  // Determine if there is data to display
  const hasData = barChartData && barChartData.length > 0;

  return (
    <Card className="h-[322px] w-[817px] !border-none !p-6">
      <CardHeader className="flex flex-col items-center justify-center border-none !p-0">
        <h1 className="text-2xl font-bold text-neutral-900">
          Total Pesanan:{" "}
          {hasData ? data.totalOrders.toLocaleString("id-ID") : 0} Pesanan
        </h1>
        <p className="text-xs font-medium text-neutral-600">
          {data?.periodLabel || "Tidak ada data"}
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
                barSize={barSize} // Apply the dynamic barSize
              />
            </div>
            {/* Donut Chart Section */}
            <div className="flex h-[221px] w-[372.5px] items-center">
              <DonutChart data={donutChartData} />
            </div>
          </div>
        ) : (
          // Empty State when no data is available
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
