import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { normalizeOrderDetail } from "@/lib/normalizers/sewaarmada";

export const getOrderDetail = async (url) => {
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
    orderType: "INSTANT",
    formValues: normalizeOrderDetail(
      orderDetail?.data?.Data,
      tempShippingOptions
    ),
  };
};

export const useGetOrderDetail = (orderId) =>
  useSWR(orderId ? `v1/orders/${orderId}/reorder` : null, getOrderDetail);
