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

  // Check if status contains a number (e.g., "MENUJU_LOKASI_BONGKAR_1")
  const statusWithNumber = orderStatus?.match(/^(.+)_(\d+)$/);

  let baseOrderStatus = orderStatus;
  let statusNumber = null;

  if (statusWithNumber) {
    const [, baseStatus, number] = statusWithNumber;
    baseOrderStatus = baseStatus;
    statusNumber = number;
  }

  const orderStatusBadgeMetadata = ORDER_STATUS_CONFIG[baseOrderStatus];

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
