import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

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
  isShowWaitFleetAlert,
}) => {
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
          isShowWaitFleetAlert={isShowWaitFleetAlert}
        />
      )}
    </div>
  );
};
