"use client";

import { useMemo } from "react";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import DonutChart from "@/components/Chart/DonutChart";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import { useGetDashboardAnalyticsAdditionalCost } from "@/services/CS/dashboard/getAdditionalCost";

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
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-lg font-bold text-neutral-900">
            Total Tambahan Biaya
          </h1>
          <InfoTooltip
            appearance={{
              iconClassName: "h-6 w-6 cursor-pointer text-neutral-700",
            }}
          >
            Jumlah biaya tambahan dari semua pesanan.
          </InfoTooltip>
        </div>
        <div>
          <p className="text-lg font-bold text-neutral-900">
            {/* FIX: Used `totalAdditionalCost` and added fallback for safety */}
            {`Rp${(data?.totalAdditionalCost || 0).toLocaleString("id-ID")}`}
          </p>
          <p className="text-xs font-medium text-neutral-600">
            {data?.periodLabel || "Tidak ada data"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="h-[173px] !px-0 !py-0">
        {hasData ? (
          <DonutChart
            data={donutChartData}
            className="flex flex-col !p-0"
            legendClassname="flex flex-row gap-x-3 pt-3"
            itemLegendClassname="gap-y-2 gap-x-[5px] items-start"
            tooltipClassname="w-full h-[23px]"
            textTooltipClassname="flex-row gap-[1px]"
            centerTooltipClassname="w-full h-[23px]"
            textCenterTooltipClassname="flex-row flex gap-[2px]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <ImageComponent
              src="/img/dashboard/missed-order.png"
              alt="Tidak Ada Biaya Tambahan"
              width={95}
              height={95}
            />
            <p className="text-base font-semibold text-neutral-600">
              Belum Ada Biaya Tambahan
            </p>
            <p className="pt-[2px] text-xs font-medium text-neutral-600">
              Saat ini tidak ada data biaya tambahan yang tercatat.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TotalAdditionalCost;
