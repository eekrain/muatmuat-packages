import { useState } from "react";

import minBy from "lodash/minBy";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";
import RecommendedTruckModal from "@/container/SewaArmada/Web/Form/JenisArmada/RecommendedTruckModal";
import SelectArmadaModal from "@/container/SewaArmada/Web/Form/JenisArmada/SelectArmadaModal";
import { SelectedTruck } from "@/container/SewaArmada/Web/Form/JenisArmada/SelectedTruck";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useSWRHook, useSWRMutateHook } from "@/hooks/use-swr";
import { cn } from "@/lib/utils";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const JenisArmada = () => {
  const [type, setType] = useState(""); // carrier or truck
  const [isArmadaPopupOpen, setIsArmadaPopupOpen] = useState(false);
  const [isRecommendedTruckOpen, setIsRecommendedTruckOpen] = useState(false);

  const orderType = useSewaArmadaStore((state) => state.orderType);
  const loadTimeStart = useSewaArmadaStore(
    (state) => state.formValues.loadTimeStart
  );
  const loadTimeEnd = useSewaArmadaStore(
    (state) => state.formValues.loadTimeEnd
  );
  const showRangeOption = useSewaArmadaStore(
    (state) => state.formValues.showRangeOption
  );
  const lokasiMuat = useSewaArmadaStore((state) => state.formValues.lokasiMuat);
  const lokasiBongkar = useSewaArmadaStore(
    (state) => state.formValues.lokasiBongkar
  );
  const cargoCategoryId = useSewaArmadaStore(
    (state) => state.formValues.cargoCategoryId
  );
  const informasiMuatan = useSewaArmadaStore(
    (state) => state.formValues.informasiMuatan
  );
  const carrierId = useSewaArmadaStore((state) => state.formValues.carrierId);
  const truckTypeId = useSewaArmadaStore(
    (state) => state.formValues.truckTypeId
  );
  const { setField } = useSewaArmadaActions();

  // Fetch recommended carriers from API using SWR
  const { data: carriersData, error: carriersError } = useSWRHook(
    cargoCategoryId
      ? `v1/orders/carriers/recommended?cargoCategoryId=${cargoCategoryId}`
      : null
  );

  // Menggunakan useSWRMutateHook untuk request POST truk
  const {
    data: trucksData,
    error: trucksError,
    trigger: fetchTrucks,
    isMutating: isLoadingTrucks,
  } = useSWRMutateHook("v1/orders/trucks/recommended", "POST");

  const carriers = carriersData?.Data || [];
  const trucks = trucksData?.Data || [];

  useShallowCompareEffect(() => {
    if (trucksData) {
      // console.log("trucksdata", trucksData);
      setField("distance", trucksData.Data.priceComponents.estimatedDistance);
      setField("distanceUnit", trucksData.Data.priceComponents.distanceUnit);
      setField(
        "estimatedTime",
        trucksData.Data.priceComponents.preparationTime
      );
    }
  }, [trucksData]);

  const selectedCarrier = useShallowMemo(
    () =>
      carrierId
        ? [
            ...(carriers.recommendedCarriers || []),
            ...(carriers.nonRecommendedCarriers || []),
          ].find((item) => item.carrierId === carrierId)
        : null,
    [carrierId, carriers]
  );

  const selectedTruck = useShallowMemo(() => {
    if (!truckTypeId) return null;

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
    setIsArmadaPopupOpen(true);

    // Jika tipe truck dan carrier sudah dipilih, fetch data truk
    if (type === "truckTypeId" && carrierId) {
      // Calculate total weight and convert to tons
      const calculateTotalWeight = () => {
        let totalWeight = 0;

        if (informasiMuatan && informasiMuatan.length > 0) {
          // Sum all weights with unit conversion
          totalWeight = informasiMuatan.reduce((sum, item) => {
            const weight = item.beratMuatan?.berat || 0;
            const unit = item.beratMuatan?.unit || "kg";

            // Convert to tons
            if (unit === "kg") {
              return sum + weight * 0.001; // kg to ton
            } else if (unit === "ton") {
              return sum + weight;
            } else {
              // For other units (like liters), convert based on estimation or just use as-is
              return sum + weight;
            }
          }, 0);
        }

        return {
          weight: totalWeight || 0,
          weightUnit: "ton", // Always use ton as per requirement
        };
      };

      // Get max dimensions from informasiMuatan and convert to meters
      const getMaxDimensions = () => {
        let maxLength = 0;
        let maxWidth = 0;
        let maxHeight = 0;

        if (informasiMuatan && informasiMuatan.length > 0) {
          informasiMuatan.forEach((item) => {
            const length = item.dimensiMuatan?.panjang || 0;
            const width = item.dimensiMuatan?.lebar || 0;
            const height = item.dimensiMuatan?.tinggi || 0;
            const unit = item.dimensiMuatan?.unit || "m";

            // Convert to meters if needed
            const conversionFactor = unit === "cm" ? 0.01 : 1; // cm to m

            // Calculate max for each dimension independently
            const convertedLength = length * conversionFactor;
            const convertedWidth = width * conversionFactor;
            const convertedHeight = height * conversionFactor;

            // Update max values independently
            if (convertedLength > maxLength) maxLength = convertedLength;
            if (convertedWidth > maxWidth) maxWidth = convertedWidth;
            if (convertedHeight > maxHeight) maxHeight = convertedHeight;
          });
        }

        return {
          length: maxLength,
          width: maxWidth,
          height: maxHeight,
          dimensionUnit: "m", // Always use meters as per requirement
        };
      };

      // Get coordinates for origin and destination
      const getOriginCoordinates = () => {
        if (lokasiMuat && lokasiMuat.length > 0) {
          return lokasiMuat.map((item) => ({
            lat: item?.dataLokasi?.coordinates?.latitude || 0,
            long: item?.dataLokasi?.coordinates?.longitude || 0,
          }));
        }
        return [{ lat: 0, long: 0 }]; // Default coordinates set to 0
      };

      const getDestinationCoordinates = () => {
        if (lokasiBongkar && lokasiBongkar.length > 0) {
          return lokasiBongkar.map((item) => ({
            lat: item?.dataLokasi?.coordinates?.latitude,
            long: item?.dataLokasi?.coordinates?.longitude,
          }));
        }
        return []; // Default coordinates set to 0
      };

      // Get load time from startDate and endDate
      const getLoadTimes = () => {
        const now = new Date().toISOString();
        const result = {
          loadTimeStart: loadTimeStart || now,
        };
        if (showRangeOption) {
          result.loadTimeEnd = loadTimeEnd || now;
        }
        return result;
      };

      // Build the request payload
      const { weight, weightUnit } = calculateTotalWeight();
      const dimensions = getMaxDimensions();
      const origin = getOriginCoordinates();
      const destination = getDestinationCoordinates();
      const loadTime = getLoadTimes();

      const requestPayload = {
        orderType,
        ...loadTime,
        origin,
        destination,
        weight,
        weightUnit,
        dimensions,
        carrierId,
      };

      // Log the payload for debugging (can remove in production)
      console.log("Sending truck request with payload:", requestPayload);

      // Send the API request
      await fetchTrucks(requestPayload);
    }
  };

  const isTruckTypeIdDisabled =
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
              className="flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 px-3"
              onClick={() =>
                handleFirstTime(() => handleOpenModal("carrierId"))
              }
            >
              <IconComponent
                src="/icons/carrier16.svg"
                width={16}
                height={16}
              />
              <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
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
                "flex h-8 w-full cursor-not-allowed items-center gap-x-2 rounded-md border border-neutral-600 bg-neutral-200 px-3",
                selectedCarrier &&
                  !isTruckTypeIdDisabled &&
                  "cursor-pointer bg-neutral-50"
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
                  "text-[12px] font-medium leading-[14.4px]",
                  isTruckTypeIdDisabled
                    ? "text-neutral-600"
                    : "text-neutral-900"
                )}
              >
                {selectedTruck?.name || "Pilih Jenis Truck"}
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
                <span className="text-[14px] leading-[16.8px]">
                  {"Pakai rekomendasi bisa hemat "}
                  <span className="text-[12px] leading-[14.4px]">{`Rp${recommendedTruckPriceDiff.toLocaleString("id-ID")}`}</span>
                </span>
              </div>
              <IconComponent src="/icons/chevron-right.svg" />
            </button>
          ) : null}
        </div>
      </FormContainer>

      <SelectArmadaModal
        carrierData={carriers}
        truckData={trucks}
        isOpen={isArmadaPopupOpen}
        setIsOpen={setIsArmadaPopupOpen}
        type={type}
        isLoadingCarrier={
          !carriersData && !carriersError && type === "carrierId"
        }
        errorCarrier={carriersError}
        isLoadingTruck={isLoadingTrucks && type === "truckTypeId"}
        errorTruck={trucksError}
      />

      <RecommendedTruckModal
        isOpen={isRecommendedTruckOpen}
        setIsOpen={setIsRecommendedTruckOpen}
        recommendedTrucks={trucks?.recommendedTrucks}
      />
    </>
  );
};
