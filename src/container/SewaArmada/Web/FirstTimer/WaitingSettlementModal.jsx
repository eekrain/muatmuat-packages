import Link from "next/link";

import Button from "@/components/Button/Button";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import {
  useWaitingSettlementModalAction,
  useWaitingSettlementModalStore,
} from "@/store/forms/waitingSettlementModalStore";

const WaitingSettlementModal = ({}) => {
  const isOpen = useWaitingSettlementModalStore((state) => state.isOpen);
  const waitingSettlementOrderId = useWaitingSettlementModalStore(
    (state) => state.waitingSettlementOrderId
  );
  const { setIsOpen } = useWaitingSettlementModalAction();
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick>
      <ModalContent className="w-modal-small">
        <ModalHeader size="small" />
        <div className="px-6 py-9">
          <div className="flex flex-col items-center justify-center gap-y-6">
            {/* Judul Modal */}
            <h2 className="w-full text-center text-[16px] font-bold leading-[19.2px] text-neutral-900">
              Oops! Masih Ada Tagihan Yang Belum Dilunasi
            </h2>

            <p className="w-full text-center text-[14px] font-medium leading-[16.8px] text-neutral-900">
              Ada tagihan yang belum dilunasi. Harap selesaikan pembayaran untuk
              dapat melanjutkan aksimu.
            </p>

            <Link
              href={
                waitingSettlementOrderId.length === 1
                  ? `/daftarpesanan/detailpesanan/${waitingSettlementOrderId[0]}`
                  : "/daftarpesanan/pesananmenunggupelunasan"
              }
            >
              <Button variant="muatparts-primary">Bayar Tagihan</Button>
            </Link>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default WaitingSettlementModal;
