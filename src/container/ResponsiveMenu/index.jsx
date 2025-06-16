import { useState } from "react";

import {
  ChevronLeft,
  ChevronUp,
  CreditCard,
  FileText,
  Globe,
  MapPin,
  Phone,
} from "lucide-react";

import DefaultResponsiveLayout from "@/layout/ResponsiveLayout/DefaultResponsiveLayout";
import { useNotificationCounterStore } from "@/store/notificationCounterStore";

export const ResponsiveMenu = () => {
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);
  const { notification, chat, order } = useNotificationCounterStore();

  const navigationItems = [
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Daftar Pesanan",
      badge: order,
      badgeColor: "bg-red-500",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Pusat Bantuan",
    },
  ];

  const settingsItems = [
    {
      icon: <MapPin className="h-6 w-6" />,
      label: "Manajemen Lokasi",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: "Rekening Bank",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      label: "Bahasa",
    },
  ];

  return (
    <DefaultResponsiveLayout mode="menu">
      <div className="flex-1 overflow-y-auto bg-neutral-200">
        {/* Profile Section */}
        <div className="bg-white p-5">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-black">
              <img
                src="https://picsum.photos/200"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="mb-3 text-base font-bold leading-tight text-black">
                Noel Gallagher
              </h3>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-black">
                  Lihat Profil
                </span>
                <ChevronLeft className="h-4 w-4 -rotate-90 text-[#461B02]" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="mt-2 bg-white">
          <div className="space-y-4 p-4">
            {navigationItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="text-[#461B02]">{item.icon}</div>
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-sm font-semibold text-black">
                    {item.label}
                  </span>
                  {item.badge && (
                    <div
                      className={`${item.badgeColor} flex h-3.5 min-w-[23px] items-center justify-center rounded-full px-2 py-1`}
                    >
                      <span className="text-[8px] font-bold text-white">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Section */}
        <div className="mt-2 bg-white">
          <div className="p-4">
            <div
              className="mb-4 flex cursor-pointer items-center justify-between"
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
            >
              <span className="text-sm font-bold text-black">Pengaturan</span>
              <ChevronUp
                className={`h-5 w-5 text-neutral-700 transition-transform ${
                  isSettingsExpanded ? "rotate-0" : "rotate-180"
                }`}
              />
            </div>

            {isSettingsExpanded && (
              <div className="space-y-5">
                {settingsItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-[#461B02]">{item.icon}</div>
                    <span className="flex-1 text-sm font-semibold text-black">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultResponsiveLayout>
  );
};
