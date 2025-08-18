"use client";

import { useState } from "react";

import DaftarPesanan from "@/container/Transporter/DaftarPesanan/DaftarPesanan";
import useDevice from "@/hooks/use-device";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useGetOrderList } from "@/services/Transporter/daftar-pesanan/getOrderList";

const DaftarPesananPage = () => {
  const { mounted } = useDevice();

  const defaultQueryParams = {
    page: 1,
    limit: 10,
    status: "",
    search: "",
    // startDate: null,
    // endDate: null,
    sort: "",
    order: "",
  };
  const [queryParams, setQueryParams] = useState(defaultQueryParams);

  const queryString = useShallowMemo(() => {
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
    // Handle dates - both can be provided individually
    // if (queryParams.startDate) {
    //   params.append("startDate", queryParams.startDate);
    // }
    // if (queryParams.endDate) {
    //   params.append("endDate", queryParams.endDate);
    // }
    if (queryParams.search) {
      params.append("search", queryParams.search);
    }
    if (queryParams.sort) {
      params.append("sort", queryParams.sort);
    }
    if (queryParams.order) {
      params.append("order", queryParams.order);
    }
    return params.toString();
  }, [queryParams]);

  const {
    data: { isFirstTimer = true, orders = [], pagination = {} } = {},
    isLoading: isOrdersLoading,
  } = useGetOrderList(queryString);

  if (!mounted) return null;

  return (
    <DaftarPesanan
      isFirstTimer={isFirstTimer}
      orders={orders}
      pagination={pagination}
    />
  );
};

export default DaftarPesananPage;
