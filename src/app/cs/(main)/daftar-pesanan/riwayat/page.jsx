"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import Period from "@/app/transporter/(main)/dashboard/real-time/components/Period";
import Button from "@/components/Button/Button";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import PageTitle from "@/components/PageTitle/PageTitle";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import { useTranslation } from "@/hooks/use-translation";

import RiwayatTab from "../components/RiwayatTab";

const DaftarPesananPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [forceFirstTimer] = useState(false);
  const [forceEmpty] = useState(false);
  const [useMockData] = useState(true);
  const [userRole] = useState("GM");

  const [dashboardData, setDashboardData] = useState({
    active: 0,
    history: 0,
    urgentCounts: {},
  });
  const [period, setPeriod] = useState(null);
  const [recentPeriodOptions, setRecentPeriodOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(true);
  const [lastAction, setLastAction] = useState("initial");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const endpoint = useMockData
        ? "/api/v1/cs/dashboard"
        : "/v1/cs/dashboard";
      try {
        const response = await fetch(endpoint);
        const result = await response.json();
        if (result.Data) {
          setDashboardData({
            active: result.Data.orderCounts?.active || 0,
            history: result.Data.orderCounts?.history || 0,
            urgentCounts: result.Data.urgentCounts || {},
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, [useMockData]);

  const periodOptions = useMemo(
    () => [
      { name: t("daftarPesanan.periodAll", {}, "Semua Periode"), value: "" },
      { name: t("daftarPesanan.periodToday", {}, "Hari Ini"), value: 0 },
      {
        name: t("daftarPesanan.periodWeek", {}, "1 Minggu Terakhir"),
        value: 7,
      },
      {
        name: t("daftarPesanan.periodMonth", {}, "30 Hari Terakhir"),
        value: 30,
      },
      {
        name: t("daftarPesanan.period3Month", {}, "90 Hari Terakhir"),
        value: 90,
      },
      {
        name: t("daftarPesanan.periodYear", {}, "1 Tahun Terakhir"),
        value: 365,
      },
    ],
    [t]
  );

  useEffect(() => {
    if (periodOptions.length > 0 && !period) {
      setPeriod(periodOptions[0]);
    }
  }, [periodOptions, period]);

  const isFirstTimer =
    forceFirstTimer ||
    (!isLoading &&
      dashboardData.active === 0 &&
      dashboardData.history === 0 &&
      lastAction === "initial");
  const isEmptyState =
    forceEmpty || (!isFirstTimer && !hasData && lastAction === "initial");

  const disableDownloadButton = isLoading || !hasData;
  const disableUploadButton = isLoading || !hasData;
  const disablePeriodButton =
    isLoading ||
    (!hasData &&
      lastAction !== "period" &&
      period?.value === periodOptions?.[0]?.value);

  const renderEmpty = () => {
    if (isEmptyState) {
      return (
        <DataEmpty
          title={t(
            "daftarPesanan.emptyActiveTitle",
            {},
            "Daftar Pesanan Aktif Masih Kosong"
          )}
          subtitle=""
          className="h-[304px]"
        />
      );
    } else if (isFirstTimer) {
      return (
        <DataEmpty
          title={t("daftarPesanan.firstTimerTitle", {}, "Belum Ada Pesanan")}
          subtitle=""
          className="h-[280px]"
        />
      );
    }
    return null;
  };

  const handleSelectPeriod = (selectedOption) => {
    if (selectedOption?.range) {
      if (
        !recentPeriodOptions.some((item) => item.value === selectedOption.value)
      ) {
        setRecentPeriodOptions((prev) => [selectedOption, ...prev].slice(0, 3));
      }
    }
    setPeriod(selectedOption);
  };

  return (
    <div className="mx-auto max-h-screen w-full max-w-[1280px] space-y-4 px-6 py-6">
      <PageTitle withBack={false}>
        {t("daftarPesanan.title", {}, "Daftar Pesanan")}
      </PageTitle>
      <Tabs value="riwayat" className="w-full">
        {!isFirstTimer && (
          <div className="flex items-center justify-between">
            <TabsList className="w-[380px]">
              <TabsTriggerWithSeparator
                value="pesanan-aktif"
                activeColor="primary-700"
                className={"!text-base"}
                onClick={() => router.push("/daftar-pesanan/pesanan-aktif")}
              >
                {t("daftarPesanan.tabActive", {}, "Pesanan Aktif")}
              </TabsTriggerWithSeparator>
              <TabsTriggerWithSeparator
                value="riwayat"
                activeColor="primary-700"
                showSeparator={false}
                className={"!text-base"}
              >
                {t("daftarPesanan.tabHistory", {}, "Riwayat")}
                {dashboardData.history > 0 ? ` (${dashboardData.history})` : ""}
              </TabsTriggerWithSeparator>
            </TabsList>
            {!isEmptyState && (
              <div className="flex items-center gap-3">
                <div className="w-[200px]">
                  <Period
                    value={period}
                    onSelect={handleSelectPeriod}
                    options={periodOptions}
                    recentSelections={recentPeriodOptions}
                    disable={disablePeriodButton}
                  />
                </div>
                {/* <Button
                  variant="muattrans-primary-secondary"
                  disabled={disableUploadButton}
                >
                  {t("daftarPesanan.buttonUploadReceipt", {}, "Unggah Resi")}
                </Button> */}
                <Button
                  variant="muattrans-primary"
                  disabled={disableDownloadButton}
                  iconLeft="/icons/download16.svg"
                >
                  {t("daftarPesanan.buttonDownload", {}, "Unduh")}
                </Button>
              </div>
            )}
          </div>
        )}
        <TabsContent value="riwayat" className="pt-4">
          {isFirstTimer || isEmptyState ? (
            renderEmpty()
          ) : (
            <RiwayatTab
              useMockData={useMockData}
              userRole={userRole}
              period={period}
              urgentCounts={dashboardData.urgentCounts}
              setIsLoading={setIsLoading}
              setHasData={setHasData}
              setLastAction={setLastAction}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DaftarPesananPage;
