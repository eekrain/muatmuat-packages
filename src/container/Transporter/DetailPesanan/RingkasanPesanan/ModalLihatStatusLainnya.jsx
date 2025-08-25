import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";
import { getOrderStatusBadgeWithTranslation } from "@/utils/Transporter/orderStatus";

export const ModalLihatStatusLainnya = ({ otherStatus }) => {
  const { t } = useTranslation();

  return (
    <Modal closeOnOutsideClick>
      <ModalTrigger>
        <button className="text-sm font-medium text-blue-600">
          Lihat Status Lainnya
        </button>
      </ModalTrigger>
      <ModalContent type="muatmuat" className="px-6 py-8">
        <h2 className="mb-6 text-center text-base font-bold leading-[1.2] text-neutral-900">
          Status Lainnya
        </h2>
        <div className="flex flex-col gap-2">
          {otherStatus?.map((status, index) => {
            const statusConfig = getOrderStatusBadgeWithTranslation(
              status.orderStatus,
              t
            );
            return (
              <BadgeStatusPesanan
                key={index}
                variant={statusConfig?.variant || "primary"}
                className="w-[272px]"
              >
                {statusConfig?.label || status.orderStatus}:{" "}
                {status.orderStatusUnit} Unit
              </BadgeStatusPesanan>
            );
          })}
        </div>
      </ModalContent>
    </Modal>
  );
};
