"use client";

import React, { useEffect, useState } from "react";

import DashboardSection from "@/app/transporter/(main)/dashboard/real-time/components/DashboardSection";
import IncomeCards from "@/app/transporter/(main)/dashboard/real-time/components/IncomeCards";
import SkeletonLoading from "@/app/transporter/(main)/dashboard/real-time/components/SkeletonLoading";
import StatCard from "@/app/transporter/(main)/dashboard/real-time/components/StatCard";
import SuspendedAccountAlert from "@/app/transporter/(main)/dashboard/real-time/components/SuspendedAccountAlert";
import PageTitle from "@/components/PageTitle/PageTitle";

const RealtimeDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [accountStatus, setAccountStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pesananLabel = {
    waitingConfirmation: "Menunggu Konfirmasi",
    confirmed: "Pesanan Terkonfirmasi",
    scheduled: "Armada Dijadwalkan",
    loading: "Proses Muat",
    unloading: "Proses Bongkar",
    documentPreparation: "Dokumen Sedang Disiapkan",
    documentDelivery: "Proses Pengiriman Dokumen",
    completed: "Pesanan Selesai",
  };

  const alertLabel = {
    needResponse: "Perlu Respon Perubahan",
    needConfirmation: "Perlu Konfirmasi Siap",
    needAssignment: "Perlu Assign Armada",
    newReviews: "Daftar Ulasan",
    sosReports: "Laporan SOS",
  };

  const contents = {
    orders: {
      waitingConfirmation: {
        text: "Armada kamu telah tercatat untuk pesanan ini, harap menunggu maks. 1 jam untuk konfirmasi dari Shipper.",
        side: "right",
        href: "/daftar-pesanan?status=waitingConfirmation",
      },
      confirmed: {
        text: "Daftar pesanan yang telah terkonfirmasi dan sedang dalam tahap persiapan armada untuk pengangkutan.",
        side: "right",
        href: "/daftar-pesanan?status=confirmed",
      },
      scheduled: {
        text: "Daftar pesanan dengan jadwal keberangkatan yang telah ditetapkan, menunggu proses pemuatan barang.",
        side: "top",
        href: "/daftar-pesanan?status=scheduled",
      },
      loading: {
        text: "Daftar pesanan yang sedang dalam proses muat barang ke dalam armada di lokasi muat.",
        side: "left",
        href: "/datar-pesanan?status=loading",
      },
      unloading: {
        text: "Daftar pesanan yang sedang dalam proses bongkar barang dari armada di lokasi bongkar.",
        side: "top",
        href: "/daftar-pesanan?status=unloading",
      },
      documentPreparation: {
        text: "Daftar pesanan yang sedang dalam proses penyiapan dan verifikasi dokumen pengiriman.",
        side: "top",
        href: "/daftar-pesanan?status=documentPreparation",
      },
      documentDelivery: {
        text: "Daftar pesanan dengan dokumen yang sedang dalam proses pengiriman ke pihak Shipper.",
        side: "top",
        href: "/daftar-pesanan?status=documentDelivery",
      },
      completed: {
        text: "Daftar pesanan jasa angkut yang telah selesai diproses, termasuk pengiriman dokumen dan pembayaran.",
        side: "left",
        href: "/daftar-pesanan?status=completed",
      },
    },
    alerts: {
      needResponse: {
        text: "Jumlah pesanan yang memerlukan respon perubahan dari Shipper hari ini",
        side: "top",
        href: "/daftar-pesaanan?status=needResponse",
      },
      needConfirmation: {
        text: "Jumlah pesanan yang membutuhkan konfirmasi siap hari ini",
        side: "top",
        href: "/daftar-pesanan?status=needConfirmation",
      },
      needAssignment: {
        text: "Jumlah pesanan yang belum memiliki armada hari ini",
        side: "top",
        href: "/daftar-pesanan?status=needAssignment",
      },
      newReviews: {
        text: "Ulasan yang baru diberikan oleh Shipper untuk pengiriman yang telah selesai pada hari ini",
        side: "left",
        href: "/dashboard/real-time/ulasan",
      },
      sosReports: {
        text: "Jumlah laporan SOS yang memerlukan tindakan penyelesaian hari ini",
        side: "top",
        href: "/monitoring?tabActive=sos",
      },
    },
    performance: {
      overallRating: {
        text: "Rating merupakan nilai rata-rata dari semua penilaian yang diberikan pengguna terhadap driver yang telah selesai",
        side: "top",
      },
      cancelledOrders: {
        text: "Jumlah Pesanan Jasa Angkut yang Dibatalkan, Kamu Lihat Detail untuk Informasi Lebih Lengkap Terkait Pembatalan",
        side: "left",
      },
      penalties: {
        text: "Jumlah poin penalti yang kamu terima dari pembatalan pesanan",
        side: "top",
      },
    },
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Set loading to true before every fetch to show skeleton on refreshes
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/v1/dashboard/summary");
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        const result = await response.json();

        // Set state from the API response
        setDashboardData(result.Data.summary);
        setAccountStatus(result.Data.accountStatus);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Gagal memuat data dashboard. Silakan coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Set up the interval for refreshing data every 5 minutes
    const intervalId = setInterval(fetchDashboardData, 300000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Show skeleton loader while loading
  if (loading) {
    return <SkeletonLoading />;
  }

  // Show a prominent error message if the initial fetch fails
  if (error && !dashboardData) {
    return (
      <div className="p-8 text-center text-lg font-semibold text-error-500">
        {error}
      </div>
    );
  }

  if (!dashboardData) {
    return null; // or a more specific "no data" component if needed
  }

  return (
    <div className="space-y-4 pb-6">
      <PageTitle>Dashboard Real-time</PageTitle>

      <SuspendedAccountAlert status={accountStatus} />

      {/* Orders Section */}
      <DashboardSection
        title="Pesanan"
        subtitle="Informasi pesanan dan status pengiriman yang perlu kamu pantau"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.entries(dashboardData.orders).map(([key, data]) => (
            <StatCard
              key={key}
              label={pesananLabel[key]}
              value={data.count}
              href={contents.orders[key].href}
              tooltipText={contents.orders[key].text}
              side={contents.orders[key].side}
            />
          ))}
        </div>
      </DashboardSection>

      {/* Income Section */}
      <DashboardSection
        title="Pendapatan"
        subtitle="Informasi potensi pendapatan dan status pencairan yang kamu dapatkan"
      >
        <IncomeCards data={dashboardData.earnings} />
      </DashboardSection>

      {/* Needs Attention Section */}
      <DashboardSection
        title="Yang Perlu Diperhatikan"
        subtitle="Aktivitas yang perlu kamu perhatikan untuk jaga kepuasan Shipper"
        className="bg-[#FFECB4]"
      >
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(dashboardData.alerts).map(([key, data]) => (
            <StatCard
              key={key}
              label={alertLabel[key]}
              href={contents.alerts[key].href}
              value={data.count}
              tooltipText={contents.alerts[key].text}
              side={contents.alerts[key].side}
            />
          ))}
        </div>
      </DashboardSection>

      {/* Performance Section */}
      <DashboardSection
        title="Performa Kamu"
        subtitle="Aktivitas yang perlu kamu perhatikan untuk jaga kepuasan Shipper, pantau dan tingkatkan terus kualitas pengiriman kamu"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            label="Rating Driver Keseluruhan"
            value={dashboardData.performance.overallRating}
            valueUnit="/5"
            href="/dashboard/real-time/rating-driver"
            icon="/icons/star.svg"
            labelIcon="/icons/star_icon.svg"
            tooltipText={contents.performance.overallRating.text}
            side={contents.performance.overallRating.side}
            variant="soft"
          />
          <StatCard
            label="Pesanan Dibatalkan"
            value={dashboardData.performance.cancelledOrders}
            valueUnit=" Pesanan"
            icon="/icons/cancel-circle.svg"
            href="/daftar-pesanan?status=cancelledOrders"
            tooltipText={contents.performance.cancelledOrders.text}
            side={contents.performance.cancelledOrders.side}
            variant="soft"
          />
          <StatCard
            label="Jumlah Penalti"
            value={dashboardData.performance.penalties}
            valueUnit=" Penalti"
            icon="/icons/danger-triangle.svg"
            href="/dashboard/real-time/penalti"
            tooltipText={contents.performance.penalties.text}
            side={contents.performance.penalties.side}
            variant="soft"
          />
        </div>
      </DashboardSection>
    </div>
  );
};

export default RealtimeDashboardPage;
