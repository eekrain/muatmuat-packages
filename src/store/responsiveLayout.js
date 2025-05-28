import { create } from "zustand";

const responsiveLayoutZustand = create((set) => ({
  screen: "default",
  setScreen: (screen) => set({ screen: screen }),
}));

export default responsiveLayoutZustand;
