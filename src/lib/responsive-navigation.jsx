import React, { createContext, useContext, useRef } from "react";

import { createStore, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { zustandDevtools } from "./utils";

/**
 * @typedef {Object} StackEntry
 * @property {string} path - The route path (e.g., "/about").
 * @property {React.ReactNode} component - The React element to render.
 * @property {Record<string, any>} [params] - Optional parameters passed to the route.
 */

/**
 * @typedef {Object} NavigationActions
 * @property {(path: string, params?: Record<string, any>) => void} push - Push a new screen to the navigation stack.
 * @property {() => void} pop - Remove the top screen from the navigation stack.
 * @property {(path: string) => void} popTo - Pop screens until reaching the specified path.
 * @property {() => void} popToTop - Pop all screens except the first one.
 * @property {(path: string, params?: Record<string, any>) => void} replace - Replace the current screen with a new one.
 */

/**
 * @typedef {Object} NavigationState
 * @property {StackEntry[]} stack - Stack of route entries representing the navigation history.
 * @property {NavigationActions} actions - Actions for navigation operations.
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<NavigationState>>} */
const createNavigationStore = () =>
  createStore(
    zustandDevtools(
      (set) => ({
        stack: [{ path: "/", params: {} }],

        actions: {
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
        },
      }),
      {
        name: "responsive-navigation",
      }
    )
  );

const NavigationContext = createContext(null);

export const ResponsiveProvider = ({ children }) => {
  const store = useRef(createNavigationStore()).current;

  return (
    <NavigationContext.Provider value={store}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * Hook to access stack navigation actions (push, pop, replace, popTo, popToTop).
 * @returns {{
 *   push: (path: string, params?: Record<string, any>) => void,
 *   pop: () => void,
 *   popTo: (path: string) => void,
 *   popToTop: () => void,
 *   replace: (path: string, params?: Record<string, any>) => void
 * }}
 */
export const useResponsiveNavigation = () => {
  const store = useContext(NavigationContext);
  if (!store)
    throw new Error(
      "useResponsiveNavigation must be used within a ResponsiveProvider"
    );
  const { push, pop, popTo, popToTop, replace } = useStore(
    store,
    (state) => state.actions
  );
  return { push, pop, popTo, popToTop, replace };
};

/**
 * Hook to access the route parameters of the current route.
 * @returns {Record<string, any>} Route parameters passed during navigation.
 */
export const useResponsiveRouteParams = () => {
  const store = useContext(NavigationContext);
  if (!store)
    throw new Error(
      "useResponsiveRouteParams must be used within a ResponsiveProvider"
    );
  const stack = useStore(
    store,
    useShallow((state) => state.stack)
  );
  return stack[stack.length - 1]?.params || {};
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
 * @returns {React.ReactNode | null}
 */
export const ResponsiveRoute = ({ path, component }) => {
  const store = useContext(NavigationContext);
  if (!store)
    throw new Error("ResponsiveRoute must be used within a ResponsiveProvider");
  const stack = useStore(
    store,
    useShallow((state) => state.stack.slice(-1))
  );
  const current = stack[stack.length - 1];

  if (path === current.path) return component;

  return null;
};
