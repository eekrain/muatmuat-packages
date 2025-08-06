"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import DataNotFound from "@/components/DataNotFound/DataNotFound";
import { InfoTooltip } from "@/components/Form/InfoTooltip";
import { MapWithPath } from "@/components/MapContainer/MapWithPath";
import {
  MonitoringTabTrigger,
  MonitoringTabs,
  MonitoringTabsContent,
  MonitoringTabsList,
} from "@/components/MonitoringTabs/MonitoringTabs";
import { NotificationCount } from "@/components/NotificationDot/NotificationCount";
import DaftarArmada from "@/container/Transporter/Monitoring/DaftarArmada/DaftarArmada";
import { MapInterfaceOverlay } from "@/container/Transporter/Monitoring/Map/MapInterfaceOverlay";
import { NoFleetOverlay } from "@/container/Transporter/Monitoring/Map/NoFleetOverlay";
import PermintaanAngkut from "@/container/Transporter/Monitoring/PermintaanAngkut/PermintaanAngkut";
import UrgentIssue from "@/container/Transporter/Monitoring/UrgentIssue/UrgentIssue";
import { cn } from "@/lib/utils";
import { useGetFleetCount } from "@/services/Transporter/monitoring/getFleetCount";
import { useGetFleetLocations } from "@/services/Transporter/monitoring/getFleetLocations";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: fleetData, isLoading } = useGetFleetCount();
  const { data: fleetLocationsData } = useGetFleetLocations();
  const [isBottomExpanded, setIsBottomExpanded] = useState(true);
  const [mapZoom, setMapZoom] = useState(12);
  const [showLeftPanel, setShowLeftPanel] = useState(false);

  // Map query param values to tab values
  const getTabValue = (queryValue) => {
    const tabMap = {
      request: "permintaan",
      urgent: "urgent",
    };
    return tabMap[queryValue] || "permintaan";
  };

  // Map tab values to query param values
  const getQueryValue = (tabValue) => {
    const queryMap = {
      permintaan: "request",
      urgent: "urgent",
    };
    return queryMap[tabValue] || "request";
  };

  // Get initial tab value from query parameter
  const tabParam = searchParams.get("tab");
  const initialTab = getTabValue(tabParam);
  const [selectedTab, setSelectedTab] = useState(initialTab);

  // Update tab when query parameter changes
  useEffect(() => {
    const newTab = getTabValue(tabParam);
    setSelectedTab(newTab);
  }, [tabParam]);

  // Handle tab change
  const handleTabChange = (value) => {
    setSelectedTab(value);
    const queryValue = getQueryValue(value);
    router.push(`/monitoring?tab=${queryValue}`);
  };

  const hasFleet = fleetData?.hasFleet || false;

  // Mock notification counts - replace with actual API data
  const requestCount = 100; // Replace with actual count from API
  const urgentCount = 2; // Replace with actual count from API

  // Zoom handlers
  const handleZoomIn = () => {
    setMapZoom((prevZoom) => Math.min(prevZoom + 1, 20)); // Max zoom level 20
  };

  const handleZoomOut = () => {
    setMapZoom((prevZoom) => Math.max(prevZoom - 1, 1)); // Min zoom level 1
  };

  // Panel handlers
  const handleOpenLeftPanel = () => {
    setShowLeftPanel(true);
    setIsBottomExpanded(false);
  };

  const handleCloseLeftPanel = () => {
    setShowLeftPanel(false);
  };

  const handleToggleBottomPanel = () => {
    setIsBottomExpanded(!isBottomExpanded);
    if (!isBottomExpanded) {
      setShowLeftPanel(false);
    }
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
    <div className="relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] grid h-[calc(100vh-92px)] w-screen grid-cols-[1fr_429px] gap-4 overflow-hidden pl-6">
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
                : `calc(100vh - 92px - 16px - 16px - 64px)`,
              width: showLeftPanel ? "calc(100% - 332px)" : "100%",
              marginLeft: showLeftPanel ? "332px" : "0",
              transition:
                "height 300ms ease-in-out, width 300ms ease-in-out, margin-left 300ms ease-in-out",
            }}
          />
          {!isLoading && !hasFleet && <NoFleetOverlay />}
          {!isLoading && hasFleet && (
            <MapInterfaceOverlay
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onClickDaftarArmada={handleOpenLeftPanel}
              hideTopNavigation={showLeftPanel}
            />
          )}

          {/* Left Panel - Daftar Armada */}
          <div
            className={cn(
              "absolute left-0 top-0 z-20 h-full w-[350px] rounded-r-xl bg-white shadow-xl transition-transform duration-300",
              showLeftPanel ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex h-full">
              <DaftarArmada onClose={handleCloseLeftPanel} />
            </div>
          </div>
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
            <div className="flex h-16 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold">
                  Daftar <br /> Pesanan Aktif
                </h3>
                <InfoTooltip
                  side="left"
                  appearance={{
                    iconClassName: "size-3.5",
                  }}
                >
                  <p>Daftar pesanan aktif yang sedang berlangsung.</p>
                </InfoTooltip>
              </div>
              <button
                onClick={handleToggleBottomPanel}
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
          <MonitoringTabs value={selectedTab} onValueChange={handleTabChange}>
            <MonitoringTabsList>
              <MonitoringTabTrigger
                value="permintaan"
                icon="/img/monitoring/permintaan-angkut.png"
                iconAlt="Permintaan Angkut"
                activeColor="muat-trans-primary-400"
                position="left"
              >
                <div className="flex items-center gap-2">
                  <span>Permintaan Angkut</span>
                  <NotificationCount
                    count={requestCount}
                    backgroundColor="error"
                    color="white"
                    variant="bordered"
                    borderColor="border-[#461B02]"
                    animated
                  />
                </div>
              </MonitoringTabTrigger>
              <MonitoringTabTrigger
                value="urgent"
                icon="/img/monitoring/urgent-issue.png"
                iconAlt="Urgent Issue"
                activeColor="muat-trans-primary-400"
                position="right"
              >
                <div className="flex items-center gap-2">
                  <span>Urgent Issue</span>
                  <NotificationCount
                    count={urgentCount}
                    backgroundColor="error"
                    color="white"
                    variant="bordered"
                    borderColor="border-[#461B02]"
                    animated
                  />
                </div>
              </MonitoringTabTrigger>
            </MonitoringTabsList>

            <MonitoringTabsContent value="permintaan">
              <PermintaanAngkut />
            </MonitoringTabsContent>

            <MonitoringTabsContent value="urgent">
              <UrgentIssue />
            </MonitoringTabsContent>
          </MonitoringTabs>
        </div>
      </div>
    </div>
  );
};
export default Page;
