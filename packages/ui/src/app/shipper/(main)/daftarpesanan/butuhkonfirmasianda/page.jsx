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
    requiresConfirmation: true,
  });

  if (!mounted) return null;

  if (isMobile) {
    return (
      <DaftarPesananResponsive
        type="needConfirmation"
        queryParams={queryParams}
        lastFilterField={lastFilterField}
        onChangeQueryParams={handleChangeQueryParams}
        orders={orders}
      />
    );
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
