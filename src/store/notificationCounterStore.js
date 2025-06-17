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
          const res = await fetcherMuatrans.get("v1/orders/sidebar-count");
          set({
            notification: res.data?.Data?.notification || 0,
            chat: res.data?.Data?.chat || 0,
            order: res.data?.Data?.order || 0,
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
