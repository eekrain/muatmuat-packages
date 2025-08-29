import { useTranslation } from "@/hooks/use-translation";

import ImageComponent from "../ImageComponent/ImageComponent";

export const HalalLogistik = () => {
  const { t } = useTranslation();

  return (
    <div className="flex h-10 w-full items-center rounded-xl bg-[#F7EAFD] px-4">
      <div className="flex items-center gap-3">
        <ImageComponent
          src="/icons/halal.svg"
          width={18}
          height={24}
          alt={t("HalalLogistik.altHalal", "Halal Indonesia")}
        />
        <span className="text-center text-xs font-semibold leading-[14.4px] text-[#652672]">
          {t("HalalLogistik.label")}
        </span>
      </div>
    </div>
  );
};
