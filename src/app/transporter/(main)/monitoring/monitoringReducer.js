// State reducer actions
export const MONITORING_ACTIONS = {
  TOGGLE_BOTTOM_PANEL: "TOGGLE_BOTTOM_PANEL",
  SET_BOTTOM_EXPANDED: "SET_BOTTOM_EXPANDED",
  SET_MAP_ZOOM: "SET_MAP_ZOOM",
  SET_MAP_CENTER: "SET_MAP_CENTER",
  TOGGLE_LEFT_PANEL: "TOGGLE_LEFT_PANEL",
  OPEN_LEFT_PANEL: "OPEN_LEFT_PANEL",
  CLOSE_LEFT_PANEL: "CLOSE_LEFT_PANEL",
  SET_LEFT_PANEL_MODE: "SET_LEFT_PANEL_MODE",
  TOGGLE_FULLSCREEN: "TOGGLE_FULLSCREEN",
  SET_FULLSCREEN: "SET_FULLSCREEN",
  TOGGLE_LICENSE_PLATE: "TOGGLE_LICENSE_PLATE",
  SET_AUTO_FIT_BOUNDS: "SET_AUTO_FIT_BOUNDS",
  SET_MAP_INTERACTION: "SET_MAP_INTERACTION",
  SET_FILTERS: "SET_FILTERS",
  SET_SELECTED_FLEET: "SET_SELECTED_FLEET",
  SHOW_LACAK_ARMADA: "SHOW_LACAK_ARMADA",
  HIDE_LACAK_ARMADA: "HIDE_LACAK_ARMADA",
  SHOW_PILIH_ARMADA: "SHOW_PILIH_ARMADA",
  HIDE_PILIH_ARMADA: "HIDE_PILIH_ARMADA",
  RESET_MAP: "RESET_MAP",
};

// Initial state
export const initialMonitoringState = {
  panels: {
    isBottomExpanded: true,
    showLeftPanel: false,
    leftPanelMode: "armada", // "armada" or "sos"
    showLacakArmada: false,
    showPilihArmada: false,
    isFullscreen: false,
  },
  map: {
    zoom: null,
    center: null,
    autoFitBounds: true,
    hasMapInteraction: false,
    showLicensePlate: true,
  },
  filters: {
    selectedTruckFilters: [],
    selectedOrderFilters: [],
  },
  selections: {
    selectedFleetId: null,
    selectedOrderForTracking: null,
    selectedRequestForFleet: null,
  },
};

// Reducer function
export function monitoringReducer(state, action) {
  switch (action.type) {
    case MONITORING_ACTIONS.TOGGLE_BOTTOM_PANEL:
      return {
        ...state,
        panels: {
          ...state.panels,
          isBottomExpanded: !state.panels.isBottomExpanded,
        },
      };
    case MONITORING_ACTIONS.SET_BOTTOM_EXPANDED:
      return {
        ...state,
        panels: { ...state.panels, isBottomExpanded: action.payload },
      };
    case MONITORING_ACTIONS.SET_MAP_ZOOM:
      return {
        ...state,
        map: { ...state.map, zoom: action.payload },
      };
    case MONITORING_ACTIONS.SET_MAP_CENTER:
      return {
        ...state,
        map: { ...state.map, center: action.payload },
      };
    case MONITORING_ACTIONS.OPEN_LEFT_PANEL:
      return {
        ...state,
        panels: {
          ...state.panels,
          showLeftPanel: true,
          leftPanelMode: action.payload || "armada",
          isBottomExpanded: false,
        },
      };
    case MONITORING_ACTIONS.CLOSE_LEFT_PANEL:
      return {
        ...state,
        panels: {
          ...state.panels,
          showLeftPanel: false,
          isBottomExpanded: true,
        },
      };
    case MONITORING_ACTIONS.TOGGLE_FULLSCREEN:
      return {
        ...state,
        panels: {
          ...state.panels,
          isFullscreen: !state.panels.isFullscreen,
          showLacakArmada: false,
          showLeftPanel: !state.panels.isFullscreen
            ? false
            : state.panels.showLeftPanel,
        },
      };
    case MONITORING_ACTIONS.SET_FULLSCREEN:
      return {
        ...state,
        panels: { ...state.panels, isFullscreen: action.payload },
      };
    case MONITORING_ACTIONS.TOGGLE_LICENSE_PLATE:
      return {
        ...state,
        map: { ...state.map, showLicensePlate: !state.map.showLicensePlate },
      };
    case MONITORING_ACTIONS.SET_AUTO_FIT_BOUNDS:
      return {
        ...state,
        map: { ...state.map, autoFitBounds: action.payload },
      };
    case MONITORING_ACTIONS.SET_MAP_INTERACTION:
      return {
        ...state,
        map: { ...state.map, hasMapInteraction: action.payload },
      };
    case MONITORING_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          selectedTruckFilters:
            action.payload.truck || state.filters.selectedTruckFilters,
          selectedOrderFilters:
            action.payload.order || state.filters.selectedOrderFilters,
        },
      };
    case MONITORING_ACTIONS.SET_SELECTED_FLEET:
      return {
        ...state,
        selections: { ...state.selections, selectedFleetId: action.payload },
      };
    case MONITORING_ACTIONS.SHOW_LACAK_ARMADA:
      return {
        ...state,
        panels: { ...state.panels, showLacakArmada: true, isFullscreen: false },
        selections: {
          ...state.selections,
          selectedOrderForTracking: action.payload,
        },
      };
    case MONITORING_ACTIONS.HIDE_LACAK_ARMADA:
      return {
        ...state,
        panels: { ...state.panels, showLacakArmada: false },
        selections: { ...state.selections, selectedOrderForTracking: null },
      };
    case MONITORING_ACTIONS.SHOW_PILIH_ARMADA:
      return {
        ...state,
        panels: {
          ...state.panels,
          showPilihArmada: true,
          isBottomExpanded: true,
          isFullscreen: true,
        },
        selections: {
          ...state.selections,
          selectedRequestForFleet: action.payload,
        },
      };
    case MONITORING_ACTIONS.HIDE_PILIH_ARMADA:
      return {
        ...state,
        panels: {
          ...state.panels,
          showPilihArmada: false,
          isBottomExpanded: false,
        },
        selections: { ...state.selections, selectedRequestForFleet: null },
      };
    case MONITORING_ACTIONS.RESET_MAP:
      return {
        ...state,
        map: {
          ...state.map,
          autoFitBounds: true,
          center: null,
          zoom: null,
          hasMapInteraction: false,
        },
      };
    default:
      return state;
  }
}
