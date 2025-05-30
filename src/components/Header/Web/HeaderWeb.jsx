"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

/**
 * Header komponen untuk Muatparts Seller Dashboard
 * Berdasarkan gambar header yang disediakan
 */
const HeaderWeb = ({ type = "muattrans" }) => {
  // State untuk dropdown
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Referensi untuk dropdown yang akan di-close ketika user klik di luar
  const languageRef = useRef(null);
  const profileRef = useRef(null);

  const iconClassnames = {
    muatmuat: "icon-fill-primary-700",
    muatparts: "icon-fill-muat-parts-non-800",
    muattrans: "icon-fill-muat-trans-secondary-900",
  };
  const iconClassname = iconClassnames[type] || iconClassnames.muattrans;

  // Handle click outside untuk menutup dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuNotifications = [
    // {
    //   src: "/icons/orders.svg",
    //   count: 32,
    // },
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
    <header className="fixed z-[20] flex h-[60px] w-full items-center justify-between bg-muat-trans-primary-400 px-10 text-neutral-900">
      <div className="flex items-center gap-x-6">
        <ImageComponent src="/icons/muattrans.svg" width={136} height={27} />
        <div className="flex items-center gap-x-1">
          <IconComponent
            classname="icon-stroke-neutral-900"
            src="/icons/mobile.svg"
          />
          <span className="text-[12px] font-semibold leading-[12px]">
            Download muatmuat
          </span>
        </div>
        <div className="flex items-center gap-x-1">
          <ImageComponent src="/img/ID.png" width={24} height={16} />
          <span className="text-[12px] font-medium leading-[12px]">IDN</span>
          <IconComponent src="/icons/chevron-down.svg" />
        </div>
      </div>
      <div className="flex items-center gap-x-6">
        <Link className="text-[12px] font-medium leading-[12px]" href="#">
          Kembali ke muatmuat
        </Link>
        <Link className="text-[12px] font-medium leading-[12px]" href="#">
          Pusat Bantuan
        </Link>
        <div className="flex items-center gap-x-3">
          <div className="flex items-center gap-x-3 pr-3">
            {menuNotifications.map((menu, key) => (
              <div className="relative" key={key}>
                <div className="absolute bottom-3 left-3 flex h-3.5 items-center rounded-[30px] border-[1.5px] border-muat-trans-secondary-900 bg-buyer-seller-900 px-1.5">
                  <span className="text-[8px] font-medium leading-[8px]">
                    {menu.count}
                  </span>
                </div>
                <IconComponent
                  classname={iconClassname}
                  src={menu.src}
                  size="medium"
                />
              </div>
            ))}
          </div>
          <hr className="h-5 border border-neutral-400" />
          <div className="size-[20px] overflow-hidden rounded-[90px] border border-neutral-500">
            <ImageComponent src="/img/profile.png" width={20} height={20} />
          </div>
          <span className="text-[12px] font-medium leading-[12px]">
            Briko Sparepart
          </span>
        </div>
      </div>
    </header>
  );
};

export default HeaderWeb;
