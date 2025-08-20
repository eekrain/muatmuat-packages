"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import { DownloadPopover } from "@/components/Header/Web/DownloadPopover";
import LanguageDropdown from "@/components/Header/Web/LanguageDropdown";
import { UserDropdown } from "@/components/Header/Web/UserDropdown";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useOverlayAction } from "@/store/Shared/overlayStore";

const HeaderLayout = ({
  notifCounter = {
    notification: 0,
    chat: 0,
  },
}) => {
  const pathname = usePathname();
  const { dataUser } = useAuth();
  const { setIsOverlayActive } = useOverlayAction();

  const [isOpenMenuDropdown, setOpenMenuDropdown] = useState(false);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    setIsOverlayActive(isOpenMenuDropdown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenMenuDropdown]);

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
      id: "order",
      label: "Daftar Pesanan",
      href: "/daftar-pesanan",
      icon: "/icons/header-transporter/agenda.svg",
    },
    {
      id: "user",
      label: "Daftar User",
      href: "/user",
      icon: "/icons/header-transporter/driver.svg",
    },
    {
      id: "laporan",
      label: "Laporan",
      icon: "/icons/header-transporter/laporan.svg",
      isDropdown: true,
      dropdownItems: [
        {
          id: "laporan-riwayat-transporter-tidak-aktif",
          label: "Laporan Riwayat Transporter Tidak Aktif",
          href: "/laporan/riwayat-transporter-tidak-aktif",
        },
        {
          id: "laporan-permintaan-dibatalkan",
          label: "Laporan Permintaan Dibatalkan",
          href: "/laporan/permintaan-dibatalkan",
        },
        {
          id: "laporan-tambahan-biaya",
          label: "Laporan Tambahan Biaya",
          href: "/laporan/tambahan-biaya",
        },
      ],
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

          {navigationMenu.map((item, key) => {
            if (item.isDropdown) {
              return (
                <SimpleDropdown
                  key={key}
                  open={isOpenMenuDropdown && openId === item.id}
                  onOpenChange={(val) => {
                    setOpenId(item.id);
                    setOpenMenuDropdown(val);
                  }}
                >
                  <SimpleDropdownTrigger asChild>
                    <button
                      className={cn(
                        "flex h-8 items-center gap-1 border-b-2 outline-none",
                        pathname.includes(item.id)
                          ? "border-muat-trans-primary-400"
                          : "border-transparent"
                      )}
                    >
                      <IconComponent src={item.icon} />
                      <span>{item.label}</span>
                      <IconComponent
                        className={cn(
                          isOpenMenuDropdown && openId === item.id
                            ? "rotate-180 transition-transform duration-300"
                            : "rotate-0 transition-transform duration-300"
                        )}
                        src="/icons/chevron-down.svg"
                      />
                    </button>
                  </SimpleDropdownTrigger>

                  <SimpleDropdownContent className="w-full max-w-full">
                    {item.dropdownItems.map((dropdownItem, key) => (
                      <SimpleDropdownItem
                        className={cn(
                          "flex items-center justify-between gap-x-2.5",
                          pathname.includes(dropdownItem.href)
                            ? "font-semibold"
                            : ""
                        )}
                        key={key}
                        onClick={dropdownItem.onClick}
                      >
                        {dropdownItem.href ? (
                          <Link href={dropdownItem.href}>
                            {dropdownItem.label}
                          </Link>
                        ) : (
                          <span>{dropdownItem.label}</span>
                        )}
                        <div className="size-4">
                          {pathname.includes(dropdownItem.href) ? (
                            <IconComponent
                              className="text-primary-700"
                              src="/icons/check16.svg"
                            />
                          ) : null}
                        </div>
                      </SimpleDropdownItem>
                    ))}
                  </SimpleDropdownContent>
                </SimpleDropdown>
              );
            }

            return (
              <Link
                key={key}
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
