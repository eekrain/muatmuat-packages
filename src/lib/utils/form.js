import { useTokenStore } from "@/store/auth/tokenStore";
import { useFirstTimerModalStore } from "@/store/first-timer/firstTimerModalStore";

export const handleFirstTime = (callback) => {
  const accessToken = useTokenStore.getState().accessToken;
  const setIsOpen = useFirstTimerModalStore.getState().actions.setIsOpen;
  if (accessToken) {
    callback();
  } else {
    setIsOpen(true);
  }
};
