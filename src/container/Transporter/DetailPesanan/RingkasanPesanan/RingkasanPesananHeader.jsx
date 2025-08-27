"use client";

import { useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";

import RespondChangeModal from "@/container/Shared/OrderModal/RespondChangeModal";

import { useTranslation } from "@/hooks/use-translation";

import { getStatusPesananMetadataTransporter } from "@/lib/normalizers/transporter/getStatusPesananMetadata";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

import { ORDER_STATUS } from "@/utils/Transporter/orderStatus";

import { ModalLihatStatusLainnya } from "./ModalLihatStatusLainnya";

const RingkasanPesananHeader = ({ dataOrderDetail }) => {
  const { t } = useTranslation();
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);

  const handleResponPerubahan = () => {
    setIsRespondModalOpen(true);
  };

  const handleAssignArmada = () => {
    const invoiceNumber =
      dataOrderDetail?.invoiceNumber || dataOrderDetail?.orderCode;
    toast.success(`Berhasil assign armada untuk pesanan ${invoiceNumber}`);
  };

  const handleKonfirmasiSiap = () => {
    const invoiceNumber =
      dataOrderDetail?.invoiceNumber || dataOrderDetail?.orderCode;
    toast.success(`Berhasil konfirmasi siap untuk pesanan ${invoiceNumber}`);
  };

  const handleKirimResponPerubahan = () => {
    const invoiceNumber =
      dataOrderDetail?.invoiceNumber || dataOrderDetail?.orderCode;
    toast.success(
      `Berhasil kirim respon perubahan untuk pesanan ${invoiceNumber}`
    );
  };

  const handleSimpanDraftResponPerubahan = () => {
    const invoiceNumber =
      dataOrderDetail?.invoiceNumber || dataOrderDetail?.orderCode;
    toast.success(
      `Respon perubahan berhasil disimpan sebagai draft untuk pesanan ${invoiceNumber}`
    );
  };

  const handleBatalkanArmada = () => {
    const invoiceNumber =
      dataOrderDetail?.invoiceNumber || dataOrderDetail?.orderCode;
    const fleetCount = dataOrderDetail?.fleets?.length || 0;
    toast.success(
      `Berhasil membatalkan ${fleetCount} armada dari pesanan ${invoiceNumber}`
    );
  };

  const handleLihatPosisiArmada = () => {
    const invoiceNumber =
      dataOrderDetail?.invoiceNumber || dataOrderDetail?.orderCode;
    toast.success(
      `Berhasil melihat posisi armada untuk pesanan ${invoiceNumber}`
    );
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

              {/* Link Lihat Status Lainnya untuk status UNLOADING */}
              {dataOrderDetail?.orderStatus?.startsWith("UNLOADING") &&
                dataOrderDetail?.otherStatus?.length > 0 && (
                  <ModalLihatStatusLainnya
                    otherStatus={dataOrderDetail?.otherStatus}
                  />
                )}

              {/* Link Lihat Detail Pembatalan untuk status yang dibatalkan */}
              {(dataOrderDetail?.orderStatus?.startsWith(
                "CANCELLED_BY_TRANSPORTER"
              ) ||
                dataOrderDetail?.orderStatus?.startsWith(
                  "CANCELLED_BY_SHIPPER"
                ) ||
                dataOrderDetail?.orderStatus?.startsWith(
                  "CANCELLED_BY_SYSTEM"
                )) && (
                <a href="#" className="text-sm font-medium text-blue-600">
                  Lihat Detail Pembatalan
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-x-3">
            {/* Referensi: LDG-7 */}
            {dataOrderDetail?.hasResponseDraft && (
              <BadgeStatusPesanan variant="muted" className="w-fit">
                Respon Perubahan Disimpan Sebagai Draf
              </BadgeStatusPesanan>
            )}

            {/* Referensi: LDG-7 */}
            {(dataOrderDetail?.orderStatus?.startsWith("LOADING") ||
              dataOrderDetail?.orderStatus?.startsWith("UNLOADING")) && (
              <Button
                onClick={handleLihatPosisiArmada}
                variant="muattrans-primary"
              >
                Lihat Posisi Armada
              </Button>
            )}
            {/* Referensi: LDN-334 */}
            {dataOrderDetail?.orderStatus?.startsWith("NEED_ASSIGN_FLEET") && (
              <Button onClick={handleAssignArmada} variant="muattrans-primary">
                Assign Armada
              </Button>
            )}
            {/* Referensi: LDN-336 */}
            {dataOrderDetail?.orderStatus?.startsWith(
              "NEED_CONFIRMATION_READY"
            ) && (
              <Button
                onClick={handleKonfirmasiSiap}
                variant="muattrans-primary"
              >
                Konfirmasi Siap
              </Button>
            )}
            {/* Referensi: LDN-337 */}
            {dataOrderDetail?.orderStatus?.startsWith(
              "NEED_CHANGE_RESPONSE"
            ) && (
              <Button
                onClick={handleResponPerubahan}
                variant="muattrans-primary"
              >
                Respon Perubahan
              </Button>
            )}
            {/* Referensi: LDN-338 */}
            {dataOrderDetail?.orderStatus?.startsWith(
              "NEED_SAVE_RESPONSE_DRAFT"
            ) && (
              <Button
                onClick={handleSimpanDraftResponPerubahan}
                variant="muattrans-primary"
              >
                Simpan Draft
              </Button>
            )}
            {/* Referensi: LDN-339 */}
            {dataOrderDetail?.orderStatus?.startsWith("NEED_CANCEL_FLEET") && (
              <Button
                onClick={handleBatalkanArmada}
                variant="muattrans-primary"
              >
                Batalkan Armada
              </Button>
            )}
            {/* Referensi: LDN-340 */}
            {dataOrderDetail?.orderStatus?.startsWith("NEED_SEND_RESPONSE") && (
              <Button
                onClick={handleKirimResponPerubahan}
                variant="muattrans-primary"
              >
                Kirim Respon Perubahan
              </Button>
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
