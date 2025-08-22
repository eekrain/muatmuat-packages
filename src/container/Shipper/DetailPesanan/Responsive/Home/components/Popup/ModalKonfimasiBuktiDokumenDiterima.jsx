import Button from "@/components/Button/Button";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { useTranslation } from "@/hooks/use-translation";

export const ModalKonfimasiBuktiDokumenDiterima = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} onOpenChange={onOpenChange} closeOnOutsideClick>
      <ModalContent type="muatmuat">
        <div className="flex w-[296px] flex-col items-center px-4 py-6">
          <h3 className="text-base font-bold leading-[1.1] text-neutral-900">
            {t("ModalKonfimasiBuktiDokumenDiterima.title", {}, "Informasi")}
          </h3>

          <div className="mt-4 text-center text-sm font-medium leading-[1.1] text-neutral-900">
            {t(
              "ModalKonfimasiBuktiDokumenDiterima.confirmationMessage",
              {},
              'Klik "Sudah", jika kamu sudah menerima bukti dokumen untuk menyelesaikan pesanan.'
            )}
          </div>

          <div className="mt-5 flex items-center gap-x-2">
            <Button
              variant="muatparts-primary-secondary"
              className="min-w-[112px]"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              {t(
                "ModalKonfimasiBuktiDokumenDiterima.buttonNotYet",
                {},
                "Belum"
              )}
            </Button>
            <Button
              variant="muatparts-primary"
              className="min-w-[112px]"
              onClick={onConfirm}
              type="button"
            >
              {t(
                "ModalKonfimasiBuktiDokumenDiterima.buttonAlready",
                {},
                "Sudah"
              )}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
