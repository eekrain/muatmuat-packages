import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useShallow } from "zustand/react/shallow";

import { fetcherMuatparts } from "@/lib/axios";
import { useTokenActions, useTokenStore } from "@/store/auth/tokenStore";
import { useUserActions, useUserStore } from "@/store/auth/userStore";

const cacheConfig = {
  headers: {
    "Content-Type": "application/json",
    // Cache for 8 hours, but allow revalidation for every 1 hour
    "Cache-Control": "public, max-age=28800, stale-while-revalidate=3600",
  },
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

  useEffect(() => {
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
        const [resUser, resMatrix, resCredential] = await Promise.all([
          fetcherMuatparts.post(
            "v1/user/getUserStatusV3",
            undefined,
            cacheConfig
          ),
          fetcherMuatparts.get("v1/register/checkmatrix", cacheConfig),
          fetcherMuatparts.get(
            "v1/muatparts/auth/credential-check",
            cacheConfig
          ),
        ]);
        const { accessToken, refreshtoken, ...user } =
          resCredential.data?.Data || {};
        setUser({ ...resUser.data?.Data, ...user });
        setDataMatrix(resMatrix.data?.Data);
      } catch (err) {
        console.log("Error initializing authentication");
      } finally {
        setHasInitAuth(true);
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
  return children;
};

export const useAuth = () => {
  const dataMatrix = useUserStore(useShallow((state) => state.dataMatrix));
  const dataUser = useUserStore(useShallow((state) => state.dataUser));

  // Stable logout function
  const logout = useCallback(async () => {
    const authStore = useTokenStore.getState();
    const userStore = useUserStore.getState();

    try {
      await fetcherMuatparts.post("v1/muatparts/auth/revoke-refresh-token", {
        refreshToken: authStore?.refreshToken,
      });
    } catch (err) {
      console.warn("Error revoking refresh token", err);
    } finally {
      authStore.actions.clearToken();
      userStore.actions.clearUser();
      window.location.replace(
        `${process.env.NEXT_PUBLIC_INTERNAL_WEB}login/signout`
      );
    }
  }, []);

  return { dataMatrix, dataUser, logout };
};
