import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { normalizeReorderFleet } from "@/lib/normalizers/sewaarmada";

export const getUpdateOrderData = async (url) => {
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
    orderType: reorderData?.data?.Data.otherInformation.orderType,
    formValues: normalizeReorderFleet(
      reorderData?.data?.Data,
      tempShippingOptions
    ),
  };
};

export const useGetUpdateOrderData = (orderId) =>
  useSWR(orderId ? `v1/orders/${orderId}` : null, getUpdateOrderData);
