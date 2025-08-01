"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import { AlertMultilineResponsive } from "@/components/Alert/AlertMultilineResponsive";
import { BannerCarousel } from "@/components/BannerCarousel/BannerCarousel";
import { BrandSection } from "@/container/Shipper/SewaArmada/Responsive/Home/BrandSection";
import DetailBiayaBottomSheet from "@/container/Shipper/SewaArmada/Responsive/Home/DetailBiayaBottomSheet";
import { SewaArmadaForm } from "@/container/Shipper/SewaArmada/Responsive/Home/Form/SewaArmadaForm";
import { ModalFirstTimer } from "@/container/Shipper/SewaArmada/Responsive/Home/ModalFirstTimer";
import { RecommendedTruckBottomsheet } from "@/container/Shipper/SewaArmada/Responsive/Home/RecommendedTruckBottomsheet";
import { SewaArmadaFooter } from "@/container/Shipper/SewaArmada/Responsive/Home/SewaArmadaFooter";
import { VoucherSelectionBottomsheet } from "@/container/Shipper/SewaArmada/Responsive/Home/Voucher/VoucherSelectionBottomsheet";
import { useVoucher } from "@/container/Shipper/SewaArmada/Responsive/Home/Voucher/useVoucher";
import WaitingSettlementModal from "@/container/Shipper/SewaArmada/Responsive/Home/WaitingSettemenetModal";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useSWRHook } from "@/hooks/use-swr";
import DefaultResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/DefaultResponsiveLayout";
import { useWaitingSettlementModalAction } from "@/store/Shipper/forms/waitingSettlementModalStore";

import LoginRequiredModal from "./LoginRequiredModal";

const SewaArmadaHomeScreen = ({
  settlementAlertInfo,
  settingsTime,
  carriers,
  trucks,
  additionalServicesOptions,
}) => {
  const router = useRouter();
  const { setIsOpen } = useWaitingSettlementModalAction();
  // Banner data
  const parentRef = useRef(null);
  const { data: dataBanner } = useSWRHook("v1/orders/banner-ads");
  const banners = useMemo(() => {
    const data = dataBanner?.Data?.banners;
    if (!data) return [];
    return data?.map((item) => ({
      id: item.id,
      imageUrl: item.imageUrlApp,
      altText: "Banner Muatrans",
      linkUrl: item.link,
    }));
  }, [dataBanner]);

  // Voucher management
  const voucherManagement = useVoucher({
    token: "Bearer your_token_here",
    useMockData: false,
    mockEmpty: false,
    baseOrderAmount: 5000000,
    adminFee: 10000,
    taxAmount: 21300,
  });

  // Recommended truck bottomsheet state
  const [
    isRecommendedTruckBottomsheetOpen,
    setRecommendedTruckBottomsheetOpen,
  ] = useState(false);

  // Data dummy untuk ringkasan transaksi sesuai screenshot
  const transactionData = {
    biayaPesanJasaAngkut: 950000,
    biayaAsuransiBarang: 10000,
    biayaLayananTambahan: 35000,
    nominalBantuanTambahan: 100000,
    adminLayanan: 10000,
    pajak: -21300, // Pajak negatif sesuai screenshot
  };

  const alertItems = useShallowMemo(() => {
    if (!settlementAlertInfo) return [];

    const listPesananUrl = [
      "/daftarpesanan/pesananmenunggupembayaran",
      "/daftarpesanan/pesananmenunggupelunasan",
      "/daftarpesanan/butuhkonfirmasianda",
    ];

    return settlementAlertInfo
      .map((item, key) => {
        if (!item.orderId || item.orderId.length === 0) {
          return null;
        }
        if (key === 1) {
          return {
            label: item.alertText,
            onClick: () => setIsOpen(true),
          };
        }
        return {
          label: item.alertText,
          onClick: () =>
            router.push(
              item.orderId.length === 1
                ? `/daftarpesanan/detailpesanan/${item.orderId[0]}`
                : listPesananUrl[key]
            ),
        };
      })
      .filter(Boolean);
  }, [settlementAlertInfo]);

  return (
    <DefaultResponsiveLayout mode="default">
      <div ref={parentRef} className="w-full bg-neutral-100">
        <BannerCarousel banners={banners} showControls={false} />
        <AlertMultilineResponsive
          items={alertItems}
          className="mt-2 w-full rounded-none"
        />
        <BrandSection />
        <SewaArmadaForm
          settingsTime={settingsTime}
          carriers={carriers}
          trucks={trucks}
          additionalServicesOptions={additionalServicesOptions}
        />
      </div>

      <SewaArmadaFooter
        selectedVoucher={voucherManagement.selectedVoucher}
        onOpenVoucherSelection={() =>
          voucherManagement.setIsBottomsheetOpen(true)
        }
        onRecommendedTruckClick={() => setRecommendedTruckBottomsheetOpen(true)}
        parentRef={parentRef}
        trucks={trucks}
      />

      {/* Voucher Selection BottomSheet */}
      <VoucherSelectionBottomsheet
        isOpen={voucherManagement.isBottomsheetOpen}
        onOpenChange={voucherManagement.setIsBottomsheetOpen}
        voucherList={voucherManagement.voucherList}
        loading={voucherManagement.loading}
        error={voucherManagement.error}
        searchQuery={voucherManagement.searchQuery}
        setSearchQuery={voucherManagement.setSearchQuery}
        filteredVouchers={voucherManagement.filteredVouchers}
        tempSelectedVoucher={voucherManagement.tempSelectedVoucher}
        validationErrors={voucherManagement.validationErrors}
        validatingVoucher={voucherManagement.validatingVoucher}
        onConfirmVoucherSelection={
          voucherManagement.handleConfirmVoucherSelection
        }
        onApplyVoucher={voucherManagement.handleApplyVoucher}
        refetch={voucherManagement.refetch}
      />

      {/* Transaction Summary BottomSheet */}
      <DetailBiayaBottomSheet
        isOpen={voucherManagement.showTransactionSummary}
        onOpenChange={voucherManagement.setShowTransactionSummary}
        transactionData={transactionData}
        selectedVoucher={voucherManagement.selectedVoucher}
        voucherDiscount={voucherManagement.voucherDiscount}
      />

      {/* Recommended Truck BottomSheet */}
      <RecommendedTruckBottomsheet
        isOpen={isRecommendedTruckBottomsheetOpen}
        onOpenChange={setRecommendedTruckBottomsheetOpen}
        trucks={trucks}
      />

      <ModalFirstTimer />
      <WaitingSettlementModal />
      <LoginRequiredModal open={false} onOpenChange={() => {}} />
    </DefaultResponsiveLayout>
  );
};

export default SewaArmadaHomeScreen;
