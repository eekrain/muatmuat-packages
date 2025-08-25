"use client";

import { useEffect, useState } from "react";

import { AlertTriangle, Loader2, X } from "lucide-react";

import CardFleet from "@/components/Card/CardFleet";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import NotificationDot from "@/components/NotificationDot/NotificationDot";
import Search from "@/components/Search/Search";
import { useTranslation } from "@/hooks/use-translation";
import { useGetFleetList } from "@/services/Transporter/monitoring/getFleetList";
import { acknowledgeSos } from "@/services/Transporter/monitoring/getSosList";
import useSosWebSocket from "@/services/Transporter/monitoring/useSosWebSocket";

import { DriverSelectionModal } from "../../Driver/DriverSelectionModal";
import FilterPopoverArmada from "./components/FilterPopoverArmada";
import ModalResponseChange from "./components/ModalResponseChange";
import SosPopupNotification from "./components/SosPopupNotification";

const DaftarArmada = ({
  onClose,
  onExpand,
  selectedFleetId,
  onFleetSelect,
  onFleetClick,
  onOpenRiwayatSOS,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'sos'
  const [truckStatusFilter, setTruckStatusFilter] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState([]);
  const [showSosNotification, setShowSosNotification] = useState(false);
  const [showResponseChangeModal, setShowResponseChangeModal] = useState(false);
  const [selectedFleetForResponse, setSelectedFleetForResponse] =
    useState(null);

  // State untuk mengontrol buka/tutup popover filter
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // State untuk parameter API
  const [apiParams, setApiParams] = useState({
    page: 1,
    limit: 50,
    sort: "asc",
    filter: "",
    search: null,
    fleetId: null,
  });

  // Map filter values to API format
  const mapFilterToAPI = (filters) => {
    const mapping = {
      ON_DUTY: "onDuty",
      WAITING_LOADING_TIME: "WaitingLoadingTime",
      READY_FOR_ORDER: "ReadyForOrder",
      INACTIVE: "inactive",
      NOT_PAIRED: "notPaired",
      NEEDS_RESPONSE: "needResponse",
    };

    return filters.map((filter) => mapping[filter] || filter);
  };

  // Update API parameters when filters or search change
  const updateApiParams = () => {
    const allFilters = [
      ...mapFilterToAPI(truckStatusFilter),
      ...mapFilterToAPI(orderStatusFilter),
    ];

    const newParams = {
      page: 1,
      limit: 50,
      sort: "asc",
      filter: allFilters.join(","),
      search: searchTerm || null,
      fleetId: selectedFleetId,
    };

    setApiParams(newParams);
  };

  // Update API params when dependencies change
  useEffect(() => {
    updateApiParams();
  }, [truckStatusFilter, orderStatusFilter, searchTerm, selectedFleetId]);

  const {
    data: fleetData,
    isLoading,
    error,
    mutate: refetchFleets,
  } = useGetFleetList(apiParams);

  const fleets = fleetData?.fleets || [];
  const totalFleets = fleetData?.pagination?.totalFleets || fleets.length;
  const sosCount = fleetData?.filter?.sos || 0;
  const hasFilterData = fleetData?.filter;

  // Set active tab to "all" if there are no SOS alerts
  useEffect(() => {
    if (hasFilterData && sosCount === 0 && activeTab === "sos") {
      setActiveTab("all");
    }
  }, [hasFilterData, sosCount, activeTab]);

  const { latestSosAlert, acknowledgeSosAlert } = useSosWebSocket();

  // Variabel boolean untuk menentukan apakah ada filter yang aktif
  const isFilterActive =
    truckStatusFilter.length > 0 || orderStatusFilter.length > 0;

  // ACK handler untuk tombol "Mengerti"
  const handleAcknowledge = async (fleet) => {
    try {
      const sosId = fleet?.detailSOS?.sosId; // pastikan API mengirimkan ini di detailSOS
      if (!sosId) {
        console.warn("sosId tidak tersedia di fleet.detailSOS");
        return;
      }
      await acknowledgeSos(sosId);
      await refetchFleets(); // refresh list agar status & style berubah
    } catch (e) {
      console.error(e);
      // TODO: tampilkan toast error kalau ada sistem notifikasi
    }
  };

  // Menampilkan notifikasi SOS saat ada alert baru
  useEffect(() => {
    if (latestSosAlert) {
      setShowSosNotification(true);
    }
  }, [latestSosAlert]);

  // Membuka detail armada yang dipilih
  useEffect(() => {
    if (selectedFleetId) {
      setExpandedId(selectedFleetId);
    }
  }, [selectedFleetId]);

  const toggleExpanded = (id) => {
    setExpandedId((prev) => {
      const newId = prev === id ? null : id;
      if (newId && onExpand) {
        onExpand(newId);
      }
      return newId;
    });
  };

  const handleOpenDriverModal = (fleet) => {
    setSelectedFleet(fleet);
    setShowDriverModal(true);
  };

  const handleOpenResponseChangeModal = (fleet) => {
    setSelectedFleetForResponse(fleet);
    setShowResponseChangeModal(true);
  };

  const handleRespondToChange = () => {
    console.log("Responding to change for fleet:", selectedFleetForResponse);
    setShowResponseChangeModal(false);
    setSelectedFleetForResponse(null);
  };

  const handleDriverSelectionSuccess = (vehicleId, driverId) => {
    refetchFleets();
    setShowDriverModal(false);
    setSelectedFleet(null);
  };

  // Fungsi ini menerapkan filter dan menutup popover
  const handleApplyFilter = (truckStatuses, orderStatuses) => {
    setTruckStatusFilter(truckStatuses);
    setOrderStatusFilter(orderStatuses);
    setIsPopoverOpen(false); // Menutup popover setelah filter diterapkan
  };

  // Function to update pagination
  const handlePageChange = (newPage) => {
    setApiParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Function to update limit
  const handleLimitChange = (newLimit) => {
    setApiParams((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1, // Reset to first page when changing limit
    }));
  };

  // Function to update sort
  const handleSortChange = (newSort) => {
    setApiParams((prev) => ({
      ...prev,
      sort: newSort,
    }));
  };

  const handleFleetCardClick = (fleet) => {
    // Fokus peta pada armada ini
    if (onFleetClick) {
      onFleetClick(fleet);
    }
    // Update juga ID armada yang dipilih
    if (onFleetSelect) {
      onFleetSelect(fleet.fleetId);
    }
  };

  // Filter data di sisi client berdasarkan keyword pencarian dan tab aktif
  const filteredData = fleets.filter((fleet) => {
    const searchMatch =
      fleet.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fleet.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "sos") {
      return fleet.hasSOSAlert && searchMatch;
    }

    return searchMatch;
  });

  return (
    <div className="flex h-[calc(100vh-92px-96px)] flex-col rounded-xl bg-white pt-4">
      {/* Header */}
      <button
        className="absolute right-2 top-2 z-10 text-primary-700 hover:text-primary-800"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>

      <div className="px-4">
        <div className="pb-3">
          <h2 className="text-[14px] font-bold text-gray-900">
            {t("DaftarArmada.title", {}, "Daftar Armada")}{" "}
            <span className="font-semibold">
              ({totalFleets} {t("DaftarArmada.fleetUnit", {}, "Armada")})
            </span>
          </h2>
        </div>
      </div>

      {/* Search & filter */}
      <div className="mb-4 px-4">
        <div className="flex gap-3">
          <Search
            placeholder={t(
              "DaftarArmada.searchPlaceholder",
              {},
              "Cari No. Polisi / Nama Driver"
            )}
            onSearch={setSearchTerm}
            autoSearch={true}
            debounceTime={300}
            defaultValue={searchTerm}
            inputClassName="w-[229px]"
          />
          {fleetData && (
            <FilterPopoverArmada
              onApplyFilter={handleApplyFilter}
              filterCounts={fleetData?.filter}
              isPopoverOpen={isPopoverOpen}
              onOpenChange={setIsPopoverOpen}
              isFilterActive={isFilterActive}
              currentTruckFilters={truckStatusFilter}
              currentOrderFilters={orderStatusFilter}
            />
          )}
        </div>
      </div>

      {/* filter tabs */}
      {fleetData && (
        <div className="flex gap-2 px-4 pb-3">
          {sosCount > 0 && (
            <button
              className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
                activeTab === "sos"
                  ? "w-auto min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                  : "w-auto min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
              }`}
              onClick={() => setActiveTab("sos")}
            >
              {t(
                "DaftarArmada.sosTab",
                { count: sosCount },
                `SOS (${sosCount})`
              )}
              {/* Notifikasi dot bisa ditambahkan logika tambahan jika diperlukan */}
              <NotificationDot
                size="sm"
                color="red"
                position="absolute"
                positionClasses="top-0 right-0"
              />
            </button>
          )}
          <button
            className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
              activeTab === "all"
                ? "w-auto min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                : "w-auto min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
            }`}
            onClick={() => setActiveTab("all")}
          >
            {t(
              "DaftarArmada.allTab",
              { count: totalFleets },
              `Semua (${totalFleets})`
            )}
          </button>
        </div>
      )}

      {/* Fleet List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">
              {t("DaftarArmada.loadingFleet", {}, "Memuat data armada...")}
            </span>
          </div>
        ) : error ? (
          <div className="flex h-32 items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
              <p className="text-sm text-red-600">
                {t(
                  "DaftarArmada.errorLoadingFleet",
                  {},
                  "Gagal memuat data armada"
                )}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {t("DaftarArmada.tryAgainLater", {}, "Silakan coba lagi nanti")}
              </p>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <DataNotFound
              type="search"
              title={
                truckStatusFilter.length > 0 ||
                orderStatusFilter.length > 0 ||
                activeTab === "sos"
                  ? t(
                      "DaftarArmada.dataNotFoundWithFilter",
                      {},
                      "Data Tidak Ditemukan. Mohon coba hapus beberapa filter"
                    )
                  : t(
                      "DaftarArmada.keywordNotFound",
                      {},
                      "Keyword Tidak Ditemukan"
                    )
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((fleet) => {
              const isSOSVisual =
                fleet.hasSOSAlert &&
                (fleet.detailSOS?.sosStatus ?? "NEW") === "NEW";

              return (
                <div
                  key={fleet.fleetId}
                  onClick={() => handleFleetCardClick(fleet)}
                  className="cursor-pointer"
                >
                  <CardFleet
                    fleet={fleet}
                    isExpanded={expandedId === fleet.fleetId}
                    onToggleExpand={toggleExpanded}
                    onOpenDriverModal={handleOpenDriverModal}
                    onOpenResponseChangeModal={handleOpenResponseChangeModal}
                    onOpenRiwayatSOS={onOpenRiwayatSOS}
                    isSOS={isSOSVisual}
                    onAcknowledge={handleAcknowledge}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Driver Selection Modal */}
      {showDriverModal && selectedFleet && (
        <DriverSelectionModal
          onClose={() => setShowDriverModal(false)}
          onSuccess={handleDriverSelectionSuccess}
          vehicleId={selectedFleet.fleetId}
          vehiclePlate={selectedFleet.licensePlate}
          currentDriverId={selectedFleet.driver?.id || null}
          title={t("DaftarArmada.selectDriverTitle", {}, "Pilih Driver")}
          closeButtonClassName={"[&_svg]:text-primary-700"}
        />
      )}

      {/* Response Change Modal */}
      {showResponseChangeModal && selectedFleetForResponse && (
        <ModalResponseChange
          open={showResponseChangeModal}
          onOpenChange={() => {
            setShowResponseChangeModal(false);
            setSelectedFleetForResponse(null);
          }}
          changeData={
            selectedFleetForResponse.activeOrder?.changeDetails || {
              // Data dummy jika tidak ada di API
              oldLoadTime: "10 Jan 2025, 08:00 WIB",
              newLoadTime: "11 Jan 2025, 10:00 WIB",
              oldDistance: "150 km",
              newDistance: "180 km",
              oldRoute: "Surabaya - Malang",
              newRoute: "Surabaya - Kediri - Malang",
              oldIncome: "Rp 1.500.000",
              newIncome: "Rp 1.750.000",
            }
          }
          onRespond={handleRespondToChange}
        />
      )}

      {/* SOS Notification Modal */}
      <SosPopupNotification
        isOpen={showSosNotification}
        sosCount={sosCount}
        onClose={() => {
          setShowSosNotification(false);
          acknowledgeSosAlert();
        }}
        onConfirm={() => {
          setActiveTab("sos");
          setShowSosNotification(false);
          acknowledgeSosAlert();
        }}
      />
    </div>
  );
};

export default DaftarArmada;
