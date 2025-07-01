"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import SewaArmadaResponsive from "@/container/SewaArmada/Responsive/SewaArmadaResponsive";
import SewaArmadaWeb from "@/container/SewaArmada/Web/SewaArmadaWeb";
import useDevice from "@/hooks/use-device";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useSWRHook } from "@/hooks/use-swr";
import { useGetSalinDetailPesananData } from "@/services/detailpesanan/getDetailPesananData";
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
  const { setField, setFormId, reset } = useSewaArmadaActions();

  const { data: dataDetailPesanan, isLoading: isLoadingDetailPesanan } =
    useGetSalinDetailPesananData(copyOrderId);
  console.log("dataDetailPesanan", dataDetailPesanan);
  const { data: requiringConfirmationCountData } = useSWRHook(
    "v1/orders/requiring-confirmation/count"
  );
  // Fetch cargo types using SWR
  const { data: cargoTypesData } = useSWRHook("v1/orders/cargos/types");
  // Fetch cargo categories using SWR
  const { data: cargoCategoriesData } = useSWRHook(
    "v1/orders/cargos/categories"
  );

  const requiringConfirmationCount =
    requiringConfirmationCountData?.Data || null;
  // Extract cargo types from response
  const cargoTypes = cargoTypesData?.Data?.types || [];
  // Extract cargo categories from response
  const cargoCategories = cargoCategoriesData?.Data?.categories || [];

  // Set default value if cargoTypes is loaded and tipeMuatan is not set
  useShallowCompareEffect(() => {
    if (cargoTypes.length > 0 && !cargoTypeId && !isMobile) {
      setField("cargoTypeId", cargoTypes[0].id);
    }
  }, [cargoTypes, cargoTypeId, isMobile]);

  // Set default value if cargoCategories is loaded and jenisMuatan is not set
  useShallowCompareEffect(() => {
    if (cargoCategories.length > 0 && !cargoCategoryId && !isMobile) {
      setField("cargoCategoryId", cargoCategories[0].id);
    }
  }, [cargoCategories, cargoCategoryId, isMobile]);

  useEffect(() => {
    if (urlFormId !== localFormId) {
      reset();
      setFormId(urlFormId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlFormId, localFormId]);

  if (!mounted) return null;
  if (isMobile)
    return (
      <SewaArmadaResponsive
        cargoTypes={cargoTypes}
        cargoCategories={cargoCategories}
      />
    );

  return (
    <SewaArmadaWeb
      cargoTypes={cargoTypes}
      cargoCategories={cargoCategories}
      requiringConfirmationCount={requiringConfirmationCount}
    />
  );
};

export default Page;
