import { ChevronRight } from "lucide-react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

export const OrderInfo = () => {
  const navigation = useResponsiveNavigation();

  // Toggle QR code visibility
  const toggleQR = () => {
    console.log("jalan");
    navigation.push("/qr");
  };

  return (
    <div className="flex w-full flex-col items-start bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        {/* QR Code Toggle Button */}
        {false && (
          <div className="box-border flex w-full flex-row items-center justify-between border-b border-[#C4C4C4] pb-4">
            <button
              className="flex w-full flex-row items-center justify-between"
              onClick={toggleQR}
            >
              <div className="flex items-center gap-3 text-xs font-semibold text-[#176CF7]">
                Tampilkan QR Code
              </div>
              <ChevronRight className="h-4 w-4 text-[#176CF7]" />
            </button>
          </div>
        )}
        {false && (
          <div className="box-border flex w-full flex-row items-center justify-between border-b border-[#C4C4C4] pb-4">
            <button
              className="flex w-full flex-row items-center justify-between"
              onClick={toggleQR}
            >
              <div className="flex items-center gap-3 text-xs font-semibold text-[#176CF7]">
                Lihat Resi Pengiriman Dokumen
              </div>
              <ChevronRight className="h-4 w-4 text-[#176CF7]" />
            </button>
          </div>
        )}

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
            variant="success"
            className="w-full text-sm font-semibold"
          >
            Selesai
          </BadgeStatusPesanan>
        </div>
      </div>
    </div>
  );
};
