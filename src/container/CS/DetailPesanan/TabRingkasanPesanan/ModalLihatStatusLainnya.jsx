import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import { ButtonMini } from "@/components/Button/ButtonMini";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";
import {
  OrderStatusEnum,
  OrderStatusTitle,
} from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";

export const ModalLihatStatusLainnya = ({ otherStatus }) => {
  const { t } = useTranslation();

  if (!otherStatus || otherStatus.length === 0) return null;

  return (
    <Modal closeOnOutsideClick>
      <ModalTrigger>
        <ButtonMini>Lihat Status Lainnya</ButtonMini>
      </ModalTrigger>
      <ModalContent type="muatmuat" className="px-6 py-8">
        <h2 className="mb-6 text-center text-base font-bold leading-[1.2] text-neutral-900">
          Status Lainnya
        </h2>
        <div className="flex flex-col gap-2">
          {otherStatus.map((item) => (
            <BadgeStatusPesanan
              key={item.orderStatus}
              variant={
                item.orderStatus.startsWith("WAITING")
                  ? "warning"
                  : item.orderStatus.startsWith("CANCELED")
                    ? "error"
                    : item.orderStatus === OrderStatusEnum.COMPLETED
                      ? "success"
                      : "primary"
              }
              className="w-[272px]"
            >
              {t(OrderStatusTitle[item.orderStatus])}: {item.count} Unit
            </BadgeStatusPesanan>
          ))}
        </div>
      </ModalContent>
    </Modal>
  );
};
