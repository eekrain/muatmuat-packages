import { useRouter } from "next/navigation";
import { useState } from "react";

import { ChevronRight, ChevronUp } from "lucide-react";

import IconComponent from "@/components/IconComponent/IconComponent";
import { useAuth } from "@/hooks/use-auth";
import DefaultResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/DefaultResponsiveLayout";
import { cn } from "@/lib/utils";
import { useNotificationCounterStore } from "@/store/Shipper/notificationCounterStore";

const MenuItem = ({
  icon,
  label,
  badge,
  badgeColor,
  iconClassName,
  ...props
}) => (
  <div className="flex cursor-pointer items-center gap-3" {...props}>
    <IconComponent
      src={icon}
      alt={`${label} icon`}
      className={cn("h-5 w-5 text-muat-trans-secondary-900", iconClassName)}
    />
    <div className="flex flex-1 items-center justify-between">
      <span className="font-sans text-sm font-semibold leading-tight text-neutral-900">
        {label}
      </span>
      {badge > 0 && (
        <div
          className={cn(
            "flex h-3.5 items-center justify-center rounded-full px-1.5 py-1",
            badgeColor
          )}
        >
          <span className="font-sans text-xxs font-bold leading-[10px] text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        </div>
      )}
    </div>
  </div>
);

const ResponsiveMenuScreen = () => {
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);
  const { order } = useNotificationCounterStore();
  const { dataUser } = useAuth();
  const router = useRouter();

  // NOTES: Sudah di implementasi di notificationCounterStore.js  dan use-auth.js
  // const { data: countByStatusData } = useSWR("v1/orders/count-by-status", () =>
  //   fetcherMuatrans
  //     .get("v1/orders/count-by-status")
  //     .then((res) => res.data?.Data?.statusCounts || {})
  // );
  // const { data, error, isLoading } = useGetProfile();
  // const profile = data?.Data?.profile;

  const navigationItems = [
    {
      icon: "/icons/menu/daftarpesanan.svg",
      label: "Daftar Pesanan",
      badge: order || 0,
      badgeColor: "bg-red-500",
      onClick: () => router.push("/daftarpesanan"),
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
      <div className="flex flex-col gap-2 bg-neutral-200">
        {/* Profile Section */}
        <div className="bg-white px-4 py-5">
          <div className="flex items-center gap-2.5">
            <div className="h-[42px] w-[42px] flex-shrink-0 overflow-hidden rounded-full">
              <img
                // Use placeholder from picsum.photos as per guidelines
                src={dataUser?.Avatar || "https://picsum.photos/42?random=1"}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="mb-3 font-sans text-base font-bold leading-tight text-neutral-900">
                {dataUser?.name || "Noel Gallagher"}
              </h3>
              <div className="flex cursor-pointer items-center gap-1">
                <span className="font-sans text-sm font-semibold leading-tight text-neutral-900">
                  Lihat Profil
                </span>
                <ChevronRight className="h-4 w-4 text-muat-trans-secondary-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="bg-white px-4 py-3">
          <div className="flex flex-col gap-[18px]">
            {navigationItems.map((item) => (
              <MenuItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                badgeColor={item.badgeColor}
                onClick={item.onClick}
              />
            ))}
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white px-4 py-3">
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
            onKeyDown={(e) =>
              e.key === "Enter" && setIsSettingsExpanded(!isSettingsExpanded)
            }
            role="button"
            tabIndex={0}
            aria-expanded={isSettingsExpanded}
          >
            <span className="font-sans text-sm font-bold leading-tight text-neutral-900">
              Pengaturan
            </span>
            <ChevronUp
              className={cn(
                "h-5 w-5 text-neutral-700 transition-transform duration-300",
                !isSettingsExpanded && "rotate-180"
              )}
            />
          </div>

          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              isSettingsExpanded
                ? "grid-rows-[1fr] pt-4"
                : "grid-rows-[0fr] pt-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-5">
                {settingsItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    iconClassName={item.iconClassName}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultResponsiveLayout>
  );
};

export default ResponsiveMenuScreen;
