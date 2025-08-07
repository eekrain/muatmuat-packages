"use client";

import { useState } from "react";

import { AlertTriangle, Loader2, X } from "lucide-react";

import CardFleet from "@/components/Card/CardFleet";
import DataEmpty from "@/components/DataEmpty/DataEmpty";
import Search from "@/components/Search/Search";
import { useGetFleetList } from "@/services/Transporter/monitoring/getFleetList";

import { DriverSelectionModal } from "../../Driver/DriverSelectionModal";

const SOSContainer = ({ onClose, onExpand }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState(null);

  const {
    data: fleetData,
    isLoading,
    error,
    mutate: refetchFleets,
  } = useGetFleetList({ search: searchTerm });

  const fleets = fleetData?.fleets || [];
  const totalFleets = fleetData?.totalFleets || fleets.length;

  const toggleExpanded = (id) => {
    setExpandedId((prev) => {
      const newId = prev === id ? null : id;
      if (newId && onExpand) {
        onExpand(newId); // melempar fleetId ke parent
      }
      return newId;
    });
  };

  const handleOpenDriverModal = (fleet) => {
    setSelectedFleet(fleet);
    setShowDriverModal(true);
  };

  const handleDriverSelectionSuccess = (vehicleId, driverId) => {
    // Refresh the fleet list to show the updated driver
    refetchFleets();
    setShowDriverModal(false);
    setSelectedFleet(null);
  };

  const filteredData = fleets.filter(
    (fleet) =>
      fleet.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fleet.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Fleet List */}
      <div className="flex-1 overflow-y-auto px-[12px] pb-3">
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
          <DataEmpty />
        ) : (
          <div className="space-y-3">
            {filteredData.map((fleet) => (
              <CardFleet
                key={fleet.fleetId}
                fleet={fleet}
                isExpanded={expandedId === fleet.fleetId}
                onToggleExpand={toggleExpanded}
                onOpenDriverModal={handleOpenDriverModal}
                isSOS={fleet.hasSOSAlert}
              />
            ))}
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
    </div>
  );
};

export default SOSContainer;
