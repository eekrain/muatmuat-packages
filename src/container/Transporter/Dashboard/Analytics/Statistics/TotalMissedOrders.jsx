"use client";

import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

const TotalMissedOrders = () => {
  return (
    <>
      <Card className="h-[322px] w-[399px] !border-none">
        <CardHeader className="flex flex-col gap-y-6 border-none">
          <div className="flex flex-row items-center gap-2">
            <h1 className="text-lg font-bold text-neutral-900">
              Total Pesanan Terlewat
            </h1>
            <InfoTooltip
              appearance={{
                iconClassName: "w-6 h-6 text-neutral-700 cursor-pointer",
              }}
            >
              Jumlah pesanan yang tidak berhasil diproses atau kamu lewatkan.
            </InfoTooltip>
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
              src="/img/dashboard/missed-order.png"
              alt="Total Orders"
              width={95}
              height={95}
            />
            <p className="text-base font-semibold text-neutral-600">
              Belum ada Pesanan Terlewat
            </p>
            <p className="pt-[2px] text-xs font-medium text-neutral-600">
              Pastikan tidak ada pesanan yang terlewat
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TotalMissedOrders;
