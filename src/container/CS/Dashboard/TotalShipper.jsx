import Link from "next/link";
import { useMemo } from "react";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import DonutChart from "@/components/Chart/DonutChart";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import { useGetDashboardAnalyticsTotalShipper } from "@/services/CS/dashboard/getTotalShipper";

const TotalShipper = () => {
  // 1. Fetch data using the SWR hook
  const { data, isLoading, isError } = useGetDashboardAnalyticsTotalShipper();

  const hasData = data && data.TotalShipper > 0;
  // 2. Transform the API data into the format required by the DonutChart component
  const chartData = useMemo(() => {
    // Return an empty array if there's no data to prevent errors
    if (!data?.donutChartData?.segments) {
      return [];
    }

    // Map API segments to the DonutChart's expected data structure
    return data.donutChartData.segments.map((segment) => ({
      name: segment.label,
      value: segment.count,
      percentage: segment.percentage,
      color: segment.status === "ACTIVE" ? "#FFC217" : "#D9D9D9",
      unit: "Shipper",
    }));
  }, [data]);

  // 3. Handle loading and error states
  if (isLoading) {
    return (
      <Card className="!border-none">
        <CardHeader className="!border-none">
          <p>Total Shipper</p>
        </CardHeader>
        <CardContent className="flex h-[168px] items-center justify-center">
          <LoadingStatic />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="!border-none">
        <CardHeader className="!border-none">
          <p>Total Shipper</p>
        </CardHeader>
        <CardContent className="flex h-[168px] items-center justify-center">
          <p className="text-sm text-error-500">Gagal memuat data.</p>
        </CardContent>
      </Card>
    );
  }

  // 4. Render the component with the processed data
  return (
    <Card className="h-[285px] w-[296px] !border-none">
      <CardHeader className="flex items-center justify-between !border-none !px-6 !py-5">
        <p className="text-base font-bold text-neutral-900">Total Shipper</p>
        <Link href="/dashboard/analytics/laporan">
          <p className="cursor-pointer text-xs font-medium text-primary-700">
            Lihat Detail
          </p>
        </Link>
      </CardHeader>
      <CardContent className="!px-0 !py-0">
        {chartData.length > 0 ? (
          <DonutChart
            data={chartData}
            className="flex flex-col !p-0"
            legendClassname="flex flex-row gap-x-3 pt-3"
            itemLegendClassname="gap-y-2 gap-x-[5px] items-start"
            tooltipClassname="w-full h-[23px]"
            textTooltipClassname="flex-row gap-[1px]"
            centerTooltipClassname="w-full min-h-0 h-[23px] text-center min-w-0"
            textCenterTooltipClassname="flex-row flex gap-[2px]"
          />
        ) : (
          <DataEmpty
            isResponsive={false}
            titleClassname="pb-2"
            className="bg-transparent !py-8"
            src="/icons/dashboard/blue-box.svg"
            title="Belum Ada Shipper Terdaftar"
            subtitle="Data total shipper yang telah terdaftar akan ditampilkan disini"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TotalShipper;
