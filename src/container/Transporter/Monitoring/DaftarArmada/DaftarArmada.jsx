"use client";

import { useState } from "react";

import {
  AlertTriangle,
  ChevronDown,
  Loader2,
  MapPin,
  Phone,
  SlidersHorizontal,
  Truck,
  User,
  X,
} from "lucide-react";

import BadgeStatus from "@/components/Badge/BadgeStatus";
import Search from "@/components/Search/Search";
import { cn } from "@/lib/utils";
import { getTruckIcon } from "@/lib/utils/armadaStatus";
import { useGetFleetList } from "@/services/Transporter/monitoring/getFleetList";

import { DriverSelectionModal } from "../../Driver/DriverSelectionModal";

// Adjust the import path as needed

const DaftarArmada = ({ onClose, onExpand }) => {
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

  const needsResponseIcon = (needResponseChange) => {
    if (needResponseChange) {
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFF9C1]">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </div>
      );
    }
    return null;
  };

  const showSOSIcon = (hasSOSAlert) => {
    if (hasSOSAlert) {
      return (
        <BadgeStatus variant="warning" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          <span>SOS</span>
        </BadgeStatus>
      );
    }
    return null;
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
        <div className="flex gap-[12px]">
          <Search
            placeholder="Cari No. Polisi / Nama Driver"
            onSearch={setSearchTerm}
            autoSearch={true}
            debounceTime={300}
            defaultValue={searchTerm}
            inputClassName="w-[229px]"
          />
          <button className="flex h-8 items-center space-x-2 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-600">
            <span className="text-gray-600">Filter</span>
            <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          </button>
        </div>
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
          <div className="flex h-32 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-gray-300"></div>
              <p className="text-sm text-gray-600">No fleet found</p>
              <p className="mt-1 text-xs text-gray-500">
                Try adjusting your search
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((fleet) => {
              const isExpanded = expandedId === fleet.fleetId;

              return (
                <div
                  key={fleet.fleetId}
                  className={cn(
                    "overflow-hidden rounded-lg border transition-all duration-200",
                    isExpanded
                      ? "border-[#FFC217] bg-[#FFFBEB]"
                      : "border-gray-200 bg-white hover:border-[#FFC217] hover:bg-[#FFFBEB]"
                  )}
                >
                  {/* Header / clickable */}
                  <div
                    className="cursor-pointer px-[12px] py-3"
                    onClick={() => toggleExpanded(fleet.fleetId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center">
                          <img
                            src={`/icons/armada-truck/${getTruckIcon(fleet.status)}`}
                            alt="Truck icon"
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <span className="text-[14px] font-bold text-gray-900">
                          {fleet.licensePlate}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {needsResponseIcon(fleet.needsResponseChange)}
                        {showSOSIcon(fleet.hasSOSAlert)}
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 text-gray-400 transition-transform",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </div>
                    </div>
                    {!isExpanded && (
                      <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="mt-1 flex items-center space-x-2">
                            <User className="h-4 w-4 flex-shrink-0 text-[#461B02]" />
                            <div className="min-w-0">
                              <label className="text-xs text-gray-500">
                                Driver
                              </label>
                              <div className="truncate font-semibold text-gray-900">
                                {fleet.driver?.name || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="mt-1 flex items-center space-x-2">
                            <MapPin className="h-4 w-4 flex-shrink-0 text-[#461B02]" />
                            <div className="min-w-0">
                              <label className="text-xs text-gray-500">
                                Lokasi Terakhir
                              </label>
                              <div className="truncate font-semibold text-gray-900">
                                {fleet.lastLocation?.address
                                  ? `${fleet.lastLocation.address.district}, ${fleet.lastLocation.address.city}`
                                  : "Unknown"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="space-y-3 px-[12px] pb-3 text-sm">
                      {/* Row 1 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="mt-1 flex items-center space-x-2">
                            <User className="h-4 w-4 text-[#461B02]" />
                            <div>
                              <label className="text-xs text-gray-500">
                                Driver
                              </label>
                              <div className="truncate font-semibold text-gray-900">
                                {fleet.driver?.name || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="mt-1 flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-[#461B02]" />
                            <div>
                              <label className="text-xs text-gray-500">
                                No. HP Driver
                              </label>
                              <div className="truncate font-semibold text-gray-900">
                                {fleet.driver?.phoneNumber || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="mt-1 flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-[#461B02]" />
                            <div>
                              <label className="text-xs text-gray-500">
                                Lokasi Terakhir
                              </label>
                              <div className="truncate font-semibold text-gray-900">
                                {fleet.lastLocation?.address?.district ||
                                  "Unknown"}
                              </div>
                              <label className="text-xs text-gray-500">
                                {fleet.lastLocation?.address?.city || "Unknown"}
                              </label>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="mt-1 flex items-center space-x-2">
                            <Truck className="h-4 w-4 text-[#461B02]" />
                            <div>
                              <label className="text-xs text-gray-500">
                                Armada
                              </label>
                              <div className="truncate font-semibold text-gray-900">
                                {fleet.carrierType?.name || "-"}
                              </div>
                              <label className="text-xs text-gray-500">
                                {fleet.truckType?.name || "-"}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tombol Pasangkan Driver */}
                      {!fleet.driver?.name && (
                        <div className="pt-1">
                          <button
                            className="w-full rounded-xl bg-[#FFC217] px-4 py-2 text-sm font-medium text-[#461B02]"
                            onClick={() => handleOpenDriverModal(fleet)}
                          >
                            Pasangkan Driver
                          </button>
                        </div>
                      )}

                      {/* detail on duty*/}
                      {fleet.status === "ON_DUTY" && (
                        <div className="flex w-full flex-col rounded bg-[#F8F8FB] px-4 py-3">
                          <p className="text-gray-500">No. Pesanan</p>
                          <h4 className="font-semibold">{fleet?.fleetId}</h4>
                          <p className="text-gray-500">Lokasi Muat & Bongkar</p>
                          <h4>lokasi awal</h4>
                          <h4>lokasi akhir</h4>
                          <div className="flex">
                            <div>proses maut</div>
                            <button>lihat detail</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
    </div>
  );
};

export default DaftarArmada;
