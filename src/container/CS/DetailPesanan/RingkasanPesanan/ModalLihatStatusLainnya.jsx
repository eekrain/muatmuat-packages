import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import { ButtonMini } from "@/components/Button/ButtonMini";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";
import {
  OrderStatusEnum,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";

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
              key={item.status}
              variant={
                item.status.startsWith("WAITING")
                  ? "warning"
                  : item.status.startsWith("CANCELED")
                    ? "error"
                    : item.status === OrderStatusEnum.COMPLETED
                      ? "success"
                      : "primary"
              }
              className="w-[272px]"
            >
              {t(OrderStatusTitle[item.status])}: {item.count} Unit
            </BadgeStatusPesanan>
          ))}
        </div>
      </ModalContent>
    </Modal>
  );
};
