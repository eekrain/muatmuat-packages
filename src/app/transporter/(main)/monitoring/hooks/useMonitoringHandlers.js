import { useCallback } from "react";

import { FILTER_ACTIONS } from "../reducers/filtersReducer";
import { MAP_ACTIONS } from "../reducers/mapReducer";
import { PANEL_ACTIONS } from "../reducers/panelsReducer";
import { SELECTION_ACTIONS } from "../reducers/selectionsReducer";

export const useMonitoringHandlers = (
  dispatches,
  state,
  fleetLocationsData,
  addToast
) => {
  const { panels, map, filters } = state;
  const { panelsDispatch, mapDispatch, filtersDispatch, selectionsDispatch } =
    dispatches;

  // Panel handlers
  const handleOpenLeftPanel = useCallback(() => {
    panelsDispatch({ type: PANEL_ACTIONS.OPEN_LEFT_PANEL, payload: "armada" });
  }, [panelsDispatch]);

  const handleOpenSOSPanel = useCallback(() => {
    panelsDispatch({ type: PANEL_ACTIONS.OPEN_LEFT_PANEL, payload: "sos" });
  }, [panelsDispatch]);

  const handleCloseLeftPanel = useCallback(() => {
    panelsDispatch({ type: PANEL_ACTIONS.CLOSE_LEFT_PANEL });
  }, [panelsDispatch]);

  const handleToggleBottomPanel = useCallback(() => {
    panelsDispatch({ type: PANEL_ACTIONS.TOGGLE_BOTTOM_PANEL });
    if (!panels.isBottomExpanded) {
      panelsDispatch({ type: PANEL_ACTIONS.CLOSE_LEFT_PANEL });
    }
  }, [panelsDispatch, panels.isBottomExpanded]);

  const handleToggleFullscreen = useCallback(() => {
    panelsDispatch({ type: PANEL_ACTIONS.TOGGLE_FULLSCREEN });
  }, [panelsDispatch]);

  // Filter handler
  const handleApplyFilter = useCallback(
    (truckStatuses, orderStatuses) => {
      // Check if any fleet will be visible after applying these filters
      if (fleetLocationsData?.fleets) {
        const willHaveData = fleetLocationsData.fleets.some((fleet) => {
          if (truckStatuses.length === 0 && orderStatuses.length === 0) {
            return true;
          }

          if (truckStatuses.length > 0) {
            if (!truckStatuses.includes(fleet.operationalStatus)) {
              return false;
            }
          }

          if (orderStatuses.length > 0) {
            if (orderStatuses.includes("NEEDS_RESPONSE")) {
              // This would need to be implemented based on your actual data structure
            }
          }

          return true;
        });

        if (
          !willHaveData &&
          (truckStatuses.length > 0 || orderStatuses.length > 0)
        ) {
          addToast({
            message: "Data tidak ditemukan",
            type: "error",
            duration: 3000,
          });
        }
      }

      filtersDispatch({
        type: FILTER_ACTIONS.SET_FILTERS,
        payload: { truck: truckStatuses, order: orderStatuses },
      });
    },
    [filtersDispatch, fleetLocationsData, addToast]
  );

  // Map handlers
  const handleMapDrag = useCallback(() => {
    mapDispatch({ type: MAP_ACTIONS.SET_AUTO_FIT_BOUNDS, payload: false });
    mapDispatch({ type: MAP_ACTIONS.SET_MAP_INTERACTION, payload: true });
  }, [mapDispatch]);

  const handleMapZoomChange = useCallback(
    (newZoom) => {
      mapDispatch({
        type: MAP_ACTIONS.SET_AUTO_FIT_BOUNDS,
        payload: false,
      });
      mapDispatch({ type: MAP_ACTIONS.SET_MAP_INTERACTION, payload: true });
      mapDispatch({ type: MAP_ACTIONS.SET_MAP_ZOOM, payload: newZoom });
    },
    [mapDispatch]
  );

  const handleMapCenterChange = useCallback(
    (newCenter) => {
      mapDispatch({ type: MAP_ACTIONS.SET_MAP_CENTER, payload: newCenter });
    },
    [mapDispatch]
  );

  const handleResetZoom = useCallback(() => {
    mapDispatch({ type: MAP_ACTIONS.RESET_MAP });
  }, [mapDispatch]);

  // Fleet selection handlers
  const handleTruckClick = useCallback(
    (marker) => {
      selectionsDispatch({
        type: SELECTION_ACTIONS.SET_SELECTED_FLEET,
        payload: marker.fleet.id,
      });
      if (!panels.showLeftPanel) {
        handleOpenLeftPanel();
      }
      mapDispatch({
        type: MAP_ACTIONS.SET_MAP_CENTER,
        payload: {
          lat: marker.position.lat,
          lng: marker.position.lng,
        },
      });
      mapDispatch({ type: MAP_ACTIONS.SET_MAP_ZOOM, payload: 16 });
      mapDispatch({
        type: MAP_ACTIONS.SET_AUTO_FIT_BOUNDS,
        payload: false,
      });
      mapDispatch({
        type: MAP_ACTIONS.SET_MAP_INTERACTION,
        payload: false,
      });
    },
    [selectionsDispatch, mapDispatch, panels.showLeftPanel, handleOpenLeftPanel]
  );

  // PilihArmada handlers
  const handleAcceptRequest = useCallback(
    (request) => {
      panelsDispatch({
        type: PANEL_ACTIONS.SHOW_PILIH_ARMADA,
      });
      selectionsDispatch({
        type: SELECTION_ACTIONS.SET_SELECTED_REQUEST_FOR_FLEET,
        payload: request,
      });
    },
    [panelsDispatch, selectionsDispatch]
  );

  const handleTogglePilihArmada = useCallback(() => {
    panelsDispatch({ type: PANEL_ACTIONS.TOGGLE_BOTTOM_PANEL });
  }, [panelsDispatch]);

  const handleOpenRiwayatSOS = useCallback(() => {
    panelsDispatch({ type: PANEL_ACTIONS.SHOW_RIWAYAT_SOS });
  }, [panelsDispatch]);

  const handleCloseRiwayatSOS = useCallback(() => {
    panelsDispatch({ type: PANEL_ACTIONS.HIDE_RIWAYAT_SOS });
  }, [panelsDispatch]);

  return {
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
    handleOpenRiwayatSOS,
    handleCloseRiwayatSOS,
  };
};
