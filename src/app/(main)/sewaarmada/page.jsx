"use client";

import { useSearchParams } from "next/navigation";

import SewaArmadaResponsive from "@/container/SewaArmada/Responsive/SewaArmadaResponsive";
import SewaArmadaWeb from "@/container/SewaArmada/Web/SewaArmadaWeb";
import useDevice from "@/hooks/use-device";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useSWRHook } from "@/hooks/use-swr";
import { fetcherPayment } from "@/lib/axios";
import { usePaymentRepaymentModalAction } from "@/store/forms/paymentRepaymentModal";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

const Page = () => {
  const { isMobile, mounted } = useDevice();
  const searchParams = useSearchParams();
  const urlFormId = searchParams.get("formid");
  const copyOrderId = searchParams.get("orderId");
  const localFormId = useSewaArmadaStore((state) => state.formId);
  const cargoTypeId = useSewaArmadaStore(
    (state) => state.formValues.cargoTypeId
  );
  const cargoCategoryId = useSewaArmadaStore(
    (state) => state.formValues.cargoCategoryId
  );
  const { setField, setFormId, setOrderType, reset } = useSewaArmadaActions();
  const { setPaymentRepaymentCount } = usePaymentRepaymentModalAction();

  const { data: reorderData, isLoading: isLoadingReorderData } = useSWRHook(
    copyOrderId ? `v1/orders/${copyOrderId}/reorder` : null
  );
  const { data: requiringConfirmationCountData } = useSWRHook(
    "v1/orders/requiring-confirmation/count"
  );
  // Fetch cargo types using SWR
  const { data: cargoTypesData } = useSWRHook("v1/orders/cargos/types");
  // Fetch cargo categories using SWR
  const { data: cargoCategoriesData } = useSWRHook(
    "v1/orders/cargos/categories"
  );
  // Fetch payment methods using SWR
  const { data: paymentMethodsData } = useSWRHook(
    "v1/payment/methods",
    fetcherPayment
  );
  const { data: settingsTimeData } = useSWRHook("v1/orders/settings/time");

  const requiringConfirmationCount =
    requiringConfirmationCountData?.Data || null;
  // Extract cargo types from response
  const cargoTypes = cargoTypesData?.Data?.types || [];
  // Extract cargo categories from response
  const cargoCategories = cargoCategoriesData?.Data?.categories || [];
  // Use the API data directly or fall back to an empty array
  const paymentMethods = paymentMethodsData?.Data || [];
  console.log("requiringConfirmationCount", requiringConfirmationCount);
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

  useShallowCompareEffect(() => {
    if (requiringConfirmationCount?.breakdown?.paymentRepaymentCount > 0) {
      setPaymentRepaymentCount(
        // requiringConfirmationCount.breakdown.paymentRepaymentCount
        2
      );
    }
  }, [requiringConfirmationCount]);

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
      requiringConfirmationCount={requiringConfirmationCount}
      settingsTime={settingsTime}
      cargoTypes={cargoTypes}
      cargoCategories={cargoCategories}
      paymentMethods={paymentMethods}
    />
  );
};

export default Page;
