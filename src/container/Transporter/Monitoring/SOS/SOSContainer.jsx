"use client";

import { useCallback, useMemo, useState } from "react";

import { AlertTriangle, Loader2, X } from "lucide-react";

import CardFleet from "@/components/Card/CardFleet";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import NotificationDot from "@/components/NotificationDot/NotificationDot";
import Search from "@/components/Search/Search";
import { useTranslation } from "@/hooks/use-translation";
import { useGetFleetList } from "@/services/Transporter/monitoring/getFleetList";
import { acknowledgeSos } from "@/services/Transporter/monitoring/getSosList";

import { DriverSelectionModal } from "../../Driver/DriverSelectionModal";

const SOSContainer = ({ onClose, onExpand }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [activeTab, setActiveTab] = useState("sos"); // 'sos' | 'all'

  // 1. Ganti hook useGetSosList dengan useGetFleetList
  const {
    data: fleetData,
    isLoading,
    error,
    mutate: refetchFleetList,
  } = useGetFleetList({
    search: searchTerm,
    page: 1,
    pageSize: 50,
    // Di API production, mungkin ada parameter seperti `hasAlert: true`
    // untuk efisiensi. Untuk saat ini, filter dilakukan di client-side.
  });

  // 2. Proses data dari useGetFleetList, tidak perlu adapter lagi
  const allFleetsWithSos = useMemo(
    () => (fleetData?.fleets || []).filter((fleet) => fleet.hasSOSAlert),
    [fleetData?.fleets]
  );

  // 3. Pisahkan data untuk tab 'SOS' (baru) dan 'Riwayat' (sudah ditangani)
  const activeSosItems = useMemo(
    () =>
      allFleetsWithSos.filter((fleet) => fleet.detailSOS?.sosStatus === "NEW"),
    [allFleetsWithSos]
  );

  const historySosItems = useMemo(
    () =>
      allFleetsWithSos.filter((fleet) => fleet.detailSOS?.sosStatus !== "NEW"),
    [allFleetsWithSos]
  );

  // Fungsi filter berdasarkan pencarian
  const filterFn = (fleet) =>
    (fleet.licensePlate || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (fleet?.driver?.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  const filteredSosData = activeSosItems.filter(filterFn);
  const filteredHistoryData = historySosItems.filter(filterFn);

  const dataToDisplay =
    activeTab === "sos" ? filteredSosData : filteredHistoryData;
  const totalActiveSos = activeSosItems.length;

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
    refetchFleetList();
    setShowDriverModal(false);
    setSelectedFleet(null);
  };

  // 4. Pindahkan handler ke dalam komponen agar bisa akses `refetchFleetList`
  const handleAcknowledge = useCallback(
    async (fleet) => {
      try {
        const sosId = fleet?.detailSOS?.sosId;
        if (!sosId) return;
        await acknowledgeSos(sosId);
        // Refresh list agar status jadi ACKNOWLEDGED -> tombol mengerti hilang
        await refetchFleetList();
      } catch (e) {
        console.error(e);
        // opsional: tampilkan toast error
      }
    },
    [refetchFleetList]
  );

  return (
    <div className="flex h-[calc(100vh-92px-96px)] flex-col rounded-xl bg-white pt-4">
      <button
        className="absolute right-2 top-2 z-10 text-primary-700 hover:text-primary-800"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>

      {/* Header */}
      <div className="px-4">
        {/* Struktur flex sudah tidak diperlukan */}
        <div className="pb-3">
          <h2 className="text-[14px] font-bold text-gray-900">
            {t("SOSContainer.title", {}, "SOS")}{" "}
            {totalActiveSos > 0 ? (
              <span className="font-semibold">
                (
                {t(
                  "SOSContainer.fleetCount",
                  { count: totalActiveSos },
                  `${totalActiveSos} Armada`
                )}
                )
              </span>
            ) : (
              <span className="font-semibold">
                ({t("SOSContainer.noReports", {}, "Belum Ada Laporan")})
              </span>
            )}
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 px-4">
        <Search
          placeholder={t(
            "SOSContainer.searchPlaceholder",
            {},
            "Cari No. Polisi / Nama Driver"
          )}
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
          {t(
            "SOSContainer.sosTab",
            { count: activeSosItems.length },
            `SOS (${activeSosItems.length})`
          )}
          {activeSosItems.length > 0 && (
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
          {t(
            "SOSContainer.historyTab",
            { count: historySosItems.length },
            `Riwayat (${historySosItems.length})`
          )}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-[12px] pb-3">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">
              {t("SOSContainer.loadingSOS", {}, "Memuat SOS...")}
            </span>
          </div>
        ) : error ? (
          <div className="flex h-32 items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
              <p className="text-sm text-red-600">
                {t(
                  "SOSContainer.errorLoadingSOS",
                  {},
                  "Gagal memuat daftar SOS"
                )}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {t("SOSContainer.tryAgainLater", {}, "Silakan coba lagi nanti")}
              </p>
            </div>
          </div>
        ) : dataToDisplay.length > 0 ? (
          <div className="space-y-3">
            {dataToDisplay.map((fleet) => (
              <CardFleet
                key={fleet.fleetId}
                fleet={fleet} // Data fleet sudah sesuai dengan props CardFleet
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
            title={t("SOSContainer.dataNotFound", {}, "Data tidak ditemukan")}
            description={t(
              "SOSContainer.noMatchingData",
              { searchTerm },
              `Tidak ada data yang cocok dengan pencarian "${searchTerm}"`
            )}
            type="search"
            className={"h-full"}
          />
        ) : activeTab === "sos" ? (
          <DataNotFound
            title={t("SOSContainer.noSOSReports", {}, "Belum Ada Laporan SOS")}
            description={t(
              "SOSContainer.noSOSDescription",
              {},
              "Saat ini tidak ada laporan SOS yang perlu ditangani."
            )}
            type="data"
            className={"h-full"}
          />
        ) : (
          <DataNotFound
            title={t(
              "SOSContainer.noHistoryReports",
              {},
              "Belum Ada Riwayat Laporan"
            )}
            description={t(
              "SOSContainer.noHistoryDescription",
              {},
              "Belum ada riwayat laporan yang tercatat."
            )}
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
          title={t("SOSContainer.assignDriverTitle", {}, "Pasangkan Driver")}
        />
      )}
    </div>
  );
};

export default SOSContainer;
