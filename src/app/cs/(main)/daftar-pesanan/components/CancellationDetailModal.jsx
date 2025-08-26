import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";

const CancellationDetailModal = ({
  isOpen,
  onClose,
  cancellationData,
  isLoading,
}) => {
  // Mock data based on the image - replace with actual data later
  const defaultData = {
    title: "Detail Pembatalan",
    cancellationTime: "Waktu Pembatalan",
    date: "12 Nov 2024 11:25 WIB",
    cancelledBy: "Dibatalkan Oleh",
    cancelledByName: "Shipper",
    cancellationReason: "Alasan Pembatalan",
    reason: "Lainnya: Kendaraan rusak",
  };

  const data = cancellationData || defaultData;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-[500px] max-w-[90vw]" type="muattrans">
        <div className="p-6">
          {/* Header */}
          <ModalTitle className="mb-6 text-center text-lg font-bold">
            {data.title}
          </ModalTitle>

          {/* Cancellation Time Section */}
          <div className="mb-6">
            <div className="mb-2 text-sm font-semibold text-neutral-900">
              {data.cancellationTime}
            </div>
            <div className="text-sm text-neutral-700">{data.date}</div>
          </div>

          {/* Cancelled By Section */}
          <div className="mb-6">
            <div className="mb-2 text-sm font-semibold text-neutral-900">
              {data.cancelledBy}
            </div>
            <div className="text-sm text-neutral-700">
              {data.cancelledByName}
            </div>
          </div>

          {/* Cancellation Reason Section */}
          <div className="mb-6">
            <div className="mb-2 text-sm font-semibold text-neutral-900">
              {data.cancellationReason}
            </div>
            <div className="text-sm text-neutral-700">{data.reason}</div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default CancellationDetailModal;
