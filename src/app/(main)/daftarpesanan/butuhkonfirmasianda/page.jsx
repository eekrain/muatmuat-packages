"use client";

import PendingOrderWeb from "@/container/PendingOrder/Web";
import usePendingOrdersPage from "@/services/pendingOrder/getPendingOrder";

const Page = () => {
  const {
    isMobile,
    mounted,
    queryParams,
    lastFilterField,
    orders,
    handleChangeQueryParams,
  } = usePendingOrdersPage({
    requiresConfirmation: true,
  });

  if (!mounted) {
    return null;
  }

  if (isMobile) {
    return <div>Responsive sementara</div>;
  }
  console.log("lastFilterField", lastFilterField);
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
