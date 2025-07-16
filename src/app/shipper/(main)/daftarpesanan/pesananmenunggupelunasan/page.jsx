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
    status: "WAITING_REPAYMENT",
  });

  if (isMobile) {
    return <div>Responsive sementara</div>;
  }

  return (
    <PendingOrderWeb
      title="Pesanan Menunggu Pelunasan"
      queryParams={queryParams}
      lastFilterField={lastFilterField}
      onChangeQueryParams={handleChangeQueryParams}
      orders={orders}
    />
  );
};

export default Page;
