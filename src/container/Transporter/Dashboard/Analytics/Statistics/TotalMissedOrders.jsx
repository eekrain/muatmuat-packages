"use client";

import { useMemo } from "react";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import DonutChart from "@/components/Chart/DonutChart";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import { useGetDashboardAnalyticsMissedOrders } from "@/services/Transporter/dashboard/analytics/getDashboardAnalyticsMissedOrder";
import { useAnalyticsStore } from "@/store/Transporter/analyticStore";

const TotalMissedOrders = () => {
  const { startDate, endDate, label } = useAnalyticsStore();
  const colorsDonutChart = ["#E9C46A", "#F4A261", "#E76F51"];

  const { data, isLoading, isError } = useGetDashboardAnalyticsMissedOrders({
    startDate,
    endDate,
  });

  // ✅ Adjusted to map from doughnutChartData
  const donutChartData = useMemo(() => {
    if (!data?.doughnutChartData?.segments) return [];
    return data.doughnutChartData.segments.map((segment, index) => ({
      name: segment.label,
      value: segment.count,
      // The 'price' property was removed as it's not in the new JSON structure
      unit: "Pesanan",
      percentage: segment.percentage,
      color: colorsDonutChart[index % colorsDonutChart.length],
    }));
  }, [data]);

  if (isLoading) {
    return (
      <Card className="flex h-[322px] w-[399px] items-center justify-center !border-none">
        <LoadingStatic />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="flex h-[322px] w-[399px] flex-col items-center justify-center !border-none">
        <p className="text-base font-semibold text-neutral-600">
          Gagal memuat data
        </p>
        <p className="pt-[2px] text-xs font-medium text-neutral-600">
          Silakan coba lagi nanti
        </p>
      </Card>
    );
  }

  // ✅ Adjusted to check for totalMissedOrders within doughnutChartData
  const hasData = data && data?.doughnutChartData?.totalMissedOrders > 0;
  const totalOrders = data?.doughnutChartData?.totalMissedOrders || 0;

  return (
    <Card className="h-[322px] w-[399px] !border-none">
      <CardHeader className="flex flex-col gap-y-6 border-none !px-6 !py-5">
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-lg font-bold text-neutral-900">
            Total Pesanan Terlewat
          </h1>
          <InfoTooltip
            appearance={{
              iconClassName: "h-6 w-6 cursor-pointer text-neutral-700",
            }}
          >
            Jumlah pesanan yang tidak berhasil diproses atau kamu lewatkan.
          </InfoTooltip>
        </div>
        <div>
          {/* ✅ Display total orders since totalMissedAmount is no longer available */}
          <p className="text-lg font-bold text-neutral-900">
            {`${totalOrders.toLocaleString("id-ID")} Pesanan`}
          </p>
          <p className="text-xs font-medium text-neutral-600">
            {label || "Tidak ada data"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="h-[173px] !px-0 !py-0">
        {hasData ? (
          <DonutChart
            className="h-full w-full"
            data={donutChartData}
            // showThirdRow is set to false because there is no price data anymore
            showThirdRow={false}
          />
        ) : (
          <DataEmpty
            isResponsive={false}
            titleClassname="pb-0"
            className="-mt-8 bg-transparent"
            src="/icons/dashboard/blue-box.svg"
            title="Belum Ada Pesanan Terlewat"
            subtitle="Pastikan tidak ada pesanan yang terlewat"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TotalMissedOrders;
