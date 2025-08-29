// Filter-specific actions
export const FILTER_ACTIONS = {
  SET_FILTERS: "SET_FILTERS",
  SET_TRUCK_FILTERS: "SET_TRUCK_FILTERS",
  SET_ORDER_FILTERS: "SET_ORDER_FILTERS",
  CLEAR_FILTERS: "CLEAR_FILTERS",
};

// Initial filters state
export const initialFiltersState = {
  selectedTruckFilters: [],
  selectedOrderFilters: [],
};

// Filters reducer
export function filtersReducer(state = initialFiltersState, action) {
  switch (action.type) {
    case FILTER_ACTIONS.SET_FILTERS:
      return {
        ...state,
        selectedTruckFilters:
          action.payload.truck || state.selectedTruckFilters,
        selectedOrderFilters:
          action.payload.order || state.selectedOrderFilters,
      };

    case FILTER_ACTIONS.SET_TRUCK_FILTERS:
      return {
        ...state,
        selectedTruckFilters: action.payload,
      };

    case FILTER_ACTIONS.SET_ORDER_FILTERS:
      return {
        ...state,
        selectedOrderFilters: action.payload,
      };

    case FILTER_ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        selectedTruckFilters: [],
        selectedOrderFilters: [],
      };

    default:
      return state;
  }
}
