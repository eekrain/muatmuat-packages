// hooks/use-orders-page.js
import { useState } from "react";

import useDevice from "@/hooks/use-device";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useSWRHook } from "@/hooks/use-swr";
import { useTranslation } from "@/hooks/use-translation";

import { useShallowMemo } from "./use-shallow-memo";

/**
 * Custom hook for order pages with shared query logic
 * @param {Object} options - Configuration options
 * @param {boolean} options.defaultPage - Whether it is all order list page or not
 * @param {boolean} options.requiresConfirmation - Whether to filter for orders requiring confirmation
 * @param {string} options.status - Optional status filter
 * @returns {Object} - Page data and handlers
 */
const useOrderListPage = (options = {}) => {
  const {
    defaultPage = false,
    requiresConfirmation = false,
    status = null,
  } = options;

  const { t } = useTranslation();
  const { isMobile, mounted } = useDevice();
  const defaultQueryParams = defaultPage
    ? {
        page: 1,
        limit: 10,
        status: "",
        search: "",
        startDate: null,
        endDate: null,
        sort: "",
        order: "",
      }
    : {
        search: "",
        sort: "",
        order: "",
      };
  const [queryParams, setQueryParams] = useState(defaultQueryParams);
  const [lastFilterField, setLastFilterField] = useState("");
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null); // Track currently selected period
  const [hasNoOrders, setHasNoOrders] = useState(false);

  // Transform state into query string using useMemo
  const queryString = useShallowMemo(() => {
    const params = new URLSearchParams();

    // Only add parameters with valid values
    if (defaultPage) {
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
      if (queryParams.startDate) {
        params.append("startDate", queryParams.startDate);
      }
      if (queryParams.endDate) {
        params.append("endDate", queryParams.endDate);
      }
    }
    if (queryParams.search && queryParams.search.length >= 3) {
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
  }, [queryParams, requiresConfirmation, status, defaultPage]);

  const { data: settlementAlertInfoData } = useSWRHook(
    defaultPage ? "v1/orders/settlement/alert-info" : null
  );
  // Fetch orders data
  const { data: ordersData, isLoading: isOrdersLoading } = useSWRHook(
    `v1/orders/list?${queryString}`
  );
  const { data: countByStatusData } = useSWRHook(
    defaultPage ? "v1/orders/count-by-status" : null
  );
  const settlementAlertInfo = settlementAlertInfoData?.Data || [];
  const orders = ordersData?.Data?.orders || [];
  const countByStatus = countByStatusData?.Data?.statusCounts || {};

  // Use the pagination from API response
  const pagination = defaultPage
    ? ordersData?.Data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
      }
    : null;

  const statusTabOptions = useShallowMemo(
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

  // Updated options with new structure
  const statusRadioOptions = isMobile
    ? [
        {
          key: "status",
          label: t("labelStatus"),
          children: [
            { value: "PREPARE_FLEET", label: "Mempersiapkan Armada" },
            { value: "CONFIRMED", label: t("labelPesananTerkonfirmasi") },
            { value: "SCHEDULED_FLEET", label: t("labelArmadaDijadwalkan") },
            { value: "WAITING_PAYMENT", label: "Menunggu Pembayaran" },
            { value: "WAITING_REPAYMENT", label: "Menunggu Pelunasan" },
            { value: "LOADING", label: t("labelProsesMuat") },
            { value: "UNLOADING", label: t("labelProsesBongkar") },
            {
              value: "PREPARE_DOCUMENT",
              label: t("labelDokumenSedangDisiapkan"),
            },
            {
              value: "PREPARE_FLEET_CHANGES",
              label: "Proses Pergantian Armada",
            },
            {
              value: "DOCUMENT_DELIVERY",
              label: "Proses Pengiriman Dokumen",
            },
            { value: "CANCELED", label: t("labelDibatalkan") },
            { value: "COMPLETED", label: t("labelSelesai") },
          ],
        },
      ]
    : [
        {
          key: "status",
          label: t("labelStatus"),
          children: [
            { value: "CONFIRMED", label: t("labelPesananTerkonfirmasi") },
            { value: "SCHEDULED_FLEET", label: t("labelArmadaDijadwalkan") },
            { value: "LOADING", label: t("labelProsesMuat") },
            { value: "UNLOADING", label: t("labelProsesBongkar") },
            {
              value: "PREPARE_DOCUMENT",
              label: t("labelDokumenSedangDisiapkan"),
            },
            { value: "COMPLETED", label: t("labelSelesai") },
            { value: "CANCELED", label: t("labelDibatalkan") },
          ],
        },
      ];

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
    if (defaultPage) {
      setCurrentPeriodValue((prevState) =>
        field === "search"
          ? { name: "Semua Periode (Default)", value: "", format: "day" }
          : prevState
      );
      setLastFilterField(field);
    }
  };

  if (defaultPage) {
    return {
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
    };
  }

  return {
    mounted,
    isMobile,
    queryParams,
    lastFilterField,
    orders,
    handleChangeQueryParams,
  };
};

export default useOrderListPage;
