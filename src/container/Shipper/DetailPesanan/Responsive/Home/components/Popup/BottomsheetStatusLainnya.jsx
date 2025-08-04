import { useState } from "react";

import { ChevronRight } from "lucide-react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/BottomSheet";
import { useTranslation } from "@/hooks/use-translation";
import { getStatusPesananMetadata } from "@/lib/normalizers/detailpesanan/getStatusPesananMetadata";

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
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>Status Lainnya</BottomSheetTitle>
        </BottomSheetHeader>

        <div className="flex flex-col gap-4 px-4 pb-6">
          {dataStatusPesanan?.otherStatus?.map((status, index) => {
            const statusMeta = getStatusPesananMetadata({
              orderStatus: status.orderStatus,
              unitFleetStatus: status.unitFleetStatus,
              totalUnit: dataStatusPesanan.totalUnit,
              t,
              orderType: dataStatusPesanan.orderType,
            });

            return (
              <BadgeStatusPesanan
                key={index}
                variant={statusMeta.variant}
                className="w-full text-sm font-semibold"
              >
                {statusMeta.label}
              </BadgeStatusPesanan>
            );
          })}
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};
