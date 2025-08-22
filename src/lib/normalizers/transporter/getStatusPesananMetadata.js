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

  // Check if status contains a number (e.g., "WAITING_PAYMENT_2")
  const statusWithNumber = orderStatus?.match(/^(.+)_(\d+)$/);

  let baseOrderStatus = orderStatus;
  let statusNumber = null;

  if (statusWithNumber) {
    const [, baseStatus, number] = statusWithNumber;
    baseOrderStatus = baseStatus;
    statusNumber = number;
  }

  // Try to find metadata for exact status first
  let orderStatusBadgeMetadata = ORDER_STATUS_CONFIG[orderStatus];

  // If not found, try to find metadata for base status
  if (!orderStatusBadgeMetadata) {
    orderStatusBadgeMetadata = ORDER_STATUS_CONFIG[baseOrderStatus];
  }

  // If still not found, try to find similar status (e.g., "WAITING_PAYMENT" for "WAITING_PAYMENT_2")
  if (!orderStatusBadgeMetadata) {
    // Look for status that starts with the base status
    const similarStatus = Object.keys(ORDER_STATUS_CONFIG).find(
      (key) => key.startsWith(baseOrderStatus) && key !== baseOrderStatus
    );

    if (similarStatus) {
      orderStatusBadgeMetadata = ORDER_STATUS_CONFIG[similarStatus];
    }
  }

  // If still not found, try to find any status that contains the base status
  if (!orderStatusBadgeMetadata) {
    const containingStatus = Object.keys(ORDER_STATUS_CONFIG).find(
      (key) => key.includes(baseOrderStatus) || baseOrderStatus.includes(key)
    );

    if (containingStatus) {
      orderStatusBadgeMetadata = ORDER_STATUS_CONFIG[containingStatus];
    }
  }

  // Fallback if metadata not found
  if (!orderStatusBadgeMetadata) {
    return {
      label: orderStatus,
      variant: "muted",
    };
  }

  if (
    baseOrderStatus !== ORDER_STATUS.COMPLETED &&
    baseOrderStatus !== ORDER_STATUS.CANCELLED_BY_TRANSPORTER &&
    baseOrderStatus !== ORDER_STATUS.CANCELLED_BY_SHIPPER &&
    baseOrderStatus !== ORDER_STATUS.CANCELLED_BY_SYSTEM &&
    orderStatusUnit &&
    orderStatusUnit > 1
  ) {
    let label = `${orderStatusBadgeMetadata.label} : ${orderStatusUnit} Unit`;

    // If status has a number, append it to the label
    if (statusNumber) {
      label = `${orderStatusBadgeMetadata.label} ${statusNumber} : ${orderStatusUnit} Unit`;
    }

    return {
      ...orderStatusBadgeMetadata,
      label,
    };
  } else {
    // If status has a number, append it to the label
    if (statusNumber) {
      return {
        ...orderStatusBadgeMetadata,
        label: `${orderStatusBadgeMetadata.label} ${statusNumber}`,
      };
    }

    return orderStatusBadgeMetadata;
  }
};
