import { create } from "zustand";

export const useSelectArmadaModalStore = create((set) => ({
  isOpen: false,
  isDimensionOrWeightChanged: false,
  type: "",
  actions: {
    setIsOpen: (isOpen) => set({ isOpen }),
    setIsDimensionOrWeightChanged: (isDimensionOrWeightChanged) =>
      set({ isDimensionOrWeightChanged }),
    setType: (type) => set({ type }),
  },
}));

export const useSelectArmadaModalAction = () => {
  const { setIsOpen, setIsDimensionOrWeightChanged, setType } =
    useSelectArmadaModalStore((state) => state.actions);
  return { setIsOpen, setIsDimensionOrWeightChanged, setType };
};
