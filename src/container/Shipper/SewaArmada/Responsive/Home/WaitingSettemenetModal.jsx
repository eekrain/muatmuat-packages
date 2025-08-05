import Link from "next/link";

import Button from "@/components/Button/Button";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import {
  useWaitingSettlementModalAction,
  useWaitingSettlementModalStore,
} from "@/store/Shipper/forms/waitingSettlementModalStore";

const WaitingSettlementModal = () => {
  const isOpen = useWaitingSettlementModalStore((state) => state.isOpen);
  const waitingSettlementOrderId = useWaitingSettlementModalStore(
    (state) => state.waitingSettlementOrderId
  );
  const { setIsOpen } = useWaitingSettlementModalAction();
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick>
      <ModalContent>
        <div className="w-[296px] px-4 py-6">
          <div className="flex flex-col items-center justify-center gap-y-6">
            {/* Judul Modal */}
            <h2 className="text-center text-base font-bold leading-[1.1] text-neutral-900">
              Oops! Masih Ada Tagihan Yang Belum Dilunasi
            </h2>

            <p className="text-center text-sm font-medium leading-[1.1] text-neutral-900">
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
              <Button
                className="h-7 px-6 text-xs leading-[1.1]"
                variant="muatparts-primary"
              >
                Bayar Tagihan
              </Button>
            </Link>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default WaitingSettlementModal;
