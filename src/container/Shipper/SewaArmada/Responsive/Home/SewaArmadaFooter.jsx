import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { cn } from "@/lib/utils";
import { idrFormat } from "@/lib/utils/formatters";
import { useSewaArmadaStore } from "@/store/Shipper/forms/sewaArmadaStore";

import OrderConfirmationBottomSheet from "../InformasiPesanan/OrderConfirmationBottomSheet";
import { VoucherAppliedCard } from "./Voucher/VoucherAppliedCard";

export const SewaArmadaFooter = ({
  selectedVoucher,
  onOpenVoucherSelection,
  onRecommendedTruckClick,
  onOpenTransactionSummary,
  parentRef,
  trucks,
  calculatedPrice,
  currentTotal, // New prop for voucher-adjusted total
}) => {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const navigation = useResponsiveNavigation();
  const { t } = useTranslation();
  const formValues = useSewaArmadaStore((s) => s.formValues);
  const footerRef = useRef(null);

  const hasAdditioinalFee = true;

  const [
    isOrderConfirmationBottomsheetOpen,
    setOrderConfirmationBottomsheetOpen,
  ] = useState(false); // Bottomsheet periksa pesanan kamu

  const isShowCostDetail = calculatedPrice;
  //   const isShowTotalCost = true;

  // Check if selected truck is non-recommended
  const isShowRecommendedTruckButton = useMemo(() => {
    if (!trucks || !formValues.truckTypeId) return false;

    const nonRecommendedTrucks = trucks.nonRecommendedTrucks || [];
    const isNonRecommendedTruck = nonRecommendedTrucks.some(
      (truck) => truck.truckTypeId === formValues.truckTypeId
    );

    return isNonRecommendedTruck;
  }, [trucks, formValues.truckTypeId]);

  useEffect(() => {
    if (parentRef.current && footerRef.current) {
      const height = footerRef.current.getBoundingClientRect().height;
      parentRef.current.style.paddingBottom = `${height}px`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowRecommendedTruckButton, isShowCostDetail]);

  return (
    <ResponsiveFooter
      ref={footerRef}
      className={cn(
        "flex flex-col gap-y-4",
        ((isEditPage && !formValues.hasUpdatedForm) || !isShowCostDetail) &&
          "hidden"
      )}
    >
      {isEditPage ? (
        <>
          {hasAdditioinalFee ? (
            <div className="flex items-center justify-between text-sm leading-[1.1] text-neutral-900">
              <span className="font-semibold">Total Tambahan Biaya</span>
              <span className="font-bold">Rp667.150</span>
            </div>
          ) : null}
          <div className="flex items-center gap-x-2">
            {hasAdditioinalFee ? (
              <Button
                variant="muatparts-primary-secondary"
                className="h-10 w-full"
                onClick={() => {}}
                type="button"
              >
                Lihat Detail Biaya
              </Button>
            ) : null}
            <OrderConfirmationBottomSheet
              isOpen={isOrderConfirmationBottomsheetOpen}
              setOpen={setOrderConfirmationBottomsheetOpen}
              onValidateInformasiPesanan={() =>
                setOrderConfirmationBottomsheetOpen(true)
              }
              onCreateOrder={() => {}}
            />
          </div>
        </>
      ) : (
        <>
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
          {/* {isShowTotalCost && ( */}
          <div className="flex w-full items-center justify-between">
            <p className="font-sans text-sm font-semibold leading-tight text-neutral-900">
              {t("SewaArmadaFooter.labelTotalBiaya", {}, "Total Biaya")}
            </p>
            <p className="font-sans text-sm font-bold leading-tight text-neutral-900">
              {currentTotal !== undefined
                ? idrFormat(currentTotal)
                : calculatedPrice?.totalPrice
                  ? idrFormat(calculatedPrice?.totalPrice)
                  : idrFormat(0)}
            </p>
          </div>
          {/* )} */}

          {/* Buttons Row */}
          <div className="flex w-full items-start gap-2 self-stretch">
            {/* <Button
          variant="muatparts-primary-secondary"
          className="h-10 flex-1 rounded-[20px] text-sm font-semibold"
          onClick={onOpenTransactionSummary}
        >
          Lihat Detail Biaya
        </Button> */}
            <Button
              variant="muatparts-primary"
              className="h-10 flex-1 rounded-[20px] text-sm font-semibold"
              onClick={() => navigation.push("/InformasiPesanan")}
            >
              {t("SewaArmadaFooter.buttonLanjut", {}, "Lanjut")}
            </Button>
          </div>
        </>
      )}
    </ResponsiveFooter>
  );
};
