"use client";

import { useEffect, useState } from "react";

import { AlertTriangle, Loader2, X } from "lucide-react";

import CardFleet from "@/components/Card/CardFleet";
import DataNotFound from "@/components/DataNotFound/DataNotFound";
import NotificationDot from "@/components/NotificationDot/NotificationDot";
import Search from "@/components/Search/Search";
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
}) => {
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

  const {
    data: fleetData,
    isLoading,
    error,
    mutate: refetchFleets,
  } = useGetFleetList({
    search: searchTerm,
    sosOnly: activeTab === "sos",
    truckStatus: truckStatusFilter,
    orderStatus: orderStatusFilter,
  });

  const fleets = fleetData?.fleets || [];
  const totalFleets = fleetData?.totalFleets || fleets.length;
  const sosCount = fleetData?.filter?.sos || 0;
  const hasFilterData = fleetData?.filter;
  const { latestSosAlert, acknowledgeSosAlert } = useSosWebSocket();

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

  // Show SOS notification when new alert arrives
  useEffect(() => {
    if (latestSosAlert) {
      setShowSosNotification(true);
    }
  }, [latestSosAlert]);

  // Expand the selected fleet when selectedFleetId changes
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
    // TODO: Implement actual response logic
    console.log("Responding to change for fleet:", selectedFleetForResponse);
    setShowResponseChangeModal(false);
    setSelectedFleetForResponse(null);
  };

  const handleDriverSelectionSuccess = (vehicleId, driverId) => {
    refetchFleets();
    setShowDriverModal(false);
    setSelectedFleet(null);
  };

  const handleApplyFilter = (truckStatuses, orderStatuses) => {
    setTruckStatusFilter(truckStatuses);
    setOrderStatusFilter(orderStatuses);
    refetchFleets(); // Trigger a refetch with new filters
  };

  const handleFleetCardClick = (fleet) => {
    // Focus map on this fleet
    if (onFleetClick) {
      onFleetClick(fleet);
    }
    // Also update the selected fleet ID
    if (onFleetSelect) {
      onFleetSelect(fleet.fleetId);
    }
  };

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
      <div className="px-4">
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-[14px] font-bold text-gray-900">
            Daftar Armada{" "}
            <span className="font-semibold">({totalFleets} Armada)</span>
          </h2>
          <button className="text-blue-500" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search & filter */}
      <div className="mb-4 px-4">
        <div className="flex gap-3">
          <Search
            placeholder="Cari No. Polisi / Nama Driver"
            onSearch={setSearchTerm}
            autoSearch={true}
            debounceTime={300}
            defaultValue={searchTerm}
            inputClassName={activeTab !== "all" ? "w-[315px]" : "w-[229px]"}
          />
          {activeTab === "all" && (
            <FilterPopoverArmada
              onApplyFilter={handleApplyFilter}
              filterCounts={fleetData?.filter}
            />
          )}
        </div>
      </div>

      {/* filter tabs */}
      {hasFilterData && sosCount !== 0 && (
        <div className="flex gap-2 px-4 pb-3">
          <button
            className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
              activeTab === "sos"
                ? "w-auto min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                : "w-auto min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
            }`}
            onClick={() => setActiveTab("sos")}
          >
            SOS ({sosCount})
            <NotificationDot
              size="sm"
              color="red"
              position="absolute"
              positionClasses="top-0 right-0"
            />
          </button>
          <button
            className={`relative flex h-full items-center justify-center gap-1 rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors ${
              activeTab === "all"
                ? "w-auto min-w-[79px] border-[#176CF7] bg-[#E2F2FF] text-[#176CF7]"
                : "w-auto min-w-[79px] border-[#F1F1F1] bg-[#F1F1F1] text-[#000000]"
            }`}
            onClick={() => setActiveTab("all")}
          >
            Semua ({totalFleets})
          </button>
        </div>
      )}

      {/* Fleet List */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading fleet data...</span>
          </div>
        ) : error ? (
          <div className="flex h-32 items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
              <p className="text-sm text-red-600">Failed to load fleet data</p>
              <p className="mt-1 text-xs text-gray-500">
                Please try again later
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
                  ? "Data Tidak Ditemukan. Mohon coba hapus beberapa filter"
                  : "Keyword Tidak Ditemukan"
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((fleet) => {
              const isSOSVisual =
                fleet.hasSOSAlert &&
                (fleet.detailSOS?.sosStatus ??
                  (fleet.hasSOSAlert ? "NEW" : "ACKNOWLEDGED")) === "NEW";

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
          title="Pasangkan Driver"
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
