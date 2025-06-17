import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandDevtools } from "@/lib/utils";

const initialAuthState = {
  accessToken: "",
  refreshToken: "",
};

export const useAuthStore = create(
  zustandDevtools(
    persist(
      (set) => ({
        ...initialAuthState,
        setToken: (val) =>
          set({ accessToken: val.accessToken, refreshToken: val.refreshToken }),
        logout: () => set({ ...initialAuthState }),
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

export const useAuthActions = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const logout = useAuthStore((state) => state.logout);
  return { setToken, logout };
};
