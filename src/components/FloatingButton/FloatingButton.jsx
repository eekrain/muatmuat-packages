"use client";

import Link from "next/link";
// import { useCustomRouter } from "@/libs/CustomRoute";
// import viewport from "@/store/zustand/common";
// import { authZustand } from "@/store/auth/authZustand";
// import CustomLink from "../CustomLink";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import { Dialog, DialogPanel } from "@headlessui/react";

import IconComponent from "@/components/IconComponent/IconComponent";

import Button from "../Button/Button";
import ImageComponent from "../ImageComponent/ImageComponent";
import styles from "./FloatingButton.module.scss";

const FloatingButtonResponsive = () => {
  // const { isMobile } = viewport();
  const router = useRouter();
  const [isShow, setIsShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const isLoggedIn = authZustand?.getState()?.accessToken;
  const isLoggedIn = true;

  const handleClickFloatingButton = () => {
    if (isLoggedIn) {
      setIsOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div
      className={`fixed z-[101] lg:right-[40px] ${isShow ? "max-[600px]:right-[15px]" : "max-[600px]:right-[-38px]"} bottom-[61px] max-[600px]:bottom-[99px] ${styles.floating_button_container}`}
    >
      {!isOpen && (
        <Fragment>
          <ImageComponent
            className="cursor-pointer"
            src="/img/FloatingMenu.png"
            height={70}
            width={66}
            alt="floating-button"
            onClick={handleClickFloatingButton}
          />
          {false ? (
            <div
              className="absolute bottom-[30.61px] cursor-pointer rounded-[900px] border-[3px] border-primary-700 bg-white p-1"
              onClick={() => setIsShow((prevState) => !prevState)}
            >
              <IconComponent
                className={isShow ? "rotate-[270deg]" : "rotate-[90deg]"}
                height={14}
                width={14}
                src="/icons/arrow-blue-down.svg"
              />
            </div>
          ) : null}
        </Fragment>
      )}
      {isOpen && (
        <div className="flex flex-col gap-y-[13px]">
          <Button
            className="flex h-[44px] min-w-[208px] items-center !self-end !px-2.5"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex w-full flex-row gap-x-2.5">
              <ImageComponent
                className="h-5 w-5 self-center"
                src="/img/whatsapp-white.png"
                height={20}
                width={20}
              />
              <div className="self-center text-[16px] leading-6">
                Hubungi Kami
              </div>
            </div>
          </Button>
          <Button
            className="flex h-[44px] !min-w-[208px] items-center !self-end !px-2.5"
            onClick={() => router.push(`${process.env.NEXT_PUBLIC_FAQ_WEB}`)}
          >
            <div className="flex w-full flex-row gap-x-2.5">
              <ImageComponent
                className="h-5 w-5 self-center"
                src="/img/faq.png"
                height={20}
                width={20}
              />
              <div className="self-center text-[16px] leading-6">
                Pusat Bantuan / FAQ
              </div>
            </div>
          </Button>
          <div
            className="w-fit !self-end rounded-3xl border-[3px] border-primary-700 bg-white p-2.5"
            onClick={() => setIsOpen(false)}
          >
            <IconComponent
              src="/icons/silang.svg"
              height={16}
              width={16}
              className="cursor-pointer stroke-primary-700"
            />
          </div>
        </div>
      )}
      <Dialog
        open={isModalOpen}
        onClose={() => {}}
        transition
        className="fixed inset-0 z-[51] flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className={"relative max-w-lg"}>
            <div
              className={`${styles.modal_apps_az_header} items-start justify-end rounded-t-[10px] p-[8px]`}
            >
              <button
                className="flex size-[20px] items-center justify-center rounded-[50px] bg-[#FFFFFF]"
                onClick={() => setIsModalOpen(false)}
              >
                <IconComponent
                  className={`${styles.icon_silang_red}`}
                  src="/icons/silang.svg"
                  width={10}
                  height={10}
                />
              </button>
            </div>
            <div className={styles.modal_apps_az}>
              <div className="flex flex-col items-center p-1">
                <span className="text-center text-[17px] font-bold leading-[25.5px] text-[#1b1b1b]">
                  Hubungi Kami
                </span>
                <span className="mt-6 text-center text-[14px] font-medium leading-[21px] text-[#1b1b1b]">
                  Jika Anda membutuhkan bantuan dapat menghubungi nomor dibawah
                  ini
                </span>
                <div className="mt-2 flex flex-row text-center text-[14px] font-medium leading-[21px] text-primary-700">
                  <ImageComponent
                    className="h-5 w-5 self-center"
                    src="/img/hubungi-kami-blue.png"
                    height={20}
                    width={20}
                  />
                  <span>+62 811-3886-7000</span>
                </div>
                <span className="mt-3 text-center text-[14px] font-medium leading-[21px] text-[#1b1b1b]">
                  atau klik tombol dibawah ini
                </span>
                <Link
                  href={"https://wa.me/+6281138867000?"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="mt-2 px-[15px] py-[7px]">
                    <div className="flex flex-row gap-x-2">
                      <ImageComponent
                        className="h-5 w-5 self-center"
                        src="/img/whatsapp.png"
                        height={20}
                        width={20}
                      />
                      <span className="self-center">Whatsapp</span>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default FloatingButtonResponsive;
