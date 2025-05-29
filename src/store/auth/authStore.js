import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const initialAuthState = {
  accessToken: "",
  refreshToken: "",
};

export const useAuthStore = create(
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
  )
);

export const useAuthActions = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const logout = useAuthStore((state) => state.logout);
  return { setToken, logout };
};
