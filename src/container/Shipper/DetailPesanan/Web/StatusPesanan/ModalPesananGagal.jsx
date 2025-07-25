import Button from "@/components/Button/Button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalHeader,
} from "@/components/Modal/Modal";

export const ModalPesananGagal = ({ open, onOpenChange }) => {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="w-[440px] p-0" type="muatmuat">
        <ModalHeader size="big" className="h-[70px] w-[440px] object-cover" />
        <div className="flex flex-col items-center gap-6 px-6 py-9">
          <h2 className="text-center text-base font-bold leading-tight text-neutral-900">
            Mohon Maaf, Pesanan
            <br />
            Tidak Dapat Diproses
          </h2>

          <p className="text-center text-sm font-medium text-neutral-900">
            Karena tingginya volume pemesanan, kami belum dapat menyiapkan
            armada yang sesuai dengan pesananmu.
            <br />
            <br />
            Kami akan mengembalikan dana secara penuh dan memberikan kompensasi
            sebagai bentuk permohonan maaf atas ketidaknyamanan ini.
            <br />
            <br />
            Terima kasih atas pengertiannya.
          </p>

          <ModalClose asChild>
            <Button
              variant="muatparts-primary"
              className="h-8 w-[130px] rounded-full text-sm font-semibold"
            >
              Ya, Mengerti
            </Button>
          </ModalClose>
        </div>
      </ModalContent>
    </Modal>
  );
};
