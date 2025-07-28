import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";

export const RecommendedTruckBottomsheet = ({ isOpen, onOpenChange }) => {
  const { t } = useTranslation();

  const handleApplyRecommendedTruck = () => {
    toast.success(t("messageArmadaBerhasilDiubah"));
    onOpenChange(false);
  };

  return (
    <BottomSheet open={isOpen} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>{t("titleRekomendasiKami")}</BottomSheetHeader>
        <div className="flex flex-col gap-y-6 px-4 pb-6 pt-7">
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
              image="/img/recommended1.png"
            >
              <LightboxPreview image="/img/recommended1.png" alt="" />
            </LightboxProvider>
            <div className="flex flex-col gap-y-3">
              <div className="flex h-[27px] items-center">
                <h3 className="text-sm font-bold leading-[1.1] text-neutral-900">
                  Colt Diesel Engkel
                </h3>
              </div>
              <span className="text-sm font-semibold leading-[1.1] text-neutral-900">
                Rp950.000
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
                    2,5 Ton
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
                    {"3,0 m x 1,7 m x 1,6 m"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Button
            variant="muatparts-primary"
            className="w-full"
            onClick={handleApplyRecommendedTruck}
          >
            {t("buttonTerapkan")}
          </Button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};
