import { Fragment } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/BottomSheet/BottomSheetUp";

import { useTranslation } from "@/hooks/use-translation";

import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";

const DriverStatusBottomsheet = ({
  isOpen,
  setOpen,
  selectedGroupedStatusInfo,
}) => {
  const { t } = useTranslation();
  return (
    <BottomSheet open={isOpen} onOpenChange={setOpen}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>Status Lainnya</BottomSheetTitle>
        </BottomSheetHeader>
        <div className="w-full px-4 pb-6">
          {selectedGroupedStatusInfo.map((status, key) => (
            <Fragment key={key}>
              <BadgeStatusPesanan
                variant={
                  status?.statusCode === OrderStatusEnum.WAITING_PAYMENT_1 ||
                  status?.statusCode === OrderStatusEnum.WAITING_PAYMENT_2 ||
                  status?.statusCode === OrderStatusEnum.WAITING_PAYMENT_3 ||
                  status?.statusCode === OrderStatusEnum.WAITING_PAYMENT_4 ||
                  status?.statusCode === OrderStatusEnum.WAITING_REPAYMENT_1 ||
                  status?.statusCode === OrderStatusEnum.WAITING_REPAYMENT_2
                    ? "warning"
                    : status?.statusCode ===
                          OrderStatusEnum.CANCELED_BY_SHIPPER ||
                        status?.statusCode ===
                          OrderStatusEnum.CANCELED_BY_SYSTEM ||
                        status?.statusCode ===
                          OrderStatusEnum.CANCELED_BY_TRANSPORTER
                      ? "error"
                      : status?.statusCode === OrderStatusEnum.COMPLETED
                        ? "success"
                        : "primary"
                }
                className="w-full"
              >
                {`${status.statusLabel} : ${status.count} ${t("labelUnit")}`}
              </BadgeStatusPesanan>
            </Fragment>
          ))}
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};

export default DriverStatusBottomsheet;
