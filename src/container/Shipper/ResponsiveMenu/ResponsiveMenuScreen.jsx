import { useState } from "react";

import { ChevronLeft, ChevronUp } from "lucide-react";

import IconComponent from "@/components/IconComponent/IconComponent";
import DefaultResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/DefaultResponsiveLayout";
import { useNotificationCounterStore } from "@/store/Shipper/notificationCounterStore";

const ResponsiveMenuScreen = () => {
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);
  const { order } = useNotificationCounterStore();

  const navigationItems = [
    {
      icon: "/icons/menu/daftarpesanan.svg",
      label: "Daftar Pesanan",
      badge: order,
      badgeColor: "bg-red-500",
    },
    {
      icon: "/icons/menu/pusatbantuan.svg",
      label: "Pusat Bantuan",
    },
  ];

  const settingsItems = [
    {
      icon: "/icons/menu/map.svg",
      label: "Manajemen Lokasi",
    },
    {
      icon: "/icons/menu/rekening.svg",
      label: "Rekening Bank",
    },
    {
      icon: "/icons/menu/bahasa.svg",
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
                <ChevronLeft className="h-4 w-4 -rotate-90 text-muat-trans-secondary-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="mt-2 bg-white">
          <div className="space-y-4 p-4">
            {navigationItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <IconComponent
                  src={item.icon}
                  className="h-5 w-5 text-muat-trans-secondary-900"
                />
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-sm font-semibold text-black">
                    {item.label}
                  </span>
                  {item.badge && (
                    <div
                      className={`${item.badgeColor} flex h-3.5 min-w-[23px] items-center justify-center rounded-full px-2 py-1`}
                    >
                      <span className="text-[8px] font-bold text-white">
                        {item.badge >= 100 ? "99+" : item.badge}
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
              className="flex cursor-pointer items-center justify-between"
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
            >
              <span className="text-sm font-bold text-black">Pengaturan</span>
              <ChevronUp
                className={`h-5 w-5 text-neutral-700 transition-transform ${
                  isSettingsExpanded ? "rotate-0" : "rotate-180"
                }`}
              />
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isSettingsExpanded
                  ? "mt-4 translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-2 opacity-0"
              } space-y-5`}
              style={{
                maxHeight: isSettingsExpanded ? "500px" : "0px",
              }}
            >
              {settingsItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <IconComponent
                    src={item.icon}
                    className="h-5 w-5 text-muat-trans-secondary-900"
                  />
                  <span className="flex-1 text-sm font-semibold text-black">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DefaultResponsiveLayout>
  );
};

export default ResponsiveMenuScreen;
