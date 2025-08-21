import {
  ORDER_STATUS,
  ORDER_STATUS_CONFIG,
} from "@/utils/Transporter/orderStatus";

export const getStatusPesananMetadataTransporter = ({
  orderStatus,
  orderStatusUnit,
  truckCount,
  t,
}) => {
  if (!orderStatus) return { variant: "primary", label: "" };

  const orderStatusBadgeMetadata = ORDER_STATUS_CONFIG[orderStatus];

  if (
    orderStatus !== ORDER_STATUS.COMPLETED &&
    orderStatus !== ORDER_STATUS.CANCELLED_BY_TRANSPORTER &&
    orderStatus !== ORDER_STATUS.CANCELLED_BY_SHIPPER &&
    orderStatus !== ORDER_STATUS.CANCELLED_BY_SYSTEM &&
    orderStatusUnit &&
    orderStatusUnit > 1
  ) {
    return {
      ...orderStatusBadgeMetadata,
      label: `${orderStatusBadgeMetadata.label} : ${orderStatusUnit} Unit`,
    };
  } else {
    return orderStatusBadgeMetadata;
  }
};
