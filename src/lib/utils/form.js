import { useTokenStore } from "@/store/auth/tokenStore";
import { useFirstTimerModalStore } from "@/store/first-timer/firstTimerModalStore";
import { usePaymentRepaymentModalStore } from "@/store/forms/paymentRepaymentModal";

export const handleFirstTime = (callback) => {
  const accessToken = useTokenStore.getState().accessToken;
  const setIsFirstTimerModalOpen =
    useFirstTimerModalStore.getState().actions.setIsOpen;
  const paymentRepaymentCount =
    usePaymentRepaymentModalStore.getState().paymentRepaymentCount;
  const setIsPaymentRepaymentModalOpen =
    usePaymentRepaymentModalStore.getState().actions.setIsOpen;
  if (accessToken) {
    if (paymentRepaymentCount) {
      setIsPaymentRepaymentModalOpen(true);
    }
    callback();
  } else {
    setIsFirstTimerModalOpen(true);
  }
};
