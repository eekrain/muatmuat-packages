"use client";

import Link from "next/link";
import { useMemo } from "react";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import DonutChart from "@/components/Chart/DonutChart";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import { useGetDashboardAnalyticsAdditionalCost } from "@/services/CS/dashboard/analytics/getAdditionalCost";

const TotalAdditionalCost = () => {
  // Define the color palette for the donut chart
  const colorsDonutChart = ["#E9C46A", "#F4A261", "#E76F51"];

  // Fetch analytics data using the custom SWR hook
  const { data, isLoading } = useGetDashboardAnalyticsAdditionalCost();

  // Memoize and transform the donut chart data from the API response
  const donutChartData = useMemo(() => {
    // Return an empty array if segments data is not available
    if (!data?.donutChartData?.segments) return [];

    // Map API segments to the format required by the DonutChart component
    return data.donutChartData.segments.map((segment, index) => ({
      name: segment.label,
      color: segment.status === "PAID" ? "#FFC217" : "#D9D9D9",
      value: segment.price, // FIX: Used `segment.price` instead of non-existent `segment.count`
      unit: "Tambahan Biaya",
      percentage: segment.percentage,
    }));
  }, [data]);

  // Display a loading indicator while data is being fetched
  if (isLoading) {
    return (
      <Card className="flex h-[322px] w-[399px] items-center justify-center !border-none">
        <LoadingStatic />
      </Card>
    );
  }

  // Determine if there is valid data to display the chart
  const hasData = data && data.totalAdditionalCost > 0;

  return (
    <Card className="h-[400px] w-[400px] !border-none">
      <CardHeader className="flex flex-col gap-y-6 border-none !px-6 !py-5">
        <div className="flex flex-row items-center justify-between gap-2">
          <h1 className="text-lg font-bold text-neutral-900">
            Total Tambahan Biaya
          </h1>
          <Link href="/dashboard/analytics/laporan">
            <p className="cursor-pointer text-xs font-medium text-primary-700">
              Lihat Laporan
            </p>
          </Link>
        </div>
        {hasData && (
          <div>
            <p className="text-lg font-bold text-neutral-900">
              {`Rp${(data?.totalAdditionalCost || 0).toLocaleString("id-ID")}`}
            </p>
            <p className="text-xs font-medium text-neutral-600">
              {data?.periodLabel || "Tidak ada data"}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className="h-[173px] !px-0 !py-0">
        {hasData ? (
          <DonutChart
            data={donutChartData}
            className="flex flex-col !p-0"
            chartClassname="w-[210px] h-[210px]"
            legendClassname="flex flex-row gap-x-3 pt-3"
            itemLegendClassname="gap-y-2 gap-x-[5px] items-start"
            tooltipClassname="w-full h-[36px]"
            textTooltipClassname="flex-col gap-[1px]"
            centerTooltipClassname="w-full h-[36px]"
            textCenterTooltipClassname="flex-col flex gap-[2px]"
            centerTextLabelClassname="text-[12px]"
            prefixTooltipCenterText="Total"
            LegendSecondRowSufix={false}
            centerTextTitleTooltipClassname="text-2xl"
            prefixTooltipCenterValue="Rp"
            showTextLabel={false}
          />
        ) : (
          <DataEmpty
            isResponsive={false}
            titleClassname="pb-2"
            className="mt-8 bg-transparent"
            src="/icons/dashboard/money-not-found.svg"
            title="Belum Ada Total Tambahan Biaya"
            subtitle="Total tambahan biaya yang diterima transporter akan ditampilkan disini"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TotalAdditionalCost;
