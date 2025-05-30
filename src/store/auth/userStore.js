import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const initialUserState = {
  id: "",
  name: "",
  phone: "",
  role: "",
  dataUser: null,
  dataMatrix: null,
};

export const useUserStore = create(
  persist(
    (set) => ({
      ...initialUserState,
      setUser: (val) => set(val),
      setDataUser: (data) => set({ dataUser: data }),
      setDataUser2: (data) =>
        set((state) => ({ dataUser: { ...state.dataUser, ...data } })),
      setDataMatrixLS: (data) => set({ dataMatrix: data }),
      removeUser: () => set({ ...initialUserState }),
    }),
    {
      name: "t-ng",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        id: state.id,
        name: state.name,
        phone: state.phone,
        role: state.role,
        dataUser: state.dataUser,
        dataMatrix: state.dataMatrix,
      }),
    }
  )
);

export const useUserActions = () => {
  const setUser = useUserStore((state) => state.setUser);
  const setDataUser = useUserStore((state) => state.setDataUser);
  const setDataUser2 = useUserStore((state) => state.setDataUser2);
  const setDataMatrixLS = useUserStore((state) => state.setDataMatrixLS);
  const removeUser = useUserStore((state) => state.removeUser);
  return { setUser, setDataUser, setDataUser2, setDataMatrixLS, removeUser };
};
