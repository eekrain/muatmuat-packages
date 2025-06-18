import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";

const DocumentReceivedModal = ({ isOpen, setIsOpen, onReceiveDocument }) => {
  return (
    <Modal closeOnOutsideClick={false} open={isOpen} onOpenChange={setIsOpen}>
      <ModalContent className="w-modal-small">
        <ModalHeader size="small" />
        <div className="flex flex-col items-center gap-y-6 px-6 py-9">
          <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
            Informasi
          </h1>
          <p className="text-center text-[14px] font-medium leading-[15.4px] text-neutral-900">
            {
              'Klik "Sudah", jika kamu sudah menerima bukti dokumen untuk menyelesaikan pesanan.'
            }
          </p>
          <div className="flex items-center gap-x-2">
            <Button
              variant="muatparts-primary-secondary"
              className="h-8"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Batal
            </Button>
            <Button
              variant="muatparts-primary"
              className="h-8"
              onClick={onReceiveDocument}
              type="button"
            >
              Sudah
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default DocumentReceivedModal;
