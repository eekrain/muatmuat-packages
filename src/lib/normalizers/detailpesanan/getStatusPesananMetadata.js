import {
  OrderStatusEnum,
  OrderStatusTitle,
  OrderTypeEnum,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";

export const getStatusPesananMetadata = ({
  orderStatus,
  unitFleetStatus,
  totalUnit,
  t,
  isShowUnitFleetStatus = true,
  orderType,
}) => {
  let variant = "primary";
  if (orderStatus.startsWith("WAITING")) variant = "warning";
  else if (orderStatus.startsWith("CANCELED")) variant = "error";
  else if (orderStatus === OrderStatusEnum.COMPLETED) variant = "success";

  return {
    variant,
    label:
      orderType === OrderTypeEnum.SCHEDULED &&
      isShowUnitFleetStatus &&
      orderStatus !== OrderStatusEnum.COMPLETED &&
      !orderStatus.startsWith("CANCELED") &&
      !orderStatus.startsWith("WAITING_PAYMENT") &&
      unitFleetStatus &&
      totalUnit > 1
        ? `${t(OrderStatusTitle[orderStatus])}: ${unitFleetStatus} Unit`
        : t(OrderStatusTitle[orderStatus]),
  };
};
