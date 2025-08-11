import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";
import {
  OrderStatusEnum,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";

export const ModalLihatStatusLainnya = ({ otherStatus }) => {
  const { t } = useTranslation();

  return (
    <Modal closeOnOutsideClick>
      <ModalTrigger>
        <button className="text-xs font-medium leading-[1.2] text-primary-700">
          Lihat Status Lainnya
        </button>
      </ModalTrigger>
      <ModalContent type="muatmuat" className="px-6 py-8">
        <h2 className="mb-6 text-center text-base font-bold leading-[1.2] text-neutral-900">
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
              {t(OrderStatusTitle[status.orderStatus])}:{" "}
              {status.unitFleetStatus} Unit
            </BadgeStatusPesanan>
          ))}
        </div>
      </ModalContent>
    </Modal>
  );
};
