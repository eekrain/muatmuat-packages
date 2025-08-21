"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import * as HoverCard from "@radix-ui/react-hover-card";
import { ChevronDown } from "lucide-react";

import Button from "@/components/Button/Button";
import { DownloadPopover } from "@/components/Header/Web/DownloadPopover";
import LanguageDropdown from "@/components/Header/Web/LanguageDropdown";
import {
  SimpleHover,
  SimpleHoverContent,
  SimpleHoverItem,
  SimpleHoverTrigger,
} from "@/components/HoverMenu/SimpleHoverMenu";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { useAuth } from "@/hooks/Transporter/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import { useOverlayAction } from "@/store/Shared/overlayStore";

// Sub-components
const MenuItem = ({ imgUrl, title, variant, onClick }) => {
  const { t } = useTranslation();
  return (
    <button
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 px-[18px] py-2 font-medium text-neutral-900 hover:bg-neutral-100",
        variant === "danger" && "text-error-400"
      )}
      onClick={onClick}
    >
      <IconComponent src={imgUrl} width={16} height={16} alt="profile" />
      <span className="pt-1 text-xs">
        {t(`HeaderLayout.userMenu.${title.replace(/\s+/g, "")}`, {}, title)}
      </span>
    </button>
  );
};

const NotificationIcon = ({ src, count }) => (
  <Link href="#" className="relative" aria-label={count}>
    <div className="absolute bottom-3 left-3 z-20 flex h-4 items-center rounded-[30px] border-[1.5px] border-neutral-50 bg-buyer-seller-900 px-1">
      <span className="text-xxs font-medium leading-[8px] text-neutral-50">
        {count}
      </span>
    </div>
    <IconComponent
      src={src}
      size="medium"
      className="text-muat-trans-primary-900"
    />
  </Link>
);

const UserDropdown = ({ dataUser, logout, isLoggedIn }) => {
  const [open, setOpen] = useState(false);
  const { setIsOverlayActive } = useOverlayAction();
  const { t } = useTranslation();

  useEffect(() => {
    setIsOverlayActive(open);
  }, [open, setIsOverlayActive]);

  if (!isLoggedIn) {
    return (
      <a
        href={`${process.env.NEXT_PUBLIC_INTERNAL_WEB}login?from=muattranshipper`}
      >
        <Button variant="muatparts-primary">
          <span className="text-sm font-semibold leading-[1] text-neutral-50">
            {t("HeaderLayout.loginButton", {}, "Masuk")}
          </span>
        </Button>
      </a>
    );
  }

  // User menu items inside component for translation
  const USER_MENU_ITEMS = [
    {
      imgUrl: "/icons/profil-user.svg",
      title: t("HeaderLayout.userMenu.ProfilSaya", {}, "Profil Saya"),
    },
    {
      imgUrl: "/icons/profile-user-setting.svg",
      title: t("HeaderLayout.userMenu.PengaturanAkun", {}, "Pengaturan Akun"),
    },
    {
      imgUrl: "/icons/profil-logout.svg",
      title: t("HeaderLayout.userMenu.Keluar", {}, "Keluar"),
      variant: "danger",
      action: "logout",
    },
  ];

  return (
    <HoverCard.Root
      open={open}
      onOpenChange={setOpen}
      openDelay={0}
      closeDelay={200}
    >
      <HoverCard.Trigger asChild>
        <button className="flex cursor-pointer items-center gap-x-2">
          <img
            src={dataUser?.profileImage || "/icons/default-avatar.svg"}
            alt={`${dataUser?.fullName} profile`}
            className="block size-[20px] overflow-hidden rounded-full border border-neutral-500"
          />
          <div className="capsize max-w-[104px] text-xs font-medium">
            <span className="block truncate">{dataUser?.fullName}</span>
          </div>
        </button>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="z-20 flex w-[174px] flex-col justify-between rounded-md border border-neutral-300 bg-neutral-50 shadow-muat"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <div className="flex flex-col py-2">
            {USER_MENU_ITEMS.map((item) => (
              <MenuItem
                key={item.title}
                imgUrl={item.imgUrl}
                title={item.title}
                variant={item.variant}
                onClick={item.action === "logout" ? logout : undefined}
              />
            ))}
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

const NavigationMenuItem = ({ item, pathname }) => {
  const { t } = useTranslation();
  if (item.isDropdown) {
    const isActive =
      (item.activePattern && pathname.startsWith(item.activePattern)) ||
      (item.href && pathname.startsWith(item.href));
    return (
      <SimpleHover>
        <SimpleHoverTrigger asChild>
          <button
            className={cn(
              "flex h-8 items-center gap-1 border-b-2 outline-none",
              isActive ? "border-muat-trans-primary-400" : "border-transparent"
            )}
          >
            <IconComponent src={item.icon} />
            <span>
              {t(`HeaderLayout.navigation.${item.id}`, {}, item.label)}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </SimpleHoverTrigger>
        <SimpleHoverContent>
          {item.dropdownItems.map((dropdownItem) => {
            const isSelected =
              dropdownItem.href && pathname.startsWith(dropdownItem.href);
            return (
              <SimpleHoverItem
                key={dropdownItem.id}
                onClick={dropdownItem.onClick}
              >
                {dropdownItem.href ? (
                  <Link
                    href={dropdownItem.href}
                    className="flex w-full items-center justify-between"
                  >
                    <span>
                      {t(
                        `HeaderLayout.navigation.${dropdownItem.id}`,
                        {},
                        dropdownItem.label
                      )}
                    </span>
                    {isSelected && (
                      <ImageComponent
                        src="/img/checkedblue.png"
                        className="h-4 w-4"
                        alt="Selected Icon"
                      />
                    )}
                  </Link>
                ) : (
                  <span className="flex w-full items-center justify-between">
                    {t(
                      `HeaderLayout.navigation.${dropdownItem.id}`,
                      {},
                      dropdownItem.label
                    )}
                  </span>
                )}
              </SimpleHoverItem>
            );
          })}
        </SimpleHoverContent>
      </SimpleHover>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex h-8 items-center gap-1 border-b-2 border-transparent",
        pathname.startsWith(item.href) && "border-muat-trans-primary-400"
      )}
    >
      <IconComponent src={item.icon} />
      <span>{t(`HeaderLayout.navigation.${item.id}`, {}, item.label)}</span>
    </Link>
  );
};

const HeaderLayout = ({ notifCounter = { notification: 0, chat: 0 } }) => {
  const pathname = usePathname();
  const { dataUser, logout } = useAuth();
  const isLoggedIn = Boolean(dataUser?.fullName);
  const { t } = useTranslation();

  // Notifications menu inside component for translation
  const MENU_NOTIFICATIONS = [
    {
      src: "/icons/header-transporter/report.svg",
      count: "99+",
    },
    { src: "/icons/header-transporter/message.svg", countKey: "chat" },
    {
      src: "/icons/header-transporter/notification.svg",
      countKey: "notification",
    },
  ];

  // Navigation menu inside component for translation
  const NAVIGATION_MENU = [
    {
      id: "dashboard",
      label: t("HeaderLayout.navigation.dashboard", {}, "Dashboard"),
      icon: "/icons/header-transporter/dashboard.svg",
      isDropdown: true,
      activePattern: "/dashboard",
      dropdownItems: [
        {
          id: "dashboard-analytics",
          label: t(
            "HeaderLayout.navigation.dashboardAnalytics",
            {},
            "Dashboard Analytics"
          ),
          href: "/dashboard/analytics",
        },
        {
          id: "dashboard-real-time",
          label: t(
            "HeaderLayout.navigation.dashboardRealTime",
            {},
            "Dashboard Real-time"
          ),
          href: "/dashboard/real-time",
        },
      ],
    },
    {
      id: "monitoring",
      label: t("HeaderLayout.navigation.monitoring", {}, "Monitoring"),
      href: "/monitoring",
      icon: "/icons/header-transporter/monitoring.svg",
    },
    {
      id: "manajemen-armada",
      label: t(
        "HeaderLayout.navigation.manajemenArmada",
        {},
        "Manajemen Armada"
      ),
      href: "/manajemen-armada",
      icon: "/icons/header-transporter/armada.svg",
    },
    {
      id: "manajemen-driver",
      label: t(
        "HeaderLayout.navigation.manajemenDriver",
        {},
        "Manajemen Driver"
      ),
      href: "/manajemen-driver",
      icon: "/icons/header-transporter/driver.svg",
    },
    {
      id: "agenda-armada-driver",
      label: t(
        "HeaderLayout.navigation.agendaArmadaDriver",
        {},
        "Agenda Armada-Driver"
      ),
      href: "/agenda-armada-driver",
      icon: "/icons/header-transporter/agenda.svg",
    },
    {
      id: "daftar-pesanan",
      label: t("HeaderLayout.navigation.daftarPesanan", {}, "Daftar Pesanan"),
      href: "/daftar-pesanan",
      icon: "/icons/header-transporter/pesanan.svg",
    },
    {
      id: "laporan",
      label: t("HeaderLayout.navigation.laporan", {}, "Laporan"),
      icon: "/icons/header-transporter/laporan.svg",
      isDropdown: true,
      activePattern: "/laporan",
      dropdownItems: [
        {
          id: "laporan-pendapatan",
          label: t(
            "HeaderLayout.navigation.laporanPendapatan",
            {},
            "Laporan Pendapatan"
          ),
          href: "/laporan/pendapatan",
        },
        {
          id: "laporan-pencairan-dana",
          label: t(
            "HeaderLayout.navigation.laporanPencairanDana",
            {},
            "Laporan Pencairan Dana"
          ),
          href: "/laporan/pencairan-dana",
        },
        {
          id: "laporan-aktivitas-armada-driver",
          label: t(
            "HeaderLayout.navigation.laporanAktivitasArmadaDriver",
            {},
            "Laporan Aktivitas Armada & Driver"
          ),
          href: "/laporan/aktivitas-armada-driver",
        },
      ],
    },
    {
      id: "pengaturan",
      label: t("HeaderLayout.navigation.pengaturan", {}, "Pengaturan"),
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
            {t("HeaderLayout.backToMuatmuat", {}, "Kembali ke muatmuat")}
          </Link>
          <Link
            className="text-xs font-medium leading-[12px]"
            href={`${process.env.NEXT_PUBLIC_INTERNAL_WEB}traffic/redirect_faq?from=gen`}
          >
            {t("HeaderLayout.helpCenter", {}, "Pusat Bantuan")}
          </Link>

          <div className="flex items-center gap-x-3">
            {isLoggedIn && (
              <div className="flex items-center gap-x-3 pr-3">
                {MENU_NOTIFICATIONS.map((menu, idx) => (
                  <NotificationIcon
                    key={idx}
                    src={menu.src}
                    count={
                      menu.countKey ? notifCounter[menu.countKey] : menu.count
                    }
                  />
                ))}
              </div>
            )}
            <hr className="h-5 border-r border-neutral-500" />
            <UserDropdown
              dataUser={dataUser}
              logout={logout}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </div>

      {isLoggedIn && (
        <div className="flex h-8 items-center gap-6 bg-muat-trans-secondary-900 px-10 text-xs font-medium leading-[1] text-neutral-50">
          <span className="block">
            {t("HeaderLayout.menuLabel", {}, "Menu :")}
          </span>

          {NAVIGATION_MENU.map((item) => (
            <NavigationMenuItem key={item.id} item={item} pathname={pathname} />
          ))}
        </div>
      )}
    </header>
  );
};

export default HeaderLayout;
