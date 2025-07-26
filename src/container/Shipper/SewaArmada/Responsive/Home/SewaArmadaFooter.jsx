import { useEffect, useRef } from "react";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";
import { idrFormat } from "@/lib/utils/formatters";
import { useSewaArmadaStore } from "@/store/Shipper/forms/sewaArmadaStore";

import { VoucherAppliedCard } from "./Voucher/VoucherAppliedCard";

export const SewaArmadaFooter = ({
  selectedVoucher,
  onOpenVoucherSelection,
  onRecommendedTruckClick,
  parentRef,
}) => {
  const navigation = useResponsiveNavigation();
  const { t } = useTranslation();
  const formValues = useSewaArmadaStore((s) => s.formValues);
  console.log("🚀 ~ formValues:", formValues);
  const footerRef = useRef(null);

  const isShowRecommendedTruckButton = false;
  const isShowCostDetail = true;
  const isShowTotalCost = true;

  useEffect(() => {
    if (parentRef.current && footerRef.current) {
      const height = footerRef.current.getBoundingClientRect().height;
      parentRef.current.style.paddingBottom = `${height}px`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowRecommendedTruckButton, isShowCostDetail, isShowTotalCost]);

  return (
    <ResponsiveFooter
      ref={footerRef}
      className={cn("flex flex-col gap-y-4", !isShowCostDetail && "hidden")}
    >
      {/* Pakai rekomendasi */}
      {isShowRecommendedTruckButton && (
        <button
          className="flex items-center rounded-md bg-primary-50 px-4 py-2"
          onClick={onRecommendedTruckClick}
        >
          <IconComponent
            src="/icons/recommended-truck-mobile.svg"
            width={28}
            height={28}
          />
          <div className="ml-3 mr-4 flex-1 text-left text-xs font-semibold leading-[1.1] text-neutral-900">
            {t("messageRekomendasiHemat")}
          </div>
          <IconComponent src="/icons/chevron-right24.svg" size="medium" />
        </button>
      )}

      {/* Voucher section */}
      <VoucherAppliedCard
        selectedVoucher={selectedVoucher}
        onOpenVoucherSelection={onOpenVoucherSelection}
      />

      {/* Total Cost Row */}
      {isShowTotalCost && (
        <div className="flex w-full items-center justify-between">
          <p className="font-sans text-sm font-semibold leading-tight text-neutral-900">
            Total Biaya
          </p>
          <p className="font-sans text-sm font-bold leading-tight text-neutral-900">
            {idrFormat(1212122)}
          </p>
        </div>
      )}

      {/* Buttons Row */}
      <div className="flex w-full items-start gap-2 self-stretch">
        <Button
          variant="muatparts-primary-secondary"
          className="h-10 flex-1 rounded-[20px] text-sm font-semibold"
        >
          Lihat Detail Biaya
        </Button>
        <Button
          variant="muatparts-primary"
          className="h-10 flex-1 rounded-[20px] text-sm font-semibold"
        >
          Lanjut
        </Button>
      </div>
    </ResponsiveFooter>
  );
};
