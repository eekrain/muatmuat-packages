import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import {
  useFirstTimerModalAction,
  useFirstTimerModalStore,
} from "@/store/Shipper/first-timer/firstTimerModalStore";

const LoginModal = ({}) => {
  const isOpen = useFirstTimerModalStore((state) => state.isOpen);
  const { setIsOpen } = useFirstTimerModalAction();
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick>
      <ModalContent className="w-modal-small">
        <ModalHeader size="small" />
        <div className="px-6 py-9">
          <div className="flex flex-col items-center justify-center gap-y-6">
            {/* Judul Modal */}
            <h2 className="leading-[19.2px] w-full text-center text-base font-bold text-neutral-900">
              Informasi
            </h2>

            <p className="leading-[16.8px] w-full text-center text-sm font-medium text-neutral-900">
              Untuk melanjutkan pemesanan jasa angkut, kamu perlu login terlebih
              dahulu. Silakan login untuk melanjutkan.
            </p>

            <a
              href={`${process.env.NEXT_PUBLIC_INTERNAL_WEB}login?from=muattrans`}
            >
              <Button variant="muatparts-primary">Login Sekarang</Button>
            </a>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
