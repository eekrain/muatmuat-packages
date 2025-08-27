import { useEffect, useState } from "react";

import useSWR from "swr";

import SidebarService from "@/services/sidebar/sidebarService";

import { useNotificationCounterStore } from "@/store/notificationCounterStore";

/**
 * Custom hook for sidebar API integration
 * Provides real-time data fetching and state management for sidebar
 */
export const useSidebarAPI = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Get notification counter actions
  const { fetchSidebarData } = useNotificationCounterStore(
    (state) => state.actions
  );

  // Fetch sidebar configuration
  const { data: sidebarConfig } = useSWR(
    "sidebar-config",
    () => SidebarService.getSidebarConfig(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Fetch user profile
  const { data: userProfile, mutate: mutateProfile } = useSWR(
    "user-profile",
    () => SidebarService.getUserProfile(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Fetch recent orders
  const { data: recentOrders, mutate: mutateOrders } = useSWR(
    "recent-orders",
    () => SidebarService.getRecentOrders(5),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Fetch order statistics
  const { data: orderStats, mutate: mutateStats } = useSWR(
    "order-stats",
    () => SidebarService.getOrderStats(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Fetch quick actions
  const { data: quickActions } = useSWR(
    "quick-actions",
    () => SidebarService.getQuickActions(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Fetch system announcements
  const { data: announcements } = useSWR(
    "system-announcements",
    () => SidebarService.getSystemAnnouncements(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Fetch user preferences
  const { data: userPreferences, mutate: mutatePreferences } = useSWR(
    "user-preferences",
    () => SidebarService.getUserPreferences(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  // Auto-refresh based on config
  useEffect(() => {
    if (!sidebarConfig?.refreshInterval) return;

    const interval = setInterval(() => {
      refreshSidebarData();
    }, sidebarConfig.refreshInterval);

    return () => clearInterval(interval);
  }, [sidebarConfig?.refreshInterval]);

  // Manual refresh function
  const refreshSidebarData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchSidebarData(), // Update notification counts
        mutateProfile(),
        mutateOrders(),
        mutateStats(),
        mutatePreferences(),
      ]);
      setLastRefresh(Date.now());
    } catch (error) {
      console.error("Error refreshing sidebar data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      const success =
        await SidebarService.markNotificationAsRead(notificationId);
      if (success) {
        await fetchSidebarData(); // Refresh counts
      }
      return success;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      const success = await SidebarService.markAllNotificationsAsRead();
      if (success) {
        await fetchSidebarData(); // Refresh counts
      }
      return success;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
  };

  // Update user preferences
  const updateUserPreferences = async (preferences) => {
    try {
      const result = await SidebarService.updateUserPreferences(preferences);
      if (result) {
        await mutatePreferences(); // Refresh preferences
      }
      return result;
    } catch (error) {
      console.error("Error updating user preferences:", error);
      return null;
    }
  };

  // Log user activity
  const logActivity = async (activity) => {
    try {
      await SidebarService.logUserActivity(activity);
    } catch (error) {
      console.error("Error logging user activity:", error);
    }
  };

  // Update sidebar layout
  const updateSidebarLayout = async (layout) => {
    try {
      const result = await SidebarService.updateSidebarLayout(layout);
      return result;
    } catch (error) {
      console.error("Error updating sidebar layout:", error);
      return null;
    }
  };

  return {
    // Data
    userProfile,
    recentOrders,
    orderStats,
    quickActions,
    announcements,
    userPreferences,
    sidebarConfig,

    // State
    isRefreshing,
    lastRefresh,

    // Actions
    refreshSidebarData,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    updateUserPreferences,
    updateSidebarLayout,
    logActivity,

    // Utilities
    formatLastRefresh: () => {
      const now = Date.now();
      const diffMs = now - lastRefresh;
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);

      if (diffSeconds < 60) {
        return `${diffSeconds} detik yang lalu`;
      } else if (diffMinutes < 60) {
        return `${diffMinutes} menit yang lalu`;
      } else {
        const diffHours = Math.floor(diffMinutes / 60);
        return `${diffHours} jam yang lalu`;
      }
    },
  };
};

export default useSidebarAPI;
