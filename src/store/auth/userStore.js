import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandDevtools } from "@/lib/utils";

export const useUserStore = create(
  zustandDevtools(
    persist(
      (set) => ({
        dataUser: null,
        dataMatrix: null,
        setUser: (val) => set({ dataUser: val }),
        setDataMatrix: (data) => set({ dataMatrix: data }),
        removeUser: () => set({ dataUser: null, dataMatrix: null }),
      }),
      {
        name: "t-ng",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          dataUser: state.dataUser,
          dataMatrix: state.dataMatrix,
        }),
      }
    ),
    {
      name: "auth-user-store",
    }
  )
);

export const useUserActions = () => {
  const setUser = useUserStore((state) => state.setUser);
  const setDataMatrix = useUserStore((state) => state.setDataMatrix);
  const removeUser = useUserStore((state) => state.removeUser);
  return { setUser, setDataMatrix, removeUser };
};
