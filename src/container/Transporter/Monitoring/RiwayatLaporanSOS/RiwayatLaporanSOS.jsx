"use client";

import Link from "next/link";
import { useState } from "react";

import { Clock3, MapPin, MoreVertical } from "lucide-react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import Search from "@/components/Search/Search";
import Table from "@/components/Table/Table";
import { NewTimelineItem, TimelineContainer } from "@/components/Timeline";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/dateFormat";
import { useGetSosList } from "@/services/Transporter/monitoring/getSosList";

const RiwayatLaporanSOS = ({ onToggleExpand, isExpanded }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, error, isLoading } = useGetSosList({
    search: searchQuery,
  });

  if (error) {
    console.error("Gagal mengambil daftar SOS:", error);
  }

  const renderOrderStatus = (status) => {
    const statusMap = {
      SCHEDULED: { text: "Terjadwal", className: "bg-blue-100 text-blue-700" },
      LOADING: { text: "Memuat", className: "bg-yellow-100 text-yellow-700" },
      ON_THE_WAY: { text: "Instan", className: "bg-success-400 text-white" },
      // Tambahkan status lain jika ada
      DEFAULT: { text: status, className: "bg-gray-100 text-gray-700" },
    };

    const { text, className } = statusMap[status] || statusMap.DEFAULT;

    return (
      <span
        className={cn("rounded-md px-2 py-1 text-xs font-semibold", className)}
      >
        {text}
      </span>
    );
  };

  const getRowClassName = (row) => {
    // Untuk status "NEW"
    if (row.status === "NEW") {
      return cn(
        // 1. Atur background dasar menjadi error-50
        "bg-error-50",
        // 2. Saat di-hover, JAGA background tetap error-50 (untuk override default hover)
        "hover:bg-error-50",
        // 3. Saat di-hover, ubah warna border menjadi error-400
        "hover:border-error-400"
      );
    }

    // Untuk status "ACKNOWLEDGED"
    if (row.status === "ACKNOWLEDGED") {
      return cn(
        // 1. Atur background dasar menjadi neutral-50
        "bg-neutral-50",
        // 2. Saat di-hover, ubah background menjadi muat-trans-primary-50
        "hover:bg-muat-trans-primary-50",
        // 3. Saat di-hover, ubah warna border menjadi muat-trans-primary-400
        "hover:border-muat-trans-primary-400"
      );
    }
    return "hover:bg-neutral-100";
  };

  // --- PERUBAHAN SELESAI DI SINI ---

  const columns = [
    // ... (definisi kolom tidak berubah, sama seperti sebelumnya)
    {
      header: "Tanggal Laporan",
      key: "reportedAt",
      headerClassName: "whitespace-nowrap",
      render: (row) => {
        // Jika tidak ada tanggal, tampilkan strip
        if (!row.reportedAt) return "-";

        // 1. Ambil hasil format tanggal lengkap, tidak perlu dipecah lagi
        const fullDateTime = formatDate(row.reportedAt); // Hasil -> "10 Jan 2025 12:00 WIB"

        return (
          // Gunakan flex-col untuk layout vertikal dan beri sedikit jarak (gap)
          <div className="flex flex-col gap-3 text-xxs">
            <span className="text-xs font-medium text-neutral-900">
              {fullDateTime}
            </span>

            {row.status === "NEW" && (
              <div className="flex items-center gap-1 text-neutral-600">
                {/* Ikon Jam */}
                <Clock3 className="h-3 w-3 flex-shrink-0 text-muat-trans-secondary-900" />
                {/* Teks Status */}
                <span>Selesai:</span>
                <span>(Laporan Belum Diakhiri)</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: "Laporan SOS",
      key: "sosReport",
      render: (row) => (
        <div className="flex flex-col gap-2 text-xxs">
          {/* Baris Pertama: Kategori Laporan (warna merah) */}
          <p className="text-xs font-semibold text-error-500">
            {row.categoryName}
          </p>
          <p className="text-xs font-medium text-neutral-900">
            {row.description}
          </p>

          {/* Baris Kedua: Lokasi Terakhir dengan Ikon */}
          {/* Lakukan pengecekan jika 'lastLocation' ada untuk menghindari error */}
          {row.lastLocation && (
            <div className="flex min-w-0 items-center gap-1.5 text-neutral-600">
              {/* Ikon Lokasi */}
              <MapPin className="h-3 w-3 flex-shrink-0 text-muat-trans-secondary-900" />

              {/* Teks Lokasi dengan efek truncate (...) */}
              <span className="truncate text-xs font-medium text-neutral-900">
                <span className="text-neutral-600">Lokasi: </span>
                {row.lastLocation.district}, {row.lastLocation.city}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "No. Pesanan",
      key: "orderCode",
      render: (row) => (
        <div className="flex flex-col gap-3 text-xs">
          <span className="font-semibold text-neutral-900">
            {row.orderCode}
          </span>
          {/* Menggunakan fungsi helper untuk status */}
          <div>{renderOrderStatus(row.orderInfo.orderStatus)}</div>
        </div>
      ),
    },
    {
      header: "Jadwal Muat & Bongkar",
      key: "schedule",
      render: (row) => (
        <div className="flex flex-col whitespace-nowrap text-xs text-neutral-900">
          {/* Asumsi: row.orderInfo memiliki pickupSchedule & dropoffSchedule */}
          <span>
            {formatDate(row.orderInfo.pickupSchedule, "dd MMM yyyy HH:mm")} WIB
            s/d
          </span>
          <span>
            {formatDate(row.orderInfo.dropoffSchedule, "dd MMM yyyy HH:mm")} WIB
          </span>
        </div>
      ),
    },

    {
      header: "Rute Muat & Bongkar",
      key: "route",
      render: (row) => (
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            <TimelineContainer>
              {/* Item Pertama: Lokasi Muat (Pickup) */}
              <NewTimelineItem
                variant="bullet"
                index={0}
                activeIndex={1}
                isLast={false}
                title={`${row.orderInfo.pickupLocation.city}, ${row.orderInfo.pickupLocation.district}`}
                // Sesuaikan tampilan font agar tidak terlalu besar dan bisa di-truncate
                appearance={{
                  titleClassname:
                    "text-xs font-medium text-neutral-800 truncate",
                }}
              />

              {/* Item Kedua: Lokasi Bongkar (Dropoff) */}
              <NewTimelineItem
                variant="bullet"
                index={1}
                activeIndex={2}
                isLast={true}
                title={`${row.orderInfo.dropoffLocation.city}, ${row.orderInfo.dropoffLocation.district}`}
                appearance={{
                  titleClassname:
                    "text-xs font-medium text-neutral-800 truncate",
                }}
              />
            </TimelineContainer>
            <Link
              href={"/monitoring"}
              className="mt-3 text-xs text-primary-700 hover:underline"
            >
              {" "}
              Lihat Lokasi Lainnya
            </Link>
          </div>
        </div>
      ),
    },
    {
      header: "",
      key: "action",
      className: "align-top",
      render: () => (
        <Button variant="muattrans-primary-secondary" size="xs">
          Detail
        </Button>
      ),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-3 px-4">
        <div className="flex items-center">
          <h3 className="whitespace-nowrap text-xs font-bold">
            Riwayat Laporan SOS Armada{" "}
            <span className="font-semibold">(Semua Armada)</span>
          </h3>
        </div>
        <div className="flex w-full items-center justify-end gap-3">
          <Search
            placeholder="Cari Pesanan"
            onSearch={(value) => setSearchQuery(value)}
            onFocus={() => {
              if (!isExpanded) onToggleExpand();
            }}
            containerClassName="h-8 w-[180px]"
            inputClassName="text-xs"
            disabled={isLoading || !data}
          />
          <button
            onClick={onToggleExpand}
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
          >
            <IconComponent
              src="/icons/monitoring/collapse.svg"
              className={cn(
                "h-5 w-5 transform transition-transform duration-300 ease-in-out",
                !isExpanded && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex-1 overflow-hidden">
          <Table
            data={data?.sosList || []}
            columns={columns}
            loading={isLoading}
            rowClassName={getRowClassName}
            emptyComponent={
              <div className="py-8 text-center text-neutral-500">
                {searchQuery
                  ? `Tidak ada hasil untuk "${searchQuery}"`
                  : "Tidak ada riwayat laporan SOS."}
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default RiwayatLaporanSOS;
