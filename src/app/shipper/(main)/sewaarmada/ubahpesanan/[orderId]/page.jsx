"use client";

import { useParams } from "next/navigation";

import SewaArmadaWeb from "@/container/Shipper/SewaArmada/Web/SewaArmadaWeb";
import useDevice from "@/hooks/use-device";
import useGetSewaArmadaFormOption from "@/services/Shipper/sewaarmada/getSewaArmadaFormOption";
import { useGetUpdateOrderData } from "@/services/Shipper/sewaarmada/getUpdateOrderData";

const Page = () => {
  const params = useParams();
  const { isMobile } = useDevice();

  const abc = useGetUpdateOrderData(params.orderId);
  const { cargoCategories, cargoTypes, additionalServicesOptions } =
    useGetSewaArmadaFormOption();

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
