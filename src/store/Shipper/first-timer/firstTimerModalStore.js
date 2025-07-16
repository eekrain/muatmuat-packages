import { create } from "zustand";

export const useFirstTimerModalStore = create((set) => ({
  isOpen: false,
  actions: {
    setIsOpen: (isOpen) => set({ isOpen }),
  },
}));

export const useFirstTimerModalAction = () => {
  const { setIsOpen } = useFirstTimerModalStore((state) => state.actions);
  return { setIsOpen };
};
