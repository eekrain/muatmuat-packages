import { create } from "zustand";

export const useLoadingStore = create((set) => ({
  isGlobalLoading: true,
  actions: {
    setIsGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),
  },
}));

export const useLoadingAction = () => {
  const { setIsGlobalLoading } = useLoadingStore((s) => s.actions);
  return { setIsGlobalLoading };
};
