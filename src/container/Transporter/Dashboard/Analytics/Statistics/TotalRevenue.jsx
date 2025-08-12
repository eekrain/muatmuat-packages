"use client";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

const TotalRevenue = () => {
  return (
    <>
      <Card className="h-[322px] w-[817px] !border-none">
        <CardHeader className="flex flex-col gap-y-6 border-none">
          <div className="flex flex-row items-center">
            <h1 className="text-lg font-bold text-neutral-900">
              Total Pendapatan Diterima
            </h1>
          </div>
          <div>
            <p className="text-lg font-bold text-neutral-900">Rp0</p>
            <p className="text-xs font-medium text-neutral-600">
              Dalam Bulan Ini
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-3">
            <ImageComponent
              src="/img/dashboard/empty-revenue.png"
              alt="Total Orders"
              width={95}
              height={95}
            />
            <p className="text-base font-semibold text-neutral-600">
              Belum Ada Pendapatan Diterima
            </p>
            <p className="pt-[2px] text-xs font-medium text-neutral-600">
              Pendapatan kamu akan muncul di sini setelah ada transaksi masuk
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TotalRevenue;
