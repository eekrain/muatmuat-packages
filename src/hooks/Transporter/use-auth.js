"use client";

import { Fragment, useCallback, useEffect } from "react";

import { useShallow } from "zustand/react/shallow";

import { fetcherMuatrans } from "@/lib/axios";
import { useTokenStore } from "@/store/AuthStore/tokenStore";
import { useUserActions, useUserStore } from "@/store/AuthStore/userStore";

/* eslint-disable no-console */

export const AuthenticationProvider = ({ children }) => {
  const isZustandHydrated = useTokenStore((state) => state.isHydrated);
  const hasAccessToken = useTokenStore((state) => !!state.accessToken);
  const { setUser } = useUserActions();

  useEffect(() => {
    // Only run when Zustand is hydrated
    if (!isZustandHydrated) return;

    if (!hasAccessToken) return;

    const handleAuth = async () => {
      try {
        const profileResponse = await fetcherMuatrans.get(
          "v1/transporter/profile"
        );

        if (profileResponse.data?.Data) {
          const { user, ...restData } = profileResponse.data.Data;

          // Store complete profile data in user store
          setUser({
            ...user,
            ...restData,
          });
        }
      } catch (err) {
        console.warn("Error initializing authentication", err);
      }
    };

    handleAuth();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isZustandHydrated]);

  // Render children after Zustand is hydrated
  return <Fragment>{isZustandHydrated ? children : null}</Fragment>;
};

/**
 *
 * @typedef {Object} AuthData
 * @property {Object} dataUser
 * @property {Object} transporter
 * @property {Array} picContacts
 * @property {Array} banks
 * @property {Array} documents
 * @property {Object} displaySettings
 * @property {Function} logout
 */

/**
 *
 * @returns {AuthData}
 */
export const useAuth = () => {
  const dataUser = useUserStore(useShallow((state) => state.dataUser));

  const logout = useCallback(async () => {
    const authStore = useTokenStore.getState();
    const userStore = useUserStore.getState();

    try {
      // Call transporter logout endpoint
      await fetcherMuatrans.post("v1/transporter/auth/logout");
    } catch (err) {
      console.warn("Error during logout", err);
    } finally {
      // Clear local state and tokens
      authStore.actions.clearToken();
      userStore.actions.clearUser();

      // Redirect to login page
      window.location.replace("/login");
    }
  }, []);

  return {
    dataUser,
    transporter: dataUser?.transporter,
    picContacts: dataUser?.picContacts || [],
    banks: dataUser?.banks || [],
    documents: dataUser?.documents || [],
    displaySettings: dataUser?.displaySettings || {},
    logout,
  };
};
