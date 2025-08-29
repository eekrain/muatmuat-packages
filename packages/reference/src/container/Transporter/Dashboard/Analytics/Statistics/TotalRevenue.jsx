"use client";

import { useMemo } from "react";

import { useGetDashboardAnalyticsIncome } from "@/services/Transporter/dashboard/analytics/getDashboardAnalyticsIncome";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import LineChart from "@/components/Chart/LineChart";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import LoadingStatic from "@/components/Loading/LoadingStatic";

import { useAnalyticsStore } from "@/store/Transporter/analyticStore";

const TotalRevenue = () => {
  const { startDate, endDate, label } = useAnalyticsStore();

  // Adjust dates for the API call. If the selected start and end dates are the same,
  // set the start date to the previous day to create a two-day range.
  let apiStartDate = startDate;
  if (startDate && endDate && startDate === endDate) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - 1);
    apiStartDate = date.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  }

  const { data: incomeData, isLoading } = useGetDashboardAnalyticsIncome({
    startDate: apiStartDate,
    endDate,
  });

  // Memoize the chart data directly from the API response
  const chartData = useMemo(() => {
    return incomeData?.lineChartData || [];
  }, [incomeData]);

  // Display a loading indicator while data is being fetched
  if (isLoading) {
    return (
      <Card className="flex h-[322px] w-[817px] items-center justify-center !border-none">
        <LoadingStatic />
      </Card>
    );
  }

  // Determine if there is data to display
  const hasData = incomeData && incomeData.totalIncome > 0;

  return (
    <Card className="h-[322px] w-[817px] !border-none">
      <CardHeader className="flex flex-col gap-y-6 border-none !px-6 !py-5">
        <div className="flex flex-row items-center">
          <h1 className="text-lg font-bold text-neutral-900">
            Total Pendapatan Diterima
          </h1>
        </div>
        <div>
          <p className="text-lg font-bold text-neutral-900">
            {/* Added a fallback to prevent crashing if data is not yet available */}
            {`Rp${(incomeData?.totalIncome || 0).toLocaleString("id-ID")}`}
          </p>
          <p className="text-xs font-medium text-neutral-600">
            {label || "Tidak ada data"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="h-[182px] !px-0 !py-0">
        {hasData ? (
          <LineChart data={chartData} />
        ) : (
          // Empty State when no data is available
          <DataEmpty
            isResponsive={false}
            subtitleClassname="max-w-full"
            titleClassname="pb-2"
            className="mt-8 bg-transparent"
            src="/icons/dashboard/money-not-found.svg"
            title="Belum Ada Total Pendapatan"
            subtitle="Total pendapatan yang diterima muatrans akan ditampilkan disini"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TotalRevenue;
