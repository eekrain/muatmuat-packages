import { create } from "zustand";

export const useResponsiveSearchStore = create((set) => ({
  searchValue: "",
  setSearchValue: (value) => set({ searchValue: value }),
}));
