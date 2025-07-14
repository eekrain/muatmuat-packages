import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

import { RingkasanPembayaranDefault } from "./RingkasanPembayaranDefault";
import { RingkasanPembayaranPending } from "./RingkasanPembayaranPending";
import { RingkasanPembayaranTambahanBiaya } from "./RingkasanPembayaranTambahanBiaya";

const LIST_SHOW_PENDING = [
  OrderStatusEnum.WAITING_PAYMENT_2,
  OrderStatusEnum.WAITING_REPAYMENT_2,
];

export const RingkasanPembayaran = ({
  dataRingkasanPembayaran,
  isShowWaitFleetAlert,
}) => {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* Card Ringkasan Pembayaran */}
      {LIST_SHOW_PENDING.includes(dataRingkasanPembayaran?.orderStatus) ? (
        <RingkasanPembayaranPending
          dataRingkasanPembayaran={dataRingkasanPembayaran}
        />
      ) : dataRingkasanPembayaran?.orderStatus ===
        OrderStatusEnum.WAITING_REPAYMENT_1 ? (
        <RingkasanPembayaranTambahanBiaya
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
