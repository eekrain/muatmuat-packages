import {
  OrderStatusEnum,
  OrderStatusTitle,
} from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import {
  DriverStatusEnum,
  DriverStatusLabel,
} from "@/lib/constants/Shipper/detailpesanan/driver-status.enum";

const SHOULD_RETURNS_DRIVER_STATUS = [
  OrderStatusEnum.LOADING,
  OrderStatusEnum.UNLOADING,
];
const SHOULD_SHOW = [
  OrderStatusEnum.CONFIRMED,
  OrderStatusEnum.SCHEDULED_FLEET,
  OrderStatusEnum.LOADING,
  OrderStatusEnum.UNLOADING,
];

export const getStatusDriverMetadataCS = ({
  driverStatus = null,
  orderStatus = null,
  t,
}) => {
  if (!SHOULD_SHOW.includes(orderStatus)) return null;
  let variant = "primary";
  let label = "";
  const splitStatus = driverStatus?.split?.("_");
  if (!splitStatus) return { variant, label };

  // Special case: WAITING_CONFIRMATION_CHANGES with MENUNGGU_ARMADA_PENGGANTI should use primary variant
  if (
    orderStatus === OrderStatusEnum.WAITING_CONFIRMATION_CHANGES &&
    driverStatus === DriverStatusEnum.FLEET_CHANGE.MENUNGGU.code
  ) {
    variant = "primary";
  } else if (orderStatus?.startsWith("WAITING")) variant = "warning";
  else if (orderStatus?.startsWith("CANCELED")) variant = "error";
  else if (orderStatus === OrderStatusEnum.COMPLETED) variant = "success";

  if (!SHOULD_RETURNS_DRIVER_STATUS.includes(orderStatus)) {
    label = t(OrderStatusTitle[orderStatus]);
    return { variant, label };
  }

  const locationIndex = Number(splitStatus.slice(-1)?.[0]);
  if (isNaN(locationIndex)) {
    label = t(DriverStatusLabel[driverStatus]);
    return { variant, label };
  }

  const newStatus = splitStatus.slice(0, -1).join("_");
  label = `${t(DriverStatusLabel[newStatus])} ${locationIndex}`;
  return { variant, label };
};
