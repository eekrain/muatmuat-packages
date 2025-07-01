// RingkasanPembayaran.jsx
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

import { RingkasanPembayaranDefault } from "./RingkasanPembayaranDefault";
import { RingkasanPembayaranPending } from "./RingkasanPembayaranPending";

export const RingkasanPembayaran = ({ dataRingkasanPembayaran }) => {
  return (
    <div className="flex w-[338px] flex-col items-center gap-4">
      {/* Card Ringkasan Pembayaran */}
      {dataRingkasanPembayaran?.orderStatus ===
      OrderStatusEnum.WAITING_PAYMENT_2 ? (
        <RingkasanPembayaranPending
          dataRingkasanPembayaran={dataRingkasanPembayaran}
        />
      ) : (
        <RingkasanPembayaranDefault
          dataRingkasanPembayaran={dataRingkasanPembayaran}
        />
      )}
    </div>
  );
};
