"use client";

import { useMemo, useRef, useState } from "react";

import { BannerCarousel } from "@/components/BannerCarousel/BannerCarousel";
import { useSWRHook } from "@/hooks/use-swr";
import DefaultResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/DefaultResponsiveLayout";

import { BrandSection } from "./BrandSection";
import DetailBiayaBottomSheet from "./DetailBiayaBottomSheet";
import { SewaArmadaForm } from "./Form/SewaArmadaForm";
import { ModalFirstTimer } from "./ModalFirstTimer";
import { RecommendedTruckBottomsheet } from "./RecommendedTruckBottomsheet";
import { SewaArmadaFooter } from "./SewaArmadaFooter";
import { VoucherSelectionBottomsheet } from "./Voucher/VoucherSelectionBottomsheet";
import { useVoucher } from "./Voucher/useVoucher";

const SewaArmadaHomeScreen = ({ carriers, trucks }) => {
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

  return (
    <DefaultResponsiveLayout mode="default">
      <div ref={parentRef} className="w-full bg-neutral-100">
        <BannerCarousel banners={banners} showControls={false} />
        <BrandSection />
        <SewaArmadaForm carriers={carriers} trucks={trucks} />
      </div>

      <SewaArmadaFooter
        selectedVoucher={voucherManagement.selectedVoucher}
        onOpenVoucherSelection={() =>
          voucherManagement.setIsBottomsheetOpen(true)
        }
        onRecommendedTruckClick={() => setRecommendedTruckBottomsheetOpen(true)}
        parentRef={parentRef}
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
      />

      <ModalFirstTimer />
    </DefaultResponsiveLayout>
  );
};

export default SewaArmadaHomeScreen;
