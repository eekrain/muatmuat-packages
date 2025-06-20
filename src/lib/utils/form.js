import { useAuthStore } from "@/store/auth/authStore";
import { useFirstTimerModalStore } from "@/store/first-timer/firstTimerModalStore";

export const handleFirstTime = (callback) => {
  const accessToken = useAuthStore.getState().accessToken;
  const setIsOpen = useFirstTimerModalStore.getState().actions.setIsOpen;
  if (accessToken) {
    callback();
  } else {
    setIsOpen(true);
  }
};
