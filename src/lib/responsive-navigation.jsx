import React from "react";

import { create } from "zustand";

// // Cara make nya kaya gini
// const searchBarDefaultLayoutParams = {
//   layout: "searchBar",
//   header: {
//     onClickBackButton: () => {},
//     placeholder: "Cari Lokasi Muat",
//   },
// };

// const defaultFormLayoutParams = {
//   layout: "form",
//   header: {
//     onClickBackButton: () => {},
//     title: {
//       label: "",
//       className: "",
//     },
//     withMenu: {
//       onClickInfo: () => {},
//       onClickMenu: () => {},
//     },
//   },
//   footer: {
//     button: [],
//   },
// };

const defaultLayoutParams = {
  layout: "default",
  header: {
    onClickBackButton: () => alert("belum di implementasi"),
    onClickNotificationButton: () => alert("belum di implementasi"),
    onClickChatButton: () => alert("belum di implementasi"),
    onClickMenuButton: () => alert("belum di implementasi"),
  },
};

/**
 * @typedef {Object} StackEntry
 * @property {string} id - Unique ID for the stack item.
 * @property {string} path - The route path (e.g., "/about").
 * @property {React.ReactNode} component - The React element to render.
 * @property {Object} [params] - Optional parameters passed to the route.
 */

/**
 * @typedef {Object} NavigationState
 * @property {StackEntry[]} stack - Stack of route entries.
 * @property {(path: string, params?: Object) => void} push - Push a new screen.
 * @property {() => void} pop - Pop the top screen.
 * @property {(path: string, params?: Object) => void} replace - Replace the current screen.
 * @property {string} searchValue - The search value.
 * @property {(value: string) => void} setSearchValue - Set the search value.
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<NavigationState>>} */
export const useNavigationStore = create((set) => ({
  stack: [{ path: "/", component: null, params: { ...defaultLayoutParams } }],
  push: (path, params = {}) =>
    set((state) => ({
      stack: [...state.stack, { path, params }],
    })),
  pop: () =>
    set((state) => {
      if (state.stack.length > 1) {
        return { stack: state.stack.slice(0, -1) };
      }
      return state;
    }),
  replace: (path, params = {}) =>
    set((state) => {
      return { stack: [{ path, params }] };
    }),

  searchValue: "",
  setSearchValue: (value) => set({ searchValue: value }),
}));

/**
 * Hook to access stack navigation actions (push, pop, replace).
 * @returns {{ push: NavigationState["push"], pop: NavigationState["pop"], replace: NavigationState["replace"] }}
 */
export const useResponsiveNavigation = () => {
  const push = useNavigationStore((state) => state.push);
  const pop = useNavigationStore((state) => state.pop);
  const replace = useNavigationStore((state) => state.replace);
  return { push, pop, replace };
};

/**
 * Hook to access the route parameters of the current route.
 * @returns {Object} route parameters passed during navigation.
 */
export const useResponsiveRouteParams = () => {
  const stack = useNavigationStore((state) => state.stack);
  return stack[stack.length - 1]?.params || {};
};

/**
 * Hook to access the search value.
 * @returns {{ searchValue: string, setSearchValue: (value: string) => void }}
 */
export const useResponsiveSearch = () => {
  const searchValue = useNavigationStore((state) => state.searchValue);
  const setSearchValue = useNavigationStore((state) => state.setSearchValue);
  return { searchValue, setSearchValue };
};

/**
 * Renders the component if the current route matches.
 * Supports `index` routes and optional layout as a React component.
 *
 * @param {{
 *   path?: string,
 *   component: React.ReactNode,
 *   index?: boolean,
 *   layout?: (children: React.ReactNode) => React.ReactNode
 * }} props
 */
export const ResponsiveRoute = ({ path, layout, component }) => {
  const { stack } = useNavigationStore();
  const current = stack[stack.length - 1];

  if (path !== current.path) return null;

  return layout ? layout(component) : component;
};
