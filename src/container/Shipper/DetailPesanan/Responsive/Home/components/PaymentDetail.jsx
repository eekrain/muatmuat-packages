import { RingkasanPembayaranPendingPayment } from "../../../Web/RingkasanPembayaran/RingkasanPembayaranPendingPayment";

export const PaymentDetail = ({ dataRingkasanPembayaran }) => {
  return (
    <div>
      <RingkasanPembayaranPendingPayment
        dataRingkasanPembayaran={dataRingkasanPembayaran}
        isShowWaitFleetAlert
      />
    </div>
  );
};
