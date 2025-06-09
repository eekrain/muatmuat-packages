import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import axios from "@/lib/axios";
import { useAuthStore } from "@/store/auth/authStore";
import { useUserStore } from "@/store/auth/userStore";

export const useInitAuthentication = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refreshToken = searchParams.get("refreshToken");
  const accessToken = searchParams.get("accessToken");
  const hasInitAuth = useRef(false);

  const setUser = useUserStore((state) => state.setUser);
  const setDataMatrix = useUserStore((state) => state.setDataMatrix);
  useEffect(() => {
    const init = async () => {
      const [resUser, resMatrix, resCredential] = await Promise.all([
        axios.post("v1/user/getUserStatusV3"),
        axios.get("v1/register/checkmatrix"),
        axios.get("v1/muatparts/auth/credential-check"),
      ]);
      // console.log("🚀 ~ init ~ resCredential:", resCredential);
      setUser(resUser.data?.Data);
      setDataMatrix(resMatrix.data?.Data);
    };
    init().catch((err) => {
      console.error("Error initializing authentication", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (refreshToken && accessToken && !hasInitAuth.current) {
      useAuthStore.getState().setToken({ refreshToken, accessToken });

      // Remove tokens from URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("refreshToken");
      params.delete("accessToken");
      const newSearch = params.toString();
      const newUrl = newSearch ? `?${newSearch}` : window.location.pathname;
      router.replace(newUrl);
      hasInitAuth.current = true;
    }
  }, [refreshToken, accessToken, router, searchParams]);
};

export const useUser = () => {
  const dataMatrix = useUserStore((state) => state.dataMatrix);
  const dataUser = useUserStore((state) => state.dataUser);
  return { dataMatrix, dataUser };
};
