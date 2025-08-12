"use client";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import CardMenu from "@/components/Card/CardMenu";

const summaryItems = [
  {
    id: 1,
    key: "totalTonnage",
    icon: "/icons/dashboard/income 2.svg", // Assuming a relevant icon path
    title: "Total Tonase Muatan",
  },
  {
    id: 2,
    key: "totalDistance",
    icon: "/icons/dashboard/address-location.svg", // Assuming a relevant icon path
    title: "Total Jarak Tempuh",
  },
  {
    id: 3,
    key: "utilizedFleets",
    icon: "/icons/dashboard/utilize-fleet.svg",
    title: "Armada Terutilisasi",
  },
];

const summaryData = {
  totalTonnage: "0 Ton",
  totalDistance: "0 Km",
  utilizedFleets: "0 Unit",
};

const SummaryShipment = () => {
  return (
    <>
      <Card className="h-[322px] w-[399px] !border-none">
        <CardHeader className="flex items-center justify-between border-none !px-6">
          <p className="text-lg font-bold text-neutral-900">
            Ringkasan Pengiriman
          </p>
          <p className="cursor-pointer text-xs font-semibold text-primary-800">
            Lihat Laporan
          </p>
        </CardHeader>
        <CardContent className="!p-0 py-5">
          <div className="flex flex-col gap-4 px-6">
            {summaryItems.map((item) => (
              <CardMenu
                key={item.id}
                icon={item.icon}
                title={item.title}
                customAction={
                  <span className="text-base font-bold text-neutral-900">
                    {summaryData[item.key]}
                  </span>
                }
                className="flex h-[71px] w-[351px] items-center justify-center rounded-[6px] border border-neutral-400 !px-6 !py-[11.5px]"
                iconContainerClassName="w-[40px] h-[40px]"
                titleClassName="text-sm !font-medium text-neutral-900"
                actionContainerClassName="pr-2"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SummaryShipment;
