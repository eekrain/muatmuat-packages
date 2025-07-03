import { create } from "zustand";

export const usePaymentRepaymentModalStore = create((set) => ({
  isOpen: false,
  paymentRepaymentCount: 0,
  actions: {
    setIsOpen: (isOpen) => set({ isOpen }),
    setPaymentRepaymentCount: (paymentRepaymentCount) =>
      set({ paymentRepaymentCount }),
  },
}));

export const usePaymentRepaymentModalAction = () => {
  const { setIsOpen, setPaymentRepaymentCount } = usePaymentRepaymentModalStore(
    (state) => state.actions
  );
  return { setIsOpen, setPaymentRepaymentCount };
};
