// hooks/use-orders-page.js
import { useMemo, useState } from "react";

import { useGetCountByStatus } from "@/services/Shipper/daftarpesanan/getCountByStatus";
import { useGetOrderList } from "@/services/Shipper/daftarpesanan/getOrderList";
import { useGetSettlementInfo } from "@/services/Shipper/daftarpesanan/getSettementInfo";

import useDevice from "@/hooks/use-device";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useTranslation } from "@/hooks/use-translation";

import { useShallowMemo } from "./use-shallow-memo";

/**
 * Custom hook for order pages with shared query logic
 * @param {Object} options - Configuration options
 * @param {boolean} options.defaultPage - Whether it is all order list page or not. If true, returns additional pagination and filter-related states.
 * @param {boolean} options.requiresConfirmation - Whether to filter for orders requiring confirmation.
 * @param {string} options.status - Optional status filter.
 * @returns {Object} - Page data and handlers.
 * @returns {Object} If `options.defaultPage` is true:
 * @property {boolean} mounted - Indicates if the component is mounted.
 * @property {boolean} isMobile - Indicates if the device is mobile.
 * @property {Object} queryParams - Current query parameters state.
 * @property {string} lastFilterField - The last field that was filtered.
 * @property {boolean} hasNoOrders - True if no orders are found with current filters.
 * @property {Array} settlementAlertInfo - Data related to settlement alerts.
 * @property {Array} orders - List of orders.
 * @property {boolean} isOrdersLoading - Loading state for orders.
 * @property {Object} pagination - Pagination information for orders.
 * @property {Array} statusRadioOptions - Options for status radio buttons.
 * @property {Array} statusTabOptions - Options for status tabs.
 * @property {Object} currentPeriodValue - Currently selected period value.
 * @property {Function} setCurrentPeriodValue - Setter for current period value.
 * @property {Function} handleChangeQueryParams - Function to handle changes in query parameters.
 * @returns {Object} If `options.defaultPage` is false:
 * @property {boolean} mounted - Indicates if the component is mounted.
 * @property {boolean} isMobile - Indicates if the device is mobile.
 * @property {Object} queryParams - Current query parameters state.
 * @property {string} lastFilterField - The last field that was filtered.
 * @property {Array} orders - List of orders.
 * @property {Function} handleChangeQueryParams - Function to handle changes in query parameters.
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
  }, [queryParams, requiresConfirmation, status, defaultPage]);

  const { data: settlementAlertInfo = [] } = useGetSettlementInfo(defaultPage);
  // Fetch orders data
  const {
    data: { orders = [], pagination = {} } = {},
    isLoading: isOrdersLoading,
  } = useGetOrderList(queryString);
  const { data: countByStatus = {} } = useGetCountByStatus(defaultPage);

  const statusTabOptions = useMemo(
    () => [
      { value: "", label: t("useOrderListPage.allStatus", {}, "Semua") },
      {
        value: "WAITING_PAYMENT",
        label: t(
          "useOrderListPage.waitingPayment",
          { count: countByStatus?.waitingPayment || 0 },
          `Menunggu Pembayaran (${countByStatus?.waitingPayment || 0})`
        ),
      },
      {
        value: "WAITING_REPAYMENT",
        label: t(
          "useOrderListPage.waitingRepayment",
          { count: countByStatus?.awaitingSettlement || 0 },
          `Menunggu Pelunasan (${countByStatus?.awaitingSettlement || 0})`
        ),
      },
      {
        value: "DOCUMENT_SHIPPING",
        label: t(
          "useOrderListPage.documentShipping",
          { count: countByStatus?.documentProcess || 0 },
          `Proses Pengiriman Dokumen (${countByStatus?.documentProcess || 0})`
        ),
      },
    ],
    [countByStatus, t]
  );

  // Updated options with new structure
  const statusRadioOptions = isMobile
    ? [
        {
          key: "status",
          label: t("labelStatus"),
          children: [
            {
              value: "PREPARE_FLEET",
              label: t(
                "useOrderListPage.preparingFleet",
                {},
                "Mempersiapkan Armada"
              ),
            },
            { value: "CONFIRMED", label: t("labelPesananTerkonfirmasi") },
            { value: "SCHEDULED_FLEET", label: t("labelArmadaDijadwalkan") },
            {
              value: "WAITING_PAYMENT",
              label: t(
                "useOrderListPage.waitingPaymentSimple",
                {},
                "Menunggu Pembayaran"
              ),
            },
            {
              value: "WAITING_REPAYMENT",
              label: t(
                "useOrderListPage.waitingRepaymentSimple",
                {},
                "Menunggu Pelunasan"
              ),
            },
            { value: "LOADING", label: t("labelProsesMuat") },
            { value: "UNLOADING", label: t("labelProsesBongkar") },
            {
              value: "PREPARE_DOCUMENT",
              label: t("labelDokumenSedangDisiapkan"),
            },
            {
              value: "PREPARE_FLEET_CHANGES",
              label: t(
                "useOrderListPage.fleetChangeProcess",
                {},
                "Proses Pergantian Armada"
              ),
            },
            {
              value: "DOCUMENT_DELIVERY",
              label: t(
                "useOrderListPage.documentDeliveryProcess",
                {},
                "Proses Pengiriman Dokumen"
              ),
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
          ? {
              name: t(
                "useOrderListPage.allPeriodsDefault",
                {},
                "Semua Periode (Default)"
              ),
              value: "",
              format: "day",
            }
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
