import { useState } from "react";

import { ChevronRight } from "lucide-react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

export const OrderInfo = () => {
  const navigation = useResponsiveNavigation();

  const [isOpenOtherStatus, setIsOpenOtherStatus] = useState();

  return (
    <div className="flex w-full flex-col items-start bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        {/* QR Code Toggle Button */}
        {false && (
          <div className="box-border flex w-full flex-row items-center justify-between border-b border-[#C4C4C4] pb-4">
            <button
              className="flex w-full flex-row items-center justify-between"
              onClick={() => navigation.push("/qr")}
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
              onClick={() => {}}
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

          {false && (
            <BadgeStatusPesanan
              variant="primary"
              className="w-full text-sm font-semibold"
            >
              Proses Muat
            </BadgeStatusPesanan>
          )}

          {false && (
            <BadgeStatusPesanan
              variant="primary"
              className="w-full text-sm font-semibold"
            >
              Proses Muat : 1 Unit
            </BadgeStatusPesanan>
          )}
          {false && (
            <BadgeStatusPesanan
              variant="warning"
              className="w-full text-sm font-semibold"
            >
              Menunggu Pelunasan : 2 Unit
            </BadgeStatusPesanan>
          )}
          {false && (
            <BadgeStatusPesanan
              variant="primary"
              className="w-full text-sm font-semibold"
            >
              Dokumen Sedang Disiapkan : 3 Unit
            </BadgeStatusPesanan>
          )}
          {false && (
            <BadgeStatusPesanan
              variant="primary"
              className="w-full text-sm font-semibold"
            >
              Proses Pengiriman Dokumen : 3 Unit
            </BadgeStatusPesanan>
          )}
          {true && (
            <BadgeStatusPesanan
              variant="success"
              className="w-full text-sm font-semibold"
            >
              Selesai
            </BadgeStatusPesanan>
          )}

          {false && (
            <div className="flex w-full flex-row items-center justify-between">
              <button
                className="flex w-full flex-row items-center justify-between"
                onClick={() => setIsOpenOtherStatus(true)}
              >
                <div className="flex items-center gap-3 text-xs font-semibold text-[#176CF7]">
                  Lihat Status Lainnya
                </div>
                <ChevronRight className="h-4 w-4 text-[#176CF7]" />
              </button>
            </div>
          )}

          <BottomSheet
            open={isOpenOtherStatus}
            onOpenChange={setIsOpenOtherStatus}
          >
            <BottomSheetContent>
              <BottomSheetHeader>Status Lainnya</BottomSheetHeader>

              <div className="flex flex-col gap-4 px-4 py-6">
                <BadgeStatusPesanan
                  variant="primary"
                  className="w-full text-sm font-semibold"
                >
                  Proses Muat : 1 Unit
                </BadgeStatusPesanan>
                <BadgeStatusPesanan
                  variant="primary"
                  className="w-full text-sm font-semibold"
                >
                  Proses Muat : 3 Unit
                </BadgeStatusPesanan>
              </div>
            </BottomSheetContent>
          </BottomSheet>
        </div>
      </div>
    </div>
  );
};
