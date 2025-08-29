"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import { useShallow } from "zustand/react/shallow";

import { fetcherMuatparts } from "@/lib/axios";

import { useTokenActions, useTokenStore } from "@/store/AuthStore/tokenStore";
import { useUserActions, useUserStore } from "@/store/AuthStore/userStore";

/* eslint-disable no-console */

const cacheConfig = {
  headers: {
    "Content-Type": "application/json",
    // Cache for 8 hours, but allow revalidation for every 1 hour
    "Cache-Control": "public, max-age=28800, stale-while-revalidate=3600",
  },
  // timeout: 2000,
};

export const AuthenticationProvider = ({ children }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Extract tokens from URL params
  const refreshTokenSearchParam = searchParams.get("refreshToken");
  const accessTokenSearchParam = searchParams.get("accessToken");

  const isZustandHydrated = useTokenStore((state) => state.isHydrated);
  const { setToken } = useTokenActions();
  const [hasInitAuth, setHasInitAuth] = useState(false);

  const { setUser, setDataMatrix } = useUserActions();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // console.log("Auth effect:", { isZustandHydrated, hasInitAuth });
    // Only run when Zustand is hydrated and we haven't initialized auth yet
    if (!isZustandHydrated || hasInitAuth) return;

    const handleAuth = async () => {
      if (refreshTokenSearchParam && accessTokenSearchParam) {
        setToken({
          refreshToken: refreshTokenSearchParam,
          accessToken: accessTokenSearchParam,
        });
        // Remove tokens from URL
        const params = new URLSearchParams(window.location.search);
        params.delete("refreshToken");
        params.delete("accessToken");
        const newSearchParams = params.toString();
        router.replace(
          newSearchParams ? `?${newSearchParams}` : window.location.pathname
        );
        // Make sure setToken with zustand persist is trully set
        await new Promise((res) => setTimeout(res, 500));
      }

      try {
        await Promise.allSettled([
          fetcherMuatparts
            .get("v1/muatparts/auth/credential-check")
            .then((res) => {
              const credential = res.data?.Data || {};
              delete credential.accessToken;
              delete credential.refreshToken;
              delete credential.refreshtoken;
              setUser({ ...credential, isLoggedIn: true });
              setIsLoggedIn(true);
            }),
          fetcherMuatparts
            .post("v1/user/getUserStatusV3", undefined, cacheConfig)
            .then((res) => setUser(res.data?.Data)),
          fetcherMuatparts
            .get("v1/register/checkmatrix", cacheConfig)
            .then((res) => setDataMatrix(res.data?.Data)),
        ]);
      } catch (err) {
        console.warn("Error initializing authentication", err);
      } finally {
        setHasInitAuth(true);
        setIsLoggedIn(true);
      }
    };

    handleAuth();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    refreshTokenSearchParam,
    accessTokenSearchParam,
    hasInitAuth,
    isZustandHydrated,
  ]);

  // Render children only after auth initialization
  return <Fragment>{isLoggedIn ? children : null}</Fragment>;
};

/**
 *
 * @typedef {Object} AuthData
 * @property {Object} dataMatrix
 * @property {Object} dataUser
 * @property {Function} logout
 * @property {boolean} isLoggedIn
 */

/**
 *
 * @returns {AuthData}
 */
export const useAuth = () => {
  const dataMatrix = useUserStore(useShallow((state) => state.dataMatrix));
  const dataUser = useUserStore(useShallow((state) => state.dataUser));
  const isLoggedIn = useMemo(() => Boolean(dataUser?.name), [dataUser?.name]);

  const logout = useCallback(async () => {
    const authStore = useTokenStore.getState();
    const userStore = useUserStore.getState();

    await fetcherMuatparts
      .post("v1/muatparts/auth/revoke-refresh-token", {
        refreshToken: authStore?.refreshToken,
      })
      .catch((err) => console.warn("Error revoking refresh token", err))
      .finally(() => {
        authStore.actions.clearToken();
        userStore.actions.clearUser();

        // Determine redirect URL based on app mode and environment
        let redirectUrl;

        if (process.env.NEXT_PUBLIC_APP_MODE === "transporter") {
          // Transporter mode: redirect to appropriate login page
          redirectUrl = "/login";
        } else {
          // Other modes: redirect to external signout
          redirectUrl = `${process.env.NEXT_PUBLIC_INTERNAL_WEB}login/signout`;
        }

        window.location.replace(redirectUrl);
      });
  }, []);

  return { dataMatrix, dataUser, logout, isLoggedIn };
};
