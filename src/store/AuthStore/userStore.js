import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandDevtools } from "@/lib/utils";

export const useUserStore = create(
  zustandDevtools(
    persist(
      (set) => ({
        dataUser: null,
        dataMatrix: null,
        actions: {
          setUser: (val) =>
            set((state) => ({
              dataUser: {
                ...(state?.dataUser ? state.dataUser : {}),
                ...val,
              },
            })),
          setDataMatrix: (data) =>
            set((state) => ({
              dataMatrix: {
                ...(state?.dataMatrix ? state.dataMatrix : {}),
                ...data,
              },
            })),
          clearUser: () => set({ dataUser: {}, dataMatrix: null }),
        },
      }),
      {
        name: "t-ng",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          dataUser: state.dataUser,
          dataMatrix: state.dataMatrix,
        }),
        onRehydrateStorage: () => (state, error) => {
          if (error) {
            state?.actions?.clearUser?.();
          }
        },
      }
    ),
    {
      name: "auth-user-store",
    }
  )
);

export const useUserActions = () => {
  const { setUser, setDataMatrix, clearUser } = useUserStore(
    (state) => state.actions
  );
  return { setUser, setDataMatrix, clearUser };
};
