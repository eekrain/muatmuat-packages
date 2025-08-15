import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Card, { CardContent } from "@/components/Card/Card";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

const RingkasanPesananHeader = ({ dataOrderDetail }) => {
  const { t } = useTranslation();

  return (
    <Card className="rounded-xl border-none">
      <CardContent className="p-6">
        <div className="flex w-full items-end gap-x-3">
          <div className="grid flex-1 grid-cols-[178px_1fr] items-center gap-x-8 gap-y-2">
            <span className="text-xs font-medium leading-[1.2] text-neutral-600">
              {t("StatusPesananHeader.labelKodePesanan", {}, "Kode Pesanan")}
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
                  //   dataStatusPesanan.orderStatus.startsWith("CANCELED") &&
                  //     dataStatusPesanan.cancellationHistory &&
                  //     "gap-x-5"
                )}
              >
                <BadgeStatusPesanan variant="primary" className="w-fit">
                  {/* {statusMeta.label} */}
                  Menunggu Konfirmasi Shipper
                </BadgeStatusPesanan>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RingkasanPesananHeader;
