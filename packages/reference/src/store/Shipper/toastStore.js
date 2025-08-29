/**
 * @typedef {'success' | 'error'} ToastType
 *
 * @typedef {Object} Toast
 * @property {string} id - Unique identifier
 * @property {string} message - Toast message
 * @property {ToastType} type - Type of toast
 * @property {number} duration - Duration in milliseconds
 * @property {number} timeoutId - setTimeout ID for cleanup
 * @property {number} createdAt - Timestamp when the toast was created
 * @property {boolean} isLeaving - Whether the toast is in leaving animation state
 *
 * @typedef {Object} ToastState
 * @property {Toast[]} dataToast - Array of active toasts
 * @property {Object} actions - Toast actions
 * @property {(toast: Omit<Toast, 'id' | 'timeoutId' | 'createdAt'>) => void} actions.addToast - Add a new toast
 * @property {(id: string) => void} actions.removeToast - Remove a toast by ID
 * @property {() => void} actions.removeAll - Remove all toasts
 */
import { create } from "zustand";

const MAX_TOASTS = 3;
const TOAST_LIMIT_BUFFER = 1000; // 1 second buffer between removing old toasts

export const useToastStore = create(
  /** @returns {ToastState} */ (set, get) => ({
    dataToast: [],
    actions: {
      addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 11);
        const currentToasts = get().dataToast;

        // If we're at the limit, remove the oldest toast first
        if (currentToasts.length >= MAX_TOASTS) {
          const oldestToast = currentToasts[0];
          get().actions.removeToast(oldestToast.id);

          // Add a small delay before adding the new toast to prevent visual glitches
          setTimeout(() => {
            get().actions.addToast(toast);
          }, TOAST_LIMIT_BUFFER);
          return;
        }

        // Create the timeout first so we can store its ID
        const timeoutId = setTimeout(() => {
          get().actions.removeToast(id);
        }, toast.duration || 6000);

        set((state) => ({
          dataToast: [
            ...state.dataToast,
            {
              ...toast,
              id,
              timeoutId,
              createdAt: Date.now(),
            },
          ].sort((a, b) => b.createdAt - a.createdAt), // Keep newest toasts at the end
        }));
      },

      removeToast: (id) => {
        // First set the leaving state
        set((state) => ({
          dataToast: state.dataToast.map((t) =>
            t.id === id ? { ...t, isLeaving: true } : t
          ),
        }));

        // Wait for animation to complete before removing
        setTimeout(() => {
          // Clear the timeout first
          const toast = get().dataToast.find((t) => t.id === id);
          if (toast?.timeoutId) {
            clearTimeout(toast.timeoutId);
          }

          // Then remove the toast from state
          set((state) => ({
            dataToast: state.dataToast.filter((t) => t.id !== id),
          }));
        }, 150); // Match this with the leave animation duration in tailwind.config.js
      },

      removeAll: () => {
        // Set all toasts to leaving state
        set((state) => ({
          dataToast: state.dataToast.map((t) => ({ ...t, isLeaving: true })),
        }));

        // Wait for animation before clearing
        setTimeout(() => {
          // Clear all timeouts first
          get().dataToast.forEach((toast) => {
            if (toast.timeoutId) {
              clearTimeout(toast.timeoutId);
            }
          });

          // Then clear the state
          set({ dataToast: [] });
        }, 150);
      },
    },
  })
);

export const useToastActions = () => {
  return useToastStore((state) => state.actions);
};
