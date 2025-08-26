"use client";

import { useState } from "react";

import DaftarPesanan from "@/container/Transporter/DaftarPesanan/DaftarPesanan";
import useDevice from "@/hooks/use-device";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";
import { useGetOrderList } from "@/services/Transporter/daftar-pesanan/getOrderList";
import { useGetOrdersCountByStatus } from "@/services/Transporter/daftar-pesanan/getOrdersCountByStatus";
import {
  ORDER_STATUS,
  getOrderStatusConfig,
} from "@/utils/Transporter/orderStatus";

const DaftarPesananPage = () => {
  const { mounted } = useDevice();
  const { t } = useTranslation();

  const defaultQueryParams = {
    page: 1,
    limit: 10,
    status: "",
    search: "",
    period: "ALL_PERIODS",
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
    // Handle period parameter
    if (queryParams.period) {
      params.append("period", queryParams.period);
    }
    // Handle dates - both can be provided individually
    if (queryParams.startDate) {
      params.append("startDate", queryParams.startDate);
    }
    if (queryParams.endDate) {
      params.append("endDate", queryParams.endDate);
    }
    if (queryParams.search && queryParams.search.trim() !== "") {
      params.append("search", queryParams.search);
    }
    if (queryParams.sort) {
      params.append("sort", queryParams.sort);
    }
    if (queryParams.order) {
      params.append("order", queryParams.order);
    }
    return params.toString();
  }, [queryParams, currentPeriodValue]);

  const {
    data: { isFirstTimer = true, orders = [], pagination = {} } = {},
    isLoading,
  } = useGetOrderList(queryString);
  // TODO: Replace with actual userId from auth context/store
  const userId = "user-id-placeholder"; // This should come from authentication context
  const { data: { statusCounts = {} } = {} } =
    useGetOrdersCountByStatus(userId);

  const recentSelections = [
    {
      label: t("AppMuatpartsAnalisaProdukHariIni"),
      value: 0,
    },
    {
      label: t("AppMuatpartsAnalisaProduk1MingguTerakhir"),
      value: 7,
    },
    {
      label: t("AppMuatpartsAnalisaProduk30HariTerakhir"),
      value: 30,
    },
    {
      label: t("AppMuatpartsAnalisaProduk90HariTerakhir"),
      value: 90,
    },
  ];

  // Tab options sesuai design
  const tabOptions = useShallowMemo(() => {
    return [
      { label: "Semua", value: "", count: statusCounts?.all },
      {
        label: `Perlu Respon Perubahan${statusCounts?.NEED_RESPONSE_CHANGE > 0 ? ` (${statusCounts?.NEED_RESPONSE_CHANGE})` : ""}`,
        value: "NEED_RESPONSE_CHANGE",
        count: statusCounts?.NEED_RESPONSE_CHANGE,
      },
      {
        label: `Perlu Konfirmasi Siap${statusCounts?.NEED_CONFIRMATION_READY > 0 ? ` (${statusCounts?.NEED_CONFIRMATION_READY})` : ""}`,
        value: ORDER_STATUS.NEED_CONFIRMATION_READY,
        count: statusCounts?.NEED_CONFIRMATION_READY,
      },
      {
        label: `Perlu Assign Armada${statusCounts?.NEED_ASSIGN_FLEET > 0 ? ` (${statusCounts?.NEED_ASSIGN_FLEET})` : ""}`,
        value: ORDER_STATUS.NEED_ASSIGN_FLEET,
        count: statusCounts?.NEED_ASSIGN_FLEET,
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
        "NEED_RESPONSE_CHANGE",
        ORDER_STATUS.NEED_CONFIRMATION_READY,
        ORDER_STATUS.LOADING,
        ORDER_STATUS.UNLOADING,
        ORDER_STATUS.PREPARE_DOCUMENT,
        ORDER_STATUS.DOCUMENT_DELIVERY,
        ORDER_STATUS.COMPLETED,
      ].map((item) => ({
        value: item,
        label:
          getOrderStatusConfig(t)[
            item === "NEED_RESPONSE_CHANGE"
              ? ORDER_STATUS.NEED_CHANGE_RESPONSE
              : item
          ].label,
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
