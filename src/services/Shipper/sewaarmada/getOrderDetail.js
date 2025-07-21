import useSWR from "swr";

import { fetcherMuatrans } from "@/lib/axios";
import { normalizeOrderDetail } from "@/lib/normalizers/sewaarmada";

export const getOrderDetail = async (url, { type }) => {
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
    orderType: "INSTANT", // Use the provided type or default to "INSTANT"
    formValues: normalizeOrderDetail(
      orderDetail?.data?.Data,
      tempShippingOptions,
      type
    ),
  };
};

export const useGetOrderDetail = (orderId, type) =>
  useSWR(orderId ? `v1/orders/${orderId}/reorder` : null, (url) =>
    getOrderDetail(url, { type })
  );
