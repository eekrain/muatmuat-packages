"use client";

import DaftarPesananResponsive from "@/container/Shipper/DaftarPesanan/Responsive";
import DaftarPesananWeb from "@/container/Shipper/DaftarPesanan/Web";

import useOrderListPage from "@/hooks/useOrderListPage";

const Page = () => {
  const {
    mounted,
    isMobile,
    queryParams,
    lastFilterField,
    hasNoOrders,
    settlementAlertInfo,
    orders,
    isOrdersLoading,
    pagination,
    statusRadioOptions,
    statusTabOptions,
    currentPeriodValue,
    setCurrentPeriodValue,
    handleChangeQueryParams,
  } = useOrderListPage({
    defaultPage: true,
  });

  if (!mounted) return null;

  if (isMobile) {
    return (
      <DaftarPesananResponsive
        type="default"
        queryParams={queryParams}
        onChangeQueryParams={handleChangeQueryParams}
        orders={orders}
        pagination={pagination}
        isOrdersLoading={isOrdersLoading}
        settlementAlertInfo={settlementAlertInfo}
        hasNoOrders={hasNoOrders}
        lastFilterField={lastFilterField}
        statusTabOptions={statusTabOptions}
        statusRadioOptions={statusRadioOptions}
      />
    );
  }
  return (
    <DaftarPesananWeb
      queryParams={queryParams}
      onChangeQueryParams={handleChangeQueryParams}
      orders={orders}
      isOrdersLoading={isOrdersLoading}
      pagination={pagination}
      settlementAlertInfo={settlementAlertInfo}
      hasNoOrders={hasNoOrders}
      lastFilterField={lastFilterField}
      statusTabOptions={statusTabOptions}
      statusRadioOptions={statusRadioOptions}
      currentPeriodValue={currentPeriodValue}
      setCurrentPeriodValue={setCurrentPeriodValue}
    />
  );
};

export default Page;
