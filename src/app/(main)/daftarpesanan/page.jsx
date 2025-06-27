"use client";

import { useMemo, useState } from "react";

import DaftarPesananWeb from "@/container/DaftarPesanan/Web";
import useDevice from "@/hooks/use-device";
import { useSWRHook } from "@/hooks/use-swr";

const Page = () => {
  const { isMobile, mounted } = useDevice();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "Semua",
    sort: "",
    order: "",
  });

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
    if (queryParams.search) {
      params.append("search", queryParams.search);
    }
    if (queryParams.status && queryParams.status !== "Semua") {
      // Map frontend status to API status
      const statusMap = {
        Pembayaran: "WAITING_PAYMENT",
        Pelunasan: "WAITING_REPAYMENT",
        Dokumen: "DOCUMENT_SHIPPING",
      };
      params.append("status", statusMap[queryParams.status] || "");
    }
    if (queryParams.sort) {
      params.append("sort", queryParams.sort);
    }
    if (queryParams.order) {
      params.append("order", queryParams.order);
    }

    return params.toString();
  }, [queryParams]);
  console.log("querystr", queryString);
  // Fetch orders data
  const { data: ordersData, isOrdersLoading } = useSWRHook(
    `v1/orders/list?${queryString}`
  );
  const { data: countByStatusData } = useSWRHook("v1/orders/count-by-status");

  const orders = ordersData?.Data?.orders || [];
  const countByStatus = countByStatusData?.Data?.statusCounts || {};

  // Use the pagination from API response
  const pagination = ordersData?.Data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  };

  const handleChangeQueryParams = (field, value) => {
    setQueryParams((prevState) => {
      // Reset to page 1 when changing filters
      if (field !== "page") {
        return { ...prevState, [field]: value, page: 1 };
      }
      return { ...prevState, [field]: value };
    });
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
      countByStatus={countByStatus}
      isOrdersLoading={isOrdersLoading}
    />
  );
};

export default Page;
