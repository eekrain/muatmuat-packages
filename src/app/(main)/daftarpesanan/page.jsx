"use client";

import { useMemo, useState } from "react";

import DaftarPesananWeb from "@/container/DaftarPesanan/Web";
import useDevice from "@/hooks/use-device";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useSWRHook } from "@/hooks/use-swr";

const Page = () => {
  const { isMobile, mounted } = useDevice();
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

  const { data: requiringConfirmationCountData } = useSWRHook(
    "v1/orders/requiring-confirmation/count"
  );
  // Fetch orders data
  const { data: ordersData, isOrdersLoading } = useSWRHook(
    `v1/orders/list?${queryString}`
  );
  const { data: countByStatusData } = useSWRHook("v1/orders/count-by-status");

  const requiringConfirmationCount =
    requiringConfirmationCountData?.Data || null;
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

  const isFirstTimer = useShallowMemo(
    () =>
      JSON.stringify(defaultQueryParams) === JSON.stringify(queryParams) ||
      (lastFilterField === "status" &&
        Object.keys(defaultQueryParams).every((key) => {
          if (key === "status") {
            return tabs.some((item) => item.value === queryParams[key]);
          }
          return (
            JSON.stringify(queryParams[key]) ===
            JSON.stringify(defaultQueryParams[key])
          );
        })),
    [defaultQueryParams, queryParams, lastFilterField, tabs]
  );

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
    setLastFilterField(field);
  };

  if (!mounted) {
    return null;
  }
  if (isMobile) {
    return <div>Responsive sementara</div>;
  }
  return (
    <DaftarPesananWeb
      queryParams={queryParams}
      onChangeQueryParams={handleChangeQueryParams}
      orders={orders}
      pagination={pagination}
      isOrdersLoading={isOrdersLoading}
      requiringConfirmationCount={requiringConfirmationCount}
      isFirstTimer={isFirstTimer}
      lastFilterField={lastFilterField}
      tabs={tabs}
    />
  );
};

export default Page;
