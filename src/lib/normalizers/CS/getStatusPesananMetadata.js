import {
  OrderStatusEnum,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";

export const getStatusPesananMetadataCS = ({
  orderStatus,
  orderStatusUnit,
  truckCount,
  t,
}) => {
  if (!orderStatus) return { variant: "primary", label: "" };
  let variant = "primary";
  if (orderStatus.startsWith("WAITING")) variant = "warning";
  else if (orderStatus.startsWith("CANCELED")) variant = "error";
  else if (orderStatus === OrderStatusEnum.COMPLETED) variant = "success";

  return {
    variant,
    label:
      orderStatus !== OrderStatusEnum.COMPLETED &&
      !orderStatus.startsWith("CANCELED") &&
      !orderStatus.startsWith("WAITING_PAYMENT") &&
      orderStatusUnit &&
      truckCount > 1
        ? `${t(OrderStatusTitle[orderStatus])} : ${orderStatusUnit} Unit`
        : t(OrderStatusTitle[orderStatus]),
  };
};
