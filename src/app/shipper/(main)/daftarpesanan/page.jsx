"use client";

import { useMemo, useState } from "react";

import DaftarPesananResponsive from "@/container/Shipper/DaftarPesanan/Responsive";
import DaftarPesananWeb from "@/container/Shipper/DaftarPesanan/Web";
import useDevice from "@/hooks/use-device";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useSWRHook } from "@/hooks/use-swr";

const Page = () => {
  const { isMobile } = useDevice();
  const defaultQueryParams = {
    page: 1,
    limit: 10,
    status: "",
    search: "",
    startDate: null,
    endDate: null,
    sort: "",
    order: "",
  };
  const [queryParams, setQueryParams] = useState(defaultQueryParams);
  const [lastFilterField, setLastFilterField] = useState("");
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null); // Track currently selected period
  const [hasNoOrders, setHasNoOrders] = useState(false);

  // Transform state into query string using useMemo
  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    // Only add parameters with valid values
    if (queryParams.page && queryParams.page > 0) {
      params.append("page", queryParams.page);
    }
    if (queryParams.limit && queryParams.limit > 0) {
      params.append("limit", queryParams.limit);
    }
    if (queryParams.status && queryParams.status !== "") {
      params.append("status", queryParams.status);
    }
    if (queryParams.search) {
      params.append("search", queryParams.search);
    }
    // Handle dates - both can be provided individually
    if (queryParams.startDate) {
      params.append("startDate", queryParams.startDate);
    }
    if (queryParams.endDate) {
      params.append("endDate", queryParams.endDate);
    }
    if (queryParams.sort) {
      params.append("sort", queryParams.sort);
    }
    if (queryParams.order) {
      params.append("order", queryParams.order);
    }

    return params.toString();
  }, [queryParams]);

  const { data: settlementAlertInfoData } = useSWRHook(
    "v1/orders/settlement/alert-info"
  );
  // Fetch orders data
  const { data: ordersData, isLoading: isOrdersLoading } = useSWRHook(
    `v1/orders/list?${queryString}`
  );
  const { data: countByStatusData } = useSWRHook("v1/orders/count-by-status");

  const settlementAlertInfo = settlementAlertInfoData?.Data || [];
  const orders = ordersData?.Data?.orders || [];
  const countByStatus = countByStatusData?.Data?.statusCounts || {};

  // Use the pagination from API response
  const pagination = ordersData?.Data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  };

  const tabs = useShallowMemo(
    () => [
      { value: "", label: "Semua" },
      {
        value: "WAITING_PAYMENT",
        label: `Menunggu Pembayaran (${countByStatus?.waitingPayment ?? 0})`,
      },
      {
        value: "WAITING_REPAYMENT",
        label: `Menunggu Pelunasan (${countByStatus?.awaitingSettlement ?? 0})`,
      },
      {
        value: "DOCUMENT_SHIPPING",
        label: `Proses Pengiriman Dokumen (${countByStatus?.documentProcess ?? 0})`,
      },
    ],
    [countByStatus]
  );

  useShallowCompareEffect(() => {
    if (
      !isOrdersLoading &&
      orders.length === 0 &&
      JSON.stringify(defaultQueryParams) === JSON.stringify(queryParams)
    ) {
      setHasNoOrders(true);
    }
  }, [orders, defaultQueryParams, queryParams, isOrdersLoading]);

  const handleChangeQueryParams = (field, value) => {
    setQueryParams((prevState) => {
      // Reset to page 1 when changing filters
      if (field !== "page") {
        if (field === "search") {
          return { ...defaultQueryParams, [field]: value, page: 1 };
        }
        return { ...prevState, [field]: value, page: 1 };
      }
      return { ...prevState, [field]: value };
    });
    setCurrentPeriodValue((prevState) =>
      field === "search"
        ? { name: "Semua Periode (Default)", value: "", format: "day" }
        : prevState
    );
    setLastFilterField(field);
  };

  if (isMobile) {
    return <DaftarPesananResponsive orders={orders} />;
  }
  return (
    <DaftarPesananWeb
      queryParams={queryParams}
      onChangeQueryParams={handleChangeQueryParams}
      orders={orders}
      pagination={pagination}
      isOrdersLoading={isOrdersLoading}
      settlementAlertInfo={settlementAlertInfo}
      hasNoOrders={hasNoOrders}
      lastFilterField={lastFilterField}
      tabs={tabs}
      currentPeriodValue={currentPeriodValue}
      setCurrentPeriodValue={setCurrentPeriodValue}
    />
  );
};

export default Page;
