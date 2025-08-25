"use client";

import { useEffect, useState } from "react";

import DashboardSection from "@/app/transporter/(main)/dashboard/real-time/components/DashboardSection";
import IncomeCards from "@/app/transporter/(main)/dashboard/real-time/components/IncomeCards";
import SkeletonLoading from "@/app/transporter/(main)/dashboard/real-time/components/SkeletonLoading";
import StatCard from "@/app/transporter/(main)/dashboard/real-time/components/StatCard";
import SuspendedAccountAlert from "@/app/transporter/(main)/dashboard/real-time/components/SuspendedAccountAlert";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useTranslation } from "@/hooks/use-translation";
import { useGetSosReports } from "@/services/Transporter/dashboard/getSosReports";

const RealtimeDashboardPage = () => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [accountStatus, setAccountStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SOS Reports data
  const {
    data: sosReportsData,
    isLoading: sosReportsLoading,
    isError: sosReportsError,
  } = useGetSosReports();

  // NOTE: pesananLabel, alertLabel, and contents objects are removed as they are now handled by t() directly.

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/v1/dashboard/summary");
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        const result = await response.json();

        setDashboardData(result.Data.summary);
        setAccountStatus(result.Data.accountStatus);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(
          t(
            "RealtimeDashboardPage.messageErrorLoad",
            {},
            "Gagal memuat data dashboard. Silakan coba lagi nanti."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(intervalId);
  }, [t]);

  if (loading) {
    return <SkeletonLoading />;
  }

  if (error && !dashboardData) {
    return (
      <div className="p-8 text-center text-lg font-semibold text-error-500">
        {error}
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const contentMap = {
    orders: {
      waitingConfirmation: {
        href: "/daftar-pesanan?status=waitingConfirmation",
        openNewTab: true,
        side: "right",
      },
      confirmed: {
        href: "/daftar-pesanan?status=confirmed",
        openNewTab: true,
        side: "right",
      },
      scheduled: {
        href: "/daftar-pesanan?status=scheduled",
        openNewTab: true,
        side: "top",
      },
      loading: {
        href: "/daftar-pesanan?status=loading",
        openNewTab: true,
        side: "left",
      },
      unloading: {
        href: "/daftar-pesanan?status=unloading",
        openNewTab: true,
        side: "top",
      },
      documentPreparation: {
        href: "/daftar-pesanan?status=documentPreparation",
        openNewTab: true,
        side: "top",
      },
      documentDelivery: {
        href: "/daftar-pesanan?status=documentDelivery",
        openNewTab: true,
        side: "top",
      },
      completed: {
        href: "/daftar-pesanan?status=completed",
        openNewTab: true,
        side: "left",
      },
    },
    alerts: {
      needResponse: {
        href: "/daftar-pesanan?status=needResponse",
        openNewTab: true,
        side: "top",
      },
      needConfirmation: {
        href: "/daftar-pesanan?status=needConfirmation",
        openNewTab: true,
        side: "top",
      },
      needAssignment: {
        href: "/daftar-pesanan?status=needAssignment",
        openNewTab: true,
        side: "top",
      },
      newReviews: { href: "/dashboard/real-time/ulasan", side: "left" },
      sosReports: {
        href: "/monitoring?tabActive=sos",
        openNewTab: true,
        side: "top",
      },
    },
  };

  return (
    <div className="space-y-4 pb-6">
      <PageTitle withBack={false}>
        {t("RealtimeDashboardPage.titlePage", {}, "Dashboard Real-time")}
      </PageTitle>

      <SuspendedAccountAlert status={accountStatus} />

      <DashboardSection
        title={t("RealtimeDashboardPage.titleOrders", {}, "Pesanan")}
        subtitle={t(
          "RealtimeDashboardPage.subtitleOrders",
          {},
          "Informasi pesanan dan status pengiriman yang perlu kamu pantau"
        )}
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.entries(dashboardData.orders).map(([key, data]) => (
            <StatCard
              key={key}
              label={t(
                `RealtimeDashboardPage.ordersLabel${key.charAt(0).toUpperCase() + key.slice(1)}`
              )}
              value={data.count}
              href={contentMap.orders[key].href}
              openNewTab={contentMap.orders[key].openNewTab}
              tooltipText={t(
                `RealtimeDashboardPage.ordersTooltip${key.charAt(0).toUpperCase() + key.slice(1)}`
              )}
              side={contentMap.orders[key].side}
            />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection
        title={t("RealtimeDashboardPage.titleIncome", {}, "Pendapatan")}
        subtitle={t(
          "RealtimeDashboardPage.subtitleIncome",
          {},
          "Informasi potensi pendapatan dan status pencairan yang kamu dapatkan"
        )}
      >
        <IncomeCards data={dashboardData.earnings} />
      </DashboardSection>

      <DashboardSection
        title={t(
          "RealtimeDashboardPage.titleNeedsAttention",
          {},
          "Yang Perlu Diperhatikan"
        )}
        subtitle={t(
          "RealtimeDashboardPage.subtitleNeedsAttention",
          {},
          "Aktivitas yang perlu kamu perhatikan untuk jaga kepuasan Shipper"
        )}
        className="bg-[#FFECB4]"
      >
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(dashboardData.alerts).map(([key, data]) => {
            // Override sosReports data with real SOS data if available
            if (key === "sosReports" && sosReportsData?.summary) {
              return (
                <StatCard
                  key={key}
                  label={t(
                    `RealtimeDashboardPage.alertsLabel${key.charAt(0).toUpperCase() + key.slice(1)}`,
                    {},
                    "Laporan SOS"
                  )}
                  href={contentMap.alerts[key].href}
                  openNewTab={contentMap.alerts[key].openNewTab}
                  value={sosReportsData.summary.activeReports}
                  tooltipText={t(
                    `RealtimeDashboardPage.alertsTooltip${key.charAt(0).toUpperCase() + key.slice(1)}`,
                    {},
                    `${sosReportsData.summary.activeReports} laporan SOS aktif, ${sosReportsData.summary.resolvedReports} telah diselesaikan. Rata-rata waktu respon: ${sosReportsData.summary.averageResponseTime}`
                  )}
                  side={contentMap.alerts[key].side}
                  icon="/icons/sos-alert.svg"
                  variant={
                    sosReportsData.summary.activeReports > 0 ? "alert" : "soft"
                  }
                />
              );
            }

            return (
              <StatCard
                key={key}
                label={t(
                  `RealtimeDashboardPage.alertsLabel${key.charAt(0).toUpperCase() + key.slice(1)}`
                )}
                href={contentMap.alerts[key].href}
                openNewTab={contentMap.alerts[key].openNewTab}
                value={data.count}
                tooltipText={t(
                  `RealtimeDashboardPage.alertsTooltip${key.charAt(0).toUpperCase() + key.slice(1)}`
                )}
                side={contentMap.alerts[key].side}
              />
            );
          })}
        </div>
      </DashboardSection>

      <DashboardSection
        title={t("RealtimeDashboardPage.titlePerformance", {}, "Performa Kamu")}
        subtitle={t(
          "RealtimeDashboardPage.subtitlePerformance",
          {},
          "Aktivitas yang perlu kamu perhatikan untuk jaga kepuasan Shipper, pantau dan tingkatkan terus kualitas pengiriman kamu"
        )}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            label={t(
              "RealtimeDashboardPage.performanceLabelOverallRating",
              {},
              "Rating Driver Keseluruhan"
            )}
            value={dashboardData.performance.overallRating}
            valueUnit="/5"
            href="/dashboard/real-time/rating-driver"
            icon="/icons/star.svg"
            labelIcon="/icons/star_icon.svg"
            tooltipText={t(
              "RealtimeDashboardPage.performanceTooltipOverallRating",
              {},
              "Rating merupakan nilai rata-rata dari semua penilaian yang diberikan pengguna terhadap driver yang telah selesai"
            )}
            side="top"
            variant="soft"
          />
          <StatCard
            label={t(
              "RealtimeDashboardPage.performanceLabelCancelledOrders",
              {},
              "Pesanan Dibatalkan"
            )}
            value={dashboardData.performance.cancelledOrders}
            valueUnit={t(
              "RealtimeDashboardPage.performanceUnitOrders",
              {},
              " Pesanan"
            )}
            icon="/icons/cancel-circle.svg"
            href="/daftar-pesanan?status=cancelledOrders"
            openNewTab={true}
            tooltipText={t(
              "RealtimeDashboardPage.performanceTooltipCancelledOrders",
              {},
              "Jumlah Pesanan Jasa Angkut yang Dibatalkan, Kamu Lihat Detail untuk Informasi Lebih Lengkap Terkait Pembatalan"
            )}
            side="left"
            variant="soft"
          />
          <StatCard
            label={t(
              "RealtimeDashboardPage.performanceLabelPenalties",
              {},
              "Jumlah Penalti"
            )}
            value={dashboardData.performance.penalties}
            valueUnit={t(
              "RealtimeDashboardPage.performanceUnitPenalties",
              {},
              " Penalti"
            )}
            icon="/icons/danger-triangle.svg"
            href="/dashboard/real-time/penalti"
            tooltipText={t(
              "RealtimeDashboardPage.performanceTooltipPenalties",
              {},
              "Jumlah poin penalti yang kamu terima dari pembatalan pesanan"
            )}
            side="top"
            variant="soft"
          />
        </div>
      </DashboardSection>
    </div>
  );
};

export default RealtimeDashboardPage;
