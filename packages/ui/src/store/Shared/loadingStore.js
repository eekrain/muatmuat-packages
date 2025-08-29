import { create } from "zustand";

import { zustandDevtools } from "@/lib/utils";

export const useLoadingStore = create(
  zustandDevtools(
    (set) => ({
      isGlobalLoading: true,
      actions: {
        setIsGlobalLoading: (isGlobalLoading) => set({ isGlobalLoading }),
      },
    }),
    {
      name: "global-loading-store",
    }
  )
);

export const useLoadingAction = () => {
  const { setIsGlobalLoading } = useLoadingStore((s) => s.actions);
  return { setIsGlobalLoading };
};
