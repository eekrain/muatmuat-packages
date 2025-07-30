import Button from "@/components/Button/Button";
import { Modal, ModalContent } from "@/components/Modal/Modal";

const LoginRequiredModal = ({ open, onOpenChange }) => {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="w-[328px] px-4 py-6">
        <h2 className="text-center text-base font-bold leading-[19px] text-neutral-900">
          Informasi
        </h2>
        <p className="mt-4 text-center text-sm font-medium leading-[15.4px] text-neutral-900">
          Untuk melanjutkan pemesanan jasa angkut, Anda perlu login terlebih
          dahulu. Silakan login untuk melanjutkan.
        </p>
        <Button
          variant="muatparts-primary"
          className="mx-auto mt-5 h-9 w-[148px] rounded-full"
        >
          Login Sekarang
        </Button>
      </ModalContent>
    </Modal>
  );
};

export default LoginRequiredModal;
