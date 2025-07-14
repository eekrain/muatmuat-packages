"use client";

import { useSearchParams } from "next/navigation";

import SewaArmadaResponsive from "@/container/SewaArmada/Responsive/SewaArmadaResponsive";
import SewaArmadaWeb from "@/container/SewaArmada/Web/SewaArmadaWeb";
import useDevice from "@/hooks/use-device";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useSWRHook, useSWRMutateHook } from "@/hooks/use-swr";
import { fetcherPayment } from "@/lib/axios";
import { getLoadTimes } from "@/lib/utils/dateTime";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";
import { useWaitingSettlementModalAction } from "@/store/forms/waitingSettlementModalStore";

const Page = () => {
  const { isMobile } = useDevice();
  const searchParams = useSearchParams();
  const urlFormId = searchParams.get("formid");
  const copyOrderId = searchParams.get("orderId");
  const localFormId = useSewaArmadaStore((state) => state.formId);
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
    tempTrucks,
    truckCount,
    distance,
    distanceUnit,
    additionalServices,
    tempShippingOptions,
    businessEntity,
    voucherId,
  } = useSewaArmadaStore((state) => state.formValues);
  const { setField, setFormId, setOrderType, reset } = useSewaArmadaActions();
  const { setWaitingSettlementOrderId } = useWaitingSettlementModalAction();

  const { data: reorderData, isLoading: isLoadingReorderData } = useSWRHook(
    copyOrderId ? `v1/orders/${copyOrderId}/reorder` : null
  );
  const { data: settlementAlertInfoData } = useSWRHook(
    "v1/orders/settlement/alert-info"
  );
  // Fetch cargo types using SWR
  const { data: cargoTypesData } = useSWRHook("v1/orders/cargos/types");
  // Fetch cargo categories using SWR
  const { data: cargoCategoriesData } = useSWRHook(
    "v1/orders/cargos/categories"
  );
  // Fetch recommended carriers from API using SWR
  const { data: carriersData } = useSWRHook(
    cargoCategoryId
      ? `v1/orders/carriers/recommended?cargoCategoryId=${cargoCategoryId}`
      : null
  );
  // Menggunakan useSWRMutateHook untuk request POST truk
  const { data: trucksData, trigger: fetchTrucks } = useSWRMutateHook(
    "v1/orders/trucks/recommended"
  );
  // Fetch layanan tambahan dari API
  const { data: additionalServicesData } = useSWRHook(
    "v1/orders/additional-services"
  );
  // Setup SWR mutation hook untuk API calculate-price
  const { trigger: calculatePrice, data: calculatedPriceData } =
    useSWRMutateHook("v1/orders/calculate-price");
  // console.log("priceddata", priceData);
  // Fetch payment methods using SWR
  const { data: paymentMethodsData } = useSWRHook(
    "v1/payment/methods",
    fetcherPayment
  );
  const { data: settingsTimeData } = useSWRHook("v1/orders/settings/time");

  const settlementAlertInfo = settlementAlertInfoData?.Data || [];
  // Extract cargo types from response
  const cargoTypes = cargoTypesData?.Data?.types || [];
  // Extract cargo categories from response
  const cargoCategories = cargoCategoriesData?.Data?.categories || [];
  const carriers = carriersData?.Data || null;
  const trucks = trucksData?.Data || tempTrucks;
  const additionalServicesOptions = additionalServicesData?.Data.services || [];
  // Use the API data directly or fall back to an empty array
  const paymentMethods = paymentMethodsData?.Data || [];
  const calculatedPrice = calculatedPriceData?.Data.price || null;
  const settingsTime = settingsTimeData?.Data || null;

  const shippingDetails = useShallowMemo(() => {
    if (additionalServices.length === 0) return null;

    const sendDeliveryEvidenceService = additionalServices.find(
      (item) => item.withShipping
    );

    return sendDeliveryEvidenceService?.shippingDetails ?? null;
  }, [additionalServices]);

  const shippingOption = useShallowMemo(() => {
    if (!shippingDetails) return null;

    return tempShippingOptions
      .flatMap((option) => option.expeditions)
      .find((item) => item.id === shippingDetails.shippingOptionId);
  }, [shippingDetails, tempShippingOptions]);

  useShallowCompareEffect(() => {
    if (trucks) {
      setField("tempTrucks", trucks);
      setField("distance", trucks.priceComponents.estimatedDistance);
      setField("distanceUnit", trucks.priceComponents.distanceUnit);
      // setField("estimatedTime", trucks.priceComponents.preparationTime);
    }
  }, [trucks]);

  useShallowCompareEffect(() => {
    const handleCalculatePrice = async () => {
      if (truckTypeId) {
        try {
          // Prepare request payload berdasarkan dokumentasi API
          const requestPayload = {
            calculationType: "FULL_ORDER_PRICING", // FULL_ORDER_PRICING atau UPDATE_ORDER_PRICING
            truckData: {
              carrierId,
              truckTypeId,
              distance,
              distanceUnit,
              orderType,
              truckCount, //sementara
            },
            // Blm ada asuransi
            // insuranceData: useAsuransi
            //   ? {
            //       // Nilai default untuk insurance jika tidak ada data spesifik
            //       insuranceOptionId: null,
            //       coverageAmount: 0,
            //     }
            //   : null,
            additionalServices: additionalServices.map((item) =>
              item.withShipping
                ? {
                    serviceId: item.serviceId,
                    withShipping: item.withShipping,
                    shippingCost:
                      Number(shippingOption.originalCost) +
                      Number(
                        item.shippingDetails.withInsurance
                          ? shippingOption.originalInsurance
                          : 0
                      ),
                  }
                : {
                    serviceId: item.serviceId,
                    withShipping: item.withShipping,
                  }
            ),
            ...(voucherId && {
              voucherData: {
                voucherId,
                applyDiscount: true,
              },
            }),
            businessEntity: {
              isBusinessEntity: businessEntity.isBusinessEntity,
            },
          };

          // Panggil API calculate-price
          await calculatePrice(requestPayload);
        } catch (error) {
          console.error("Error calculating price:", error);
        }
      }
    };
    handleCalculatePrice();
  }, [
    orderType,
    carrierId,
    truckTypeId,
    truckCount,
    distance,
    distanceUnit,
    additionalServices,
    shippingOption,
    businessEntity.isBusinessEntity,
    voucherId,
  ]);

  useShallowCompareEffect(() => {
    if (settlementAlertInfo.length > 0) {
      setWaitingSettlementOrderId(settlementAlertInfo[1].orderId);
    }
  }, [settlementAlertInfo]);

  useShallowCompareEffect(() => {
    if (!copyOrderId || !isLoadingReorderData) {
      if (reorderData) {
        const cargoPhotos =
          reorderData?.Data.otherInformation.cargoPhotos || [];
        setOrderType("INSTANT");
        setField("cargoTypeId", reorderData?.Data.otherInformation.cargoTypeId);
        setField(
          "cargoCategoryId",
          reorderData?.Data.otherInformation.cargoCategoryId
        );
        setField(
          "informasiMuatan",
          reorderData?.Data.cargos.map((item) => ({
            beratMuatan: {
              berat: item.weight,
              unit: item.weightUnit,
            },
            dimensiMuatan: {
              panjang: item.dimensions.length,
              lebar: item.dimensions.width,
              tinggi: item.dimensions.heigth,
              unit: item.dimensions.unit,
            },
            namaMuatan: {
              label: item.cargoName,
              value: item.cargoNameId,
            },
          }))
        );
        setField(
          "cargoPhotos",
          cargoPhotos.concat(Array(4 - cargoPhotos.length).fill(null))
        );
        setField(
          "cargoDescription",
          reorderData?.Data.otherInformation.cargoDescription
        );
      } else if (urlFormId !== localFormId) {
        reset();
        setFormId(urlFormId);
      }
    }
  }, [urlFormId, localFormId, copyOrderId, reorderData, isLoadingReorderData]);

  const handleFetchTrucks = async ({
    informasiMuatan: newInformasiMuatan,
  } = {}) => {
    // Jika tipe truck dan carrier sudah dipilih, fetch data truk
    if (carrierId) {
      const latestInformasiMuatan = newInformasiMuatan || informasiMuatan;
      // Calculate total weight and convert to tons
      const calculateTotalWeight = () => {
        let totalWeight = 0;

        if (latestInformasiMuatan && latestInformasiMuatan.length > 0) {
          // Sum all weights with unit conversion
          totalWeight = latestInformasiMuatan.reduce((sum, item) => {
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

        if (latestInformasiMuatan && latestInformasiMuatan.length > 0) {
          latestInformasiMuatan.forEach((item) => {
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

      // Get load time from startDate and endDate, preserving the exact time

      // Build the request payload
      const { weight, weightUnit } = calculateTotalWeight();
      const dimensions = getMaxDimensions();
      const origin = getOriginCoordinates();
      const destination = getDestinationCoordinates();
      const loadTime = getLoadTimes(
        loadTimeStart,
        showRangeOption,
        loadTimeEnd
      );

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

      // Send the API request
      await fetchTrucks(requestPayload);
    }
  };

  if (isMobile)
    return (
      <SewaArmadaResponsive
        cargoTypes={cargoTypes}
        cargoCategories={cargoCategories}
        additionalServicesOptions={additionalServicesOptions}
        paymentMethods={paymentMethods}
      />
    );

  return (
    <SewaArmadaWeb
      settlementAlertInfo={settlementAlertInfo}
      settingsTime={settingsTime}
      cargoTypes={cargoTypes}
      cargoCategories={cargoCategories}
      carriers={carriers}
      trucks={trucks}
      additionalServicesOptions={additionalServicesOptions}
      shippingDetails={shippingDetails}
      shippingOption={shippingOption}
      calculatedPrice={calculatedPrice}
      paymentMethods={paymentMethods}
      onFetchTrucks={handleFetchTrucks}
    />
  );
};

export default Page;
