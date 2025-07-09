import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { useShallow } from "zustand/react/shallow";

import { fetcherMuatparts } from "@/lib/axios";
import { useTokenActions, useTokenStore } from "@/store/auth/tokenStore";
import { useUserActions, useUserStore } from "@/store/auth/userStore";

export const InitializeAuthentication = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refreshTokenParam = searchParams.get("refreshToken");
  const accessTokenParam = searchParams.get("accessToken");
  const { setToken } = useTokenActions();
  const [hasCheckAuthParams, setHasCheckAuthParams] = useState(false);

  const { setUser, setDataMatrix } = useUserActions();

  // Setting token from URL params on first render
  useEffect(() => {
    if (hasCheckAuthParams) return;
    if (
      Boolean(refreshTokenParam) &&
      Boolean(accessTokenParam) &&
      !hasCheckAuthParams
    ) {
      // Add delay to ensure Zustand store is hydrated from localStorage
      const timeoutId = setTimeout(() => {
        setToken({
          refreshToken: refreshTokenParam,
          accessToken: accessTokenParam,
        });
        // Remove tokens from URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete("refreshToken");
        params.delete("accessToken");
        const newSearch = params.toString();
        const newUrl = newSearch ? `?${newSearch}` : window.location.pathname;
        router.replace(newUrl);
      }, 300); // 100ms delay should be sufficient for store hydration

      // Cleanup timeout on unmount or dependency change
      return () => clearTimeout(timeoutId);
    }
    setHasCheckAuthParams(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTokenParam, accessTokenParam, hasCheckAuthParams, searchParams]);

  // Fetching user data and matrix on first render
  useEffect(() => {
    const credentialCheck = async () => {
      const [resUser, resMatrix, resCredential] = await Promise.all([
        fetcherMuatparts.post("v1/user/getUserStatusV3"),
        fetcherMuatparts.get("v1/register/checkmatrix"),
        fetcherMuatparts.get("v1/muatparts/auth/credential-check"),
      ]);
      // console.log("🚀 ~ init ~ resCredential:", resCredential);
      const { accessToken, refreshtoken, ...user } = resCredential.data?.Data;
      setUser({ ...resUser.data?.Data, ...user });
      setDataMatrix(resMatrix.data?.Data);
    };
    if (hasCheckAuthParams) {
      credentialCheck().catch((err) => {
        console.error("Error initializing authentication", err);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCheckAuthParams]);

  return null;
};

export const useAuth = () => {
  const dataMatrix = useUserStore(useShallow((state) => state.dataMatrix));
  const dataUser = useUserStore(useShallow((state) => state.dataUser));

  const logout = useCallback(async () => {
    const authStore = useTokenStore.getState();
    const userStore = useUserStore.getState();

    await fetcherMuatparts
      .post("v1/muatparts/auth/revoke-refresh-token", {
        refreshToken: authStore?.refreshToken,
      })
      .catch((err) => {
        console.warn("Error revoking refresh token", err);
      });

    authStore.actions.clearToken();
    userStore.actions.clearUser();
    window.location.replace(
      `${process.env.NEXT_PUBLIC_INTERNAL_WEB}login/signout`
    );
  }, []);

  return { dataMatrix, dataUser, logout };
};
