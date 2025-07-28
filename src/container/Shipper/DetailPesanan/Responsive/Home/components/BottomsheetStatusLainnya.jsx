import { useState } from "react";

import { ChevronRight } from "lucide-react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/Bottomsheet";
import { useTranslation } from "@/hooks/use-translation";

import { getOrderStatusLabel, getStatusVariant } from "../../../utlis";

export const BottomsheetStatusLainnya = ({ dataStatusPesanan }) => {
  const { t } = useTranslation();
  const [isOpenOtherStatus, setIsOpenOtherStatus] = useState();

  if (!dataStatusPesanan?.otherStatus?.length) return null;

  return (
    <BottomSheet open={isOpenOtherStatus} onOpenChange={setIsOpenOtherStatus}>
      <BottomSheetTrigger>
        <button
          className="flex w-full flex-row items-center justify-between"
          onClick={() => setIsOpenOtherStatus(true)}
        >
          <div className="flex items-center gap-3 text-xs font-semibold text-[#176CF7]">
            Lihat Status Lainnya
          </div>
          <ChevronRight className="h-4 w-4 text-[#176CF7]" />
        </button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>Status Lainnya</BottomSheetHeader>

        <div className="flex flex-col gap-4 px-4 py-6">
          {dataStatusPesanan?.otherStatus?.map((status, index) => (
            <BadgeStatusPesanan
              key={index}
              variant={getStatusVariant({
                orderStatus: status.orderStatus,
              })}
              className="w-full text-sm font-semibold"
            >
              {getOrderStatusLabel({
                orderStatus: status.orderStatus,
                unitFleetStatus: dataStatusPesanan.unitFleetStatus,
                totalUnit: dataStatusPesanan.totalUnit,
                t,
              })}
            </BadgeStatusPesanan>
          ))}
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};
