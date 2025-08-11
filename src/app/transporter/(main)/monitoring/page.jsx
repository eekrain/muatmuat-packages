"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  MonitoringTabTrigger,
  MonitoringTabs,
  MonitoringTabsContent,
  MonitoringTabsList,
} from "@/components/MonitoringTabs/MonitoringTabs";
import { NotificationCount } from "@/components/NotificationDot/NotificationCount";
import DaftarArmada from "@/container/Transporter/Monitoring/DaftarArmada/DaftarArmada";
import DaftarPesananAktif from "@/container/Transporter/Monitoring/DaftarPesananAktif/DaftarPesananAktif";
import { MapInterfaceOverlay } from "@/container/Transporter/Monitoring/Map/MapInterfaceOverlay";
import { MapMonitoring } from "@/container/Transporter/Monitoring/Map/MapMonitoring";
import { NoFleetOverlay } from "@/container/Transporter/Monitoring/Map/NoFleetOverlay";
import PermintaanAngkut from "@/container/Transporter/Monitoring/PermintaanAngkut/PermintaanAngkut";
import SOSContainer from "@/container/Transporter/Monitoring/SOS/SOSContainer";
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
  const [mapZoom, setMapZoom] = useState(null); // Initialize as null, will be set from calculated bounds
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [leftPanelMode, setLeftPanelMode] = useState("armada"); // "armada" or "sos"
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLicensePlate, setShowLicensePlate] = useState(true);
  const [autoFitBounds, setAutoFitBounds] = useState(true);
  const [mapCenter, setMapCenter] = useState(null); // Track current map center
  const [hasMapInteraction, setHasMapInteraction] = useState(false); // Track if user has interacted with map
  const [selectedTruckFilters, setSelectedTruckFilters] = useState([]);
  const [selectedOrderFilters, setSelectedOrderFilters] = useState([]);
  const [selectedFleetId, setSelectedFleetId] = useState(null);

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
    // Exit fullscreen mode when a tab is clicked
    if (isFullscreen) {
      setIsFullscreen(false);
    }
  };

  const hasFleet = fleetData?.hasFleet || false;

  // Mock notification counts - replace with actual API data
  const requestCount = 100; // Replace with actual count from API
  const urgentCount = 2; // Replace with actual count from API

  // Panel handlers
  const handleOpenLeftPanel = () => {
    setLeftPanelMode("armada");
    setShowLeftPanel(true);
    setIsBottomExpanded(false);
  };

  const handleOpenSOSPanel = () => {
    setLeftPanelMode("sos");
    setShowLeftPanel(true);
    setIsBottomExpanded(false);
  };

  const handleCloseLeftPanel = () => {
    setShowLeftPanel(false);
    setIsBottomExpanded(true);
  };

  const handleApplyFilter = (truckStatuses, orderStatuses) => {
    setSelectedTruckFilters(truckStatuses);
    setSelectedOrderFilters(orderStatuses);
  };

  const handleToggleBottomPanel = () => {
    setIsBottomExpanded(!isBottomExpanded);
    if (!isBottomExpanded) {
      setShowLeftPanel(false);
    }
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setShowLeftPanel(false);
    }
  };

  // Function to calculate bounds and zoom level for all fleet vehicles
  const calculateMapBounds = (markers) => {
    if (!markers || markers.length === 0) {
      return {
        center: { lat: -6.2, lng: 106.816666 }, // Default Jakarta
        zoom: 12,
      };
    }

    if (markers.length === 1) {
      return {
        center: markers[0].position,
        zoom: 15, // Closer zoom for single vehicle
      };
    }

    // Calculate bounds
    let minLat = markers[0].position.lat;
    let maxLat = markers[0].position.lat;
    let minLng = markers[0].position.lng;
    let maxLng = markers[0].position.lng;

    markers.forEach((marker) => {
      minLat = Math.min(minLat, marker.position.lat);
      maxLat = Math.max(maxLat, marker.position.lat);
      minLng = Math.min(minLng, marker.position.lng);
      maxLng = Math.max(maxLng, marker.position.lng);
    });

    // Calculate center - geographic midpoint of all fleet positions
    const center = {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2,
    };

    // Calculate zoom level based on bounds
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);

    // Comprehensive zoom levels for better granularity
    let zoom = 12; // Default zoom

    // Define zoom levels with finer ranges
    const zoomLevels = [
      { maxDiff: 0.001, zoom: 18 }, // Single building
      { maxDiff: 0.003, zoom: 17 }, // Few buildings
      { maxDiff: 0.005, zoom: 16 }, // Street level
      { maxDiff: 0.01, zoom: 15 }, // Neighborhood
      { maxDiff: 0.02, zoom: 14 }, // Small district
      { maxDiff: 0.04, zoom: 13 }, // District
      { maxDiff: 0.08, zoom: 12 }, // Multiple districts
      { maxDiff: 0.15, zoom: 11 }, // City (Surabaya spread)
      { maxDiff: 0.3, zoom: 10 }, // Greater city area
      { maxDiff: 0.6, zoom: 9 }, // Metropolitan area
      { maxDiff: 1.2, zoom: 8 }, // Between close cities
      { maxDiff: 2.5, zoom: 8 }, // Regional (100-200km)
      { maxDiff: 4, zoom: 8 }, // Cilacap-Surabaya (~3.7°)
      { maxDiff: 6, zoom: 7 }, // Inter-province
      { maxDiff: 10, zoom: 6 }, // Jakarta-Surabaya (~6°)
      { maxDiff: 15, zoom: 5 }, // Half country
      { maxDiff: 25, zoom: 5 }, // Most of Indonesia
      { maxDiff: 35, zoom: 4 }, // Jakarta-Papua
      { maxDiff: 50, zoom: 4 }, // Entire Indonesia
      { maxDiff: Infinity, zoom: 3 }, // Continental view
    ];

    // Find appropriate zoom level
    for (const level of zoomLevels) {
      if (maxDiff < level.maxDiff) {
        zoom = level.zoom;
        break;
      }
    }

    return { center, zoom };
  };

  // Handle truck click on map - moved before usage
  const handleTruckClick = (marker) => {
    setSelectedFleetId(marker.fleet.id);
    // Open the left panel if it's not already open
    if (!showLeftPanel) {
      handleOpenLeftPanel();
    }
    // Center map on the clicked truck
    setMapCenter({
      lat: marker.position.lat,
      lng: marker.position.lng,
    });
    setMapZoom(16); // Zoom in to focus on the truck
    setAutoFitBounds(false); // Disable auto-fit
    setHasMapInteraction(false);
  };

  // Handle fleet click from list - focus map on selected fleet
  const handleFleetClickFromList = (fleet) => {
    // Find the corresponding marker from fleet locations
    const marker = allFleetMarkers.find((m) => m.fleet.id === fleet.fleetId);
    if (marker) {
      // Center map on the selected fleet
      setMapCenter({
        lat: fleet.lastLocation.latitude,
        lng: fleet.lastLocation.longitude,
      });
      setMapZoom(16); // Zoom in to focus on the truck
      setAutoFitBounds(false); // Disable auto-fit
      setHasMapInteraction(false);
    }
  };

  // Convert fleet locations to map markers and apply filters
  const allFleetMarkers =
    fleetLocationsData?.fleets?.map((fleet) => {
      let icon = "/img/monitoring/truck/gray.png"; // Default

      // Map operational status to truck icon colors
      switch (fleet.operationalStatus) {
        case "ON_DUTY":
          icon = "/img/monitoring/truck/blue.png";
          break;
        case "READY_FOR_ORDER":
          icon = "/img/monitoring/truck/green.png";
          break;
        case "NOT_PAIRED":
          icon = "/img/monitoring/truck/gray.png";
          break;
        case "WAITING_LOADING_TIME":
          icon = "/img/monitoring/truck/yellow.png";
          break;
        case "INACTIVE":
          icon = "/img/monitoring/truck/red.png";
          break;
        default:
          icon = "/img/monitoring/truck/gray.png";
      }

      return {
        position: { lat: fleet.latitude, lng: fleet.longitude },
        title: `${fleet.licensePlate} - ${fleet.driverName}`,
        icon: icon,
        rotation: fleet.heading || 0, // Pass heading as rotation
        fleet: fleet, // Keep fleet data for additional info
        onClick: handleTruckClick, // Add click handler
      };
    }) || [];

  // Apply filters to fleet markers
  const fleetMarkers = allFleetMarkers.filter((marker) => {
    // If no filters selected, show all
    if (
      selectedTruckFilters.length === 0 &&
      selectedOrderFilters.length === 0
    ) {
      return true;
    }

    // Check truck status filter
    if (selectedTruckFilters.length > 0) {
      if (!selectedTruckFilters.includes(marker.fleet.operationalStatus)) {
        return false;
      }
    }

    // Check order status filter (if needed)
    if (selectedOrderFilters.length > 0) {
      // Add logic for order status filtering if applicable
      // For now, we'll just check if the fleet has any order that needs response
      if (selectedOrderFilters.includes("NEEDS_RESPONSE")) {
        // This would need to be implemented based on your actual data structure
        // return marker.fleet.hasOrderNeedsResponse || false;
      }
    }

    return true;
  });

  // Calculate fleet counts for filter popover
  const fleetCounts = allFleetMarkers.reduce((acc, marker) => {
    const status = marker.fleet.operationalStatus;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Always calculate the bounds to get the proper center
  const calculatedBounds = calculateMapBounds(fleetMarkers);

  // Zoom handlers - moved after calculatedBounds
  const handleZoomIn = () => {
    setAutoFitBounds(false); // Disable auto-fit when user manually zooms
    setHasMapInteraction(true); // Mark that user has interacted
    // Use current zoom or calculated zoom as base
    const currentZoom = mapZoom || calculatedBounds.zoom;
    setMapZoom(Math.min(currentZoom + 1, 20)); // Max zoom level 20
  };

  const handleZoomOut = () => {
    setAutoFitBounds(false); // Disable auto-fit when user manually zooms
    setHasMapInteraction(true); // Mark that user has interacted
    // Use current zoom or calculated zoom as base
    const currentZoom = mapZoom || calculatedBounds.zoom;
    setMapZoom(Math.max(currentZoom - 1, 1)); // Min zoom level 1
  };

  const handleResetZoom = () => {
    setAutoFitBounds(true); // Re-enable auto-fit to show all vehicles
    setMapCenter(null); // Reset to calculated center
    setMapZoom(null); // Reset zoom to recalculate
    setHasMapInteraction(false); // Reset interaction state when centering
  };

  // Handle map drag - disable auto-fit when user drags the map
  const handleMapDrag = () => {
    setAutoFitBounds(false);
    setHasMapInteraction(true); // Mark that user has interacted
  };

  // Handle map zoom change from map interaction
  const handleMapZoomChange = (newZoom) => {
    setAutoFitBounds(false);
    setHasMapInteraction(true); // Mark that user has interacted
    setMapZoom(newZoom);
  };

  // Handle center change from map interaction
  const handleMapCenterChange = (newCenter) => {
    setMapCenter(newCenter);
  };

  // Determine which center to use
  const currentCenter = mapCenter || calculatedBounds.center;

  // Use calculated center and zoom when auto-fit is enabled
  const mapConfig = autoFitBounds
    ? calculatedBounds // Use calculated center and zoom
    : {
        center: currentCenter, // Use current center (doesn't change on zoom)
        zoom: mapZoom || calculatedBounds.zoom, // Use manual zoom or calculated if not set
      };

  return (
    <>
      <div
        className={cn(
          "relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] h-[calc(100vh-92px)] w-screen overflow-hidden pl-6 transition-all duration-300 ease-in-out",
          isFullscreen
            ? "grid grid-cols-1 pr-6"
            : "grid grid-cols-[1fr_429px] gap-4"
        )}
      >
        {/* Left Section - Map and Bottom Panel */}
        <div className="flex h-full flex-col gap-4 pt-4 transition-all duration-300 ease-in-out">
          {/* Map Container */}
          <div className="relative flex-1 overflow-hidden rounded-[20px] bg-white shadow-lg transition-all duration-300 ease-in-out">
            <MapMonitoring
              locationMarkers={fleetMarkers}
              center={mapConfig.center}
              zoom={autoFitBounds ? mapConfig.zoom : mapZoom}
              showLicensePlate={showLicensePlate}
              onMapDrag={handleMapDrag}
              onMapZoom={handleMapZoomChange}
              onMapCenterChange={handleMapCenterChange}
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
                onClickSOS={handleOpenSOSPanel}
                onApplyFilter={handleApplyFilter}
                fleetCounts={fleetCounts}
                hideTopNavigation={showLeftPanel}
                onToggleFullscreen={handleToggleFullscreen}
                isFullscreen={isFullscreen}
                showLicensePlate={showLicensePlate}
                onToggleLicensePlate={setShowLicensePlate}
                onCenter={handleResetZoom}
                hasMapInteraction={hasMapInteraction}
              />
            )}

            {/* Left Panel - Daftar Armada or SOS */}
            <div
              className={cn(
                "absolute left-0 top-0 z-20 h-full w-[350px] rounded-r-xl bg-white shadow-muat transition-transform duration-300 ease-in-out",
                showLeftPanel ? "translate-x-0" : "-translate-x-full"
              )}
            >
              {leftPanelMode === "sos" ? (
                <SOSContainer onClose={handleCloseLeftPanel} />
              ) : (
                <DaftarArmada
                  onClose={handleCloseLeftPanel}
                  selectedFleetId={selectedFleetId}
                  onFleetSelect={setSelectedFleetId}
                  onFleetClick={handleFleetClickFromList}
                />
              )}
            </div>
          </div>

          {/* Bottom Panel - Daftar Pesanan Aktif */}
          <div
            className="rounded-t-[20px] bg-white shadow-muat transition-all duration-300 ease-in-out"
            style={{
              height: isBottomExpanded
                ? "calc((100vh - 92px - 16px - 16px) / 2)"
                : "calc(100vh - 100vh + 64px)",
            }}
          >
            <DaftarPesananAktif
              onToggleExpand={handleToggleBottomPanel}
              isExpanded={isBottomExpanded}
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div
          className={cn(
            "transition-all duration-300 ease-in-out",
            isFullscreen ? "absolute right-0 top-0 z-30" : "h-full"
          )}
        >
          <div
            className={cn(
              "flex flex-col overflow-hidden bg-white shadow-muat transition-[border-radius,width] duration-300 ease-in-out",
              isFullscreen
                ? "h-12 w-[429px] rounded-bl-xl"
                : "h-full rounded-l-xl"
            )}
          >
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

              {!isFullscreen && (
                <>
                  <MonitoringTabsContent value="permintaan">
                    <PermintaanAngkut />
                  </MonitoringTabsContent>

                  <MonitoringTabsContent value="urgent">
                    <UrgentIssue />
                  </MonitoringTabsContent>
                </>
              )}
            </MonitoringTabs>
          </div>
        </div>
      </div>
    </>
  );
};
export default Page;
