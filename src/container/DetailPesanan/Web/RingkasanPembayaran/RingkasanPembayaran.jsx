// RingkasanPembayaran.jsx
import Button from "@/components/Button/Button";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

import { ModalBatalkanPesanan } from "./ModalBatalkanPesanan";
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

      {/* Buttons Section */}
      {dataRingkasanPembayaran?.orderStatus !==
        OrderStatusEnum.WAITING_PAYMENT_2 && (
        <div className="flex w-full flex-col gap-4">
          {dataRingkasanPembayaran?.orderStatus !==
            OrderStatusEnum.SEARCHING_FLEET && (
            <Button
              variant="muatparts-primary-secondary"
              className="h-8 w-full"
              onClick={() => {}}
              type="button"
            >
              Ubah Pesanan
            </Button>
          )}

          <ModalBatalkanPesanan />
        </div>
      )}
    </div>
  );
};
