// Selection-specific actions
export const SELECTION_ACTIONS = {
  SET_SELECTED_FLEET: "SET_SELECTED_FLEET",
  SET_SELECTED_ORDER_FOR_TRACKING: "SET_SELECTED_ORDER_FOR_TRACKING",
  SET_SELECTED_REQUEST_FOR_FLEET: "SET_SELECTED_REQUEST_FOR_FLEET",
  CLEAR_SELECTIONS: "CLEAR_SELECTIONS",
};

// Initial selections state
export const initialSelectionsState = {
  selectedFleetId: null,
  selectedOrderForTracking: null,
  selectedRequestForFleet: null,
};

// Selections reducer
export function selectionsReducer(state = initialSelectionsState, action) {
  switch (action.type) {
    case SELECTION_ACTIONS.SET_SELECTED_FLEET:
      return {
        ...state,
        selectedFleetId: action.payload,
      };

    case SELECTION_ACTIONS.SET_SELECTED_ORDER_FOR_TRACKING:
      return {
        ...state,
        selectedOrderForTracking: action.payload,
      };

    case SELECTION_ACTIONS.SET_SELECTED_REQUEST_FOR_FLEET:
      return {
        ...state,
        selectedRequestForFleet: action.payload,
      };

    case SELECTION_ACTIONS.CLEAR_SELECTIONS:
      return {
        ...state,
        selectedFleetId: null,
        selectedOrderForTracking: null,
        selectedRequestForFleet: null,
      };

    default:
      return state;
  }
}
