import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useFirstTimerSewaArmadaApp = create(
  persist(
    (set) => ({
      dontShowAgain: false,
      userId: null,
      setDontShowAgain: (value, userId) =>
        set({ dontShowAgain: value, userId }),
    }),
    {
      name: "first-timer-sewa-armada-app",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        dontShowAgain: state.dontShowAgain,
        userId: state.userId,
      }),
    }
  )
);
