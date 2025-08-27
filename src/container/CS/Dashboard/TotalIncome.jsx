"use client";

import { useMemo } from "react";

import { useGetCsDashboardAnalyticsIncome } from "@/services/CS/dashboard/analytics/getIncomeAnalytics";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import LineChart from "@/components/Chart/LineChart";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import LoadingStatic from "@/components/Loading/LoadingStatic";

const TotalIncome = () => {
  // Fetch income analytics data using the custom SWR hook
  const { data: incomeData, isLoading } = useGetCsDashboardAnalyticsIncome();

  // Memoize the chart data directly from the API response without transformation
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
    <Card className="h-[400px] w-[817px] !border-none">
      <CardHeader className="flex flex-col gap-y-6 border-none !px-6 !py-5">
        <div className="flex flex-row items-center">
          <h1 className="text-lg font-bold text-neutral-900">
            Total Pendapatan
          </h1>
        </div>
        {hasData && (
          <div>
            <p className="text-lg font-bold text-neutral-900">
              {`Rp${incomeData?.totalIncome?.toLocaleString("id-ID") || 0}`}
            </p>
            <p className="text-xs font-medium text-neutral-600">
              {incomeData?.periodLabel || "Tidak ada data"}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="h-[182px] !px-0 !py-0">
        {hasData ? (
          <LineChart data={chartData} height={262} />
        ) : (
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

export default TotalIncome;
