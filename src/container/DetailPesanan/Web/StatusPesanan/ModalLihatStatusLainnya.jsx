import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { OrderStatusTitle } from "@/lib/constants/detailpesanan/detailpesanan.enum";

export const ModalLihatStatusLainnya = ({ otherStatus }) => {
  return (
    <Modal>
      <ModalTrigger>
        <button className="text-xs font-medium leading-[1.2] text-primary-700">
          Lihat Status Lainnya
        </button>
      </ModalTrigger>
      <ModalContent className="px-6 py-8">
        <h2 className="mb-6 text-center text-[16px] font-bold leading-[1.2] text-neutral-900">
          Status Lainnya
        </h2>
        <div className="flex flex-col gap-2">
          {otherStatus.map((status) => (
            <BadgeStatusPesanan
              key={status.orderStatus}
              variant="primary"
              className="w-[272px]"
            >
              {OrderStatusTitle[status.orderStatus]}: {status.unitFleetStatus}{" "}
              Unit
            </BadgeStatusPesanan>
          ))}
        </div>
      </ModalContent>
    </Modal>
  );
};
