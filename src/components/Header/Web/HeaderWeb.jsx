"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";

import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { useUser } from "@/hooks/use-auth";
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
  const { dataUser } = useUser();

  const menuNotifications = [
    // {
    //   src: "/icons/orders.svg",
    //   count: 32,
    // },
    {
      src: "/icons/messages.svg",
      count: notifCounter.chat,
    },
    {
      src: "/icons/notifications.svg",
      count: notifCounter.notification,
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
            className="text-[12px] font-medium leading-[12px]"
            href={process.env.NEXT_PUBLIC_INTERNAL_WEB}
          >
            Kembali ke muatmuat
          </Link>
          <Link
            className="text-[12px] font-medium leading-[12px]"
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
                      <span className="text-[8px] font-medium leading-[8px] text-neutral-50">
                        {menu.count}
                      </span>
                    </div>
                    <IconComponent src={menu.src} size="medium" />
                  </Link>
                ))}
              </div>
            )}
            <hr className="h-5 border border-neutral-400" />
            <UserDropdown />
          </div>
        </div>
      </div>

      {dataUser?.Email && (
        <div className="flex h-8 items-center gap-6 bg-muat-trans-secondary-900 px-10 text-xs font-medium leading-[1] text-neutral-50">
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
            <span>Pesan Jasa Angkut</span>
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
            <span>Daftar Pesanan</span>
          </Link>

          <DropdownMenuPrimitive.Root data-slot="dropdown-menu">
            <DropdownMenuPrimitive.Trigger
              data-slot="dropdown-menu-trigger"
              asChild
            >
              <button className="flex h-8 items-center gap-1 border-b-2 border-transparent outline-none">
                <IconComponent src="/icons/header-pengaturan.svg" />
                <span>Pengaturan</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuPrimitive.Trigger>
            <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal">
              <DropdownMenuPrimitive.Content
                data-slot="dropdown-menu-content"
                className="shadow-muat z-50 mt-1 flex w-[194px] flex-col rounded-md border border-neutral-300 bg-neutral-50"
                side="bottom"
                align="start"
              >
                <DropdownMenuPrimitive.Item
                  data-slot="dropdown-menu-item"
                  className={cn(
                    "cursor-pointer px-2.5 py-3 text-xs font-medium leading-[1.2] outline-none hover:bg-neutral-100"
                  )}
                  onClick={() => {
                    alert("Handle redirect general manajemen lokasi");
                  }}
                >
                  Manajemen Lokasi
                </DropdownMenuPrimitive.Item>

                <DropdownMenuPrimitive.Item
                  data-slot="dropdown-menu-item"
                  className={cn(
                    "cursor-pointer px-2.5 py-3 text-xs font-medium leading-[1.2] outline-none hover:bg-neutral-100"
                  )}
                  onClick={() => {
                    alert("Handle redirect general rekening bank");
                  }}
                >
                  Rekening Bank
                </DropdownMenuPrimitive.Item>
              </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
          </DropdownMenuPrimitive.Root>
        </div>
      )}
    </header>
  );
};

export default HeaderWeb;
