import { create } from "zustand";

import { zustandDevtools } from "@/lib/utils";

export const useUserStore = create(
  zustandDevtools((set) => ({
    dataUser: null,
    dataMatrix: null,
    actions: {
      setUser: (val) => set({ dataUser: val }),
      setDataMatrix: (data) => set({ dataMatrix: data }),
      clearUser: () => set({ dataUser: null, dataMatrix: null }),
    },
  })),
  {
    name: "auth-user-store",
  }
);

export const useUserActions = () => {
  const { setUser, setDataMatrix, clearUser } = useUserStore(
    (state) => state.actions
  );
  return { setUser, setDataMatrix, clearUser };
};
