import { AlertPendingPrepareFleet } from "@/container/Shipper/DetailPesanan/Web/StatusPesanan/AlertPendingPrepareFleet";

export const FleetStatusAlert = () => {
  const orderStatus = "WAITING_PAYMENT_1";
  const expiredAt = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

  return (
    <div>
      <AlertPendingPrepareFleet
        orderStatus={orderStatus}
        expiredAt={expiredAt}
      />
    </div>
  );
};
