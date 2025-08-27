import { useParams } from "next/navigation";

import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";

import { ModalBatalkanPesanan } from "@/container/Shipper/DetailPesanan/Web/RingkasanPembayaran/ModalBatalkanPesanan";

import { useSWRMutateHook } from "@/hooks/use-swr";

export const WaitFleetSearchButton = ({ onClick = () => {} }) => {
  const params = useParams();
  const { trigger: confirmWaiting } = useSWRMutateHook(
    `v1/orders/${params.orderId}/waiting-confirmation`
  );

  return (
    <Button
      variant="muatparts-primary"
      className="h-8 w-full"
      onClick={() => {
        confirmWaiting({
          continueWaiting: true,
        });
        onClick();
      }}
      type="button"
    >
      Ya, Menunggu
    </Button>
  );
};

export const WaitFleetSearchModal = ({
  dataRingkasanPembayaran,
  isOpen,
  setIsOpen,
  setIsShowWaitFleetAlert,
}) => {
  return (
    <Modal
      closeOnOutsideClick={true}
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
        setIsShowWaitFleetAlert(!isOpen);
      }}
    >
      <ModalContent className="w-modal-small" type="muattrans">
        <ModalHeader type="muattrans" size="small" />
        <div className="flex flex-col items-center gap-y-6 px-6 py-9">
          <h1 className="text-base font-bold leading-[19.2px] text-neutral-900">
            Oops, Volume Pesanan Sedang Tinggi
          </h1>
          <p className="text-center text-sm font-medium leading-[15.4px] text-neutral-900">
            Kami membutuhkan waktu lebih lama untuk mempersiapkan armada. Apakah
            kamu tetap ingin menunggu?
          </p>
          <div className="flex items-center gap-x-2">
            <ModalBatalkanPesanan
              dataRingkasanPembayaran={dataRingkasanPembayaran}
            >
              <Button
                variant="muatparts-primary-secondary"
                className="h-8"
                onClick={() => {}}
                type="button"
              >
                Batalkan
              </Button>
            </ModalBatalkanPesanan>

            <WaitFleetSearchButton onClick={() => setIsOpen(false)} />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
