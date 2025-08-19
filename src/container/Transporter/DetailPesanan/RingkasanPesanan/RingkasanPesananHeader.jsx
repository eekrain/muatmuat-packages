"use client";

import { useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import RespondChangeModal from "@/container/Shared/OrderModal/RespondChangeModal";
import { useTranslation } from "@/hooks/use-translation";
import { getStatusPesananMetadataTransporter } from "@/lib/normalizers/transporter/getStatusPesananMetadata";
import { cn } from "@/lib/utils";
import { ORDER_STATUS } from "@/utils/Transporter/orderStatus";

const RingkasanPesananHeader = ({ dataOrderDetail }) => {
  const { t } = useTranslation();
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);

  const handleResponPerubahan = () => {
    setIsRespondModalOpen(true);
  };

  const statusMeta = getStatusPesananMetadataTransporter({
    orderStatus: dataOrderDetail?.orderStatus,
    orderStatusUnit: dataOrderDetail?.orderStatusUnit,
    truckCount: dataOrderDetail?.totalUnit,
    t,
  });

  return (
    <Card className="rounded-xl border-none">
      <CardContent className="p-6">
        <div className="flex w-full items-center gap-x-3">
          <div className="grid flex-1 grid-cols-[178px_1fr] items-center gap-x-8 gap-y-2">
            <span className="text-xs font-medium leading-[1.2] text-neutral-600">
              {/* 25. 30 - Web - LB - 0253 */}
              No. Pesanan
            </span>

            <span className="text-xs font-medium leading-[1.2] text-neutral-600">
              {t(
                "StatusPesananHeader.labelStatusPesanan",
                {},
                "Status Pesanan"
              )}
            </span>

            <span className="text-sm font-bold leading-[16.8px] text-neutral-900">
              {dataOrderDetail?.invoiceNumber || dataOrderDetail?.orderCode}
            </span>

            <div className="flex items-center gap-x-2">
              <div
                className={cn(
                  "flex items-center gap-x-2"
                  // dataStatusPesanan.orderStatus.startsWith("CANCELED") &&
                  //   dataStatusPesanan.cancellationHistory &&
                  //   "gap-x-5"
                )}
              >
                <BadgeStatusPesanan
                  variant={statusMeta?.variant}
                  icon={{ iconLeft: statusMeta?.icon }}
                  className="w-fit"
                >
                  {statusMeta?.label}
                </BadgeStatusPesanan>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-x-3">
            {/* Referensi: LDG-7 */}
            {false && (
              <BadgeStatusPesanan variant="muted" className="w-fit">
                Respon Perubahan Disimpan Sebagai Draf
              </BadgeStatusPesanan>
            )}

            {/* Referensi: LDG-7 */}
            {dataOrderDetail?.orderStatus === ORDER_STATUS.LOADING && (
              <Button onClick={() => {}} variant="muattrans-primary">
                Lihat Posisi Armada
              </Button>
            )}
            {/* Referensi: LDN-334 */}
            {dataOrderDetail?.orderStatus ===
              ORDER_STATUS.NEED_ASSIGN_FLEET && (
              <Button onClick={() => {}} variant="muattrans-primary">
                Assign Armada
              </Button>
            )}
            {/* Referensi: LDN-336 */}
            {dataOrderDetail?.orderStatus ===
              ORDER_STATUS.NEED_CONFIRMATION_READY && (
              <Button onClick={() => {}} variant="muattrans-primary">
                Konfirmasi Siap
              </Button>
            )}
            {/* Referensi: LDN-337 */}
            {dataOrderDetail?.orderStatus ===
              ORDER_STATUS.NEED_CHANGE_RESPONSE && (
              <Button onClick={() => {}} variant="muattrans-primary">
                Respon Perubahan
              </Button>
            )}

            {dataOrderDetail?.orderStatus === "NEED_RESPONSE_CHANGE" && (
              <Button onClick={handleResponPerubahan}>Respon Perubahan</Button>
            )}
          </div>
        </div>
      </CardContent>

      {/* Modal Response Change*/}
      <RespondChangeModal
        isOpen={isRespondModalOpen}
        onClose={() => setIsRespondModalOpen(false)}
        orderData={{
          ...dataOrderDetail,
          id: dataOrderDetail?.orderId, // map orderId ke id menyesuaikan api yang diterima modal
        }}
      />
    </Card>
  );
};

export default RingkasanPesananHeader;
