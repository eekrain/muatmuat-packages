import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";

import { useTranslation } from "@/hooks/use-translation";

import { cn } from "@/lib/utils";

export const InformasiArmadaFragment = ({
  dataStatusPesanan,
  dataRingkasanPesanan,
  className,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn("bg-neutral-50 px-4 py-5", className)}>
      <h3 className="mb-4 text-sm font-semibold text-neutral-900">
        {t("InformasiArmadaFragment.title", {}, "Informasi Armada")}
      </h3>
      <div className="flex items-center gap-3">
        <LightboxProvider image="/img/truck.png">
          <LightboxPreview image="/img/truck.png" />
        </LightboxProvider>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-neutral-900">
            {dataRingkasanPesanan?.vehicle?.name ||
              t(
                "InformasiArmadaFragment.defaultVehicle",
                {},
                "Box - Colt Diesel Engkel"
              )}
          </p>
          <p className="text-sm font-medium text-neutral-900">
            {t("InformasiArmadaFragment.needLabel", {}, "Kebutuhan :")}{" "}
            {dataRingkasanPesanan?.vehicle?.truckCount ||
              dataStatusPesanan?.totalUnit ||
              0}{" "}
            {t("InformasiArmadaFragment.unit", {}, "Unit")}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
};
