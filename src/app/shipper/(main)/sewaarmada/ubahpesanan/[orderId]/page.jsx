"use client";

import { useParams } from "next/navigation";

import SewaArmadaWeb from "@/container/Shipper/SewaArmada/Web/SewaArmadaWeb";
import useDevice from "@/hooks/use-device";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { useGetOrderDetail } from "@/services/Shipper/sewaarmada/getOrderDetail";
import { useGetRecommendedCarriers } from "@/services/Shipper/sewaarmada/getRecommendedCarriers";
import { useGetRecommendedTrucks } from "@/services/Shipper/sewaarmada/getRecommendedTrucks";
import useGetSewaArmadaFormOption from "@/services/Shipper/sewaarmada/getSewaArmadaFormOption";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

const Page = () => {
  const params = useParams();
  const { isMobile } = useDevice();
  const { setField, setOrderType } = useSewaArmadaActions();
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
  console.log("distance", distance);
  const {
    settingsTime,
    cargoCategories,
    cargoTypes,
    additionalServicesOptions,
  } = useGetSewaArmadaFormOption("update");
  const { data: orderDetailData, isLoading } = useGetOrderDetail(
    params.orderId
  );
  // console.log("orderDetailData", orderDetailData);
  const { data: carriers } = useGetRecommendedCarriers(cargoCategoryId);
  const { data: trucks, trigger: fetchTrucks } = useGetRecommendedTrucks();
  // Setup SWR mutation hook untuk API calculate-price
  const { trigger: calculatePrice, data: calculatedPriceData } =
    useSWRMutateHook("v1/orders/calculate-price");

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
    if (!isLoading && orderDetailData) {
      setOrderType(orderDetailData.orderType);
      Object.entries(orderDetailData.formValues).forEach(([key, value]) => {
        setField(key, value);
      });
    }
  }, [isLoading, orderDetailData]);

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
          calculationType: "UPDATE_ORDER_PRICING",
          orderId: params.orderId,
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
    params.orderId,
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

  if (isMobile)
    return (
      <div>{"Ubah pesanan responsive :)"}</div>
      //   <SewaArmadaResponsive
      //     cargoTypes={cargoTypes}
      //     cargoCategories={cargoCategories}
      //     additionalServicesOptions={additionalServicesOptions}
      //     paymentMethods={paymentMethods}
      //   />
    );

  return (
    <SewaArmadaWeb
      settingsTime={settingsTime}
      cargoTypes={cargoTypes}
      cargoCategories={cargoCategories}
      carriers={carriers}
      trucks={tempTrucks}
      additionalServicesOptions={additionalServicesOptions}
      shippingDetails={shippingDetails}
      shippingOption={shippingOption}
      //   calculatedPrice={calculatedPrice}
      //   paymentMethods={paymentMethods}
      orderStatus={orderDetailData?.orderStatus}
      onFetchTrucks={handleFetchTrucks}
    />
  );
};

export default Page;
