import { useTokenStore } from "@/store/AuthStore/tokenStore";
import { useFirstTimerModalStore } from "@/store/Shipper/first-timer/firstTimerModalStore";
import { useWaitingSettlementModalStore } from "@/store/Shipper/forms/waitingSettlementModalStore";

export const handleFirstTime = (callback) => {
  const accessToken = useTokenStore.getState().accessToken;
  const setIsFirstTimerModalOpen =
    useFirstTimerModalStore.getState().actions.setIsOpen;
  const waitingSettlementOrderId =
    useWaitingSettlementModalStore.getState().waitingSettlementOrderId;
  const setIsWaitingSettlementModalOpen =
    useWaitingSettlementModalStore.getState().actions.setIsOpen;

  // Early exit: if no access token, show first timer modal and return
  if (!accessToken) {
    setIsFirstTimerModalOpen(true);
    return;
  }

  // At this point, we know we have an accessToken
  if (waitingSettlementOrderId.length > 0) {
    setIsWaitingSettlementModalOpen(true);
    return;
  }

  // Execute callback
  return callback();
};
