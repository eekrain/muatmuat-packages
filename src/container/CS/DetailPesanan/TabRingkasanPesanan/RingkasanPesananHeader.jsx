import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Card, { CardContent } from "@/components/Card/Card";
import { useTranslation } from "@/hooks/use-translation";
import { getStatusPesananMetadataCS } from "@/lib/normalizers/CS/getStatusPesananMetadata";
import { cn } from "@/lib/utils";

import { InformasiKontakCard } from "./InformasiKontakCard";
import { ModalLihatStatusLainnya } from "./ModalLihatStatusLainnya";

const RingkasanPesananHeader = ({ data }) => {
  const { t } = useTranslation();

  const statusPesanan = getStatusPesananMetadataCS({
    orderStatus: data?.orderDetail?.orderStatus,
    orderStatusUnit: data?.orderDetail?.orderStatusUnit,
    truckCount: data?.orderSummary?.truckCount,
    t,
  });

  return (
    <Card className="rounded-xl border-none">
      <CardContent className="p-6">
        <div className="flex w-full items-end gap-x-3">
          <div className="grid flex-1 grid-cols-[200px_320px_200px] items-center gap-x-3 gap-y-2">
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

            <span className="text-xs font-medium leading-[1.2] text-neutral-600">
              {t(
                "RingkasanPesananHeader.labelJumlahArmada",
                {},
                "Jumlah Armada"
              )}
            </span>

            <span className="text-sm font-bold leading-[16.8px] text-neutral-900">
              {data?.orderDetail?.orderCode}
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
                <BadgeStatusPesanan
                  // icon={{ iconLeft: "/icons/warning14.svg" }}
                  // variant="warning"
                  // variant="error"
                  // variant="success"
                  // variant="primary"
                  variant={statusPesanan.variant}
                  className="w-fit"
                >
                  {statusPesanan.label}
                  {/* Selesai */}
                  {/* Proses Bongkar */}
                  {/* Proses Muat */}
                  {/* Perlu Respon Perubahan */}
                  {/* Perlu Konfirmasi Siap */}
                  {/* Armada Dijadwalkan */}
                  {/* Perlu Assign Armada */}
                  {/* Pesanan Terkonfirmasi */}
                  {/* Menunggu Konfirmasi Shipper */}
                </BadgeStatusPesanan>

                <ModalLihatStatusLainnya otherStatus={data?.otherStatus} />
              </div>
            </div>

            <span className="text-sm font-bold leading-[16.8px] text-neutral-900">
              {t(
                "RingkasanPesananHeader.textArmadaCount",
                { count: data?.orderSummary?.truckCount },
                "{count} Unit"
              )}
            </span>
          </div>
        </div>

        <InformasiKontakCard
          shipperInfo={data?.shipperInfo}
          transporterInfo={data?.transporterInfo}
        />
      </CardContent>
    </Card>
  );
};

export default RingkasanPesananHeader;
