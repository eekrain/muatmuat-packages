"use client";

import Image from "next/image";
import { useState } from "react";

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { MapWithPath } from "@/components/MapContainer/MapWithPath";
import { MapInterfaceOverlay } from "@/components/monitoring/MapInterfaceOverlay";
import { NoFleetOverlay } from "@/components/monitoring/NoFleetOverlay";
import PermintaanAngkut from "@/container/Transporter/Monitoring/PermintaanAngkut/PermintaanAngkut";
import { cn } from "@/lib/utils";
import { useGetFleetCount } from "@/services/Transporter/monitoring/getFleetCount";
import { useGetFleetLocations } from "@/services/Transporter/monitoring/getFleetLocations";

const Page = () => {
  const { data: fleetData, isLoading } = useGetFleetCount();
  const { data: fleetLocationsData } = useGetFleetLocations();
  const [activeTab, setActiveTab] = useState("tersedia");
  const [isBottomExpanded, setIsBottomExpanded] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState("permintaan");
  const [mapZoom, setMapZoom] = useState(12);

  const hasFleet = fleetData?.hasFleet || false;

  // Zoom handlers
  const handleZoomIn = () => {
    setMapZoom((prevZoom) => Math.min(prevZoom + 1, 20)); // Max zoom level 20
  };

  const handleZoomOut = () => {
    setMapZoom((prevZoom) => Math.max(prevZoom - 1, 1)); // Min zoom level 1
  };

  // Convert fleet locations to map markers
  const fleetMarkers =
    fleetLocationsData?.fleets?.map((fleet) => {
      let icon = "/icons/marker-truck.svg";

      // You can customize icons based on status
      if (fleet.hasSOSAlert) {
        icon = "/icons/marker-truck.svg"; // TODO: Add SOS truck icon when available
      } else if (fleet.operationalStatus === "BUSY") {
        icon = "/icons/marker-truck.svg"; // TODO: Add busy truck icon when available
      }

      return {
        position: { lat: fleet.latitude, lng: fleet.longitude },
        title: fleet.licensePlate,
        icon: icon,
        fleet: fleet, // Keep fleet data for additional info
      };
    }) || [];

  return (
    <div className="relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] grid h-[calc(100vh-92px)] w-screen grid-cols-[1fr_400px] gap-4 overflow-hidden pl-6">
      {/* Left Section - Map and Bottom Panel */}
      <div className="flex h-full flex-col gap-4 pt-4">
        {/* Map Container */}
        <div className="relative flex-1 overflow-hidden rounded-[20px] bg-white shadow-lg">
          <MapWithPath
            locationMarkers={fleetMarkers}
            center={
              fleetMarkers.length > 0
                ? fleetMarkers[0].position
                : {
                    lat: -6.2,
                    lng: 106.816666,
                  }
            }
            zoom={mapZoom}
            mapContainerStyle={{
              height: isBottomExpanded
                ? `calc((100vh - 92px - 16px - 16px) / 2)`
                : `calc(100vh - 92px - 16px - 16px - 48px)`,
              width: "100%",
              transition: "height 300ms ease-in-out",
            }}
          />
          {!isLoading && !hasFleet && <NoFleetOverlay />}
          {!isLoading && hasFleet && (
            <MapInterfaceOverlay
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
            />
          )}
        </div>

        {/* Bottom Panel - Daftar Pesanan Aktif */}
        <div
          className={cn(
            "rounded-t-[20px] bg-white shadow-lg transition-all duration-300"
          )}
          style={{
            height: isBottomExpanded
              ? "calc((100vh - 92px - 16px - 16px) / 2)"
              : "calc(100vh - 100vh + 64px)",
          }}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  Daftar Pesanan Aktif
                </h3>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1C4.13 1 1 4.13 1 8s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm1 11H7v-2h2v2zm0-3H7V4h2v5z"
                    fill="#9CA3AF"
                  />
                </svg>
              </div>
              <button
                onClick={() => setIsBottomExpanded(!isBottomExpanded)}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
              >
                <svg
                  className={cn(
                    "h-5 w-5 transform text-gray-600 transition-transform",
                    isBottomExpanded && "rotate-180"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
            </div>

            {isBottomExpanded && (
              <div className="flex-1 overflow-y-auto p-4">
                <DataNotFound className="h-full gap-y-5 pb-10" type="data">
                  <div className="text-center">
                    <p className="text-base font-semibold text-neutral-600">
                      Oops, daftar pesananmu masih kosong
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Mohon bersabar untuk menanti permintaan baru
                    </p>
                  </div>
                </DataNotFound>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="h-full">
        <div className="flex h-full flex-col overflow-hidden rounded-l-xl bg-white shadow-lg">
          {/* Tab Header */}
          <div className="flex h-12 w-full flex-row items-start bg-white">
            <button
              onClick={() => setActiveRightTab("permintaan")}
              className={cn(
                "flex h-full flex-1 items-center justify-center border-b-2 border-r transition-colors",
                activeRightTab === "permintaan"
                  ? "border-b-2 border-b-muat-trans-primary-400 bg-muat-trans-primary-50"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              <div className="flex h-2 flex-row items-center gap-2">
                <Image
                  src="/img/monitoring/permintaan-angkut.png"
                  alt="Permintaan Angkut"
                  width={20}
                  height={20}
                />
                <span
                  className="text-xs font-bold leading-[120%] text-black"
                  style={{
                    fontFamily: "Avenir Next LT Pro",
                  }}
                >
                  Permintaan Angkut
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveRightTab("urgent")}
              className={cn(
                "flex h-full flex-1 items-center justify-center border-b-2 border-l transition-colors",
                activeRightTab === "urgent"
                  ? "border-b-2 border-b-red-500 bg-white text-red-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              <div className="flex h-2 flex-row items-center gap-2">
                <Image
                  src="/img/monitoring/urgent-issue.png"
                  alt="Urgent Issue"
                  width={20}
                  height={20}
                />
                <span
                  className="text-xs font-bold leading-[120%] text-black"
                  style={{
                    fontFamily: "Avenir Next LT Pro",
                  }}
                >
                  Urgent Issue
                </span>
              </div>
            </button>
          </div>

          {/* Content Area */}
          {activeRightTab === "permintaan" && (
            <>
              <PermintaanAngkut />
            </>
          )}

          {activeRightTab === "urgent" && (
            // <div className="flex-1 overflow-y-auto p-4">
            //   <h2 className="mb-4 text-lg font-semibold text-gray-800">
            //     Urgent Issues
            //   </h2>
            //   <DataNotFound className="h-full gap-y-5" type="data">
            //     <p className="text-center text-base font-semibold text-neutral-600">
            //       Tidak ada urgent issue saat ini
            //     </p>
            //   </DataNotFound>
            // </div>
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
export default Page;
