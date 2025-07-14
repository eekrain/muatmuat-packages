import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { normalizeReorderFleet } from "@/lib/normalizers/sewaarmada";

export const getReorderData = async (url) => {
  const reorderData = await fetcherMuatrans.get(url);

  const documentDeliveryService =
    reorderData?.data?.Data.additionalService.find((item) => item.isShipping);
  let tempShippingOptions = [];

  if (documentDeliveryService) {
    const result = await fetcherMuatrans.post("v1/orders/shipping-options", {
      lat: documentDeliveryService.addressInformation.latitude,
      long: documentDeliveryService.addressInformation.longitude,
    });
    tempShippingOptions = result?.data?.Data.shippingOptions;
  }

  return {
    orderType: "INSTANT",
    formValues: normalizeReorderFleet(
      reorderData?.data?.Data,
      tempShippingOptions
    ),
  };
};

export const useGetReorderData = (orderId) =>
  useSWR(orderId ? `v1/orders/${orderId}/reorder` : null, getReorderData);
