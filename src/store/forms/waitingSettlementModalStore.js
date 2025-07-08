import { create } from "zustand";

export const useWaitingSettlementModalStore = create((set) => ({
  isOpen: false,
  waitingSettlementOrderId: [],
  actions: {
    setIsOpen: (isOpen) => set({ isOpen }),
    setWaitingSettlementOrderId: (waitingSettlementOrderId) =>
      set({ waitingSettlementOrderId }),
  },
}));

export const useWaitingSettlementModalAction = () => {
  const { setIsOpen, setWaitingSettlementOrderId } =
    useWaitingSettlementModalStore((state) => state.actions);
  return { setIsOpen, setWaitingSettlementOrderId };
};
