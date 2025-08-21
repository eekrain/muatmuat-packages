import Link from "next/link";
import { useMemo } from "react";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import DonutChart from "@/components/Chart/DonutChart";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import { useGetDashboardAnalyticsTotalDriver } from "@/services/CS/dashboard/getTotalDriver";
import { useGetDashboardAnalyticsTotalArmada } from "@/services/CS/dashboard/getTotalFleet";
// 1. Import all necessary data fetching hooks
import { useGetDashboardAnalyticsTotalTransporter } from "@/services/CS/dashboard/getTotalTransporter";

const TotalTransporterShipper = () => {
  // 2. Fetch data for all three categories
  const {
    data: transporterData,
    isLoading: isLoadingTransporter,
    isError: isErrorTransporter,
  } = useGetDashboardAnalyticsTotalTransporter();
  const {
    data: driverData,
    isLoading: isLoadingDriver,
    isError: isErrorDriver,
  } = useGetDashboardAnalyticsTotalDriver();
  const {
    data: armadaData,
    isLoading: isLoadingArmada,
    isError: isErrorArmada,
  } = useGetDashboardAnalyticsTotalArmada();

  // 3. Combine loading and error states
  const isLoading = isLoadingTransporter || isLoadingDriver || isLoadingArmada;
  const isError = isErrorTransporter || isErrorDriver || isErrorArmada;

  // 4. Transform all API data into a single array for easy looping
  const allChartData = useMemo(() => {
    // Define unique colors for each chart's "active" state
    const colors = ["#FFC217"]; // Yellow, Blue, Green

    // Helper function to process data for a single chart
    const processData = (data, unit, activeColor) => {
      if (!data?.donutChartData?.segments) {
        return null;
      }
      return data.donutChartData.segments.map((segment) => ({
        name: segment.label,
        value: segment.count,
        percentage: segment.percentage,
        color: segment.status === "ACTIVE" ? activeColor : "#D9D9D9",
        unit: unit,
      }));
    };

    const charts = [
      { data: processData(transporterData, "Transporter", colors[0]) },
      { data: processData(driverData, "Driver", colors[0]) },
      { data: processData(armadaData, "Armada", colors[0]) },
    ];

    // Filter out any charts that don't have data
    return charts.filter((chart) => chart.data && chart.data.length > 0);
  }, [transporterData, driverData, armadaData]);

  // 5. Handle combined loading and error states
  if (isLoading) {
    return (
      <Card className="!border-none">
        <CardHeader className="!border-none">
          <p>Total Transporter, Driver, dan Fleet</p>
        </CardHeader>
        <CardContent className="flex h-[208px] items-center justify-center">
          <LoadingStatic />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="!border-none">
        <CardHeader className="!border-none">
          <p>Total Transporter, Driver, dan Fleet</p>
        </CardHeader>
        <CardContent className="flex h-[208px] items-center justify-center">
          <p className="text-sm text-error-500">Gagal memuat data.</p>
        </CardContent>
      </Card>
    );
  }

  // 6. Render the component, looping through the processed chart data
  return (
    <Card className="h-[285px] w-[920px] !border-none">
      <CardHeader className="flex items-center justify-between !border-none !px-6 !py-5">
        <p className="text-base font-bold text-neutral-900">
          Total Transporter, Driver, dan Fleet
        </p>
        <Link href="/dashboard/analytics/laporan">
          <p className="cursor-pointer text-xs font-medium text-primary-700">
            Lihat Detail
          </p>
        </Link>
      </CardHeader>
      <CardContent className="!px-6 !py-0">
        {allChartData.length > 0 ? (
          <div className="flex flex-row">
            {allChartData.map((chart, index) => (
              <div
                key={index}
                className="flex flex-1 flex-row items-center justify-center"
              >
                <DonutChart
                  data={chart.data}
                  className="flex h-[208px] w-[269.33px] flex-col !p-0"
                  legendClassname="flex flex-row gap-x-3 pt-3"
                  itemLegendClassname="gap-y-2 gap-x-[5px] items-start"
                  tooltipClassname="w-full h-[23px]"
                  textTooltipClassname="flex-row gap-[1px]"
                  centerTooltipClassname="w-full h-[23px]"
                  textCenterTooltipClassname="flex-row flex gap-[2px]"
                />
                {/* Render the separator if it's not the last chart */}
                {index < allChartData.length - 1 && (
                  <hr className="h-[70px] w-0 border border-neutral-400" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <DataEmpty
            isResponsive={false}
            className="bg-transparent !py-8"
            src="/icons/dashboard/blue-box.svg"
            title="Belum Ada Data Terdaftar"
            subtitle="Data total transporter, driver, dan fleet akan ditampilkan disini"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TotalTransporterShipper;
