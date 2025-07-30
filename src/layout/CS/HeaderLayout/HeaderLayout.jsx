"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronDown } from "lucide-react";

import { DownloadPopover } from "@/components/Header/Web/DownloadPopover";
import LanguageDropdown from "@/components/Header/Web/LanguageDropdown";
import { UserDropdown } from "@/components/Header/Web/UserDropdown";
import {
  SimpleHover,
  SimpleHoverContent,
  SimpleHoverItem,
  SimpleHoverTrigger,
} from "@/components/HoverMenu/SimpleHoverMenu";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const HeaderLayout = ({
  notifCounter = {
    notification: 0,
    chat: 0,
  },
}) => {
  const pathname = usePathname();
  const { dataUser } = useAuth();

  const menuNotifications = [
    {
      src: "/icons/header-transporter/report.svg",
      count: "99+",
    },
    {
      src: "/icons/header-transporter/message.svg",
      count: notifCounter.chat,
    },
    {
      src: "/icons/header-transporter/notification.svg",
      count: notifCounter.notification,
    },
  ];

  const navigationMenu = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "/icons/header-transporter/dashboard.svg",
      isDropdown: true,
      dropdownItems: [
        {
          id: "dashboard-analytics",
          label: "Dashboard Analytics",
          href: "/dashboard/analytics",
        },
        {
          id: "dashboard-real-time",
          label: "Dashboard Real-time",
          href: "/dashboard/real-time",
        },
      ],
    },
    {
      id: "monitoring",
      label: "Monitoring",
      href: "/monitoring",
      icon: "/icons/header-transporter/monitoring.svg",
    },
    {
      id: "user",
      label: "Data User",
      href: "/user",
      icon: "/icons/header-transporter/driver.svg",
    },
    {
      id: "transporter",
      label: "Transporter Management",
      href: "/transporter",
      icon: "/icons/header-transporter/armada.svg",
    },
    {
      id: "shipper",
      label: "Shipper Management",
      href: "/shipper",
      icon: "/icons/header-transporter/pesanan.svg",
    },
    {
      id: "order",
      label: "Order Management",
      href: "/order",
      icon: "/icons/header-transporter/agenda.svg",
    },
    {
      id: "laporan",
      label: "Laporan",
      icon: "/icons/header-transporter/laporan.svg",
      isDropdown: true,
      dropdownItems: [
        {
          id: "laporan-pendapatan",
          label: "Laporan Pendapatan",
          href: "/laporan/pendapatan",
        },
        {
          id: "laporan-pencairan-dana",
          label: "Laporan Pencairan Dana",
          href: "/laporan/pencairan-dana",
        },
        {
          id: "laporan-aktivitas",
          label: "Laporan Aktivitas",
          href: "/laporan/aktivitas",
        },
      ],
    },
    {
      id: "pengaturan",
      label: "Pengaturan",
      href: "/pengaturan",
      icon: "/icons/header-transporter/pengaturan.svg",
    },
  ];

  return (
    <header className="sticky left-0 top-0 z-20 w-full">
      <div className="flex h-[60px] w-full items-center justify-between bg-muat-trans-primary-400 px-10 text-neutral-900">
        <div className="flex items-center gap-x-6">
          <ImageComponent src="/icons/muattrans.svg" width={136} height={27} />
          <DownloadPopover />
          <LanguageDropdown />
        </div>
        <div className="flex items-center gap-x-6">
          <Link
            className="text-xs font-medium leading-[12px]"
            href={process.env.NEXT_PUBLIC_INTERNAL_WEB}
          >
            Kembali ke muatmuat
          </Link>
          <Link
            className="text-xs font-medium leading-[12px]"
            href={`${
              process.env.NEXT_PUBLIC_INTERNAL_WEB
            }traffic/redirect_faq?from=gen`}
          >
            Pusat Bantuan
          </Link>

          <div className="flex items-center gap-x-3">
            {dataUser?.Email && (
              <div className="flex items-center gap-x-3 pr-3">
                {menuNotifications.map((menu, key) => (
                  <Link href="#" className="relative" key={key}>
                    <div className="absolute bottom-3 left-3 flex h-3.5 items-center rounded-[30px] border-[1.5px] border-neutral-50 bg-buyer-seller-900 px-1.5">
                      <span className="text-xxs font-medium leading-[8px] text-neutral-50">
                        {menu.count}
                      </span>
                    </div>
                    <IconComponent
                      src={menu.src}
                      size="medium"
                      className="text-muat-trans-primary-900"
                    />
                  </Link>
                ))}
              </div>
            )}
            <hr className="h-5 border-r border-neutral-500" />
            <UserDropdown />
          </div>
        </div>
      </div>

      {dataUser?.Email && (
        <div className="flex h-8 items-center gap-6 bg-muat-trans-secondary-900 px-10 text-xs font-medium leading-[1] text-neutral-50">
          <span className="block">Menu :</span>

          {navigationMenu.map((item) => {
            if (item.isDropdown) {
              return (
                <SimpleHover key={item.id}>
                  <SimpleHoverTrigger asChild>
                    <button className="flex h-8 items-center gap-1 border-b-2 border-transparent outline-none">
                      <IconComponent src={item.icon} />
                      <span>{item.label}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </SimpleHoverTrigger>

                  <SimpleHoverContent>
                    {item.dropdownItems.map((dropdownItem) => (
                      <SimpleHoverItem
                        key={dropdownItem.id}
                        onClick={dropdownItem.onClick}
                      >
                        {dropdownItem.href ? (
                          <Link href={dropdownItem.href}>
                            {dropdownItem.label}
                          </Link>
                        ) : (
                          <span>{dropdownItem.label}</span>
                        )}
                      </SimpleHoverItem>
                    ))}
                  </SimpleHoverContent>
                </SimpleHover>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex h-8 items-center gap-1 border-b-2 border-transparent",
                  pathname.startsWith(item.href) &&
                    "border-muat-trans-primary-400"
                )}
              >
                <IconComponent src={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default HeaderLayout;
