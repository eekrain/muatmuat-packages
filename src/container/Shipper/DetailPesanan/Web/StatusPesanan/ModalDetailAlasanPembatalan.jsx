import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import { formatDate } from "@/lib/utils/dateFormat";

export const ModalDetailAlasanPembatalan = ({ cancellationHistory }) => {
  return (
    <Modal>
      <ModalTrigger>
        <button className="text-xs font-medium leading-[1.2] text-primary-700">
          Lihat Alasan Pembatalan
        </button>
      </ModalTrigger>
      <ModalContent type="muatmuat">
        <div className="relative flex w-[472px] flex-col items-start gap-[10px] rounded-xl bg-white px-6 py-8">
          {/* Content Container */}
          <div className="flex flex-row items-start gap-2">
            <div className="flex flex-col items-center gap-6">
              {/* Title */}
              <h2 className="w-[424px] text-center text-base font-bold leading-[19.2px] text-black">
                Alasan Pembatalan
              </h2>

              {/* Details Section */}
              <div className="flex flex-col items-start gap-4">
                {/* Cancellation Time */}
                <div className="flex w-[133px] flex-col items-start gap-3">
                  <div className="flex w-[105px] flex-row items-center gap-2">
                    <span className="h-[8px] text-xs font-semibold leading-[14.4px] text-black">
                      Waktu Pembatalan
                    </span>
                  </div>
                  <span className="w-[133px] text-xs font-medium leading-[14.4px] text-neutral-600">
                    {formatDate(cancellationHistory.cancelledAt)}
                  </span>
                </div>

                {/* Cancelled By */}
                <div className="flex w-[91px] flex-col items-start gap-3">
                  <div className="flex w-[91px] flex-row items-center gap-2">
                    <span className="h-[8px] text-xs font-semibold leading-[14.4px] text-black">
                      Dibatalkan Oleh
                    </span>
                  </div>
                  <span className="w-11 text-xs font-medium leading-[14.4px] text-neutral-600">
                    {cancellationHistory.cancelledBy === "CUSTOMER"
                      ? "SHIPPER"
                      : cancellationHistory.cancelledBy}
                  </span>
                </div>

                {/* Cancellation Reason */}
                <div className="flex w-[424px] flex-col items-start gap-3">
                  <div className="flex w-[106px] flex-row items-center gap-2">
                    <span className="h-[8px] text-xs font-semibold leading-[14.4px] text-black">
                      Alasan Pembatalan
                    </span>
                  </div>
                  <p className="w-[424px] text-xs font-medium leading-[14.4px] text-neutral-600">
                    {cancellationHistory.reason?.additionalInfo ||
                      cancellationHistory.reason?.reasonName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
