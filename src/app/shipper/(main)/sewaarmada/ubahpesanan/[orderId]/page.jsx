"use client";

import SewaArmadaWeb from "@/container/Shipper/SewaArmada/Web/SewaArmadaWeb";
import useDevice from "@/hooks/use-device";
import { useSWRHook } from "@/hooks/use-swr";

const Page = () => {
  const { isMobile } = useDevice();

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

  // Extract cargo types from response
  const cargoTypes = cargoTypesData?.Data?.types || [];
  // Extract cargo categories from response
  const cargoCategories = cargoCategoriesData?.Data?.categories || [];
  const additionalServicesOptions = additionalServicesData?.Data.services || [];

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
      //   settingsTime={settingsTime}
      cargoTypes={cargoTypes}
      cargoCategories={cargoCategories}
      //   carriers={carriers}
      //   trucks={trucks}
      additionalServicesOptions={additionalServicesOptions}
      //   shippingDetails={shippingDetails}
      //   shippingOption={shippingOption}
      //   calculatedPrice={calculatedPrice}
      //   paymentMethods={paymentMethods}
      //   onFetchTrucks={handleFetchTrucks}
    />
  );
};

export default Page;
