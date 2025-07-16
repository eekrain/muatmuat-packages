"use client";

import PendingOrderWeb from "@/container/Shipper/PendingOrder/Web";
import usePendingOrdersPage from "@/services/Shipper/pendingOrder/getPendingOrder";

const Page = () => {
  const {
    isMobile,
    queryParams,
    lastFilterField,
    orders,
    handleChangeQueryParams,
  } = usePendingOrdersPage({
    requiresConfirmation: true,
  });

  if (isMobile) {
    return <div>Responsive sementara</div>;
  }

  return (
    <PendingOrderWeb
      title="Butuh Konfirmasi Anda"
      queryParams={queryParams}
      lastFilterField={lastFilterField}
      onChangeQueryParams={handleChangeQueryParams}
      orders={orders}
    />
  );
};

export default Page;
