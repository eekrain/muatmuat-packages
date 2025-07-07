import { useState } from "react";

import { ChevronRight } from "lucide-react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";

const OrderStatus = () => {
  const [showQR, setShowQR] = useState(false);

  // Toggle QR code visibility
  const toggleQR = () => {
    setShowQR(!showQR);
  };

  return (
    <div className="flex w-full flex-col items-start bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        {/* QR Code Toggle Button */}
        <div className="box-border flex w-full flex-row items-center justify-between border-b border-[#C4C4C4] pb-4">
          <div className="flex w-full flex-row items-center justify-between">
            <button
              onClick={toggleQR}
              className="flex items-center gap-3 text-xs font-semibold text-[#176CF7]"
            >
              Tampilkan QR Code
            </button>
            <ChevronRight className="h-4 w-4 text-[#176CF7]" />
          </div>
        </div>

        {/* Order Code */}
        <div className="box-border flex w-full flex-row items-start justify-between border-b border-[#C4C4C4] pb-4">
          <span className="text-xs font-medium text-[#7B7B7B]">
            Kode Pesanan
          </span>
          <span className="text-right text-xs font-semibold text-black">
            INV/MT25AA001
          </span>
        </div>

        {/* Order Status */}
        <div className="flex w-full flex-col items-start gap-3">
          <span className="text-xs font-medium text-[#7B7B7B]">
            Status Pesanan
          </span>
          {/* <div className="flex w-full flex-row items-center justify-center rounded-md bg-[#E2F2FF] px-2 py-1">
            <span className="text-sm font-semibold text-[#176CF7]">
              Proses Muat
            </span>
          </div> */}

          <BadgeStatusPesanan
            variant="primary"
            className="w-full text-sm font-semibold"
          >
            Proses Muat
          </BadgeStatusPesanan>
        </div>
      </div>

      {/* QR Code would be displayed here if showQR is true */}
      {showQR && (
        <div className="mt-4 flex w-full justify-center rounded-md border border-[#E2F2FF] p-4">
          <div className="flex h-32 w-32 items-center justify-center bg-[#F5F5F5]">
            <span className="text-xs text-[#7B7B7B]">QR Code Placeholder</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
