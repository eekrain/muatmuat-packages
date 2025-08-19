import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { cn } from "@/lib/utils";

export const InformasiArmadaFragment = ({
  dataStatusPesanan,
  dataRingkasanPesanan,
  className,
  children,
}) => {
  return (
    <div className={cn("bg-neutral-50 px-4 py-5", className)}>
      <h3 className="mb-4 text-sm font-semibold text-neutral-900">
        Informasi Armada
      </h3>
      <div className="flex items-center gap-3">
        <LightboxProvider image="/img/truck.png">
          <LightboxPreview image="/img/truck.png" />
        </LightboxProvider>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-neutral-900">
            {dataRingkasanPesanan?.vehicle?.name || "Box - Colt Diesel Engkel"}
          </p>
          <p className="text-sm font-medium text-neutral-900">
            Kebutuhan :{" "}
            {dataRingkasanPesanan?.vehicle?.truckCount ||
              dataStatusPesanan?.totalUnit ||
              0}{" "}
            Unit
          </p>
        </div>
      </div>

      {children}
    </div>
  );
};
