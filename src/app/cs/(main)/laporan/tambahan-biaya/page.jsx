"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import LaporanTambahanBiaya from "@/container/CS/LaporanTambahanBiaya/LaporanTambahanBiaya";
import useDevice from "@/hooks/use-device";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useGetAdditionalCostReports } from "@/services/CS/laporan/tambahan-biaya/getAdditionalCostReports";
import { useGetFilterOptions } from "@/services/CS/laporan/tambahan-biaya/getFilterOptions";
import { useGetPeriodHistory } from "@/services/CS/laporan/tambahan-biaya/getPeriodHistory";

const Page = () => {
  const { mounted } = useDevice();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const router = useRouter();

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
  const [activeTab, setActiveTab] = useState("active");
  const [hasNoReports, setHasNoReports] = useState(false);

  const additionalCostReportsQueryString = useShallowMemo(() => {
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

  const filterOptionsQueryString = useShallowMemo(() => {
    const params = new URLSearchParams();
    params.append("report_type", activeTab);
    return params.toString();
  }, [activeTab]);

  const { data: { reports = [], pagination = null } = {}, isLoading } =
    useGetAdditionalCostReports(additionalCostReportsQueryString);
  const {
    data: { history: periodHistory = [] } = {},
    mutate: refetchPeriodHistory,
  } = useGetPeriodHistory();
  const { data: filterOptions = null } = useGetFilterOptions(
    filterOptionsQueryString
  );

  useShallowCompareEffect(() => {
    if (tab) {
      setActiveTab(tab);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("tab");
      router.replace(`?${newSearchParams.toString()}`, { shallow: true });
    }
  }, [tab, searchParams]);

  useShallowCompareEffect(() => {
    if (
      !isLoading &&
      reports.length === 0 &&
      JSON.stringify(defaultQueryParams) === JSON.stringify(queryParams)
    ) {
      setHasNoReports(true);
    }
  }, [reports, defaultQueryParams, queryParams, isLoading]);

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
    <LaporanTambahanBiaya
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isLoading={isLoading}
      reports={reports}
      pagination={pagination}
      periodHistory={periodHistory}
      filterOptions={filterOptions}
      hasNoReports={hasNoReports}
      lastFilterField={lastFilterField}
      onChangeQueryParams={handleChangeQueryParams}
    />
  );
};

export default Page;
