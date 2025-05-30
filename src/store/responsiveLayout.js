import { create } from "zustand";

/**
 * @typedef {Object} DefaultScreenHeader
 * @property {() => void} onClickBackButton
 * @property {() => void} onClickNotificationButton
 * @property {() => void} onClickChatButton
 * @property {() => void} onClickMenuButton
 */

/**
 * @typedef {Object} DefaultScreenState
 * @property {DefaultScreenHeader} header
 */

/**
 * @typedef {Object} SearchBarHeader
 * @property {() => void} onClickBackButton
 * @property {(value: string) => void} onSearchValueChange
 */

/**
 * @typedef {Object} SearchBarState
 * @property {SearchBarHeader} header
 */

/**
 * @typedef {Object} FormScreenHeader
 * @property {() => void} onClickBackButton
 * @property {string} titleLabel
 * @property {string} className
 */

/**
 * @typedef {Object} FormScreenFooterButton
 * @property {string} label
 * @property {() => void} onClick
 * @property {string} className
 * @property {string} type
 */

/**
 * @typedef {Object} FormScreenFooter
 * @property {FormScreenFooterButton[]} button
 */

/**
 * @typedef {Object} FormScreenState
 * @property {FormScreenHeader} header
 * @property {FormScreenFooter} footer
 */

/**
 * @typedef {Object} ResponsiveLayoutState
 * @property {"default"|"menu"|"searchBar"|"form"} screen
 * @property {SearchBarState} searchBar
 * @property {FormScreenState} form
 * @property {DefaultScreenState} default
 */

/**
 * @typedef {Object} ResponsiveLayoutActions
 * @property {(newDefaultState: DefaultScreenState) => void} setDefaultScreen
 * @property {(newMenuState: DefaultScreenState) => void} setMenuScreen
 * @property {(newSearchBarState: SearchBarState) => void} setSearchBarScreen
 * @property {(newFormState: FormScreenState) => void} setFormScreen
 */

/**
 * @typedef {ResponsiveLayoutState & ResponsiveLayoutActions} ResponsiveLayoutStore
 */

const searchBarDefaultState = {
  header: {
    onClickBackButton: () => {},
    onSearchValueChange: () => {},
  },
};

const formDefaultState = {
  header: {
    onClickBackButton: () => {},
    titleLabel: "",
    className: "",
  },
  footer: {
    button: [],
  },
};

const defaultScreenState = {
  header: {
    onClickBackButton: () => alert("belum di implementasi"),
    onClickNotificationButton: () => alert("belum di implementasi"),
    onClickChatButton: () => alert("belum di implementasi"),
    onClickMenuButton: () => alert("belum di implementasi"),
  },
};

/**
 * Responsive layout zustand store
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<ResponsiveLayoutStore>>}
 */
export const useResponsiveLayout = create((set) => ({
  // State
  screen: "default",
  searchBar: searchBarDefaultState,
  form: formDefaultState,
  default: defaultScreenState,
  // Actions
  /**
   * Set the screen to default and update the default state
   * @param {DefaultScreenState} newDefaultState
   */
  setDefaultScreen: (newDefaultState) =>
    set({
      screen: "default",
      default: newDefaultState,
      searchBar: searchBarDefaultState,
      form: formDefaultState,
    }),
  /**
   * Set the screen to menu and update the default state
   * @param {DefaultScreenState} newMenuState
   */
  setMenuScreen: (newMenuState) =>
    set({
      screen: "menu",
      default: newMenuState,
      searchBar: searchBarDefaultState,
      form: formDefaultState,
    }),
  /**
   * Set the screen to searchBar and update the searchBar state
   * @param {SearchBarState} newSearchBarState
   */
  setSearchBarScreen: (newSearchBarState) =>
    set({
      screen: "searchBar",
      default: defaultScreenState,
      searchBar: newSearchBarState,
      form: formDefaultState,
    }),
  /**
   * Set the screen to form and update the form state
   * @param {FormScreenState} newFormState
   */
  setFormScreen: (newFormState) =>
    set({
      screen: "form",
      default: defaultScreenState,
      searchBar: searchBarDefaultState,
      form: newFormState,
    }),

  resetScreen: () =>
    set({
      screen: "default",
      default: defaultScreenState,
      searchBar: searchBarDefaultState,
      form: formDefaultState,
    }),
}));

/**
 * Hook to access responsive layout actions
 * @returns {ResponsiveLayoutActions}
 */
export const useResponsiveLayoutActions = () => {
  const setDefaultScreen = useResponsiveLayout(
    (state) => state.setDefaultScreen
  );
  const setMenuScreen = useResponsiveLayout((state) => state.setMenuScreen);
  const setSearchBarScreen = useResponsiveLayout(
    (state) => state.setSearchBarScreen
  );
  const setFormScreen = useResponsiveLayout((state) => state.setFormScreen);
  const resetScreen = useResponsiveLayout((state) => state.resetScreen);
  return {
    setDefaultScreen,
    setMenuScreen,
    setSearchBarScreen,
    setFormScreen,
    resetScreen,
  };
};
