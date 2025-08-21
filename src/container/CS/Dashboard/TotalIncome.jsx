"use client";

import { useMemo } from "react";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import LineChart from "@/components/Chart/LineChart";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import { useGetDashboardAnalyticsIncome } from "@/services/Transporter/dashboard/analytics/getDashboardAnalyticsIncome";

const TotalIncome = () => {
  // Fetch income analytics data using the custom SWR hook
  const { data: incomeData, isLoading } = useGetDashboardAnalyticsIncome();

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
            Total Pendapatan Diterima
          </h1>
        </div>
        <div>
          <p className="text-lg font-bold text-neutral-900">
            {`Rp${incomeData.totalIncome.toLocaleString("id-ID")}`}
          </p>
          <p className="text-xs font-medium text-neutral-600">
            {incomeData?.periodLabel || "Tidak ada data"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="h-[182px] !px-0 !py-0">
        {hasData ? (
          <LineChart data={chartData} />
        ) : (
          // Empty State when no data is available
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <ImageComponent
              src="/img/dashboard/empty-revenue.png"
              alt="Total Orders"
              width={95}
              height={95}
            />
            <p className="text-base font-semibold text-neutral-600">
              Belum Ada Pendapatan Diterima
            </p>
            <p className="pt-[2px] text-xs font-medium text-neutral-600">
              Pendapatan kamu akan muncul di sini setelah ada transaksi masuk
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TotalIncome;
