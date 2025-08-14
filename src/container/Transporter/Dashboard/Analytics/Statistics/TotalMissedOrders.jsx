"use client";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import DonutChart from "@/components/Chart/DonutChart";
import { InfoTooltip } from "@/components/Form/InfoTooltip";

const TotalMissedOrders = () => {
  const donutChartData = [
    {
      name: "Selesai",
      value: 200000,
      unit: "Pesanan",
      percentage: 65,
      price: 20000,
      color: "#F09D51",
    },
    {
      name: "Berjalan",
      value: 40000,
      unit: "Pesanan",
      percentage: 32,
      price: 30000,
      color: "#E3C16F",
    },
    {
      name: "Dibatalkan",
      value: 50000,
      unit: "Pesanan",
      percentage: 3,
      price: 50000,
      color: "#D9534F",
    },
  ];

  return (
    <>
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
            <p className="text-lg font-bold text-neutral-900">Rp3,500,000</p>
            <p className="text-xs font-medium text-neutral-600">
              Dalam Bulan Ini
            </p>
          </div>
        </CardHeader>
        <CardContent className="!px-0 !py-0">
          <DonutChart
            className="h-[173px] w-[351px]"
            data={donutChartData}
            showThirdRow={true}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default TotalMissedOrders;
