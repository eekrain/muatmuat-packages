import Image from "next/image";
import Link from "next/link";

import IconComponent from "../IconComponent/IconComponent";

const BottomNavigationBar = () => {
  // kalo ada yg perlu custom bisa bantu pakek props, saya lagi malas :), nanti dapat pahala
  return (
    <div className="fixed bottom-0 flex h-[103px] w-full justify-between">
      <div className="relative flex h-[66px] w-full flex-row items-end justify-between self-end bg-transparent px-5 pb-[7px]">
        <Link
          className="absolute bottom-[39px] left-1/2 -translate-x-1/2 transform"
          href="/sewaarmada"
        >
          <Image
            alt="add-button"
            src="/icons/muatrans-add-button.svg"
            width={64}
            height={64}
          />
        </Link>
        <Link
          className="z-[1] flex h-[66px] w-[70px] flex-col items-center justify-end gap-y-2"
          href="#"
        >
          <IconComponent src="/icons/chat24.svg" size="medium" />
          <span className="text-xs font-medium leading-none text-neutral-600">
            Pesan
          </span>
        </Link>
        <Link
          className="z-[1] text-xs font-medium leading-none text-primary-700"
          href="/sewaarmada"
        >
          Buat Pesanan
        </Link>
        <Link
          className="z-[1] flex h-[66px] w-[70px] flex-col items-center justify-end gap-y-2"
          href="#"
        >
          <IconComponent src="/icons/profile24.svg" size="medium" />
          <span className="text-xs font-medium leading-none text-neutral-600">
            Profil
          </span>
        </Link>
        <Image
          alt="bottomnavbar"
          className="absolute bottom-0 left-0 h-[66px] w-auto w-full object-cover"
          src="/icons/bottom-navigation-bar.svg"
          width={100}
          height={66}
          priority
        />
      </div>
    </div>
  );
};

export default BottomNavigationBar;
