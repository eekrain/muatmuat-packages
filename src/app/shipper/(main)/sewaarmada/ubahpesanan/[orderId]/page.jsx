"use client";

import { useParams } from "next/navigation";

import { useGetOrderDetail } from "@/services/Shipper/sewaarmada/getOrderDetail";
import { useGetRecommendedCarriers } from "@/services/Shipper/sewaarmada/getRecommendedCarriers";
import useGetSewaArmadaFormOption from "@/services/Shipper/sewaarmada/getSewaArmadaFormOption";

import SewaArmadaResponsive from "@/container/Shipper/SewaArmada/Responsive/SewaArmadaResponsive";
import SewaArmadaWeb from "@/container/Shipper/SewaArmada/Web/SewaArmadaWeb";

import useDevice from "@/hooks/use-device";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useSWRMutateHook } from "@/hooks/use-swr";

import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

// Note 25/07/2025
// ubah pesanan instan
// cuma bisa tambah atau ganti lokasi bongkar 2 sampek bates maksimal (menuju lokasi bongkar 2)
// kalo lebih jauh selalu ada tambah biaya
// kalo sdh menuju lokasi bongkar 2 ada penalti

// ubah pesanan terjadwal
// blm berangkat bisa rubah semua lokasi muat dan bongkar, tapi ga bisa tambah atau hapus
// kalo hari h (driver sudah menuju lokasi muat) cuma bisa ganti lokasi bongkar sampai ada driver yang menuju lokasi bongkar 1
// kalo sdh ada driver menuju lokasi bongkar 1 ada penalti

const Page = () => {
  const params = useParams();
  const { isMobile } = useDevice();
  const { setField, setOrderType, setOriginalOrderData } =
    useSewaArmadaActions();
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
    truckType,
    tempTrucks,
    truckCount,
    distance,
    distanceUnit,
    additionalServices,
    tempShippingOptions,
    businessEntity,
    voucherId,
    hasUpdatedForm,
  } = useSewaArmadaStore((state) => state.formValues);

  const {
    settingsTime,
    cargoCategories,
    cargoTypes,
    additionalServicesOptions,
  } = useGetSewaArmadaFormOption("update");
  const { data: orderDetailData, isLoading } = useGetOrderDetail(
    params.orderId
  );

  const { data: carriers } = useGetRecommendedCarriers(cargoCategoryId);

  const { trigger: calculateDistance, data: calculatedDistanceData } =
    useSWRMutateHook("v1/orders/calculate-distance");
  const { trigger: calculatePrice, data: calculatedPriceData } =
    useSWRMutateHook("v1/orders/calculate-price");

  const calculatedPrice = useShallowMemo(
    () => calculatedPriceData?.Data.price || null,
    [calculatedPriceData]
  );
  const calculatedDistance = useShallowMemo(
    () => calculatedDistanceData?.Data || null,
    [calculatedDistanceData]
  );

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
    const handleCalculateDistance = async () => {
      try {
        const requestPayload = {
          origin: lokasiMuat.map((item) => ({
            lat: item?.dataLokasi?.coordinates?.latitude || 0,
            long: item?.dataLokasi?.coordinates?.longitude || 0,
          })),
          destination: lokasiBongkar.map((item) => ({
            lat: item?.dataLokasi?.coordinates?.latitude,
            long: item?.dataLokasi?.coordinates?.longitude,
          })),
        };
        await calculateDistance(requestPayload);
      } catch (error) {
        console.error("Error calculating distance:", error);
      }
    };
    if (lokasiMuat.length > 0 && lokasiBongkar.length > 0) {
      handleCalculateDistance();
    }
  }, [lokasiMuat, lokasiBongkar]);

  useShallowCompareEffect(() => {
    if (calculatedDistance) {
      setField("distance", calculatedDistance?.estimatedDistance);
      setField("distanceUnit", calculatedDistance?.distanceUnit);
    }
  }, [calculatedDistance]);

  useShallowCompareEffect(() => {
    if (!isLoading && orderDetailData) {
      setOrderType(orderDetailData.orderType);
      // Simpan data original order untuk perbandingan
      setOriginalOrderData(orderDetailData.formValues);
      // Validasi formValues sebelum menggunakan Object.entries
      if (
        orderDetailData.formValues &&
        typeof orderDetailData.formValues === "object"
      ) {
        Object.entries(orderDetailData.formValues).forEach(([key, value]) => {
          setField(key, value);
        });
      }
    }
  }, [isLoading, orderDetailData]);

  useShallowCompareEffect(() => {
    const handleCalculatePrice = async () => {
      try {
        const requestPayload = {
          calculationType: "UPDATE_ORDER_PRICING",
          orderId: params.orderId,
          truckData: {
            carrierId,
            truckTypeId: truckType.truckTypeId,
            distance,
            distanceUnit,
            orderType,
            truckCount,
          },
          additionalServices: additionalServices.map((item) =>
            item.withShipping && shippingOption
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
        await calculatePrice(requestPayload);
      } catch (error) {
        console.error("Error calculating price:", error);
      }
    };
    if (truckType?.truckTypeId && hasUpdatedForm) {
      handleCalculatePrice();
    }
  }, [
    params.orderId,
    orderType,
    carrierId,
    truckType?.truckTypeId,
    truckCount,
    distance,
    distanceUnit,
    additionalServices,
    shippingOption,
    businessEntity.isBusinessEntity,
    voucherId,
    hasUpdatedForm,
  ]);

  // FIXED: Added a handler to implement the "Save Changes" flow (Requirement LD-G2.4)
  const handleSaveChanges = () => {
    // This uses the browser's default confirm dialog as a placeholder for the confirmation pop-up.
    const isConfirmed = window.confirm(
      "Are you sure you want to save these changes?"
    );

    if (isConfirmed) {
      console.log("User confirmed. Proceeding to call the final update API...");
    } else {
      console.log("User cancelled the changes.");
    }
  };

  if (isMobile)
    return (
      <SewaArmadaResponsive
        settingsTime={settingsTime}
        cargoTypes={cargoTypes}
        cargoCategories={cargoCategories}
        carriers={carriers}
        trucks={tempTrucks}
        additionalServicesOptions={additionalServicesOptions}
        shippingDetails={shippingDetails}
        shippingOption={shippingOption}
        calculatedPrice={calculatedPrice}
        orderStatus={orderDetailData?.orderStatus}
        onSaveChanges={handleSaveChanges}
        isUpdateFlow={true}
      />
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
      calculatedPrice={calculatedPrice}
      orderStatus={orderDetailData?.orderStatus}
      onSaveChanges={handleSaveChanges}
      isUpdateFlow={true}
    />
  );
};

export default Page;
