import {
  OrderStatusEnum,
  OrderStatusTitle,
} from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { DriverStatusLabel } from "@/lib/constants/detailpesanan/driver-status.enum";

const SHOULD_RETURNS_ORDER_STATUS = [
  OrderStatusEnum.WAITING_REPAYMENT_1,
  OrderStatusEnum.WAITING_REPAYMENT_2,
  OrderStatusEnum.PREPARE_DOCUMENT,
  OrderStatusEnum.DOCUMENT_DELIVERY,
  OrderStatusEnum.COMPLETED,
  OrderStatusEnum.CANCELED_BY_SHIPPER,
  OrderStatusEnum.CANCELED_BY_SYSTEM,
  OrderStatusEnum.CANCELED_BY_TRANSPORTER,
];

export const getDriverStatusMetadata = ({
  driverStatus = null,
  orderStatus = null,
  t,
}) => {
  let variant = "primary";
  let label = "";
  const splitStatus = driverStatus?.split?.("_");
  if (!splitStatus) return { variant, label };

  if (orderStatus?.startsWith("WAITING")) variant = "warning";
  else if (orderStatus?.startsWith("CANCELED")) variant = "error";
  else if (orderStatus === OrderStatusEnum.COMPLETED) variant = "success";

  if (SHOULD_RETURNS_ORDER_STATUS.includes(orderStatus)) {
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
