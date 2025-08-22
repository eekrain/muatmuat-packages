import { ButtonMini } from "@/components/Button/ButtonMini";
import { HalalLogistik } from "@/components/HalalLogistik/HalalLogistik";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useTranslation } from "@/hooks/use-translation";

export const InformasiMuatanFragment = ({ dataRingkasanPesanan }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">
        {t("InformasiMuatanFragment.title", {}, "Informasi Muatan")}
      </h3>
      {dataRingkasanPesanan?.isHalalLogistics && <HalalLogistik />}

      <div className="flex flex-col gap-3">
        {dataRingkasanPesanan?.cargos?.slice(0, 2)?.map((cargo) => (
          <div key={cargo.cargoId} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <IconComponent src="/icons/box16.svg" />
              <span className="mt-0.5 text-xs font-medium">
                {cargo.name}{" "}
                <span className="text-neutral-600">
                  ({cargo.weight} {cargo.weightUnit})
                </span>
              </span>
            </div>
          </div>
        ))}

        {dataRingkasanPesanan?.cargos?.length > 2 && (
          <div className="flex items-center gap-2">
            <div className="w-4" />
            <ButtonMini
              onClick={() =>
                alert(
                  t(
                    "InformasiMuatanFragment.viewMoreAlert",
                    {},
                    "Lihat Muatan Lainnya"
                  )
                )
              }
            >
              {t(
                "InformasiMuatanFragment.viewMore",
                {},
                "Lihat Muatan Lainnya"
              )}
            </ButtonMini>
          </div>
        )}
      </div>
    </div>
  );
};
