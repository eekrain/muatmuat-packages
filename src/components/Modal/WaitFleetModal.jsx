import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { ModalBatalkanPesanan } from "@/container/DetailPesanan/Web/RingkasanPembayaran/ModalBatalkanPesanan";

const WaitFleetModal = ({
  dataRingkasanPembayaran,
  isOpen,
  setIsOpen,
  onConfirm,
}) => {
  return (
    <Modal closeOnOutsideClick={false} open={isOpen} onOpenChange={setIsOpen}>
      <ModalContent className="w-modal-small">
        <ModalHeader size="small" />
        <div className="flex flex-col items-center gap-y-6 px-6 py-9">
          <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
            Oops, Volume Pesanan Sedang Tinggi
          </h1>
          <p className="text-center text-[14px] font-medium leading-[15.4px] text-neutral-900">
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
                type="button"
              >
                Batalkan
              </Button>
            </ModalBatalkanPesanan>

            <Button
              variant="muatparts-primary"
              className="h-8"
              onClick={onConfirm}
              type="button"
            >
              Ya, Menunggu
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default WaitFleetModal;
