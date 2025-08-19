import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { ORDER_STATUS_CONFIG } from "@/utils/Transporter/orderStatus";

export const getStatusPesananMetadataTransporter = ({
  orderStatus,
  orderStatusUnit,
  truckCount,
  t,
}) => {
  if (!orderStatus) return { variant: "primary", label: "" };

  const orderStatusBadgeMetadata = ORDER_STATUS_CONFIG[orderStatus];

  if (
    orderStatus !== OrderStatusEnum.COMPLETED &&
    !orderStatus.startsWith("CANCELED") &&
    !orderStatus.startsWith("WAITING_PAYMENT") &&
    orderStatusUnit &&
    truckCount > 1
  ) {
    return {
      ...orderStatusBadgeMetadata,
      label: `${orderStatusBadgeMetadata.label} : ${orderStatusUnit} Unit`,
    };
  } else {
    return orderStatusBadgeMetadata;
  }
};
