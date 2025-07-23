import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { normalizeReorderFleet } from "@/lib/normalizers/sewaarmada";

export const getReorderFleetData = async (url) => {
  const orderDetail = await fetcherMuatrans.get(url);

  const documentDeliveryService =
    orderDetail?.data?.Data.additionalService.find((item) => item.isShipping);
  let tempShippingOptions = [];

  if (documentDeliveryService) {
    const result = await fetcherMuatrans.post("v1/orders/shipping-options", {
      lat: documentDeliveryService.addressInformation.latitude,
      long: documentDeliveryService.addressInformation.longitude,
    });
    tempShippingOptions = result?.data?.Data.shippingOptions;
  }
  return {
    orderType: orderDetail?.data?.Data.otherInformation.orderType,
    formValues: normalizeReorderFleet(
      orderDetail?.data?.Data,
      tempShippingOptions
    ),
  };
};

export const useGetReorderFleetData = (orderId) =>
  useSWR(orderId ? `v1/orders/${orderId}/reorder` : null, getReorderFleetData);
