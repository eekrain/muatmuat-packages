import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import minBy from "lodash/minBy";

import ButtonPlusMinus from "@/components/Form/ButtonPlusMinus";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";
import RecommendedTruckModal from "@/container/Shipper/SewaArmada/Web/Form/JenisArmada/RecommendedTruckModal";
import { SelectedTruck } from "@/container/Shipper/SewaArmada/Web/Form/JenisArmada/SelectedTruck";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { cn } from "@/lib/utils";
import { handleFirstTime } from "@/lib/utils/form";
import { useSelectArmadaModalAction } from "@/store/Shipper/forms/selectArmadaModalStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

export const JenisArmada = ({ carriers, trucks, onFetchTrucks }) => {
  const [isRecommendedTruckOpen, setIsRecommendedTruckOpen] = useState(false);

  const pathname = usePathname();
  const isEditPage = pathname.includes("/ubahpesanan");
  const orderType = useSewaArmadaStore((state) => state.orderType);
  const {
    loadTimeStart,
    loadTimeEnd,
    showRangeOption,
    lokasiMuat,
    lokasiBongkar,
    cargoCategoryId,
    informasiMuatan,
    carrierId,
    truckTypeId,
    minTruckCount,
    truckCount,
  } = useSewaArmadaStore((state) => state.formValues);
  const { setField } = useSewaArmadaActions();
  const { setIsOpen: setSelectArmadaModalOpen, setType } =
    useSelectArmadaModalAction();

  // Check if locations have more than one non-null item
  const hasMultipleLocations =
    (lokasiMuat &&
      lokasiMuat.filter((location) => location !== null).length > 1) ||
    (lokasiBongkar &&
      lokasiBongkar.filter((location) => location !== null).length > 1);

  // Reset truckCount to 1 when locations change and have multiple non-null items
  useEffect(() => {
    const nonNullLokasiMuat =
      lokasiMuat?.filter((location) => location !== null) || [];
    const nonNullLokasiBongkar =
      lokasiBongkar?.filter((location) => location !== null) || [];

    if (
      (nonNullLokasiMuat.length > 1 || nonNullLokasiBongkar.length > 1) &&
      truckCount !== 1
    ) {
      setField("truckCount", 1);
    }
  }, [lokasiMuat, lokasiBongkar, truckCount, setField]);

  const selectedCarrier = useShallowMemo(
    () =>
      carrierId && carriers
        ? [
            ...(carriers.recommendedCarriers || []),
            ...(carriers.nonRecommendedCarriers || []),
          ].find((item) => item.carrierId === carrierId)
        : null,
    [carrierId, carriers]
  );

  const selectedTruck = useShallowMemo(() => {
    if (!truckTypeId || !trucks) return null;

    const recommendedTruck = trucks.recommendedTrucks?.find(
      (item) => item.truckTypeId === truckTypeId
    );

    if (recommendedTruck) {
      return { ...recommendedTruck, isRecommended: true };
    }

    const nonRecommendedTruck = trucks.nonRecommendedTrucks?.find(
      (item) => item.truckTypeId === truckTypeId
    );

    if (nonRecommendedTruck) {
      return { ...nonRecommendedTruck, isRecommended: false };
    }

    return null;
  }, [truckTypeId, trucks]);

  const recommendedTruckPriceDiff = useShallowMemo(() => {
    if (!selectedTruck || trucks.length === 0) {
      return 0;
    }
    const lowestRecommendedTruckPrice = minBy(
      trucks.recommendedTrucks,
      "price"
    );
    return selectedTruck.price - lowestRecommendedTruckPrice?.price;
  }, [selectedTruck, trucks]);

  // Ketika modal dibuka dan tipe adalah truck, fetch data truk
  const handleOpenModal = async (type) => {
    setType(type);
    setSelectArmadaModalOpen(true);
    if (type === "truckTypeId") {
      await onFetchTrucks();
    }
  };

  const isTruckTypeIdDisabled =
    isEditPage ||
    !loadTimeStart ||
    (showRangeOption && !loadTimeEnd) ||
    !lokasiMuat ||
    !lokasiBongkar ||
    !cargoCategoryId ||
    informasiMuatan.length === 0 ||
    !carrierId;

  return (
    <>
      <FormContainer>
        <FormLabel required>Jenis Armada</FormLabel>

        <div className="flex flex-1 flex-col gap-y-3.5">
          <div className="flex items-center gap-x-3.5">
            <button
              className={cn(
                "flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 px-3",
                informasiMuatan?.length > 0 && !isEditPage
                  ? "cursor-pointer bg-neutral-50"
                  : "cursor-not-allowed bg-neutral-200"
              )}
              disabled={informasiMuatan?.length === 0 || isEditPage}
              onClick={() =>
                handleFirstTime(() => handleOpenModal("carrierId"))
              }
            >
              <IconComponent
                src="/icons/carrier16.svg"
                width={16}
                height={16}
              />
              <span
                className={cn(
                  "text-xs font-medium leading-[14.4px]",
                  informasiMuatan?.length === 0
                    ? "text-neutral-600"
                    : "text-neutral-900"
                )}
              >
                {selectedCarrier?.name || "Pilih Jenis Carrier"}
              </span>
              <IconComponent
                src="/icons/chevron-right.svg"
                width={16}
                height={16}
                className="ml-auto"
              />
            </button>
            <button
              className={cn(
                "flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 px-3",
                selectedCarrier && !isTruckTypeIdDisabled
                  ? "cursor-pointer bg-neutral-50"
                  : "cursor-not-allowed bg-neutral-200"
              )}
              disabled={isTruckTypeIdDisabled}
              onClick={() =>
                handleFirstTime(() => handleOpenModal("truckTypeId"))
              }
            >
              <IconComponent
                src="/icons/transporter16.svg"
                width={16}
                height={16}
              />
              <span
                className={cn(
                  "text-xs font-medium leading-[14.4px]",
                  isTruckTypeIdDisabled
                    ? "text-neutral-600"
                    : "text-neutral-900"
                )}
              >
                {selectedTruck?.name || "Pilih Jenis Truk"}
              </span>
              <IconComponent
                src="/icons/chevron-right.svg"
                width={16}
                height={16}
                className="ml-auto"
              />
            </button>
          </div>
          {selectedTruck ? <SelectedTruck {...selectedTruck} /> : null}
          {selectedTruck?.isRecommended === false ? (
            <button
              className="flex h-10 w-full items-center justify-between self-start rounded-md border border-primary-700 bg-primary-50 px-3"
              onClick={() => setIsRecommendedTruckOpen(true)}
            >
              <div className="flex items-center gap-x-2 font-medium text-neutral-900">
                <IconComponent
                  src="/icons/recommended-truck.svg"
                  size="medium"
                />
                <span className="text-sm leading-[16.8px]">
                  {"Pakai rekomendasi bisa hemat "}
                  <span className="text-xs leading-[14.4px]">{`Rp${recommendedTruckPriceDiff.toLocaleString("id-ID")}`}</span>
                </span>
              </div>
              <IconComponent src="/icons/chevron-right.svg" />
            </button>
          ) : null}
        </div>
      </FormContainer>
      {orderType === "SCHEDULED" ? (
        <FormContainer>
          <FormLabel required>Jumlah Armada</FormLabel>
          <div className="">
            <ButtonPlusMinus
              disabled={!truckTypeId || hasMultipleLocations}
              onChange={(value) => setField("truckCount", value)}
              minValue={minTruckCount}
              maxValue={10}
              value={truckCount}
            />
          </div>
        </FormContainer>
      ) : null}

      <RecommendedTruckModal
        isOpen={isRecommendedTruckOpen}
        setIsOpen={setIsRecommendedTruckOpen}
        recommendedTrucks={trucks?.recommendedTrucks}
      />
    </>
  );
};
