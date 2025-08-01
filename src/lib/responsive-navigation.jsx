import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

// MODIFIED: Imported useEffect

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

import useDevice from "@/hooks/use-device";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";

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
const useNavigationStore = create(
  persist(
    zustandDevtools(
      (set) => ({
        stack: [{ path: "/", params: {} }],
        isHydrated: false,
        isReady: false,
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
              if (targetIndex === -1) return state;
              return { stack: state.stack.slice(0, targetIndex + 1) };
            }),
          popToTop: () =>
            set((state) => ({
              stack: state.stack.slice(0, 1),
            })),
          replace: (path, params = {}) =>
            set(() => {
              return { stack: [{ path, params }] };
            }),

          setHasHydrated: () => set({ isHydrated: true }),
          setHasReady: () => set({ isReady: true }),
        },
      }),
      { name: "responsive-navigation" }
    ),
    {
      name: "responsive-navigation",
      partialize: (state) => ({ stack: state.stack }),
      onRehydrateStorage: () => (state, error) => {
        setTimeout(() => {
          state?.actions?.setHasHydrated?.();
        }, 1000);
      },
    }
  )
);

const isValidScreenPath = (path) =>
  typeof path === "string" && path.startsWith("/");

export const ResponsiveProvider = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const screenSearchParam = searchParams.get("screen");
  const stack = useNavigationStore(useShallow((state) => state.stack));
  const {
    replace: replaceNavigation,
    setHasReady: setNavigationHasReady,
    popTo,
  } = useNavigationStore((state) => state.actions);
  const isNavigationHydrated = useNavigationStore((state) => state.isHydrated);
  const hasCheckedInitial = useRef(false);
  const { isMobile } = useDevice();

  useShallowCompareEffect(() => {
    if (hasCheckedInitial.current || !isMobile || !isNavigationHydrated) return;
    hasCheckedInitial.current = true;
    const currentStack = stack[stack.length - 1];
    if (!screenSearchParam) {
      if (currentStack?.path !== "/") {
        replaceNavigation("/");
      }
    } else if (decodeURIComponent(screenSearchParam) !== currentStack?.path) {
      const decoded = decodeURIComponent(screenSearchParam);
      if (isValidScreenPath(decoded)) {
        const foundEntry = stack.find((entry) => entry.path === decoded);
        if (foundEntry) {
          replaceNavigation(decoded, foundEntry.params);
        } else {
          replaceNavigation("/");
        }
      } else {
        replaceNavigation("/");
      }
    }
    setNavigationHasReady();
  }, [stack, screenSearchParam, isMobile, isNavigationHydrated]);

  // On stack change: update the search param if needed
  useShallowCompareEffect(() => {
    if (!isMobile || !isNavigationHydrated) return;
    const currentStack = stack[stack.length - 1];
    if (!currentStack) return; // Guard against empty stack

    const stackString = encodeURIComponent(currentStack.path);
    if (screenSearchParam !== stackString) {
      const params = new URLSearchParams(window.location.search);
      params.set("screen", stackString);

      // MODIFICATION 1: Use `push` to create browser history entries.
      router.push(`${window.location.pathname}?${params.toString()}`, {
        scroll: false,
      });
    }
  }, [stack, screenSearchParam, isMobile, isNavigationHydrated]);

  // NEW: Listen for browser back/forward button clicks
  useEffect(() => {
    const handlePopState = (event) => {
      const newScreen =
        new URLSearchParams(window.location.search).get("screen") ?? "/";
      const decodedScreen = decodeURIComponent(newScreen);

      const currentStack = useNavigationStore.getState().stack;
      const topOfStackPath = currentStack[currentStack.length - 1]?.path;

      // Only sync if the URL state is different from the stack state
      if (decodedScreen !== topOfStackPath) {
        popTo(decodedScreen); // Your existing popTo logic is perfect for this.
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [popTo]); // Dependency on popTo action from the store

  return children;
};

export const useResponsiveNavigation = () => {
  const router = useRouter(); // MODIFIED: get router
  const { push, popTo, popToTop, replace } = useNavigationStore(
    (state) => state.actions
  );

  // MODIFICATION 2: The `pop` action should now trigger a browser back navigation.
  const pop = () => {
    router.back();
  };

  return { push, pop, popTo, popToTop, replace };
};

export const useResponsiveRouteParams = () => {
  const stack = useNavigationStore(useShallow((state) => state.stack));
  return stack[stack.length - 1]?.params || {};
};

export const ResponsiveRoute = ({ path, component }) => {
  const stack = useNavigationStore(
    useShallow((state) => state.stack.slice(-1))
  );
  const isNavigationReady = useNavigationStore((state) => state.isReady);
  const current = stack[stack.length - 1];

  if (path !== current?.path || !isNavigationReady) return null;

  return component;
};
