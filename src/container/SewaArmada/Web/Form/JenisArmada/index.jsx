import { useState } from "react";

import { FormContainer, FormLabel } from "@/components/Form/Form";
import IconComponent from "@/components/IconComponent/IconComponent";
import FilterModal from "@/container/SewaArmada/Web/Form/JenisArmada/FilterModal";
import { SelectedTruck } from "@/container/SewaArmada/Web/Form/JenisArmada/SelectedTruck";
import { useSWRHook, useSWRMutateHook } from "@/hooks/use-swr";
import { cn } from "@/lib/utils";
import { handleFirstTime } from "@/lib/utils/form";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const JenisArmada = () => {
  const [isTruckImageModalOpen, setIsTruckImageModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const [type, setType] = useState(""); // carrier or truck
  const [isArmadaPopupOpen, setIsArmadaPopupOpen] = useState(false);

  const formValues = useSewaArmadaStore((state) => state.formValues);
  const showRangeOption = useSewaArmadaStore(
    (state) => state.formValues.showRangeOption
  );
  const orderType = useSewaArmadaStore((state) => state.orderType);

  const jenisCarrier = formValues.jenisCarrier;
  const jenisTruk = formValues.jenisTruk;
  const { setField } = useSewaArmadaActions();

  const cargoCategoryId = "f483709a-de4c-4541-b29e-6f4d9a912332";

  // Fetch recommended carriers from API using SWR
  const { data: carriersData, error: carriersError } = useSWRHook(
    `v1/orders/carriers/recommended?cargoCategoryId=${cargoCategoryId}`
  );

  // Menggunakan useSWRMutateHook untuk request POST truk
  const {
    data: trucksData,
    error: trucksError,
    trigger: fetchTrucks,
    isMutating: isLoadingTrucks,
  } = useSWRMutateHook("v1/orders/trucks/recommended", "POST");

  const handleSelectArmada = (value) => {
    if (type === "carrier") {
      setField("jenisCarrier", value);
    }
    if (type === "truck") {
      setField("jenisTruk", value);
    }
  };

  const handleSelectImage = (src) => {
    setSelectedImageSrc(src);
    setIsTruckImageModalOpen(true);
  };

  // Ketika modal dibuka dan tipe adalah truck, fetch data truk
  const handleOpenModal = async (selectedType) => {
    setType(selectedType);
    setIsArmadaPopupOpen(true);

    // Jika tipe truck dan carrier sudah dipilih, fetch data truk
    if (selectedType === "truck" && jenisCarrier?.id) {
      // Calculate total weight and convert to tons
      const calculateTotalWeight = () => {
        let totalWeight = 0;

        if (
          formValues.informasiMuatan &&
          formValues.informasiMuatan.length > 0
        ) {
          // Sum all weights with unit conversion
          totalWeight = formValues.informasiMuatan.reduce((sum, item) => {
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

        if (
          formValues.informasiMuatan &&
          formValues.informasiMuatan.length > 0
        ) {
          formValues.informasiMuatan.forEach((item) => {
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
        if (formValues.lokasiMuat && formValues.lokasiMuat.length > 0) {
          return formValues.lokasiMuat.map((item) => ({
            lat: item?.dataLokasi?.coordinates?.latitude || 0,
            long: item?.dataLokasi?.coordinates?.longitude || 0,
          }));
        }
        return [{ lat: 0, long: 0 }]; // Default coordinates set to 0
      };

      const getDestinationCoordinates = () => {
        if (formValues.lokasiBongkar && formValues.lokasiBongkar.length > 0) {
          return formValues.lokasiBongkar.map((item) => ({
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
          loadTimeStart: formValues.startDate || now,
        };

        if (showRangeOption) {
          result.loadTimeEnd = formValues.endDate || now;
        }

        return result;
      };

      // Build the request payload
      const { weight, weightUnit } = calculateTotalWeight();
      const dimensions = getMaxDimensions();
      const origin = getOriginCoordinates();
      const destination = getDestinationCoordinates();
      const { loadTimeStart, loadTimeEnd } = getLoadTimes();

      const requestPayload = {
        carrierId: jenisCarrier.id,
        weight,
        weightUnit,
        dimensions,
        origin,
        destination,
        loadTimeStart,
        loadTimeEnd,
        orderType,
      };

      // Log the payload for debugging (can remove in production)
      console.log("Sending truck request with payload:", requestPayload);

      // Send the API request
      await fetchTrucks(requestPayload);
    }
  };

  return (
    <>
      <FormContainer>
        <FormLabel required>Jenis Armada</FormLabel>

        <div className="flex flex-1 flex-col gap-y-3.5">
          <div className="flex items-center gap-x-3.5">
            <button
              className="flex h-8 w-full items-center gap-x-2 rounded-md border border-neutral-600 px-3"
              onClick={() => handleFirstTime(() => handleOpenModal("carrier"))}
            >
              <IconComponent
                src="/icons/carrier16.svg"
                width={16}
                height={16}
              />
              <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                {jenisCarrier?.title || "Pilih Jenis Carrier"}
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
                jenisCarrier && "cursor-pointer bg-neutral-50"
              )}
              disabled={!jenisCarrier}
              onClick={() => handleFirstTime(() => handleOpenModal("truck"))}
            >
              <IconComponent src="/icons/truck16.svg" width={16} height={16} />
              <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
                {jenisTruk?.title || "Pilih Jenis Truck"}
              </span>
              <IconComponent
                src="/icons/chevron-right.svg"
                width={16}
                height={16}
                className="ml-auto"
              />
            </button>
          </div>
          {jenisTruk ? (
            <SelectedTruck {...jenisTruk} onSelectImage={handleSelectImage} />
          ) : null}
        </div>
      </FormContainer>

      <FilterModal
        carrierData={carriersData?.Data}
        truckData={trucksData?.Data || []}
        isOpen={isArmadaPopupOpen}
        setIsOpen={setIsArmadaPopupOpen}
        onSelectArmada={handleSelectArmada}
        type={type}
        isLoadingCarrier={!carriersData && !carriersError && type === "carrier"}
        errorCarrier={carriersError}
        isLoadingTruck={isLoadingTrucks && type === "truck"}
        errorTruck={trucksError}
      />
    </>
  );
};
