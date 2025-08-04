import Button from "@/components/Button/Button";
import { Modal, ModalContent } from "@/components/Modal/Modal";

export const ModalKonfimasiBuktiDokumenDiterima = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <Modal open={open} onOpenChange={onOpenChange} closeOnOutsideClick>
      <ModalContent type="muatmuat">
        <div className="flex w-[296px] flex-col items-center px-4 py-6">
          <h3 className="text-base font-bold leading-[1.1] text-neutral-900">
            Informasi
          </h3>

          <div className="mt-4 text-center text-sm font-medium leading-[1.1] text-neutral-900">
            {`Klik "Sudah", jika kamu sudah menerima bukti dokumen untuk
              menyelesaikan pesanan.`}
          </div>

          <div className="mt-5 flex items-center gap-x-2">
            <Button
              variant="muatparts-primary-secondary"
              className="min-w-[112px]"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Belum
            </Button>
            <Button
              variant="muatparts-primary"
              className="min-w-[112px]"
              onClick={onConfirm}
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
