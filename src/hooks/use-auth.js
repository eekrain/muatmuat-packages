import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuthStore } from "@/store/auth/authStore";
import { useUserStore } from "@/store/auth/userStore";

import { useSWRHook } from "./use-swr";

export const useInitAuthentication = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refreshToken = searchParams.get("refreshToken");
  const accessToken = searchParams.get("accessToken");
  const hasInitAuth = useRef(false);

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

export const useCheckMatrix = () => {
  const { data: dataCheckMatrix, isLoading: isLoadingCheckMatrix } = useSWRHook(
    isLogin && !apiCallRef.current ? `${baseUrl}register/checkmatrix` : null
  );

  return { dataCheckMatrix, isLoadingCheckMatrix };
};
