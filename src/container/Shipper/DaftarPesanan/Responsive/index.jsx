"use client";

import { useState } from "react";

import ListScreen from "@/container/Shipper/DaftarPesanan/Responsive/List/ListScreen";
import StatusFilterScreen from "@/container/Shipper/DaftarPesanan/Responsive/StatusFilter/StatusFilterScreen";
import {
  ResponsiveProvider,
  ResponsiveRoute,
} from "@/lib/responsive-navigation";

const DaftarPesananResponsive = ({
  queryParams,
  onChangeQueryParams,
  orders,
  pagination,
  isOrdersLoading,
  settlementAlertInfo,
  hasNoOrders,
  lastFilterField,
  statusTabOptions,
  statusRadioOptions,
}) => {
  const [isFiltering, setFiltering] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <ResponsiveProvider>
      <ResponsiveRoute
        path="/"
        component={
          <ListScreen
            queryParams={queryParams}
            onChangeQueryParams={onChangeQueryParams}
            orders={orders}
            pagination={pagination}
            isOrdersLoading={isOrdersLoading}
            settlementAlertInfo={settlementAlertInfo}
            hasNoOrders={hasNoOrders}
            lastFilterField={lastFilterField}
            statusTabOptions={statusTabOptions}
            setFiltering={setFiltering}
            filterType={filterType}
            setFilterType={setFilterType}
          />
        }
      />
      <ResponsiveRoute
        path="/StatusFilter"
        component={
          <StatusFilterScreen
            onChangeQueryParams={onChangeQueryParams}
            statusRadioOptions={statusRadioOptions}
            isFiltering={isFiltering}
            setFilterType={setFilterType}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        }
      />
    </ResponsiveProvider>
  );
};

export default DaftarPesananResponsive;
