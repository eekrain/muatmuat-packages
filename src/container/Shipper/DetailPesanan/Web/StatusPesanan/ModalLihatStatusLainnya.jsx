import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import {
  OrderStatusEnum,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";

export const ModalLihatStatusLainnya = ({ otherStatus }) => {
  return (
    <Modal>
      <ModalTrigger>
        <button className="leading-[1.2] text-xs font-medium text-primary-700">
          Lihat Status Lainnya
        </button>
      </ModalTrigger>
      <ModalContent className="px-6 py-8">
        <h2 className="leading-[1.2] mb-6 text-center text-base font-bold text-neutral-900">
          Status Lainnya
        </h2>
        <div className="flex flex-col gap-2">
          {otherStatus.map((status) => (
            <BadgeStatusPesanan
              key={status.orderStatus}
              variant={
                status.orderStatus.startsWith("WAITING")
                  ? "warning"
                  : status.orderStatus.startsWith("CANCELED")
                    ? "error"
                    : status.orderStatus === OrderStatusEnum.COMPLETED
                      ? "success"
                      : "primary"
              }
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
