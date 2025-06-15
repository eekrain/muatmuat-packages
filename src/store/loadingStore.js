import { create } from "zustand";

export const useLoadingStore = create((set) => ({
  isGlobalLoading: true,
  setIsGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),
}));

export const useLoadingAction = () => {
  const setIsGlobalLoading = useLoadingStore((s) => s.setIsGlobalLoading);

  return { setIsGlobalLoading };
};
