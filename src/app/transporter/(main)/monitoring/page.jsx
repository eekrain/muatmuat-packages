"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useReducer, useState } from "react";

import {
  MonitoringTabTrigger,
  MonitoringTabs,
  MonitoringTabsContent,
  MonitoringTabsList,
} from "@/components/MonitoringTabs/MonitoringTabs";
import { NotificationCount } from "@/components/NotificationDot/NotificationCount";
import UrgentIssue from "@/container/CS/Monitoring/UrgentIssue/UrgentIssue";
import DaftarArmada from "@/container/Transporter/Monitoring/DaftarArmada/DaftarArmada";
import DaftarPesananAktif from "@/container/Transporter/Monitoring/DaftarPesananAktif/DaftarPesananAktif";
import LacakArmada from "@/container/Transporter/Monitoring/LacakArmada/LacakArmada";
import { MapInterfaceOverlay } from "@/container/Transporter/Monitoring/Map/MapInterfaceOverlay";
import { MapMonitoring } from "@/container/Transporter/Monitoring/Map/MapMonitoring";
import { NoFleetOverlay } from "@/container/Transporter/Monitoring/Map/NoFleetOverlay";
import PermintaanAngkut from "@/container/Transporter/Monitoring/PermintaanAngkut/PermintaanAngkut";
import PilihArmada from "@/container/Transporter/Monitoring/PilihArmada/PilihArmada";
import SOSContainer from "@/container/Transporter/Monitoring/SOS/SOSContainer";
import { cn } from "@/lib/utils";
import { useGetFleetCount } from "@/services/Transporter/monitoring/getFleetCount";
import { useGetFleetLocations } from "@/services/Transporter/monitoring/getFleetLocations";
import { useToastActions } from "@/store/Shipper/toastStore";

import { useMonitoringHandlers } from "./hooks/useMonitoringHandlers";
import {
  FILTER_ACTIONS,
  filtersReducer,
  initialFiltersState,
} from "./reducers/filtersReducer";
import {
  MAP_ACTIONS,
  initialMapState,
  mapReducer,
} from "./reducers/mapReducer";
import {
  PANEL_ACTIONS,
  initialPanelsState,
  panelsReducer,
} from "./reducers/panelsReducer";
import {
  SELECTION_ACTIONS,
  initialSelectionsState,
  selectionsReducer,
} from "./reducers/selectionsReducer";
import {
  applyFiltersToMarkers,
  calculateFleetCounts,
  calculateMapBounds,
  convertFleetToMarkers,
} from "./utils/mapUtils";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: fleetData, isLoading } = useGetFleetCount();
  const { data: fleetLocationsData } = useGetFleetLocations();
  const { addToast } = useToastActions();

  // Use multiple reducers for domain separation
  const [panels, panelsDispatch] = useReducer(
    panelsReducer,
    initialPanelsState
  );
  const [map, mapDispatch] = useReducer(mapReducer, initialMapState);
  const [filters, filtersDispatch] = useReducer(
    filtersReducer,
    initialFiltersState
  );
  const [selections, selectionsDispatch] = useReducer(
    selectionsReducer,
    initialSelectionsState
  );

  // Track onboarding state at parent level to prevent reset
  const [hasShownOnboarding, setHasShownOnboarding] = useState(false);

  // Create combined state object for easier access
  const state = { panels, map, filters, selections };

  // Use monitoring handlers hook
  const dispatches = {
    panelsDispatch,
    mapDispatch,
    filtersDispatch,
    selectionsDispatch,
  };
  const {
    handleOpenLeftPanel,
    handleOpenSOSPanel,
    handleCloseLeftPanel,
    handleToggleBottomPanel,
    handleToggleFullscreen,
    handleApplyFilter,
    handleMapDrag,
    handleMapZoomChange,
    handleMapCenterChange,
    handleResetZoom,
    handleTruckClick,
    handleAcceptRequest,
    handleTogglePilihArmada,
  } = useMonitoringHandlers(dispatches, state, fleetLocationsData, addToast);

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
    if (panels.isFullscreen) {
      panelsDispatch({ type: PANEL_ACTIONS.SET_FULLSCREEN, payload: false });
    }
  };

  const hasFleet = fleetData?.hasFleet || false;

  // Mock notification counts - replace with actual API data
  const requestCount = 100; // Replace with actual count from API
  const urgentCount = 2; // Replace with actual count from API

  // handleTruckClick is now imported from useMonitoringHandlers hook

  // Handle fleet click from list - focus map on selected fleet
  const handleFleetClickFromList = (fleet) => {
    // Find the corresponding marker from fleet locations
    const marker = allFleetMarkers.find((m) => m.fleet.id === fleet.fleetId);
    if (marker) {
      // Center map on the selected fleet
      mapDispatch({
        type: MAP_ACTIONS.SET_MAP_CENTER,
        payload: {
          lat: fleet.lastLocation.latitude,
          lng: fleet.lastLocation.longitude,
        },
      });
      mapDispatch({ type: MAP_ACTIONS.SET_MAP_ZOOM, payload: 16 }); // Zoom in to focus on the truck
      mapDispatch({
        type: MAP_ACTIONS.SET_AUTO_FIT_BOUNDS,
        payload: false,
      }); // Disable auto-fit
      mapDispatch({
        type: MAP_ACTIONS.SET_MAP_INTERACTION,
        payload: false,
      });
    }
  };

  // Handle search selection - focus map on selected vehicle
  const handleSearchSelect = (searchData) => {
    if (!searchData || !searchData.originalData) return;

    // Find the corresponding marker from fleet locations
    const marker = allFleetMarkers.find(
      (m) =>
        m.fleet.licensePlate === searchData.originalData.licensePlate ||
        m.fleet.driverName === searchData.originalData.driverName
    );

    if (marker) {
      // Center map on the selected vehicle
      mapDispatch({
        type: MAP_ACTIONS.SET_MAP_CENTER,
        payload: {
          lat: marker.position.lat,
          lng: marker.position.lng,
        },
      });
      mapDispatch({ type: MAP_ACTIONS.SET_MAP_ZOOM, payload: 16 }); // Zoom in to focus on the truck
      mapDispatch({
        type: MAP_ACTIONS.SET_AUTO_FIT_BOUNDS,
        payload: false,
      }); // Disable auto-fit
      mapDispatch({
        type: MAP_ACTIONS.SET_MAP_INTERACTION,
        payload: false,
      });

      // Also select the fleet in the armada list if panel is open
      selectionsDispatch({
        type: SELECTION_ACTIONS.SET_SELECTED_FLEET,
        payload: marker.fleet.id,
      });

      // Open the left panel to show details
      if (!panels.showLeftPanel) {
        handleOpenLeftPanel();
      }
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
      filters.selectedTruckFilters.length === 0 &&
      filters.selectedOrderFilters.length === 0
    ) {
      return true;
    }

    // Check truck status filter
    if (filters.selectedTruckFilters.length > 0) {
      if (
        !filters.selectedTruckFilters.includes(marker.fleet.operationalStatus)
      ) {
        return false;
      }
    }

    // Check order status filter (if needed)
    if (filters.selectedOrderFilters.length > 0) {
      // Add logic for order status filtering if applicable
      // For now, we'll just check if the fleet has any order that needs response
      if (filters.selectedOrderFilters.includes("NEEDS_RESPONSE")) {
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

  // Zoom handlers are now imported from useMonitoringHandlers hook
  // Need to create handleZoomIn and handleZoomOut that use calculatedBounds
  const handleZoomIn = () => {
    mapDispatch({ type: MAP_ACTIONS.SET_AUTO_FIT_BOUNDS, payload: false });
    mapDispatch({ type: MAP_ACTIONS.SET_MAP_INTERACTION, payload: true });
    const currentZoom = map.zoom || calculatedBounds.zoom;
    mapDispatch({
      type: MAP_ACTIONS.SET_MAP_ZOOM,
      payload: Math.min(currentZoom + 1, 20),
    });
  };

  const handleZoomOut = () => {
    mapDispatch({ type: MAP_ACTIONS.SET_AUTO_FIT_BOUNDS, payload: false });
    mapDispatch({ type: MAP_ACTIONS.SET_MAP_INTERACTION, payload: true });
    const currentZoom = map.zoom || calculatedBounds.zoom;
    mapDispatch({
      type: MAP_ACTIONS.SET_MAP_ZOOM,
      payload: Math.max(currentZoom - 1, 1),
    });
  };

  // Map handlers are now imported from useMonitoringHandlers hook

  // Determine which center to use
  const currentCenter = map.center || calculatedBounds.center;

  // Use calculated center and zoom when auto-fit is enabled
  const mapConfig = map.autoFitBounds
    ? calculatedBounds // Use calculated center and zoom
    : {
        center: currentCenter, // Use current center (doesn't change on zoom)
        zoom: map.zoom || calculatedBounds.zoom, // Use manual zoom or calculated if not set
      };

  // PilihArmada handlers are now imported from useMonitoringHandlers hook

  return (
    <>
      <div
        className={cn(
          "relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] h-[calc(100vh-92px)] w-screen overflow-hidden pl-6 transition-all duration-300 ease-in-out",
          panels.isFullscreen
            ? "grid grid-cols-1 pr-6"
            : "grid grid-cols-[minmax(811px,1fr)_429px] gap-4"
        )}
      >
        {/* Left Section - Map and Bottom Panel */}
        <div className="flex h-full flex-col gap-4 pt-4 transition-all duration-300 ease-in-out">
          {/* Map Container */}
          <div className="relative flex-1 overflow-hidden rounded-[20px] bg-white shadow-muat transition-all duration-300 ease-in-out">
            <MapMonitoring
              locationMarkers={fleetMarkers}
              center={mapConfig.center}
              zoom={map.autoFitBounds ? mapConfig.zoom : map.zoom}
              showLicensePlate={map.showLicensePlate}
              onMapDrag={handleMapDrag}
              onMapZoom={handleMapZoomChange}
              onMapCenterChange={handleMapCenterChange}
              mapContainerStyle={{
                height: panels.isBottomExpanded
                  ? `calc((100vh - 92px - 16px - 16px) / 2)`
                  : `calc(100vh - 92px - 16px - 16px - 64px)`,
                width: panels.showLeftPanel ? "calc(100% - 332px)" : "100%",
                marginLeft: panels.showLeftPanel ? "332px" : "0",
                transition:
                  "height 300ms ease-in-out, width 300ms ease-in-out, margin-left 300ms ease-in-out",
              }}
            />
            {!isLoading && !hasFleet && <NoFleetOverlay />}
            {!isLoading && hasFleet && (
              <MapInterfaceOverlay
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onClickDaftarArmada={
                  panels.showPilihArmada
                    ? () => {
                        panelsDispatch({
                          type: PANEL_ACTIONS.HIDE_PILIH_ARMADA,
                        });
                      }
                    : handleOpenLeftPanel
                }
                onClickSOS={handleOpenSOSPanel}
                onApplyFilter={handleApplyFilter}
                fleetCounts={fleetCounts}
                hideTopNavigation={panels.showLeftPanel}
                onToggleFullscreen={handleToggleFullscreen}
                isFullscreen={panels.isFullscreen}
                showLicensePlate={map.showLicensePlate}
                onToggleLicensePlate={(value) =>
                  mapDispatch({ type: MAP_ACTIONS.TOGGLE_LICENSE_PLATE })
                }
                onCenter={handleResetZoom}
                hasMapInteraction={map.hasMapInteraction}
                onSearch={handleSearchSelect}
                activeFilters={{
                  truck: filters.selectedTruckFilters,
                  order: filters.selectedOrderFilters,
                }}
                showPilihArmada={panels.showPilihArmada}
              />
            )}

            {/* Left Panel - Daftar Armada or SOS */}
            <div
              className={cn(
                "absolute left-0 top-0 z-20 h-full w-[350px] rounded-r-xl bg-white shadow-muat transition-transform duration-300 ease-in-out",
                panels.showLeftPanel ? "translate-x-0" : "-translate-x-full"
              )}
            >
              {panels.leftPanelMode === "sos" ? (
                <SOSContainer onClose={handleCloseLeftPanel} />
              ) : (
                <DaftarArmada
                  onClose={handleCloseLeftPanel}
                  selectedFleetId={selections.selectedFleetId}
                  onFleetSelect={(id) =>
                    selectionsDispatch({
                      type: SELECTION_ACTIONS.SET_SELECTED_FLEET,
                      payload: id,
                    })
                  }
                  onFleetClick={handleFleetClickFromList}
                />
              )}
            </div>
          </div>

          {/* Bottom Panel - PilihArmada and Daftar Pesanan Aktif */}
          <div
            className="rounded-t-[20px] bg-white shadow-muat transition-all duration-300 ease-in-out"
            style={{
              height: panels.isBottomExpanded
                ? "calc((100vh - 92px - 16px - 16px) / 2)"
                : "calc(100vh - 100vh + 64px)",
            }}
          >
            {panels.showPilihArmada ? (
              <PilihArmada
                onToggleExpand={handleTogglePilihArmada}
                isExpanded={panels.isBottomExpanded}
                selectedRequest={selections.selectedRequestForFleet}
              />
            ) : (
              <DaftarPesananAktif
                onToggleExpand={handleToggleBottomPanel}
                isExpanded={panels.isBottomExpanded}
                hasShownOnboarding={hasShownOnboarding}
                onOnboardingShown={() => setHasShownOnboarding(true)}
                onViewFleetStatus={(order) => {
                  panelsDispatch({
                    type: PANEL_ACTIONS.SHOW_LACAK_ARMADA,
                  });
                  selectionsDispatch({
                    type: SELECTION_ACTIONS.SET_SELECTED_ORDER_FOR_TRACKING,
                    payload: order,
                  });
                  // Automatically exit fullscreen mode when opening LacakArmada
                  if (panels.isFullscreen) {
                    panelsDispatch({
                      type: PANEL_ACTIONS.SET_FULLSCREEN,
                      payload: false,
                    });
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div
          className={cn(
            "relative rounded-l-xl shadow-muat transition-all duration-300 ease-in-out",
            panels.isFullscreen ? "absolute right-0 top-0 z-30" : "h-full"
          )}
        >
          {/* LacakArmada as overlay */}
          {panels.showLacakArmada && (
            <div className="absolute right-0 top-0 z-30 h-screen w-[429px] overflow-hidden rounded-l-xl bg-white">
              <LacakArmada
                onClose={() => {
                  panelsDispatch({ type: PANEL_ACTIONS.HIDE_LACAK_ARMADA });
                  selectionsDispatch({
                    type: SELECTION_ACTIONS.SET_SELECTED_ORDER_FOR_TRACKING,
                    payload: null,
                  });
                }}
                orderId={selections.selectedOrderForTracking?.id}
              />
            </div>
          )}

          {/* Tab triggers - always visible */}
          <div
            className={cn(
              "relative flex flex-col overflow-hidden bg-white transition-[border-radius,width] duration-300 ease-in-out",
              panels.isFullscreen || panels.showLacakArmada
                ? "absolute right-0 top-0 z-[40] h-12 w-[429px] rounded-l-xl shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1)]"
                : "h-full rounded-l-xl"
            )}
          >
            {/* Tabs with higher z-index for triggers */}
            <MonitoringTabs value={selectedTab} onValueChange={handleTabChange}>
              <MonitoringTabsList className="relative z-20 bg-white">
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

              {!panels.isFullscreen && !panels.showLacakArmada && (
                <>
                  <MonitoringTabsContent value="permintaan">
                    <PermintaanAngkut onAcceptRequest={handleAcceptRequest} />
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
