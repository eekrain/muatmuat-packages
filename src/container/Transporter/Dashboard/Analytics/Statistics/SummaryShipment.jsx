"use client";

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
import { useGetDashboardDeliverySummary } from "@/services/Transporter/dashboard/analytics/getDashboardDeliverySummary";
import { useAnalyticsStore } from "@/store/Transporter/analyticStore";

const summaryItems = [
  {
    id: 1,
    key: "totalTonnage",
    icon: "/icons/dashboard/income 2.svg",
    title: "Total Tonase Muatan",
    unit: "Ton",
  },
  {
    id: 2,
    key: "totalDistance",
    icon: "/icons/dashboard/address-location.svg",
    title: "Total Jarak Tempuh",
    unit: "km",
  },
  {
    id: 3,
    key: "utilizedFleets",
    icon: "/icons/dashboard/utilize-fleet.svg",
    title: "Armada Terutilisasi",
    unit: "Unit",
  },
];

const SummaryShipment = () => {
  // Get the dynamic date range from the global store
  const { startDate, endDate } = useAnalyticsStore();

  // Fetch summary data using the SWR hook with the selected dates
  const { data, isLoading } = useGetDashboardDeliverySummary({
    startDate,
    endDate,
  });

  if (isLoading) {
    return (
      <Card className="flex h-[322px] w-[399px] items-center justify-center !border-none">
        <LoadingStatic />
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="h-[322px] w-[399px] !border-none">
        <CardHeader className="flex flex-row items-center justify-between border-none !px-6">
          <p className="text-lg font-bold text-neutral-900">
            Ringkasan Pengiriman
          </p>
          <Link href="/dashboard/analytics/laporan">
            <p className="cursor-pointer text-xs font-semibold text-primary-800">
              Lihat Laporan
            </p>
          </Link>
        </CardHeader>
        <CardContent className="!p-0 py-5">
          <div className="flex flex-col gap-4 px-6">
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
                  className="flex h-[71px] w-[351px] cursor-default items-center justify-center rounded-[6px] border border-neutral-400 !px-6 !py-[11.5px]"
                  iconContainerClassName="h-[40px] w-[40px]"
                  titleClassName="text-sm !font-medium text-neutral-900"
                  actionContainerClassName="pr-2"
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default SummaryShipment;
