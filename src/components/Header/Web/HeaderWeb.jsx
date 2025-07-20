"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronDown } from "lucide-react";

import {
  SimpleDropdown,
  SimpleDropdownContent,
  SimpleDropdownItem,
  SimpleDropdownTrigger,
} from "@/components/Dropdown/SimpleDropdownMenu";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

import { DownloadPopover } from "./DownloadPopover";
import LanguageDropdown from "./LanguageDropdown";
import { UserDropdown } from "./UserDropdown";

/**
 * Header komponen untuk Muatparts Seller Dashboard
 * Berdasarkan gambar header yang disediakan
 */
const HeaderWeb = ({
  notifCounter = {
    notification: 0,
    chat: 0,
  },
}) => {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  const menuNotifications = [
    {
      src: "/icons/messages.svg",
      count: notifCounter.chat,
    },
    {
      src: "/icons/notifications.svg",
      count: notifCounter.notification,
    },
  ];

  const settingsMenu = [
    {
      label: "Manajemen Lokasi",
      onClick: () => {
        alert("Handle redirect general manajemen lokasi");
      },
    },
    {
      label: "Rekening Bank",
      onClick: () => {
        alert("Handle redirect general rekening bank");
      },
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
            className="leading-[12px] text-xs font-medium capsize"
            href={process.env.NEXT_PUBLIC_INTERNAL_WEB}
          >
            Kembali ke muatmuat
          </Link>
          <Link
            className="leading-[12px] text-xs font-medium capsize"
            href={`${
              process.env.NEXT_PUBLIC_INTERNAL_WEB
            }traffic/redirect_faq?from=gen`}
          >
            Pusat Bantuan
          </Link>

          <div className="flex items-center gap-x-3">
            {isLoggedIn && (
              <div className="flex items-center gap-x-3 pr-3">
                {menuNotifications.map((menu, key) => (
                  <Link href="#" className="relative" key={key}>
                    <div className="absolute bottom-3 left-3 flex h-3.5 items-center rounded-[30px] border-[1.5px] border-muat-trans-secondary-900 bg-buyer-seller-900 px-1.5">
                      <span className="leading-[8px] text-xxs font-medium text-neutral-50">
                        {menu.count}
                      </span>
                    </div>
                    <IconComponent
                      src={menu.src}
                      className="size-6 text-muat-trans-secondary-900"
                    />
                  </Link>
                ))}
              </div>
            )}
            <hr className="h-5 border border-neutral-400" />
            <UserDropdown />
          </div>
        </div>
      </div>

      {isLoggedIn && (
        <div className="leading-[1] flex h-8 items-center gap-6 bg-muat-trans-secondary-900 px-10 text-xs font-medium text-neutral-50">
          <span className="block">Menu :</span>

          <Link
            href="/sewaarmada"
            className={cn(
              "flex h-8 items-center gap-1 border-b-2 border-transparent",
              pathname.startsWith("/sewaarmada") &&
                "border-muat-trans-primary-400"
            )}
          >
            <IconComponent src="/icons/header-pesan-jasa-angkut.svg" />
            <span className="capsize">Pesan Jasa Angkut</span>
          </Link>

          <Link
            href="/daftarpesanan"
            className={cn(
              "flex h-8 items-center gap-1 border-b-2 border-transparent",
              pathname.startsWith("/daftarpesanan") &&
                "border-muat-trans-primary-400"
            )}
          >
            <IconComponent src="/icons/header-daftar-pesanan.svg" />
            <span className="capsize">Daftar Pesanan</span>
          </Link>

          <SimpleDropdown>
            <SimpleDropdownTrigger asChild>
              <button className="flex h-8 items-center gap-1 border-b-2 border-transparent outline-none">
                <IconComponent src="/icons/header-pengaturan.svg" />
                <span className="capsize">Pengaturan</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </SimpleDropdownTrigger>

            <SimpleDropdownContent>
              {settingsMenu.map((menu, key) => (
                <SimpleDropdownItem key={key} onClick={menu.onClick}>
                  {menu.label}
                </SimpleDropdownItem>
              ))}
            </SimpleDropdownContent>
          </SimpleDropdown>
        </div>
      )}
    </header>
  );
};

export default HeaderWeb;
