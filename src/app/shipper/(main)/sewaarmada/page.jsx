"use client";

import { useSearchParams } from "next/navigation";

import SewaArmadaResponsive from "@/container/Shipper/SewaArmada/Responsive/SewaArmadaResponsive";
import SewaArmadaWeb from "@/container/Shipper/SewaArmada/Web/SewaArmadaWeb";
import useDevice from "@/hooks/use-device";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { normalizeFetchTruck } from "@/lib/normalizers/sewaarmada/normalizeFetchTruck";
import { useGetSettlementInfo } from "@/services/Shipper/daftarpesanan/getSettementInfo";
import { useGetRecommendedCarriers } from "@/services/Shipper/sewaarmada/getRecommendedCarriers";
import { useGetRecommendedTrucks } from "@/services/Shipper/sewaarmada/getRecommendedTrucks";
import { useGetReorderFleetData } from "@/services/Shipper/sewaarmada/getReorderFleetData";
import useGetSewaArmadaFormOptionData from "@/services/Shipper/sewaarmada/getSewaArmadaFormOption";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";
import { useWaitingSettlementModalAction } from "@/store/Shipper/forms/waitingSettlementModalStore";

const Page = () => {
  const { isMobile, mounted } = useDevice();
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

  const { data: reorderData, isLoading } = useGetReorderFleetData(copyOrderId);

  const { data: settlementAlertInfo = [] } = useGetSettlementInfo(true);
  const {
    cargoCategories,
    cargoTypes,
    additionalServicesOptions,
    paymentMethods,
    settingsTime,
  } = useGetSewaArmadaFormOptionData("reorder");
  // Fetch recommended carriers from API using SWR
  const { data: carriers } = useGetRecommendedCarriers(cargoCategoryId);
  const { data: trucks, trigger: fetchTrucks } = useGetRecommendedTrucks();

  // Setup SWR mutation hook untuk API calculate-price
  const { trigger: calculatePrice, data: calculatedPriceData } =
    useSWRMutateHook("v1/orders/calculate-price");

  const calculatedPrice = calculatedPriceData?.Data.price || null;

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
      try {
        // Prepare request payload berdasarkan dokumentasi API
        const requestPayload = {
          calculationType: "FULL_ORDER_PRICING",
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
    };
    if (truckTypeId) {
      handleCalculatePrice();
    }
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
    if (!copyOrderId || !isLoading) {
      if (reorderData) {
        setOrderType(reorderData.orderType);
        Object.entries(reorderData.formValues).forEach(([key, value]) => {
          setField(key, value);
        });
        // const url = new URL(window.location.href);
        // url.searchParams.delete("orderId");
        // window.history.replaceState({}, document.title, url.toString());
      } else if (urlFormId !== localFormId) {
        reset();
        setFormId(urlFormId);
      }
    }
  }, [urlFormId, localFormId, copyOrderId, reorderData, isLoading]);

  const handleFetchTrucks = async ({
    informasiMuatan: newInformasiMuatan,
  } = {}) => {
    // Jika tipe truck dan carrier sudah dipilih, fetch data truk
    if (carrierId) {
      const requestBody = normalizeFetchTruck({
        orderType,
        loadTimeStart,
        loadTimeEnd,
        showRangeOption,
        lokasiMuat,
        lokasiBongkar,
        informasiMuatan,
        newInformasiMuatan,
        carrierId,
      });

      // Send the API request
      await fetchTrucks(requestBody);
    }
  };

  if (!mounted) return null;

  if (isMobile)
    return (
      <SewaArmadaResponsive
        settlementAlertInfo={settlementAlertInfo}
        settingsTime={settingsTime}
        cargoTypes={cargoTypes}
        cargoCategories={cargoCategories}
        additionalServicesOptions={additionalServicesOptions}
        shippingOption={shippingOption}
        paymentMethods={paymentMethods}
        carriers={carriers}
        trucks={trucks || tempTrucks}
        calculatedPrice={calculatedPrice}
        handleFetchTrucks={handleFetchTrucks}
      />
    );

  return (
    <SewaArmadaWeb
      settlementAlertInfo={settlementAlertInfo}
      settingsTime={settingsTime}
      cargoTypes={cargoTypes}
      cargoCategories={cargoCategories}
      carriers={carriers}
      trucks={trucks || tempTrucks}
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
