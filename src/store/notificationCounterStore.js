import { create } from "zustand";

import { fetcherMuatrans } from "@/lib/axios";
import { zustandDevtools } from "@/lib/utils";

export const useNotificationCounterStore = create(
  zustandDevtools(
    (set, get) => ({
      notification: 0,
      chat: 0,
      order: 0,
      actions: {
        fetchSidebarData: async () => {
          const response = await fetcherMuatrans.get("v1/orders/sidebar-count");
          const data = response.data?.Data;
          set({
            notification: data?.notification || 0,
            chat: data?.chat || 0,
            order: data?.order || 0,
          });
        },
      },
    }),
    {
      name: "notification-store",
    }
  )
);

export const useNotificationCounterActions = () => {
  const { fetchSidebarData } = useNotificationCounterStore((s) => s.actions);
  return { fetchSidebarData };
};
