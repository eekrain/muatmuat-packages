import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import {
  useFirstTimerModalAction,
  useFirstTimerModalStore,
} from "@/store/first-timer/firstTimerModalStore";

export const ModalLogin = ({}) => {
  const isOpen = useFirstTimerModalStore((state) => state.isOpen);
  const { setIsOpen } = useFirstTimerModalAction();
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick>
      <ModalContent>
        <ModalHeader size="small" />
        <div className="w-modal-small px-6 py-9">
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Judul Modal */}
            <h2 className="w-full text-center text-[16px] font-bold leading-[19.2px] text-neutral-900">
              Informasi
            </h2>

            <p className="w-full text-center text-[14px] font-medium leading-[16.8px] text-neutral-900">
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
