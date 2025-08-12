"use client";

import { useMemo, useState } from "react";

import { AlertTriangle, Loader2, X } from "lucide-react";

import CardFleet from "@/components/Card/CardFleet";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import NotificationDot from "@/components/NotificationDot/NotificationDot";
import Search from "@/components/Search/Search";
// PAKAI HOOK SOS BARU
import {
  acknowledgeSos,
  useGetSosList,
} from "@/services/Transporter/monitoring/getSosList";

import { DriverSelectionModal } from "../../Driver/DriverSelectionModal";

// --- helper: mapping order status -> truck status icon (opsional, buat ikon tidak default)
const mapOrderStatusToFleetStatus = (orderStatus) => {
  if (!orderStatus) return undefined;
  const s = String(orderStatus).toUpperCase();
  // sesuaikan dengan util getTruckIcon kamu
  if (s === "LOADING" || s === "ON_THE_WAY") return "ON_DUTY";
  return "READY_FOR_ORDER";
};

// --- adapter: ubah shape data SOS -> shape yang CardFleet harapkan
const mapSosToCardFleet = (sos) => ({
  fleetId: sos.fleetId,
  licensePlate: sos.licensePlate,
  status: mapOrderStatusToFleetStatus(sos?.orderInfo?.orderStatus),

  driver: { name: sos.driverName, phoneNumber: sos.driverPhone },

  lastLocation: {
    address: {
      fullAddress: sos?.lastLocation?.address || "",
      district: sos?.lastLocation?.district || "",
      city: sos?.lastLocation?.city || "",
    },
  },

  truckType: { name: sos.truckType || "-" },
  carrierType: { name: sos.carrierType || "-" },

  // tambahkan sosId & sosStatus agar CardFleet bisa kontrol tombol
  detailSOS: {
    sosId: sos.id,
    sosStatus: sos.status, // "NEW" | "ACKNOWLEDGED"
    sosCategory: sos.categoryName,
    description: sos.description,
    photos: sos.photos || [],
    reportAt: sos.reportedAt,
  },

  activeOrder: {
    orderCode: sos.orderCode,
    pickupLocation: sos?.orderInfo?.pickupLocation,
    dropoffLocation: sos?.orderInfo?.dropoffLocation,
  },

  needsResponseChange: false,
  hasSOSAlert: true,
});

// handler klik “Mengerti”
const handleAcknowledge = async (fleet) => {
  try {
    const sosId = fleet?.detailSOS?.sosId;
    if (!sosId) return;
    await acknowledgeSos(sosId);
    // refresh list agar status jadi ACKNOWLEDGED -> tombol mengerti hilang
    // await refetchSos();
  } catch (e) {
    console.error(e);
    // opsional: tampilkan toast error
  }
};

const SOSContainer = ({ onClose, onExpand }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [activeTab, setActiveTab] = useState("sos"); // 'sos' | 'all' (untuk sekarang keduanya pakai data yang sama)

  // Ambil data SOS (mock sudah support filter search/status)
  const {
    data,
    isLoading,
    error,
    mutate: refetchSos,
  } = useGetSosList({
    search: searchTerm, // biar mock ikut filter juga
    // status: ['NEW', 'ACKNOWLEDGED'] // kalau mau filter status tertentu
    page: 1,
    pageSize: 50,
  });

  // Normalisasi data ke shape CardFleet
  const sosListRaw = data?.sosList || [];
  const sosCardItems = useMemo(
    () => sosListRaw.map(mapSosToCardFleet),
    [sosListRaw]
  );

  // Tab "Riwayat" sementara pakai data yang sama (nanti tinggal ganti kalau endpoint riwayat siap)
  const allHistoryItems = sosCardItems;

  const filterFn = (fleet) =>
    (fleet.licensePlate || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (fleet?.driver?.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const filteredSosData = sosCardItems.filter(filterFn);
  const filteredHistoryData = allHistoryItems.filter(filterFn);

  const dataToDisplay =
    activeTab === "sos" ? filteredSosData : filteredHistoryData;
  const totalSos = sosCardItems.length;

  const toggleExpanded = (id) => {
    setExpandedId((prev) => {
      const newId = prev === id ? null : id;
      if (newId && onExpand) onExpand(newId);
      return newId;
    });
  };

  const handleOpenDriverModal = (fleet) => {
    setSelectedFleet(fleet);
    setShowDriverModal(true);
  };

  const handleDriverSelectionSuccess = () => {
    refetchSos();
    setShowDriverModal(false);
    setSelectedFleet(null);
  };

  return (
    <div className="flex h-[calc(100vh-92px-96px)] flex-col rounded-xl bg-white pt-4">
      {/* Header */}
      <div className="px-4">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-[14px] font-bold text-gray-900">
            SOS{" "}
            {totalSos > 0 ? (
              <span className="font-semibold">({totalSos} Armada)</span>
            ) : (
              <span className="font-semibold">(Belum Ada Laporan)</span>
            )}
          </h2>
          <button className="text-blue-500" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 px-4">
        <Search
          placeholder="Cari No. Polisi / Nama Driver"
          onSearch={setSearchTerm}
          autoSearch={true}
          debounceTime={300}
          defaultValue={searchTerm}
          inputClassName="min-w-full"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pb-3">
        <button
          className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
            activeTab === "sos"
              ? "w-auto min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
              : "w-auto min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
          }`}
          onClick={() => setActiveTab("sos")}
        >
          SOS ({sosCardItems.length})
          {sosCardItems.length > 0 && (
            <NotificationDot
              size="sm"
              color="red"
              position="absolute"
              positionClasses="top-0 right-0"
            />
          )}
        </button>

        <button
          className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
            activeTab === "all"
              ? "w-auto min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
              : "w-auto min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
          }`}
          onClick={() => setActiveTab("all")}
        >
          Riwayat ({allHistoryItems.length})
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-[12px] pb-3">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading SOS…</span>
          </div>
        ) : error ? (
          <div className="flex h-32 items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
              <p className="text-sm text-red-600">Failed to load SOS list</p>
              <p className="mt-1 text-xs text-gray-500">
                Please try again later
              </p>
            </div>
          </div>
        ) : dataToDisplay.length > 0 ? (
          <div className="space-y-3">
            {dataToDisplay.map((fleet) => (
              <CardFleet
                key={fleet.fleetId}
                fleet={fleet}
                isExpanded={expandedId === fleet.fleetId}
                onToggleExpand={toggleExpanded}
                onOpenDriverModal={handleOpenDriverModal}
                isSOS={fleet?.detailSOS?.sosStatus === "NEW"}
                onAcknowledge={handleAcknowledge}
              />
            ))}
          </div>
        ) : searchTerm ? (
          <DataNotFound
            title="Data tidak ditemukan"
            description={`Tidak ada data yang cocok dengan pencarian "${searchTerm}"`}
            type="search"
            className={"h-full"}
          />
        ) : activeTab === "sos" ? (
          <DataNotFound
            title="Belum Ada Laporan SOS"
            description="Saat ini tidak ada laporan SOS yang perlu ditangani."
            type="data"
            className={"h-full"}
          />
        ) : (
          <DataNotFound
            title="Belum Ada Riwayat Laporan"
            description="Belum ada riwayat laporan yang tercatat."
            type="data"
            className={"h-full"}
          />
        )}
      </div>

      {/* Modal */}
      {showDriverModal && selectedFleet && (
        <DriverSelectionModal
          onClose={() => setShowDriverModal(false)}
          onSuccess={handleDriverSelectionSuccess}
          vehicleId={selectedFleet.fleetId}
          vehiclePlate={selectedFleet.licensePlate}
          currentDriverId={selectedFleet.driver?.id || null}
          title="Pasangkan Driver"
        />
      )}
    </div>
  );
};

export default SOSContainer;
