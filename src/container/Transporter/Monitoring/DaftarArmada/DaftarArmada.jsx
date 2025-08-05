"use client";

import { useState } from "react";

import {
  AlertTriangle,
  ChevronDown,
  Loader2,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  Truck,
  User,
  X,
} from "lucide-react";

import { getTruckIcon } from "@/lib/utils/armadaStatus";
import { useGetFleetList } from "@/services/Transporter/monitoring/getFleetList";

const DaftarArmada = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState({});

  // Fetch fleet data using SWR
  const {
    data: fleetData,
    isLoading,
    error,
  } = useGetFleetList({
    search: searchTerm,
  });

  // Process API data
  const fleets = fleetData?.fleets || [];
  const totalFleets = fleetData?.totalFleets || fleets.length;

  const getStatusIcon = (status) => {
    if (status === "EMERGENCY" || status === "MAINTENANCE") {
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FFF9C1]">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </div>
      );
    }
    return null;
  };

  const formatLastUpdate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleExpanded = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredData = fleets.filter(
    (fleet) =>
      fleet.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fleet.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="flex flex-col rounded-r-xl bg-white pt-4"
      style={{
        width: "350px",
        height: "532px",
        borderTopRightRadius: "12px",
        borderBottomRightRadius: "12px",
      }}
    >
      {/* Header */}
      <div className="mb-4 px-4">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center space-x-2">
            <h1 className="text-[14px] font-bold text-gray-900">
              Daftar Armada{" "}
              <span className="font-semibold">({totalFleets} Armada)</span>
            </h1>
          </div>
          <button className="text-blue-500" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 px-4">
        <div
          className="flex"
          style={{
            width: "318px",
            height: "32px",
            gap: "12px",
          }}
        >
          <div className="relative h-full flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Cari No. Polisi / Nama Driver"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-full w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm placeholder:text-[12px] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-600"
            style={{ height: "100%" }}
          >
            <span className="text-gray-600">Filter</span>
            <SlidersHorizontal className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Fleet List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
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
          <div className="space-y-4">
            {filteredData.map((fleet) => (
              <div
                key={fleet.fleetId}
                className={`overflow-hidden rounded-lg border bg-white transition-all duration-200 ${
                  expandedItems[fleet.fleetId]
                    ? "border-[#FFC217] bg-[#FFFBEB]"
                    : "border-gray-200 hover:border-[#FFC217] hover:bg-[#FFFBEB]"
                }`}
              >
                <div
                  className="cursor-pointer p-4"
                  onClick={() => toggleExpanded(fleet.fleetId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-6 w-6 items-center justify-center">
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
                      {getStatusIcon(fleet.status)}
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          expandedItems[fleet.fleetId] ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Driver and location info - now side by side */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <User className="h-4 w-4 flex-shrink-0 text-[#461B02]" />
                      <span className="truncate">
                        {fleet.driver?.name || "-"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-[#461B02]" />
                      <span className="truncate">
                        {fleet.lastLocation?.address || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                {expandedItems[fleet.fleetId] && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-[#461B02]" />
                        <span className="text-gray-900">
                          {fleet.driver?.phoneNumber || "-"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-[#461B02]" />
                        <span className="text-gray-900">
                          {fleet.truckType?.name || "-"}
                        </span>
                      </div>
                      <div className="col-span-2 flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-gray-900">
                          {fleet.status?.replace("_", " ")}
                        </span>
                      </div>
                      <div className="col-span-2 flex justify-between">
                        <span className="text-gray-600">Carrier:</span>
                        <span className="text-gray-900">
                          {fleet.carrierType?.name || "-"}
                        </span>
                      </div>
                      <div className="col-span-2 flex justify-between">
                        <span className="text-gray-600">Last Update:</span>
                        <span className="text-gray-900">
                          {formatLastUpdate(fleet.lastLocation?.lastUpdate)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default DaftarArmada;
