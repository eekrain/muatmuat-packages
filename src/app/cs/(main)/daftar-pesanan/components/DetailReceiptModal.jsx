import { useState } from "react";

import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { Modal, ModalContent, ModalTitle } from "@/components/Modal/Modal";

const DetailReceiptModal = ({ isOpen, onClose, order, isLoading }) => {
  // Mock data based on the image - replace with actual data later
  const [receiptData] = useState({
    title: "Bukti Pengiriman Dokumen",
    date: "04 Okt 2024 18:00 WIB",
    photoReceipt: "Foto Resi",
    images: [
      "https://picsum.photos/400/300?random=1",
      "https://picsum.photos/400/300?random=2",
      "https://picsum.photos/400/300?random=3",
    ],
    documentNotes: "Catatan Dokumen",
    notes:
      "Kami informasikan bahwa dokumen telah kami kirim dan saat ini sudah diterima oleh pak Sadiantara. Mohon konfirmasi apabila ada yang perlu ditindaklanjuti lebih lanjut. Kami siap membantu apabila dibutuhkan ada klarifikasi atau kelengkapan tambahan. Terima kasih atas perhatian dan kerja samanya.",
  });

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-[600px] max-w-[90vw]" type="muattrans">
        <div className="p-6">
          {/* Header with Close Button */}
          <div className="mb-6 flex items-center justify-between">
            <ModalTitle className="flex-1 text-center">
              {receiptData.title}
            </ModalTitle>
          </div>

          {/* Date Section */}
          <div className="mb-6">
            <div className="mb-1 text-xs font-medium">Tanggal</div>
            <div className="text-xs font-medium">{receiptData.date}</div>
          </div>

          {/* Photo Receipt Section */}
          <div className="mb-6">
            <div className="mb-3 text-xs font-medium">
              {receiptData.photoReceipt}
            </div>

            {/* Images Grid */}
            <LightboxProvider
              images={receiptData.images}
              title={receiptData.photoReceipt}
            >
              <div className="flex flex-wrap gap-3">
                {receiptData.images.map((image, index) => (
                  <LightboxPreview
                    key={index}
                    image={image}
                    index={index}
                    alt={`Receipt photo ${index + 1}`}
                    className="h-20 w-20 rounded-lg border border-neutral-200 object-cover"
                  />
                ))}
              </div>
            </LightboxProvider>
          </div>

          {/* Document Notes Section */}
          <div className="mb-6">
            <div className="mb-3 text-xs font-medium text-neutral-900">
              {receiptData.documentNotes}
            </div>
            <div className="text-xs font-medium">{receiptData.notes}</div>
          </div>
        </div>

        {/* Footer - can be extended with action buttons if needed */}
        <div className="pb-6">{/* Reserved for future action buttons */}</div>
      </ModalContent>
    </Modal>
  );
};

export default DetailReceiptModal;
