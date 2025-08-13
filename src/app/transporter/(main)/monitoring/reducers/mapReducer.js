// Map-specific actions
export const MAP_ACTIONS = {
  SET_MAP_ZOOM: "SET_MAP_ZOOM",
  SET_MAP_CENTER: "SET_MAP_CENTER",
  TOGGLE_LICENSE_PLATE: "TOGGLE_LICENSE_PLATE",
  SET_AUTO_FIT_BOUNDS: "SET_AUTO_FIT_BOUNDS",
  SET_MAP_INTERACTION: "SET_MAP_INTERACTION",
  RESET_MAP: "RESET_MAP",
};

// Initial map state
export const initialMapState = {
  zoom: null,
  center: null,
  autoFitBounds: true,
  hasMapInteraction: false,
  showLicensePlate: true,
};

// Map reducer
export function mapReducer(state = initialMapState, action) {
  switch (action.type) {
    case MAP_ACTIONS.SET_MAP_ZOOM:
      return {
        ...state,
        zoom: action.payload,
      };

    case MAP_ACTIONS.SET_MAP_CENTER:
      return {
        ...state,
        center: action.payload,
      };

    case MAP_ACTIONS.TOGGLE_LICENSE_PLATE:
      return {
        ...state,
        showLicensePlate: !state.showLicensePlate,
      };

    case MAP_ACTIONS.SET_AUTO_FIT_BOUNDS:
      return {
        ...state,
        autoFitBounds: action.payload,
      };

    case MAP_ACTIONS.SET_MAP_INTERACTION:
      return {
        ...state,
        hasMapInteraction: action.payload,
      };

    case MAP_ACTIONS.RESET_MAP:
      return {
        ...state,
        autoFitBounds: true,
        center: null,
        zoom: null,
        hasMapInteraction: false,
      };

    default:
      return state;
  }
}
