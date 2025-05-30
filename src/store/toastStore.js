import { create } from "zustand";

export const useToastStore = create(
  /** @returns {ToastState} */ (set, get) => ({
    dataToast: [],
    position: "bottom-right",
    actions: {
      addToast: (toast) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          dataToast: [...state.dataToast, { ...toast, id }],
        }));

        setTimeout(() => {
          set((state) => ({
            dataToast: state.dataToast.filter((t) => t.id !== id),
          }));
        }, toast.duration || 5000);
      },
      removeToast: (id) =>
        set((state) => ({
          dataToast: state.dataToast.filter((t) => t.id !== id),
        })),
    },
  })
);

export const useToastActions = () => useToastStore((state) => state.actions);
