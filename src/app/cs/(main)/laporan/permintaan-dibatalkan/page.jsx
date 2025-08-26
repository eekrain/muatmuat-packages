"use client";

import { useState } from "react";

import LaporanPermintaanDibatalkan from "@/container/CS/LaporanPermintaanDibatalkan/LaporanPermintaanDibatalkan";
import useDevice from "@/hooks/use-device";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { useGetCancelledOrders } from "@/services/CS/laporan/permintaan-dibatalkan/getCancelledOrders";
import { useGetPeriodHistory } from "@/services/CS/laporan/permintaan-dibatalkan/getPeriodHistory";

const Page = () => {
  const { mounted } = useDevice();

  const defaultQueryParams = {
    page: 1,
    limit: 10,
    search: "",
    startDate: null,
    endDate: null,
    sort: "",
    order: "",
  };
  const [queryParams, setQueryParams] = useState(defaultQueryParams);
  const [lastFilterField, setLastFilterField] = useState("");
  const [hasNoOrders, setHasNoOrders] = useState(false);
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null);

  const queryString = useShallowMemo(() => {
    const params = new URLSearchParams();

    // Only add parameters with valid values
    if (queryParams.page && queryParams.page > 0) {
      params.append("page", queryParams.page);
    }
    if (queryParams.limit && queryParams.limit > 0) {
      params.append("limit", queryParams.limit);
    }
    // Handle dates - both can be provided individually
    if (queryParams.startDate) {
      params.append("startDate", queryParams.startDate);
    }
    if (queryParams.endDate) {
      params.append("endDate", queryParams.endDate);
    }
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

  const { data: { orders = [], pagination = null } = {}, isLoading } =
    useGetCancelledOrders(queryString);
  const { data: { periodHistory = [] } = {}, mutate: refetchPeriodHistory } =
    useGetPeriodHistory();
  const { trigger: savePeriodHistory, isMutating: isUploadingLogo } =
    useSWRMutateHook(
      "v1/cs/canceled-orders/period-history",
      "POST",
      undefined,
      undefined,
      {
        onSuccess: (data) => {
          if (data.Data) {
            refetchPeriodHistory();
          }
        },
      }
    );

  useShallowCompareEffect(() => {
    if (
      !isLoading &&
      orders.length === 0 &&
      JSON.stringify(defaultQueryParams) === JSON.stringify(queryParams)
    ) {
      setHasNoOrders(true);
    }
  }, [orders, defaultQueryParams, queryParams, isLoading]);

  const handleChangeQueryParams = (field, value) => {
    setQueryParams((prevState) => {
      // Reset to page 1 when changing filters
      if (field !== "page") {
        return { ...prevState, [field]: value, page: 1 };
      }
      return { ...prevState, [field]: value };
    });
    setLastFilterField(field);
  };

  const handleSavePeriodHistory = (startDate, endDate) => {
    // nunggu nanti API nya udh bener
    // savePeriodHistory({ startDate, endDate });
  };

  if (!mounted) return null;

  return (
    <LaporanPermintaanDibatalkan
      isLoading={isLoading}
      orders={orders}
      pagination={pagination}
      periodHistory={periodHistory}
      hasNoOrders={hasNoOrders}
      queryParams={queryParams}
      lastFilterField={lastFilterField}
      currentPeriodValue={currentPeriodValue}
      setCurrentPeriodValue={setCurrentPeriodValue}
      onChangeQueryParams={handleChangeQueryParams}
      onSavePeriodHistory={handleSavePeriodHistory}
    />
  );
};

export default Page;
