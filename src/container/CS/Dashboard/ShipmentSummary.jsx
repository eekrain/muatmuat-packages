import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import CardMenu from "@/components/Card/CardMenu";
import LoadingStatic from "@/components/Loading/LoadingStatic";
import { formatNumberShorthand } from "@/lib/utils/formatNumberShorthand";
import { useGetDashboardAnalyticsDeliverySummary } from "@/services/CS/dashboard/getDeliverySummaryDashboard";

const summaryItems = [
  {
    id: 1,
    key: "totalTonnage",
    icon: "/icons/dashboard/income 2.svg", // Updated icon path
    title: "Total Tonase Muatan",
    unit: "Ton",
  },
  {
    id: 2,
    key: "totalDistance",
    icon: "/icons/dashboard/address-location.svg", // Updated icon path
    title: "Total Jarak Tempuh",
    unit: "km",
  },
];

const ShipmentSummary = () => {
  const { data, isLoading, isError } =
    useGetDashboardAnalyticsDeliverySummary();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <LoadingStatic />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-error-500">Gagal memuat data.</p>
        </div>
      );
    }

    return (
      <div className="flex h-full gap-x-4">
        <TooltipProvider>
          {summaryItems.map((item) => {
            const rawValue = data?.[item.key] || 0;
            const displayValue = `${formatNumberShorthand(rawValue)} ${item.unit}`;

            return (
              <CardMenu
                key={item.id}
                icon={item.icon}
                title={item.title}
                customAction={
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-base font-bold text-neutral-900">
                        {displayValue}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-900 shadow-md">
                      <p>{`${rawValue.toLocaleString("id-ID")} ${item.unit}`}</p>
                    </TooltipContent>
                  </Tooltip>
                }
                className="flex h-[72px] w-[584px] cursor-pointer items-center justify-center rounded-[6px] border border-neutral-400 !px-6 !py-[11.5px] hover:border-primary-800"
                iconContainerClassName="h-[40px] w-[40px]"
                titleClassName="text-sm !font-medium text-neutral-900"
                actionContainerClassName="pr-2"
                containerClassname="gap-x-3"
              />
            );
          })}
        </TooltipProvider>
      </div>
    );
  };

  return (
    <Card className="h-[149px] w-full max-w-[1232px] !border-none">
      <CardHeader className="flex flex-row items-center justify-between !border-none !px-6 !py-4">
        <p className="text-base font-bold text-neutral-900">
          Ringkasan Pengiriman
        </p>
        <Link href="/dashboard/analytics/laporan">
          <span className="cursor-pointer text-xs font-medium text-primary-700">
            Lihat Laporan
          </span>
        </Link>
      </CardHeader>
      <CardContent className="!flex !gap-4 !p-0 !px-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default ShipmentSummary;
