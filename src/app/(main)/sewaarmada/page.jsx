"use client";

import { useSearchParams } from "next/navigation";

import SewaArmadaResponsive from "@/container/SewaArmada/Responsive/SewaArmadaResponsive";
import SewaArmadaWeb from "@/container/SewaArmada/Web/SewaArmadaWeb";
import useDevice from "@/hooks/use-device";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useSWRHook, useSWRMutateHook } from "@/hooks/use-swr";
import { fetcherPayment } from "@/lib/axios";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";
import { useWaitingSettlementModalAction } from "@/store/forms/waitingSettlementModal";

const Page = () => {
  const { isMobile, mounted } = useDevice();
  const searchParams = useSearchParams();
  const urlFormId = searchParams.get("formid");
  const copyOrderId = searchParams.get("orderId");
  const localFormId = useSewaArmadaStore((state) => state.formId);
  const orderType = useSewaArmadaStore((state) => state.orderType);
  const {
    cargoTypeId,
    cargoCategoryId,
    carrierId,
    truckTypeId,
    truckCount,
    distance,
    distanceUnit,
    additionalServices,
    businessEntity,
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
  // Fetch layanan tambahan dari API
  const { data: additionalServicesData } = useSWRHook(
    "v1/orders/additional-services"
  );
  // Setup SWR mutation hook untuk API calculate-price
  const {
    trigger: calculatePrice,
    isMutating: isCalculatingPrice,
    data: priceData,
    error: priceError,
  } = useSWRMutateHook("v1/orders/calculate-price");
  console.log("priceddata", priceData);
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
  const additionalServicesOptions = additionalServicesData?.Data.services;
  // Use the API data directly or fall back to an empty array
  const paymentMethods = paymentMethodsData?.Data || [];
  const settingsTime = settingsTimeData?.Data || null;

  // Set default value if cargoTypes is loaded and tipeMuatan is not set
  useShallowCompareEffect(() => {
    if (cargoTypes.length > 0 && !cargoTypeId) {
      setField("cargoTypeId", cargoTypes[0].id);
    }
  }, [cargoTypes, cargoTypeId, isMobile]);

  // Set default value if cargoCategories is loaded and jenisMuatan is not set
  useShallowCompareEffect(() => {
    if (cargoCategories.length > 0 && !cargoCategoryId) {
      setField("cargoCategoryId", cargoCategories[0].id);
    }
  }, [cargoCategories, cargoCategoryId, isMobile]);

  // useShallowCompareEffect(async () => {
  //   // Jika user memilih jenis truk, kita perlu menghitung harga
  //   // Nanti dibuat function biar bisa diakses di tempat2 yg perlu calculate harga
  //   if (truckTypeId) {
  //     try {
  //       // Prepare request payload berdasarkan dokumentasi API
  //       const requestPayload = {
  //         calculationType: "FULL_ORDER_PRICING", // FULL_ORDER_PRICING atau UPDATE_ORDER_PRICING
  //         truckData: {
  //           carrierId,
  //           truckTypeId,
  //           distance,
  //           distanceUnit,
  //           orderType,
  //           truckCount, //sementara
  //         },
  //         // Blm ada asuransi
  //         // insuranceData: useAsuransi
  //         //   ? {
  //         //       // Nilai default untuk insurance jika tidak ada data spesifik
  //         //       insuranceOptionId: null,
  //         //       coverageAmount: 0,
  //         //     }
  //         //   : null,
  //         additionalServices,
  //         // Blm bisa akses voucher karena state nya cuma ada di SummaryPanel.jsx
  //         // voucherData: {
  //         //   voucherId: null,
  //         //   applyDiscount: false,
  //         // },
  //         businessEntity: {
  //           isBusinessEntity: businessEntity.isBusinessEntity,
  //         },
  //       };

  //       // Panggil API calculate-price
  //       // const priceResult = await calculatePrice(requestPayload);

  //       // Jika berhasil, simpan hasil perhitungan ke store
  //       // if (priceResult?.data?.price) {
  //       //   Update price data di store
  //       //   setField("calculatedPrice", priceResult.data.price);
  //       // }
  //     } catch (error) {
  //       console.error("Error calculating price:", error);
  //       // Opsional: Set error message di store
  //       // setError("price", "Gagal menghitung harga. Silahkan coba lagi.");
  //     }
  //   }
  // }, [
  //   orderType,
  //   carrierId,
  //   truckTypeId,
  //   truckCount,
  //   distance,
  //   distanceUnit,
  //   businessEntity.isBusinessEntity,
  // ]);

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
          "fotoMuatan",
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

  if (!mounted) return null;
  if (isMobile)
    return (
      <SewaArmadaResponsive
        cargoTypes={cargoTypes}
        cargoCategories={cargoCategories}
        paymentMethods={paymentMethods}
      />
    );

  return (
    <SewaArmadaWeb
      settlementAlertInfo={settlementAlertInfo}
      settingsTime={settingsTime}
      cargoTypes={cargoTypes}
      cargoCategories={cargoCategories}
      additionalServicesOptions={additionalServicesOptions}
      paymentMethods={paymentMethods}
    />
  );
};

export default Page;
