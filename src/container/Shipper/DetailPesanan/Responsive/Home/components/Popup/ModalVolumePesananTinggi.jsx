import Button from "@/components/Button/Button";
import { Modal, ModalContent } from "@/components/Modal/Modal";

/**
 * A confirmation modal displayed when order volumes are high.
 * It asks the user if they are willing to wait longer for fleet preparation.
 *
 * @param {object} props - The props for the component.
 * @param {boolean} props.open - Controlled state for the modal's visibility.
 * @param {(isOpen: boolean) => void} props.onOpenChange - Callback for when the modal's open state changes.
 * @param {() => void} [props.onConfirm] - Optional callback for when the 'Ya, Menunggu' button is clicked.
 * @param {() => void} [props.onCancel] - Optional callback for when the 'Batalkan' button is clicked.
 */
export const ModalVolumePesananTinggi = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="w-[296px] rounded-[10px] p-0" type="muatmuat">
        <div className="flex flex-col items-center gap-5 px-4 pb-6 pt-6">
          <div className="flex flex-col items-center gap-4">
            <h2 className="font-avenir-next w-[216px] text-center text-base font-bold leading-[1.1] text-black">
              Oops, Volume Pesanan Sedang Tinggi
            </h2>
            <p className="font-avenir-next w-[264px] text-center text-sm font-medium leading-[1.1] text-black">
              Kami membutuhkan waktu lebih lama untuk mempersiapkan armada.
              Apakah kamu tetap ingin menunggu?
            </p>
          </div>
          <div className="flex flex-row justify-center gap-2">
            <Button
              variant="muatparts-primary-secondary"
              onClick={onCancel}
              className="h-7 min-w-[112px] rounded-[20px] px-6 py-3 text-xs font-semibold"
            >
              Batalkan
            </Button>
            <Button
              variant="muatparts-primary"
              onClick={onConfirm}
              className="h-7 min-w-[112px] rounded-[20px] px-6 py-3 text-xs font-semibold"
            >
              Ya, Menunggu
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
