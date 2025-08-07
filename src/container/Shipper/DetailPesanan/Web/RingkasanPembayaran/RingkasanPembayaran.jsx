import { useEffect, useRef } from "react";

import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { toast } from "@/lib/toast";

import { RingkasanPembayaranDefault } from "./RingkasanPembayaranDefault";
import { RingkasanPembayaranPendingPayment } from "./RingkasanPembayaranPendingPayment";
import { RingkasanPembayaranPerubahanPesanan } from "./RingkasanPembayaranPerubahanPesanan";
import { RingkasanPembayaranTambahanBiaya } from "./RingkasanPembayaranTambahanBiaya";

const LIST_SHOW_PENDING = [
  OrderStatusEnum.WAITING_PAYMENT_2,
  OrderStatusEnum.WAITING_PAYMENT_4,
  OrderStatusEnum.WAITING_REPAYMENT_2,
];

export const RingkasanPembayaran = ({
  dataRingkasanPembayaran,
  dataStatusPesanan,
  isShowWaitFleetAlert,
}) => {
  const prevStatusRef = useRef(dataRingkasanPembayaran?.orderStatus);

  useEffect(() => {
    const currentStatus = dataRingkasanPembayaran?.orderStatus;
    const prevStatus = prevStatusRef.current;

    // Jika sebelumnya status ada di LIST_SHOW_PENDING
    if (prevStatus && LIST_SHOW_PENDING.includes(prevStatus)) {
      // Dan sekarang status berubah ke selain CANCELED
      if (
        currentStatus &&
        !LIST_SHOW_PENDING.includes(currentStatus) &&
        currentStatus !== OrderStatusEnum.CANCELED_BY_SYSTEM &&
        currentStatus !== OrderStatusEnum.CANCELED_BY_SHIPPER &&
        currentStatus !== OrderStatusEnum.CANCELED_BY_TRANSPORTER
      ) {
        toast.success("Pembayaran berhasil");
      }
    }

    // Update ref untuk pengecekan berikutnya
    prevStatusRef.current = currentStatus;
  }, [dataRingkasanPembayaran?.orderStatus]);
  return (
    <div className="sticky top-[120px] h-fit">
      {/* Card Ringkasan Pembayaran */}
      {LIST_SHOW_PENDING.includes(dataRingkasanPembayaran?.orderStatus) ? (
        <RingkasanPembayaranPendingPayment
          dataRingkasanPembayaran={dataRingkasanPembayaran}
        />
      ) : dataRingkasanPembayaran?.priceCharge &&
        dataRingkasanPembayaran?.priceCharge?.isPaid === false ? (
        <RingkasanPembayaranTambahanBiaya
          dataRingkasanPembayaran={dataRingkasanPembayaran}
        />
      ) : dataRingkasanPembayaran?.orderStatus ===
        OrderStatusEnum.WAITING_PAYMENT_3 ? (
        <RingkasanPembayaranPerubahanPesanan
          dataRingkasanPembayaran={dataRingkasanPembayaran}
        />
      ) : (
        <RingkasanPembayaranDefault
          dataRingkasanPembayaran={dataRingkasanPembayaran}
          dataStatusPesanan={dataStatusPesanan}
          isShowWaitFleetAlert={isShowWaitFleetAlert}
        />
      )}
    </div>
  );
};
