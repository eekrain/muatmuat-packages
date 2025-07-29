import { Fragment } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import { useTranslation } from "@/hooks/use-translation";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

const DriverStatusBottomsheet = ({
  isOpen,
  setOpen,
  selectedGroupedStatusInfo,
}) => {
  const { t } = useTranslation();
  return (
    <BottomSheet open={isOpen} onOpenChange={setOpen}>
      <BottomSheetContent>
        <BottomSheetHeader>Status Lainnya</BottomSheetHeader>
        <div className="w-full px-4 py-6">
          {selectedGroupedStatusInfo.map((status, key) => (
            <Fragment key={key}>
              <BadgeStatusPesanan
                variant={
                  status?.statusLabel === OrderStatusEnum.WAITING_PAYMENT_1 ||
                  status?.statusLabel === OrderStatusEnum.WAITING_PAYMENT_2 ||
                  status?.statusLabel === OrderStatusEnum.WAITING_REPAYMENT_1 ||
                  status?.statusLabel === OrderStatusEnum.WAITING_REPAYMENT_2
                    ? "warning"
                    : status?.statusLabel ===
                          OrderStatusEnum.CANCELED_BY_SHIPPER ||
                        status?.statusLabel ===
                          OrderStatusEnum.CANCELED_BY_SYSTEM ||
                        status?.statusLabel ===
                          OrderStatusEnum.CANCELED_BY_TRANSPORTER
                      ? "error"
                      : status?.statusLabel === OrderStatusEnum.COMPLETED
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
