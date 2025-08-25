"use client";

import { useState } from "react";

import DaftarPesanan from "@/container/Transporter/DaftarPesanan/DaftarPesanan";
import useDevice from "@/hooks/use-device";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { formatDateToDDMonYYYY } from "@/lib/utils/dateFormat";
import { useGetOrderList } from "@/services/Transporter/daftar-pesanan/getOrderList";
import { useGetOrdersCountByStatus } from "@/services/Transporter/daftar-pesanan/getOrdersCountByStatus";
import {
  ORDER_STATUS,
  ORDER_STATUS_CONFIG,
} from "@/utils/Transporter/orderStatus";

const DaftarPesananPage = () => {
  const { mounted } = useDevice();

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
  const [currentPeriodValue, setCurrentPeriodValue] = useState(null);
  const [filterType, setFilterType] = useState("");

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

  const {
    data: { isFirstTimer = true, orders = [], pagination = {} } = {},
    isLoading,
  } = useGetOrderList(queryString);
  const { data: { statusCounts = {} } = {} } = useGetOrdersCountByStatus();

  const recentSelections = useShallowMemo(() => {
    return [
      {
        start_date: "2025-08-01",
        end_date: "2025-08-31",
        searched_at: "2025-01-20T10:00:00Z",
      },
      {
        start_date: "2025-06-02",
        end_date: "2025-08-03",
        searched_at: "2025-01-20T10:00:00Z",
      },
      {
        start_date: "2025-06-04",
        end_date: "2025-08-12",
        searched_at: "2025-01-20T10:00:00Z",
      },
    ].map((item) => ({
      name: `${formatDateToDDMonYYYY(item.start_date)} - ${formatDateToDDMonYYYY(item.end_date)}`,
      value: `${formatDateToDDMonYYYY(item.start_date)} - ${formatDateToDDMonYYYY(item.end_date)}`,
      start_date: formatDateToDDMonYYYY(item.start_date),
      end_date: formatDateToDDMonYYYY(item.end_date),
    }));
  }, []);

  // Tab options sesuai design
  const tabOptions = useShallowMemo(() => {
    return [
      { label: "Semua", value: "", count: statusCounts?.all },
      {
        label: `Perlu Respon Perubahan${statusCounts?.needsChangeResponse > 0 ? ` (${statusCounts?.needsChangeResponse})` : ""}`,
        value: ORDER_STATUS.NEED_CHANGE_RESPONSE,
        count: statusCounts?.needsChangeResponse,
      },
      {
        label: `Perlu Konfirmasi Siap${statusCounts?.needsReadyConfirmation > 0 ? ` (${statusCounts?.needsReadyConfirmation})` : ""}`,
        value: ORDER_STATUS.NEED_CONFIRMATION_READY,
        count: statusCounts?.needsReadyConfirmation,
      },
      {
        label: `Perlu Assign Armada${statusCounts?.needsFleetAssignment > 0 ? ` (${statusCounts?.needsFleetAssignment})` : ""}`,
        value: ORDER_STATUS.NEED_ASSIGN_FLEET,
        count: statusCounts?.needsFleetAssignment,
      },
    ];
  }, [statusCounts]);

  // Status radio options untuk hierarchical filter
  const statusRadioOptions = [
    {
      key: "status",
      label: "Status",
      children: [
        ORDER_STATUS.WAITING_CONFIRMATION_SHIPPER,
        ORDER_STATUS.NEED_CHANGE_RESPONSE,
        ORDER_STATUS.NEED_CONFIRMATION_READY,
        ORDER_STATUS.LOADING,
        ORDER_STATUS.UNLOADING,
        ORDER_STATUS.PREPARE_DOCUMENT,
        ORDER_STATUS.DOCUMENT_DELIVERY,
        ORDER_STATUS.COMPLETED,
      ].map((item) => ({
        value: item,
        label: ORDER_STATUS_CONFIG[item].label,
      })),
    },
  ];

  const handleChangeQueryParams = (field, value) => {
    setQueryParams((prevState) => {
      // Reset to page 1 when changing filters
      if (field !== "page") {
        return { ...prevState, [field]: value, page: 1 };
      }
      return { ...prevState, [field]: value };
    });
    setLastFilterField(field);
    // if (defaultPage) {
    //   setCurrentPeriodValue((prevState) =>
    //     field === "search"
    //       ? { name: "Semua Periode (Default)", value: "", format: "day" }
    //       : prevState
    //   );
    //   setLastFilterField(field);
    // }
  };

  if (!mounted) return null;

  return (
    <DaftarPesanan
      isLoading={isLoading}
      isFirstTimer={isFirstTimer}
      orders={orders}
      pagination={pagination}
      tabOptions={tabOptions}
      statusRadioOptions={statusRadioOptions}
      recentSelections={recentSelections}
      queryParams={queryParams}
      lastFilterField={lastFilterField}
      currentPeriodValue={currentPeriodValue}
      setCurrentPeriodValue={setCurrentPeriodValue}
      filterType={filterType}
      setFilterType={setFilterType}
      onChangeQueryParams={handleChangeQueryParams}
    />
  );
};

export default DaftarPesananPage;
