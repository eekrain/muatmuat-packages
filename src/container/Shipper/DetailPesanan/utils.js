import {
  OrderStatusEnum,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";

export const shouldShowUnitFleetStatus = ({
  orderStatus,
  unitFleetStatus,
  totalUnit,
  isShowUnitFleetStatus,
}) => {
  return (
    isShowUnitFleetStatus &&
    orderStatus !== OrderStatusEnum.COMPLETED &&
    !orderStatus.startsWith("CANCELED") &&
    !orderStatus.startsWith("WAITING_PAYMENT") &&
    unitFleetStatus &&
    totalUnit > 1
  );
};

export const getOrderStatusLabel = ({
  orderStatus,
  unitFleetStatus,
  totalUnit,
  t,
  isShowUnitFleetStatus = true,
}) =>
  shouldShowUnitFleetStatus({
    orderStatus,
    unitFleetStatus,
    totalUnit,
    isShowUnitFleetStatus,
  })
    ? `${t(OrderStatusTitle[orderStatus])}: ${unitFleetStatus} Unit`
    : t(OrderStatusTitle[orderStatus]);

export const getStatusVariant = ({ orderStatus }) => {
  if (orderStatus.startsWith("WAITING")) {
    return "warning";
  }
  if (orderStatus.startsWith("CANCELED")) {
    return "error";
  }
  if (orderStatus === OrderStatusEnum.COMPLETED) {
    return "success";
  }
  return "primary";
};
