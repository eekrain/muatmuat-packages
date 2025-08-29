// Panel-specific actions
export const PANEL_ACTIONS = {
  TOGGLE_BOTTOM_PANEL: "TOGGLE_BOTTOM_PANEL",
  SET_BOTTOM_EXPANDED: "SET_BOTTOM_EXPANDED",
  OPEN_LEFT_PANEL: "OPEN_LEFT_PANEL",
  CLOSE_LEFT_PANEL: "CLOSE_LEFT_PANEL",
  SET_LEFT_PANEL_MODE: "SET_LEFT_PANEL_MODE",
  TOGGLE_FULLSCREEN: "TOGGLE_FULLSCREEN",
  SET_FULLSCREEN: "SET_FULLSCREEN",
  SHOW_LACAK_ARMADA: "SHOW_LACAK_ARMADA",
  HIDE_LACAK_ARMADA: "HIDE_LACAK_ARMADA",
  SHOW_PILIH_ARMADA: "SHOW_PILIH_ARMADA",
  HIDE_PILIH_ARMADA: "HIDE_PILIH_ARMADA",
  SHOW_RIWAYAT_SOS: "SHOW_RIWAYAT_SOS",
  HIDE_RIWAYAT_SOS: "HIDE_RIWAYAT_SOS",
  SHOW_POSISI_ARMADA: "SHOW_POSISI_ARMADA",
  HIDE_POSISI_ARMADA: "HIDE_POSISI_ARMADA",
};

// Initial panels state
export const initialPanelsState = {
  isBottomExpanded: true,
  showLeftPanel: false,
  leftPanelMode: "armada", // "armada" or "sos"
  showLacakArmada: false,
  showPilihArmada: false,
  showRiwayatSOS: false,
  isFullscreen: false,
};

// Panels reducer
export function panelsReducer(state = initialPanelsState, action) {
  switch (action.type) {
    case PANEL_ACTIONS.TOGGLE_BOTTOM_PANEL:
      return {
        ...state,
        isBottomExpanded: !state.isBottomExpanded,
      };

    case PANEL_ACTIONS.SET_BOTTOM_EXPANDED:
      return {
        ...state,
        isBottomExpanded: action.payload,
      };

    case PANEL_ACTIONS.OPEN_LEFT_PANEL:
      return {
        ...state,
        showLeftPanel: true,
        leftPanelMode: action.payload || "armada",
        isBottomExpanded: false,
      };

    case PANEL_ACTIONS.CLOSE_LEFT_PANEL:
      return {
        ...state,
        showLeftPanel: false,
        isBottomExpanded: true,
      };

    case PANEL_ACTIONS.SET_LEFT_PANEL_MODE:
      return {
        ...state,
        leftPanelMode: action.payload,
      };

    case PANEL_ACTIONS.TOGGLE_FULLSCREEN:
      return {
        ...state,
        isFullscreen: !state.isFullscreen,
        showLacakArmada: false,
        showLeftPanel: !state.isFullscreen ? false : state.showLeftPanel,
      };

    case PANEL_ACTIONS.SET_FULLSCREEN:
      return {
        ...state,
        isFullscreen: action.payload,
      };

    case PANEL_ACTIONS.SHOW_LACAK_ARMADA:
      return {
        ...state,
        showLacakArmada: true,
        isFullscreen: false,
      };

    case PANEL_ACTIONS.HIDE_LACAK_ARMADA:
      return {
        ...state,
        showLacakArmada: false,
      };

    case PANEL_ACTIONS.SHOW_PILIH_ARMADA:
      return {
        ...state,
        showPilihArmada: true,
        isBottomExpanded: true,
        isFullscreen: true,
      };

    case PANEL_ACTIONS.HIDE_PILIH_ARMADA:
      return {
        ...state,
        showPilihArmada: false,
        isBottomExpanded: true,
        isFullscreen: false,
      };

    case PANEL_ACTIONS.SHOW_RIWAYAT_SOS:
      return {
        ...state,
        showRiwayatSOS: true,
        isBottomExpanded: true,
        showPilihArmada: false,
        isFullscreen: true,
        showLeftPanel: false,
      };

    case PANEL_ACTIONS.HIDE_RIWAYAT_SOS:
      return {
        ...state,
        showRiwayatSOS: false,
        isBottomExpanded: true,
        isFullscreen: false,
      };

    case PANEL_ACTIONS.SHOW_POSISI_ARMADA:
      return {
        ...state,
        showLeftPanel: true,
        leftPanelMode: "posisi",
        isBottomExpanded: false,
        showLacakArmada: false, // Close right panel
        isFullscreen: true, // Enter fullscreen for better map view
      };

    case PANEL_ACTIONS.HIDE_POSISI_ARMADA:
      return {
        ...state,
        showLeftPanel: false,
        leftPanelMode: "armada", // Reset to default mode
        isBottomExpanded: true, // Show bottom panel again
        isFullscreen: false, // Exit fullscreen
      };

    default:
      return state;
  }
}
