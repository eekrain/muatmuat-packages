import { useMemo } from "react";

import {
  BottomSheet,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
} from "@/components/Bottomsheet/BottomSheet";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { useTranslation } from "@/hooks/use-translation";
import { OrderTypeEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { toast } from "@/lib/toast";
import { idrFormat } from "@/lib/utils/formatters";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

export const RecommendedTruckBottomsheet = ({
  isOpen,
  onOpenChange,
  trucks,
}) => {
  const { t } = useTranslation();
  const orderType = useSewaArmadaStore((state) => state.orderType);
  const { setField } = useSewaArmadaActions();

  // Get the first (cheapest) recommended truck
  const recommendedTruck = useMemo(() => {
    if (!trucks?.recommendedTrucks || trucks.recommendedTrucks.length === 0) {
      return null;
    }
    // Sort by price to get the cheapest one
    return trucks.recommendedTrucks.sort((a, b) => a.price - b.price)[0];
  }, [trucks]);

  const handleApplyRecommendedTruck = () => {
    if (!recommendedTruck) {
      toast.error("Tidak ada truk rekomendasi yang tersedia");
      return;
    }

    // Update the store with the recommended truck
    setField("truckTypeId", recommendedTruck.truckTypeId);
    setField(
      "truckCount",
      orderType === OrderTypeEnum.INSTANT ? 1 : recommendedTruck.unit || 1
    );
    setField("minTruckCount", recommendedTruck.unit || 1);

    toast.success(t("messageArmadaBerhasilDiubah"));
    onOpenChange(false);
  };

  return (
    <BottomSheet open={isOpen} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetClose />
          <BottomSheetTitle>{t("titleRekomendasiKami")}</BottomSheetTitle>
        </BottomSheetHeader>
        <div className="flex flex-col gap-y-6 px-4">
          <div className="flex items-center gap-x-2.5 rounded-md bg-warning-100 p-2">
            <div className="size-[20px]">
              <IconComponent
                className="text-secondary-400"
                src="icons/warning20.svg"
                width={20}
                height={20}
              />
            </div>
            <p className="text-xs font-medium leading-[1.1] text-neutral-900">
              {t("messagePastikanLokasi")}
            </p>
          </div>
          <div className="flex gap-x-3">
            <LightboxProvider
              className="size-[68px]"
              title=""
              image={recommendedTruck?.image}
            >
              <LightboxPreview
                image={recommendedTruck?.image}
                alt={recommendedTruck?.name}
              />
            </LightboxProvider>
            <div className="flex flex-col gap-y-3">
              <div className="flex h-[27px] items-center">
                <h3 className="text-sm font-bold leading-[1.1] text-neutral-900">
                  {recommendedTruck?.name}
                </h3>
              </div>
              <span className="text-sm font-semibold leading-[1.1] text-neutral-900">
                {idrFormat(recommendedTruck?.price)}
              </span>
              <div className="flex items-center gap-2">
                <IconComponent
                  src="/icons/jenis-truck/scale.svg"
                  className="size-6 text-amber-900"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold leading-[13.2px] text-black">
                    {t("labelEstimasiKapasitas")}
                  </span>
                  <span className="text-xs font-bold leading-[13.2px] text-black">
                    {recommendedTruck?.maxWeight} {recommendedTruck?.weightUnit}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <IconComponent
                  src="/icons/jenis-truck/dimension.svg"
                  className="size-6 text-amber-900"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold leading-[13.2px] text-black">
                    {t("labelEstimasiDimensi")}
                  </span>
                  <span className="text-xs font-bold leading-[13.2px] text-black">
                    {recommendedTruck?.dimensions?.length} x{" "}
                    {recommendedTruck?.dimensions?.width} x{" "}
                    {recommendedTruck?.dimensions?.height}{" "}
                    {recommendedTruck?.dimensions?.dimensionUnit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BottomSheetFooter className="pt-6">
          <Button
            variant="muatparts-primary"
            className="w-full"
            onClick={handleApplyRecommendedTruck}
          >
            {t("buttonTerapkan")}
          </Button>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
};
