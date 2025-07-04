"use client";

import PendingOrderWeb from "@/container/PendingOrder/Web";
import usePendingOrdersPage from "@/services/pendingOrder/getPendingOrder";

const Page = () => {
  const { isMobile, mounted, queryParams, orders, handleChangeQueryParams } =
    usePendingOrdersPage({
      status: "WAITING_PAYMENT",
    });

  if (!mounted) {
    return null;
  }

  if (isMobile) {
    return <div>Responsive sementara</div>;
  }

  return (
    <PendingOrderWeb
      title="Pesanan Menunggu Pembayaran"
      queryParams={queryParams}
      onChangeQueryParams={handleChangeQueryParams}
      orders={orders}
    />
  );
};

export default Page;
