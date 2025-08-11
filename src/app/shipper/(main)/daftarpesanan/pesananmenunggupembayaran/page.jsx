"use client";

import DaftarPesananResponsive from "@/container/Shipper/DaftarPesanan/Responsive";
import PendingOrderWeb from "@/container/Shipper/PendingOrder/Web";
import useOrderListPage from "@/hooks/useOrderListPage";

const Page = () => {
  const {
    mounted,
    isMobile,
    queryParams,
    lastFilterField,
    orders,
    handleChangeQueryParams,
  } = useOrderListPage({
    status: "WAITING_PAYMENT",
  });

  if (!mounted) return null;

  if (isMobile) {
    return (
      <DaftarPesananResponsive
        type="waitingPayment"
        queryParams={queryParams}
        lastFilterField={lastFilterField}
        onChangeQueryParams={handleChangeQueryParams}
        orders={orders}
      />
    );
  }

  return (
    <PendingOrderWeb
      title="Pesanan Menunggu Pembayaran"
      queryParams={queryParams}
      lastFilterField={lastFilterField}
      onChangeQueryParams={handleChangeQueryParams}
      orders={orders}
    />
  );
};

export default Page;
