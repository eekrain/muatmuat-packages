import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { fetcherMuatparts } from "@/lib/axios";
import { useAuthStore } from "@/store/auth/authStore";
import { useUserStore } from "@/store/auth/userStore";

export const useInitAuthentication = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refreshTokenParam = searchParams.get("refreshToken");
  const accessTokenParam = searchParams.get("accessToken");
  const setToken = useAuthStore((state) => state.setToken);
  const hasInitAuth = useRef(false);

  const setUser = useUserStore((state) => state.setUser);
  const setDataMatrix = useUserStore((state) => state.setDataMatrix);

  // Setting token from URL params on first render
  useEffect(() => {
    if (refreshTokenParam && accessTokenParam && !hasInitAuth.current) {
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
      hasInitAuth.current = true;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTokenParam, accessTokenParam, router, searchParams]);

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

    credentialCheck().catch((err) => {
      console.error("Error initializing authentication", err);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useUser = () => {
  const dataMatrix = useUserStore((state) => state.dataMatrix);
  const dataUser = useUserStore((state) => state.dataUser);
  return { dataMatrix, dataUser };
};
