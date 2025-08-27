"use client";

import { useRouter } from "next/navigation";

import DashboardSection from "@/app/transporter/(main)/dashboard/real-time/components/DashboardSection";
import IncomeCards from "@/app/transporter/(main)/dashboard/real-time/components/IncomeCards";
import SkeletonLoading from "@/app/transporter/(main)/dashboard/real-time/components/SkeletonLoading";
import StatCard from "@/app/transporter/(main)/dashboard/real-time/components/StatCard";
import SuspendedAccountAlert from "@/app/transporter/(main)/dashboard/real-time/components/SuspendedAccountAlert";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useTranslation } from "@/hooks/use-translation";
import { useGetAccountStatus } from "@/services/Transporter/account/getAccountStatus";
import { useGetSosReports } from "@/services/Transporter/alerts/getSosReports";
import { useGetDashboardMenuOptions } from "@/services/Transporter/dashboard/getDashboardMenuOptions";
import { useGetDashboardSummary } from "@/services/Transporter/dashboard/getDashboardSummary";
import { useGetFilteredOrders } from "@/services/Transporter/orders/getFilteredOrders";
import { useGetFilteredOrdersCompleted } from "@/services/Transporter/orders/getFilteredOrdersCompleted";
import { useGetFilteredOrdersConfirmed } from "@/services/Transporter/orders/getFilteredOrdersConfirmed";
import { useGetFilteredOrdersDocumentDelivery } from "@/services/Transporter/orders/getFilteredOrdersDocumentDelivery";
import { useGetFilteredOrdersDocumentPreparation } from "@/services/Transporter/orders/getFilteredOrdersDocumentPreparation";
import { useGetFilteredOrdersLoading } from "@/services/Transporter/orders/getFilteredOrdersLoading";
import { useGetFilteredOrdersScheduled } from "@/services/Transporter/orders/getFilteredOrdersScheduled";
import { useGetFilteredOrdersUnloading } from "@/services/Transporter/orders/getFilteredOrdersUnloading";

const RealtimeDashboardPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  // Dashboard Summary data using SWR hook
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isError: dashboardError,
    mutate: refreshDashboard,
  } = useGetDashboardSummary();

  // Account Status data using SWR hook
  const {
    data: accountStatusData,
    isLoading: accountStatusLoading,
    isError: accountStatusError,
    mutate: refreshAccountStatus,
  } = useGetAccountStatus();

  // SOS Reports data
  const {
    data: sosReportsData,
    isLoading: sosReportsLoading,
    isError: sosReportsError,
  } = useGetSosReports();

  // Dashboard Menu Options data using SWR hook
  const {
    data: menuOptionsData,
    isLoading: menuOptionsLoading,
    isError: menuOptionsError,
    mutate: refreshMenuOptions,
  } = useGetDashboardMenuOptions();

  // Filtered Orders data using SWR hooks for all statuses
  const {
    data: waitingConfirmationData,
    isLoading: waitingConfirmationLoading,
    isError: waitingConfirmationError,
    mutate: refreshWaitingConfirmation,
  } = useGetFilteredOrders({ page: 1, limit: 10 });

  const {
    data: confirmedData,
    isLoading: confirmedLoading,
    isError: confirmedError,
    mutate: refreshConfirmed,
  } = useGetFilteredOrdersConfirmed({ page: 1, limit: 10 });

  const {
    data: scheduledData,
    isLoading: scheduledLoading,
    isError: scheduledError,
    mutate: refreshScheduled,
  } = useGetFilteredOrdersScheduled({ page: 1, limit: 10 });

  const {
    data: loadingData,
    isLoading: loadingLoading,
    isError: loadingError,
    mutate: refreshLoading,
  } = useGetFilteredOrdersLoading({ page: 1, limit: 10 });

  const {
    data: unloadingData,
    isLoading: unloadingLoading,
    isError: unloadingError,
    mutate: refreshUnloading,
  } = useGetFilteredOrdersUnloading({ page: 1, limit: 10 });

  const {
    data: documentPreparationData,
    isLoading: documentPreparationLoading,
    isError: documentPreparationError,
    mutate: refreshDocumentPreparation,
  } = useGetFilteredOrdersDocumentPreparation({ page: 1, limit: 10 });

  const {
    data: documentDeliveryData,
    isLoading: documentDeliveryLoading,
    isError: documentDeliveryError,
    mutate: refreshDocumentDelivery,
  } = useGetFilteredOrdersDocumentDelivery({ page: 1, limit: 10 });

  const {
    data: completedData,
    isLoading: completedLoading,
    isError: completedError,
    mutate: refreshCompleted,
  } = useGetFilteredOrdersCompleted({ page: 1, limit: 10 });

  // Debug: Log menu options data
  console.log("🔍 Menu Options Data:", menuOptionsData);
  console.log("🔍 Menu Options Loading:", menuOptionsLoading);
  console.log("🔍 Menu Options Error:", menuOptionsError);

  // Navigation handler for waiting confirmation orders
  const handleWaitingConfirmationClick = () => {
    console.log("🚀 Navigating to waiting confirmation orders...");
    router.push("/daftar-pesanan?status=waitingConfirmation");
  };

  // Navigation handlers for all order statuses
  const handleConfirmedClick = () => {
    console.log("🚀 Navigating to confirmed orders...");
    router.push("/daftar-pesanan?status=confirmed");
  };

  const handleScheduledClick = () => {
    console.log("🚀 Navigating to scheduled orders...");
    router.push("/daftar-pesanan?status=scheduled");
  };

  const handleLoadingClick = () => {
    console.log("🚀 Navigating to loading orders...");
    router.push("/daftar-pesanan?status=loading");
  };

  const handleUnloadingClick = () => {
    console.log("🚀 Navigating to unloading orders...");
    router.push("/daftar-pesanan?status=unloading");
  };

  const handleDocumentPreparationClick = () => {
    console.log("🚀 Navigating to document preparation orders...");
    router.push("/daftar-pesanan?status=documentPreparation");
  };

  const handleDocumentDeliveryClick = () => {
    console.log("🚀 Navigating to document delivery orders...");
    router.push("/daftar-pesanan?status=documentDelivery");
  };

  const handleCompletedClick = () => {
    console.log("🚀 Navigating to completed orders...");
    router.push("/daftar-pesanan?status=completed");
  };

  // Loading state
  if (dashboardLoading) {
    return <SkeletonLoading />;
  }

  // Error state
  if (dashboardError && !dashboardData) {
    return (
      <div className="p-8 text-center text-lg font-semibold text-error-500">
        {t(
          "RealtimeDashboardPage.messageErrorLoad",
          {},
          "Gagal memuat data dashboard. Silakan coba lagi nanti."
        )}
      </div>
    );
  }

  // No data state
  if (!dashboardData) {
    return null;
  }

  const contentMap = {
    orders: {
      waitingConfirmation: {
        href: "/daftar-pesanan?status=waitingConfirmation",
        openNewTab: true,
        side: "right",
        onClick: handleWaitingConfirmationClick, // Add click handler
      },
      confirmed: {
        href: "/daftar-pesanan?status=confirmed",
        openNewTab: true,
        side: "right",
        onClick: handleConfirmedClick,
      },
      scheduled: {
        href: "/daftar-pesanan?status=scheduled",
        openNewTab: true,
        side: "top",
        onClick: handleScheduledClick,
      },
      loading: {
        href: "/daftar-pesanan?status=loading",
        openNewTab: true,
        side: "left",
        onClick: handleLoadingClick,
      },
      unloading: {
        href: "/daftar-pesanan?status=unloading",
        openNewTab: true,
        side: "top",
        onClick: handleUnloadingClick,
      },
      documentPreparation: {
        href: "/daftar-pesanan?status=documentPreparation",
        openNewTab: true,
        side: "top",
        onClick: handleDocumentPreparationClick,
      },
      documentDelivery: {
        href: "/daftar-pesanan?status=documentDelivery",
        openNewTab: true,
        side: "top",
        onClick: handleDocumentDeliveryClick,
      },
      completed: {
        href: "/daftar-pesanan?status=completed",
        openNewTab: true,
        side: "left",
        onClick: handleCompletedClick,
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

      <SuspendedAccountAlert accountStatusData={accountStatusData} />

      <DashboardSection
        title={t("RealtimeDashboardPage.titleOrders", {}, "Pesanan")}
        subtitle={t(
          "RealtimeDashboardPage.subtitleOrders",
          {},
          "Informasi pesanan dan status pengiriman yang perlu kamu pantau"
        )}
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.entries(dashboardData.sections.orders).map(([key, data]) => (
            <StatCard
              key={key}
              label={t(
                `RealtimeDashboardPage.ordersLabel${key.charAt(0).toUpperCase() + key.slice(1)}`
              )}
              value={data.count}
              href={contentMap.orders[key]?.href}
              openNewTab={contentMap.orders[key]?.openNewTab}
              tooltipText={data.tooltip}
              side={contentMap.orders[key]?.side}
              onClick={contentMap.orders[key]?.onClick} // Add onClick handler
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
        <IncomeCards data={dashboardData.sections.earnings} />
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
          {Object.entries(dashboardData.sections.alerts).map(([key, data]) => {
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
            value={dashboardData.sections.performance.overallRating}
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
            value={dashboardData.sections.performance.cancelledOrders}
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
            value={dashboardData.sections.performance.penalties}
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
