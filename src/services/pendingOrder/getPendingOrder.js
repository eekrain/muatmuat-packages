// hooks/use-orders-page.js
import { useMemo, useState } from "react";

import useDevice from "@/hooks/use-device";
import { useSWRHook } from "@/hooks/use-swr";

/**
 * Custom hook for order pages with shared query logic
 * @param {Object} options - Configuration options
 * @param {boolean} options.requiresConfirmation - Whether to filter for orders requiring confirmation
 * @param {string} options.status - Optional status filter
 * @returns {Object} - Page data and handlers
 */
export default function usePendingOrdersPage(options = {}) {
  const { requiresConfirmation = false, status = null } = options;

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

    // Add conditional parameters based on options
    if (requiresConfirmation) {
      params.append("requiresConfirmation", true);
    }
    if (status) {
      params.append("status", status);
    }

    return params.toString();
  }, [queryParams, requiresConfirmation, status]);

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

  return {
    isMobile,
    mounted,
    queryParams,
    orders,
    handleChangeQueryParams,
  };
}
