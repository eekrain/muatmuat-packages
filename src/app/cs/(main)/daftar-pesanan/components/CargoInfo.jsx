"use client";

import { useMemo } from "react";

import { InfoTooltip } from "@/components/Form/InfoTooltip";
import IconComponent from "@/components/IconComponent/IconComponent";

import { useTranslation } from "@/hooks/use-translation";

const CargoInfo = ({ cargoItems = [], totalWeight, weightUnit }) => {
  const { t } = useTranslation();

  const firstCargoItem = useMemo(
    () => (cargoItems.length > 0 ? cargoItems[0] : null),
    [cargoItems]
  );
  const otherCargoItems = useMemo(
    () => (cargoItems.length > 1 ? cargoItems.slice(1) : []),
    [cargoItems]
  );
  const otherCargoItemsCount = otherCargoItems.length;

  const renderCargoTooltipContent = () => (
    <div>
      <p className="mb-[12px] text-sm font-medium text-neutral-900">
        {t("pesananCard.cargoInfoTitle", {}, "Informasi Muatan")}
      </p>
      <ol className="ml-1 list-inside list-decimal text-sm text-neutral-900">
        {otherCargoItems.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ol>
    </div>
  );

  if (!firstCargoItem) {
    return null; // Don't render anything if there are no cargo items
  }

  return (
    <div className="flex items-center gap-1">
      <IconComponent
        src="/icons/monitoring/daftar-pesanan-aktif/scales.svg"
        className="h-4 w-4 text-gray-600"
      />
      <span className="text-xxs font-medium">
        <span>{firstCargoItem.name}</span>
        {otherCargoItemsCount > 0 && (
          <InfoTooltip
            trigger={
              <span className="cursor-pointer text-primary-700 hover:text-primary-800">
                , +{otherCargoItemsCount}{" "}
                {t("pesananCard.cargoOthers", {}, "lainnya")}
              </span>
            }
            side="top"
            align="center"
          >
            {renderCargoTooltipContent()}
          </InfoTooltip>
        )}
        {totalWeight && weightUnit && (
          <span>
            {" "}
            ({totalWeight} {weightUnit})
          </span>
        )}
      </span>
    </div>
  );
};

export default CargoInfo;
