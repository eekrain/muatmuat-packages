"use client";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

const TotalOrders = () => {
  return (
    <Card className="h-[322px] w-[817px] !border-none">
      <CardHeader className="flex flex-col items-center justify-center border-none">
        <h1 className="text-2xl font-bold text-neutral-900">
          Total Pesanan: 0 Pesanan
        </h1>
        <p className="text-xs font-medium text-neutral-600">Dalam Bulan Ini</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <ImageComponent
            src="/img/dashboard/empty-order.png"
            alt="Total Orders"
            width={95}
            height={95}
          />
          <p className="text-base font-semibold text-neutral-600">
            Belum ada Pesanan
          </p>
          <p className="pt-[2px] text-xs font-medium text-neutral-600">
            Belum ada transaksi yang tercatat
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalOrders;
