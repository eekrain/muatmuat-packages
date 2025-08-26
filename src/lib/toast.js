import { useToastStore } from "@/store/Shipper/toastStore";

/**
 * Global toast utility
 */
export const toast = {
  /**
   * Trigger a success toast
   * @param {string} message - The message to display
   * @param {number} [duration=6000] - Duration in milliseconds
   */
  success: (message, duration = 6000) => {
    useToastStore.getState().actions.addToast({
      message,
      type: "success",
      duration,
    });
  },

  /**
   * Trigger an error toast
   * @param {string} message - The message to display
   * @param {number} [duration=6000] - Duration in milliseconds
   */
  error: (message, duration = 6000) => {
    useToastStore.getState().actions.addToast({
      message,
      type: "error",
      duration,
    });
  },

  /**
   * Trigger an info toast
   * @param {string} message - The message to display
   * @param {number} [duration=6000] - Duration in milliseconds
   */
  info: (message, duration = 6000) => {
    useToastStore.getState().actions.addToast({
      message,
      type: "info",
      duration,
    });
  },
};
