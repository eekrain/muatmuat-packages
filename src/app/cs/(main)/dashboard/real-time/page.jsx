"use client";

import { useEffect, useState } from "react";

import DashboardSection from "@/app/transporter/(main)/dashboard/real-time/components/DashboardSection";
import StatCard from "@/app/transporter/(main)/dashboard/real-time/components/StatCard";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useTranslation } from "@/hooks/use-translation";

import SkeletonLoading from "./components/SkeletonLoading";
import TransporterRatingCard from "./components/TransporterRatingCard";

const CSDashboardPage = () => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/v1/cs/dashboard/data");
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const result = await response.json();
        setDashboardData(result.Data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !dashboardData) {
    return <SkeletonLoading />;
  }

  const orderStatusMap = [
    {
      key: "menungguKonfirmasi",
      labelKey: "csDashboard.orderStatus.waitingConfirmation",
      labelFallback: "Menunggu Konfirmasi",
      tooltipKey: "csDashboard.tooltip.waitingConfirmation",
      tooltipFallback:
        "Daftar pesanan instan yang sedang menunggu pembayaran oleh shipper.",
    },
    {
      key: "pesananTerkonfirmasi",
      labelKey: "csDashboard.orderStatus.confirmed",
      labelFallback: "Pesanan Terkonfirmasi",
      tooltipKey: "csDashboard.tooltip.confirmed",
      tooltipFallback:
        "Daftar pesanan yang telah terkonfirmasi dan sedang dalam tahap persiapan armada untuk pengangkutan.",
    },
    {
      key: "armadaDijadwalkan",
      labelKey: "csDashboard.orderStatus.scheduled",
      labelFallback: "Armada Dijadwalkan",
      tooltipKey: "csDashboard.tooltip.scheduled",
      tooltipFallback:
        "Daftar pesanan dengan jadwal keberangkatan yang telah ditetapkan, menunggu proses pemuatan barang.",
    },
    {
      key: "prosesMuat",
      labelKey: "csDashboard.orderStatus.loading",
      labelFallback: "Proses Muat",
      tooltipKey: "csDashboard.tooltip.loading",
      tooltipFallback:
        "Daftar pesanan yang sedang dalam proses muat barang ke dalam armada di lokasi muat.",
      side: "left",
    },
    {
      key: "prosesBongkar",
      labelKey: "csDashboard.orderStatus.unloading",
      labelFallback: "Proses Bongkar",
      tooltipKey: "csDashboard.tooltip.unloading",
      tooltipFallback:
        "Daftar pesanan yang sedang dalam proses bongkar barang dari armada di lokasi bongkar.",
    },
    {
      key: "dokumenSedangDisiapkan",
      labelKey: "csDashboard.orderStatus.docPrep",
      labelFallback: "Dokumen Sedang Disiapkan",
      tooltipKey: "csDashboard.tooltip.docPrep",
      tooltipFallback:
        "Daftar pesanan yang sedang dalam proses penyiapan dan verifikasi dokumen pengiriman.",
    },
    {
      key: "prosesPengirimanDokumen",
      labelKey: "csDashboard.orderStatus.docDelivery",
      labelFallback: "Proses Pengiriman Dokumen",
      tooltipKey: "csDashboard.tooltip.docDelivery",
      tooltipFallback:
        "Daftar pesanan dengan dokumen yang sedang dalam proses pengiriman ke pihak Shipper.",
    },
    {
      key: "pesananSelesai",
      labelKey: "csDashboard.orderStatus.completed",
      labelFallback: "Pesanan Selesai",
      tooltipKey: "csDashboard.tooltip.completed",
      tooltipFallback:
        "Daftar pesanan jasa angkut yang telah selesai diproses, termasuk pengiriman dokumen dan pembayaran.",
      side: "left",
    },
  ];

  const attentionItemsMap = [
    {
      key: "perluResponPerubahan",
      labelKey: "csDashboard.attention.needsChangeResponse",
      labelFallback: "Perlu Respon Perubahan",
      tooltipKey: "csDashboard.tooltip.needsChangeResponse",
      tooltipFallback:
        "Jumlah pesanan yang memerlukan konfirmasi perubahan dari shipper hari ini.",
    },
    {
      key: "perluKonfirmasiSiap",
      labelKey: "csDashboard.attention.needsReadyConfirmation",
      labelFallback: "Perlu Konfirmasi Siap",
      tooltipKey: "csDashboard.tooltip.needsReadyConfirmation",
      tooltipFallback:
        "Jumlah pesanan yang membutuhkan konfirmasi siap hari ini.",
    },
    {
      key: "perluAssignArmada",
      labelKey: "csDashboard.attention.needsFleetAssignment",
      labelFallback: "Perlu Assign Armada",
      tooltipKey: "csDashboard.tooltip.needsFleetAssignment",
      tooltipFallback: "Jumlah pesanan yang belum memiliki armada hari ini.",
    },
    {
      key: "ulasanBaru",
      labelKey: "csDashboard.attention.newReviews",
      labelFallback: "Daftar Ulasan",
      tooltipKey: "csDashboard.tooltip.newReviews",
      tooltipFallback:
        "Ulasan yang baru diberikan oleh shipper untuk pengiriman yang telah selesai pada hari ini.",
    },
    {
      key: "laporanSOS",
      labelKey: "csDashboard.attention.sosReports",
      labelFallback: "Laporan SOS",
      tooltipKey: "csDashboard.tooltip.sosReports",
      tooltipFallback:
        "Jumlah laporan SOS yang memerlukan tindakan penyelesaian hari ini.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-6">
      <PageTitle withBack={false}>
        {t("csDashboard.pageTitle", {}, "Dashboard Real-time")}
      </PageTitle>

      <DashboardSection
        title={t("csDashboard.ordersSectionTitle", {}, "Pesanan")}
        subtitle={t(
          "csDashboard.ordersSectionSubtitle",
          {},
          "Informasi pesanan dan status pengiriman dari seluruh Transporter muatrans"
        )}
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {orderStatusMap.map((item) => (
            <StatCard
              key={item.key}
              label={t(item.labelKey, {}, item.labelFallback)}
              value={dashboardData?.orderStatusCounts?.[item.key] || 0}
              href="/cs/daftar-pesanan"
              tooltipText={t(item.tooltipKey, {}, item.tooltipFallback)}
              side={item.side || "top"}
            />
          ))}
        </div>
      </DashboardSection>

      <div className="flex gap-4">
        <DashboardSection
          title={t(
            "csDashboard.attentionSectionTitle",
            {},
            "Yang Perlu Diperhatikan"
          )}
          subtitle={t(
            "csDashboard.attentionSectionSubtitle",
            {},
            "Aktivitas Transporter yang perlu kamu perhatikan untuk jaga kepuasan Shipper"
          )}
          className="!bg-[#FFECB4]"
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {attentionItemsMap.map((item) => (
              <StatCard
                key={item.key}
                label={t(item.labelKey, {}, item.labelFallback)}
                value={dashboardData?.attentionItems?.[item.key] || 0}
                href="/cs/daftar-pesanan"
                tooltipText={t(item.tooltipKey, {}, item.tooltipFallback)}
              />
            ))}
          </div>
        </DashboardSection>
        <TransporterRatingCard ratingData={dashboardData?.transporterRating} />
      </div>
    </div>
  );
};

export default CSDashboardPage;
