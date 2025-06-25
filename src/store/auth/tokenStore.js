import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandDevtools } from "@/lib/utils";

const initialAuthState = {
  accessToken: "",
  refreshToken: "",
};

export const useTokenStore = create(
  zustandDevtools(
    persist(
      (set) => ({
        ...initialAuthState,
        actions: {
          setToken: (val) =>
            set({
              accessToken: val.accessToken,
              refreshToken: val.refreshToken,
            }),
          clearToken: () => set({ ...initialAuthState }),
        },
      }),
      {
        name: "t-ash",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }),
      }
    ),
    {
      name: "auth-token-store",
    }
  )
);

export const useTokenActions = () => {
  const { setToken, clearToken } = useTokenStore((state) => state.actions);
  return { setToken, clearToken };
};
