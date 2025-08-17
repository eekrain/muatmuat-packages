"use client";

import { useMemo } from "react";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import DonutChart from "@/components/Chart/DonutChart";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import { useGetDashboardAnalyticsMissedOrders } from "@/services/Transporter/dashboard/analytics/getDashboardAnalyticsMissedOrder";

const TotalMissedOrders = () => {
  // Define the color palette for the donut chart
  const colorsDonutChart = ["#E9C46A", "#F4A261", "#E76F51"];

  // Fetch analytics data using the custom SWR hook
  const { data, isLoading } = useGetDashboardAnalyticsMissedOrders();

  // Memoize and transform the donut chart data from the API response
  const donutChartData = useMemo(() => {
    if (!data?.donutChartData?.segments) return [];
    return data.donutChartData.segments.map((segment, index) => ({
      name: segment.label,
      value: segment.count,
      price: segment.price, // ✅ Pass the price from the API data
      unit: "Pesanan",
      percentage: segment.percentage,
      color: colorsDonutChart[index % colorsDonutChart.length],
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

  // Determine if there is data to display
  const hasData = data && data.totalMissedOrders > 0;

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
          <p className="text-lg font-bold text-neutral-900">
            {`Rp${data.totalMissedAmount.toLocaleString("id-ID")}`}
          </p>
          <p className="text-xs font-medium text-neutral-600">
            {data?.periodLabel || "Tidak ada data"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="h-[173px] !px-0 !py-0">
        {hasData ? (
          <DonutChart
            className="h-full w-full"
            data={donutChartData}
            showThirdRow={true} // ✅ Enable the third row display
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <ImageComponent
              src="/img/dashboard/missed-order.png"
              alt="Total Orders"
              width={95}
              height={95}
            />
            <p className="text-base font-semibold text-neutral-600">
              Belum Ada Pesanan Terlewat
            </p>
            <p className="pt-[2px] text-xs font-medium text-neutral-600">
              Pastikan tidak ada pesanan yang terlewat
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TotalMissedOrders;
