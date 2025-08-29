import Button from "@/components/Button/Button";
import { Modal, ModalContent } from "@/components/Modal";

import { useTranslation } from "@/hooks/use-translation";

const CancelUpdateOrderModal = ({ isOpen, setOpen }) => {
  const { t } = useTranslation();

  return (
    <Modal open={isOpen} onOpenChange={setOpen}>
      <ModalContent className="w-[296px] rounded-[10px] p-0" type="muatmuat">
        <div className="flex flex-col items-center px-4 py-6">
          <h1 className="text-center text-base font-bold leading-[1.1]">
            {t("CancelUpdateOrderModal.title", {}, "Batalkan Perubahan")}
          </h1>
          <p className="mt-4 text-center text-sm font-medium leading-[1.1]">
            {t(
              "CancelUpdateOrderModal.confirmationMessage",
              {},
              "Apakah kamu yakin ingin membatalkan perubahan?"
            )}
            <br />
            <br />
            {t(
              "CancelUpdateOrderModal.warningMessage",
              {},
              "Jika kamu melakukan pembatalan, kamu tidak dapat melakukan perubahan pesanan lagi"
            )}
          </p>
          <Button
            variant="muatparts-primary-secondary"
            onClick={() => setOpen(false)}
            className="mt-5 h-7 px-6 text-xs font-semibold leading-[1.1]"
          >
            {t(
              "CancelUpdateOrderModal.buttonCancelChanges",
              {},
              "Batalkan Perubahan"
            )}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default CancelUpdateOrderModal;
