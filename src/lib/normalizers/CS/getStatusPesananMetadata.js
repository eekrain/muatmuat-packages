import {
  CSOrderStatusEnum,
  CSOrderStatusTitle,
} from "@/lib/constants/CS/detailpesanan/detailpesanan-cs.enum";

export const getStatusPesananMetadataCS = ({
  orderStatus,
  orderStatusUnit,
  truckCount,
  t,
}) => {
  if (!orderStatus) return { variant: "primary", label: "" };
  let variant = "primary";
  if (
    orderStatus === CSOrderStatusEnum.NEED_ASSIGN_FLEET ||
    orderStatus === CSOrderStatusEnum.NEED_CONFIRMATION_CHANGES
  )
    variant = "warning";
  else if (orderStatus === CSOrderStatusEnum.NEED_CONFIRMATION_READY)
    variant = "error";
  else if (orderStatus === CSOrderStatusEnum.COMPLETED) variant = "success";

  return {
    variant,
    label:
      orderStatus !== CSOrderStatusEnum.COMPLETED &&
      !orderStatus.startsWith("CANCELED") &&
      !orderStatus.startsWith("WAITING_PAYMENT") &&
      orderStatusUnit &&
      truckCount > 1
        ? `${t(CSOrderStatusTitle[orderStatus])} : ${orderStatusUnit} Unit`
        : t(CSOrderStatusTitle[orderStatus]),
  };
};
