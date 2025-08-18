import { create } from "zustand";
// 1. Import the 'persist' middleware from Zustand
import { persist } from "zustand/middleware";

export const useAnalyticsStore = create(
  // 2. Wrap your store's definition with the 'persist' middleware
  persist(
    (set, get) => ({
      sharedData: null,
      setSharedData: (data) => set({ sharedData: data }),
      period: "month",
      setPeriod: (newPeriod) => {
        // The logging can be removed now, but is left here for clarity
        console.log(`[Zustand Store] Setting period to:`, newPeriod);
        set({ period: newPeriod });
        console.log(`[Zustand Store] New state is:`, get());
      },
    }),
    {
      // 3. Provide a unique name for the storage key in localStorage
      name: "analytics-period-storage",
      // 4. (Recommended) Specify which parts of the store to save.
      // We only need to save 'period'.
      partialize: (state) => ({ period: state.period }),
    }
  )
);
