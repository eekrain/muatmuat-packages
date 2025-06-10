import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";

export const ModalLogin = ({ open, setOpen }) => {
  return (
    <Modal open={open} onOpenChange={setOpen} closeOnOutsideClick>
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
              <Button variant="muatparts-primary">
                <span className="text-[14px] font-semibold leading-[1] text-neutral-50">
                  Masuk
                </span>
              </Button>
            </a>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
