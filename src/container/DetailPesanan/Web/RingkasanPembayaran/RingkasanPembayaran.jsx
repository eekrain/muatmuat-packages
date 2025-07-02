import { RingkasanPembayaranTambahanBiaya } from "./RingkasanPembayaranTambahanBiaya";

export const RingkasanPembayaran = ({ dataRingkasanPembayaran }) => {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <RingkasanPembayaranTambahanBiaya
        dataRingkasanPembayaran={dataRingkasanPembayaran}
      />
    </div>
  );
};

// {/* Card Ringkasan Pembayaran */}
// {dataRingkasanPembayaran?.orderStatus ===
//   OrderStatusEnum.WAITING_PAYMENT_2 ? (
//     <RingkasanPembayaranPending
//       dataRingkasanPembayaran={dataRingkasanPembayaran}
//     />
//   ) : (
//     <RingkasanPembayaranDefault
//       dataRingkasanPembayaran={dataRingkasanPembayaran}
//     />
//   )}
