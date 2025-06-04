// store/responsive/sewaArmadaResponsiveStore.js
import { create } from "zustand";

export const useSewaArmadaResponsiveStore = create((set) => ({
  screen: "",
  setScreen: (screen) => set({ screen }),
}));
