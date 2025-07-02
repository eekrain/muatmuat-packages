"use client";

import { useMemo, useState } from "react";

import ButuhKonfirmasiAndaWeb from "@/container/ButuhKonfirmasiAnda/Web";
import useDevice from "@/hooks/use-device";
import { useSWRHook } from "@/hooks/use-swr";

const Page = () => {
  const { isMobile, mounted } = useDevice();
  const [queryParams, setQueryParams] = useState({
    search: "",
    sort: "",
    order: "",
  });

  // Transform state into query string using useMemo
  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    // Only add parameters with valid values
    if (queryParams.search) {
      params.append("search", queryParams.search);
    }
    if (queryParams.sort) {
      params.append("sort", queryParams.sort);
    }
    if (queryParams.order) {
      params.append("order", queryParams.order);
    }
    params.append("requiresConfirmation", true);

    return params.toString();
  }, [queryParams]);
  // Fetch orders data
  const { data: ordersData } = useSWRHook(`v1/orders/list?${queryString}`);

  const orders = ordersData?.Data?.orders || [];

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
    <ButuhKonfirmasiAndaWeb
      queryParams={queryParams}
      onChangeQueryParams={handleChangeQueryParams}
      orders={orders}
    />
  );
};

export default Page;
