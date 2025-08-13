import { useCallback } from "react";

import { MONITORING_ACTIONS } from "../monitoringReducer";

export const useMonitoringHandlers = (
  dispatch,
  state,
  fleetLocationsData,
  addToast
) => {
  const { panels, map, filters } = state;

  // Panel handlers
  const handleOpenLeftPanel = useCallback(() => {
    dispatch({ type: MONITORING_ACTIONS.OPEN_LEFT_PANEL, payload: "armada" });
  }, [dispatch]);

  const handleOpenSOSPanel = useCallback(() => {
    dispatch({ type: MONITORING_ACTIONS.OPEN_LEFT_PANEL, payload: "sos" });
  }, [dispatch]);

  const handleCloseLeftPanel = useCallback(() => {
    dispatch({ type: MONITORING_ACTIONS.CLOSE_LEFT_PANEL });
  }, [dispatch]);

  const handleToggleBottomPanel = useCallback(() => {
    dispatch({ type: MONITORING_ACTIONS.TOGGLE_BOTTOM_PANEL });
    if (!panels.isBottomExpanded) {
      dispatch({ type: MONITORING_ACTIONS.CLOSE_LEFT_PANEL });
    }
  }, [dispatch, panels.isBottomExpanded]);

  const handleToggleFullscreen = useCallback(() => {
    dispatch({ type: MONITORING_ACTIONS.TOGGLE_FULLSCREEN });
  }, [dispatch]);

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

      dispatch({
        type: MONITORING_ACTIONS.SET_FILTERS,
        payload: { truck: truckStatuses, order: orderStatuses },
      });
    },
    [dispatch, fleetLocationsData, addToast]
  );

  // Map handlers
  const handleMapDrag = useCallback(() => {
    dispatch({ type: MONITORING_ACTIONS.SET_AUTO_FIT_BOUNDS, payload: false });
    dispatch({ type: MONITORING_ACTIONS.SET_MAP_INTERACTION, payload: true });
  }, [dispatch]);

  const handleMapZoomChange = useCallback(
    (newZoom) => {
      dispatch({
        type: MONITORING_ACTIONS.SET_AUTO_FIT_BOUNDS,
        payload: false,
      });
      dispatch({ type: MONITORING_ACTIONS.SET_MAP_INTERACTION, payload: true });
      dispatch({ type: MONITORING_ACTIONS.SET_MAP_ZOOM, payload: newZoom });
    },
    [dispatch]
  );

  const handleMapCenterChange = useCallback(
    (newCenter) => {
      dispatch({ type: MONITORING_ACTIONS.SET_MAP_CENTER, payload: newCenter });
    },
    [dispatch]
  );

  const handleResetZoom = useCallback(() => {
    dispatch({ type: MONITORING_ACTIONS.RESET_MAP });
  }, [dispatch]);

  // Fleet selection handlers
  const handleTruckClick = useCallback(
    (marker) => {
      dispatch({
        type: MONITORING_ACTIONS.SET_SELECTED_FLEET,
        payload: marker.fleet.id,
      });
      if (!panels.showLeftPanel) {
        handleOpenLeftPanel();
      }
      dispatch({
        type: MONITORING_ACTIONS.SET_MAP_CENTER,
        payload: {
          lat: marker.position.lat,
          lng: marker.position.lng,
        },
      });
      dispatch({ type: MONITORING_ACTIONS.SET_MAP_ZOOM, payload: 16 });
      dispatch({
        type: MONITORING_ACTIONS.SET_AUTO_FIT_BOUNDS,
        payload: false,
      });
      dispatch({
        type: MONITORING_ACTIONS.SET_MAP_INTERACTION,
        payload: false,
      });
    },
    [dispatch, panels.showLeftPanel, handleOpenLeftPanel]
  );

  // PilihArmada handlers
  const handleAcceptRequest = useCallback(
    (request) => {
      dispatch({
        type: MONITORING_ACTIONS.SHOW_PILIH_ARMADA,
        payload: request,
      });
    },
    [dispatch]
  );

  const handleTogglePilihArmada = useCallback(() => {
    dispatch({ type: MONITORING_ACTIONS.TOGGLE_BOTTOM_PANEL });
  }, [dispatch]);

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
  };
};
