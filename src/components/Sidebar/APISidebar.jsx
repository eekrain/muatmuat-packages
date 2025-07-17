"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import { useAuth } from "@/hooks/use-auth";
import { useSidebarAPI } from "@/hooks/use-sidebar-api";
import { fetcherMuatrans } from "@/lib/axios";
import { useUserStore } from "@/store/auth/userStore";
import { useNotificationCounterStore } from "@/store/notificationCounterStore";

// API Sidebar Component with integrated API functionality
export const APISidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { dataUser } = useAuth();
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [profileModal, setProfileModal] = useState(false);

  // Get notification counts from store
  const { notification, chat, order } = useNotificationCounterStore();

  // Use the custom sidebar API hook
  const {
    userProfile,
    recentOrders,
    orderStats,
    quickActions,
    announcements,
    userPreferences,
    sidebarConfig,
    isRefreshing,
    lastRefresh,
    refreshSidebarData,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    updateUserPreferences,
    logActivity,
    formatLastRefresh,
  } = useSidebarAPI();

  const formatCount = (count) => {
    if (count === 0) return null;
    return count > 99 ? "99+" : count.toString();
  };

  const handleNavigate = (path) => {
    // Log user activity
    logActivity({
      action: "sidebar_navigate",
      destination: path,
      timestamp: new Date().toISOString(),
    });

    router.push(path);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await fetcherMuatrans.post("/v1/auth/logout");
      // Clear auth stores
      useUserStore.getState().actions.clearUser();
      router.push("/sewaarmada");
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleQuickAction = (action) => {
    logActivity({
      action: "sidebar_quick_action",
      actionId: action.id,
      timestamp: new Date().toISOString(),
    });

    handleNavigate(action.url);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="h-full w-80 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-yellow-400 px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-gray-800">
              <IconComponent src="/icons/arrow-left.svg" className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <IconComponent
                src="/icons/muatrans-logo.svg"
                className="h-8 w-8"
              />
              <span className="font-bold text-gray-800">muatrans</span>
            </div>
          </div>
          <button
            onClick={refreshSidebarData}
            disabled={isRefreshing}
            className="text-gray-800 hover:text-gray-600 disabled:opacity-50"
            title={`Last refresh: ${formatLastRefresh()}`}
          >
            <IconComponent
              src="/icons/refresh.svg"
              className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="flex h-full flex-col overflow-y-auto">
          {/* Profile Section */}
          <div className="border-b border-gray-200 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-300">
                <ImageComponent
                  src={userProfile?.avatar || "/img/avatar.png"}
                  alt="Profile"
                  className="h-12 w-12 object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {userProfile?.name || dataUser?.name || "User"}
                </h3>
                <p className="text-sm text-gray-500">
                  {userProfile?.email || dataUser?.email || ""}
                </p>
              </div>
            </div>
            <button
              onClick={() => setProfileModal(true)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Lihat Profil →
            </button>
          </div>

          {/* Quick Stats */}
          {orderStats && sidebarConfig?.showQuickStats && (
            <div className="border-b border-gray-200 p-4">
              <h4 className="mb-3 font-semibold text-gray-900">
                Statistik Cepat
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-blue-50 p-3">
                  <div className="text-2xl font-bold text-blue-600">
                    {orderStats.totalOrders || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Pesanan</div>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <div className="text-2xl font-bold text-green-600">
                    {orderStats.completedOrders || 0}
                  </div>
                  <div className="text-sm text-gray-600">Selesai</div>
                </div>
              </div>
            </div>
          )}

          {/* System Announcements */}
          {announcements &&
            announcements.length > 0 &&
            sidebarConfig?.showAnnouncements && (
              <div className="border-b border-gray-200 p-4">
                <h4 className="mb-3 font-semibold text-gray-900">Pengumuman</h4>
                <div className="space-y-2">
                  {announcements.slice(0, 2).map((announcement) => (
                    <div
                      key={announcement.id}
                      className="rounded-lg bg-yellow-50 p-3 text-sm"
                    >
                      <div className="font-medium text-yellow-800">
                        {announcement.title}
                      </div>
                      <div className="text-yellow-700">
                        {announcement.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Quick Actions */}
          {quickActions && quickActions.length > 0 && (
            <div className="border-b border-gray-200 p-4">
              <h4 className="mb-3 font-semibold text-gray-900">Aksi Cepat</h4>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    className="w-full rounded-lg bg-blue-50 p-3 text-left transition-colors hover:bg-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent
                        src={action.icon}
                        className="h-5 w-5 text-blue-600"
                      />
                      <span className="text-sm font-medium text-blue-700">
                        {action.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="flex-1 space-y-2 p-4">
            {/* Daftar Pesanan */}
            <button
              onClick={() => handleNavigate("/daftarpesanan")}
              className="flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <IconComponent
                  src="/icons/menu/daftarpesanan.svg"
                  className="h-5 w-5"
                />
                <span className="text-gray-900">Daftar Pesanan</span>
              </div>
              {formatCount(order) && (
                <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                  {formatCount(order)}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={() => handleNavigate("/notifications")}
              className="flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <IconComponent
                  src="/icons/notification.svg"
                  className="h-5 w-5"
                />
                <span className="text-gray-900">Notifikasi</span>
              </div>
              <div className="flex items-center gap-2">
                {formatCount(notification) && (
                  <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                    {formatCount(notification)}
                  </span>
                )}
                {notification > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllNotificationsAsRead();
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                    title="Mark all as read"
                  >
                    ✓
                  </button>
                )}
              </div>
            </button>

            {/* Chat */}
            <button
              onClick={() => handleNavigate("/chat")}
              className="flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <IconComponent src="/icons/chat.svg" className="h-5 w-5" />
                <span className="text-gray-900">Chat</span>
              </div>
              {formatCount(chat) && (
                <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
                  {formatCount(chat)}
                </span>
              )}
            </button>

            {/* Pusat Bantuan */}
            <button
              onClick={() => handleNavigate("/help")}
              className="flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
            >
              <IconComponent
                src="/icons/menu/pusatbantuan.svg"
                className="h-5 w-5"
              />
              <span className="text-gray-900">Pusat Bantuan</span>
            </button>

            {/* Recent Orders */}
            {recentOrders?.length > 0 && sidebarConfig?.showRecentOrders && (
              <div className="mt-6">
                <h4 className="mb-3 font-semibold text-gray-900">
                  Pesanan Terbaru
                </h4>
                <div className="space-y-2">
                  {recentOrders.slice(0, 3).map((order) => (
                    <button
                      key={order.orderId}
                      onClick={() =>
                        handleNavigate(
                          `/daftarpesanan/detailpesanan/${order.orderId}`
                        )
                      }
                      className="w-full rounded-lg p-3 text-left transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderCode}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.destination}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString(
                              "id-ID"
                            )}
                          </div>
                          <div className="text-xs font-medium text-blue-600">
                            {order.status}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Settings */}
            <div className="mt-6">
              <button
                onClick={() => setSettingsExpanded(!settingsExpanded)}
                className="flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <IconComponent
                    src="/icons/settings.svg"
                    className="h-5 w-5"
                  />
                  <span className="text-gray-900">Pengaturan</span>
                </div>
                <IconComponent
                  src="/icons/chevron-down.svg"
                  className={`h-4 w-4 transition-transform ${settingsExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {settingsExpanded && (
                <div className="ml-8 mt-2 space-y-2">
                  <button
                    onClick={() => handleNavigate("/settings/location")}
                    className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                  >
                    <IconComponent
                      src="/icons/menu/map.svg"
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-900">
                      Manajemen Lokasi
                    </span>
                  </button>
                  <button
                    onClick={() => handleNavigate("/settings/bank")}
                    className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                  >
                    <IconComponent
                      src="/icons/menu/rekening.svg"
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-900">Rekening Bank</span>
                  </button>
                  <button
                    onClick={() => handleNavigate("/settings/language")}
                    className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                  >
                    <IconComponent
                      src="/icons/menu/bahasa.svg"
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-gray-900">Bahasa</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg p-3 text-red-600 transition-colors hover:bg-red-50"
            >
              <IconComponent src="/icons/logout.svg" className="h-5 w-5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <Modal open={profileModal} onOpenChange={setProfileModal}>
        <ModalContent className="w-[400px]">
          <ModalHeader>
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-300">
                <ImageComponent
                  src={userProfile?.avatar || "/img/avatar.png"}
                  alt="Profile"
                  className="h-16 w-16 object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {userProfile?.name || dataUser?.name || "User"}
                </h3>
                <p className="text-sm text-gray-500">
                  {userProfile?.email || dataUser?.email || ""}
                </p>
              </div>
            </div>
          </ModalHeader>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {userProfile?.phoneNumber || dataUser?.phoneNumber || "-"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Member Since
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {userProfile?.createdAt
                    ? new Date(userProfile.createdAt).toLocaleDateString(
                        "id-ID"
                      )
                    : "-"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setProfileModal(false);
                  handleNavigate("/profile/edit");
                }}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setProfileModal(false)}
                className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default APISidebar;
