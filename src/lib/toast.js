// lib/toast.ts
import { useToastStore } from "@/store/toastStore";

/**
 * @typedef {Object} ToastOptions
 * @property {number} [duration=6000] - Duration in milliseconds
 * @property {"default"} [offset="default"] - Offset in pixels
 */

const defaultOptions = {
  duration: 6000,
  offset: "default",
};

/**
 * Global toast utility
 */
export const toast = {
  /**
   * Trigger a success toast
   * @param {string} message - The message to display
   * @param {Partial<ToastOptions>} [options] - Options for the toast
   */
  success: (message, options) => {
    const newOptions = { ...defaultOptions, ...options };
    useToastStore.getState().actions.addToast({
      message,
      type: "success",
      ...newOptions,
    });
  },

  /**
   * Trigger an error toast
   * @param {string} message - The message to display
   * @param {Partial<ToastOptions>} [options] - Options for the toast
   */
  error: (message, options) => {
    const newOptions = { ...defaultOptions, ...options };
    useToastStore.getState().actions.addToast({
      message,
      type: "error",
      ...newOptions,
    });
  },
};
