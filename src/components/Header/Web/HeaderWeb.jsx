"use client";

import Link from "next/link";

import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { useAuthStore } from "@/store/auth/authStore";

import { DownloadPopover } from "./DownloadPopover";
import LanguageDropdown from "./LanguageDropdown";
import { UserDropdown } from "./UserDropdown";

/**
 * Header komponen untuk Muatparts Seller Dashboard
 * Berdasarkan gambar header yang disediakan
 */
const HeaderWeb = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  const menuNotifications = [
    {
      src: "/icons/orders.svg",
      count: 32,
    },
    {
      src: "/icons/messages.svg",
      count: 4,
    },
    {
      src: "/icons/notifications.svg",
      count: 12,
    },
  ];

  return (
    <header className="fixed z-10 flex h-[60px] w-full items-center justify-between bg-muat-trans-primary-400 px-10 text-neutral-900">
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
          {accessToken && (
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
    </header>
  );
};

export default HeaderWeb;
