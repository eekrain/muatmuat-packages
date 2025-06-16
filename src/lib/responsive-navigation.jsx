import React from "react";

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { zustandDevtools } from "./utils";

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
 * @property {(path: string) => void} popTo - Pop screens until reaching the specified path.
 * @property {() => void} popToTop - Pop all screens except the first one.
 * @property {string} searchValue - The search value.
 * @property {(value: string) => void} setSearchValue - Set the search value.
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<NavigationState>>} */
export const useNavigationStore = create(
  zustandDevtools(
    (set) => ({
      stack: [{ path: "/", params: {} }],
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
      popTo: (path) =>
        set((state) => {
          const targetIndex = state.stack.findIndex(
            (entry) => entry.path === path
          );
          if (targetIndex === -1) return state; // Path not found, keep state unchanged
          return { stack: state.stack.slice(0, targetIndex + 1) };
        }),
      popToTop: () =>
        set((state) => ({
          stack: state.stack.slice(0, 1),
        })),
      replace: (path, params = {}) =>
        set((state) => {
          return { stack: [{ path, params }] };
        }),

      searchValue: "",
      setSearchValue: (value) => set({ searchValue: value }),
    }),
    {
      name: "responsive-navigation",
    }
  )
);

/**
 * Hook to access stack navigation actions (push, pop, replace, popTo, popToTop).
 * @returns {{
 *   push: NavigationState["push"],
 *   pop: NavigationState["pop"],
 *   replace: NavigationState["replace"],
 *   popTo: NavigationState["popTo"],
 *   popToTop: NavigationState["popToTop"]
 * }}
 */
export const useResponsiveNavigation = () => {
  const push = useNavigationStore((state) => state.push);
  const pop = useNavigationStore((state) => state.pop);
  const replace = useNavigationStore((state) => state.replace);
  const popTo = useNavigationStore((state) => state.popTo);
  const popToTop = useNavigationStore((state) => state.popToTop);
  return { push, pop, replace, popTo, popToTop };
};

/**
 * Hook to access the route parameters of the current route.
 * @returns {Object} route parameters passed during navigation.
 */
export const useResponsiveRouteParams = () => {
  const stack = useNavigationStore(useShallow((state) => state.stack));
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
export const ResponsiveRoute = ({ path, component }) => {
  const stack = useNavigationStore(
    useShallow((state) => state.stack.slice(-1))
  );
  const current = stack[stack.length - 1];
  // console.log("🚀 ~ ResponsiveRoute ~ path:", {
  //   path,
  //   currentPath: current.path,
  // });
  // console.log(
  //   "🚀 ~ ResponsiveRoute ~ path !== current.path:",
  //   path !== current.path
  // );

  if (path === current.path) return component;

  return null;
};
