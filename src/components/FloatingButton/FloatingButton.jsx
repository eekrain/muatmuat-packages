"use client"

import { Dialog, DialogPanel } from "@headlessui/react";
import { Fragment, useState } from "react"
import styles from "./FloatingButton.module.scss"
import IconComponent from "@/components/ui/IconComponent/IconComponent"
import Button from "../Button/Button"
import ImageComponent from "../ImageComponent/ImageComponent";
// import { useCustomRouter } from "@/libs/CustomRoute";
// import viewport from "@/store/zustand/common";
// import { authZustand } from "@/store/auth/authZustand";
// import CustomLink from "../CustomLink";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FloatingButtonResponsive = () => {
  // const { isMobile } = viewport();
  const router = useRouter();
  const [isShow, setIsShow] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const isLoggedIn = authZustand?.getState()?.accessToken;
  const isLoggedIn = true

  const handleClickFloatingButton = () => {
    if (isLoggedIn) {
      setIsOpen(true)
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <div 
        className={`z-[101] fixed lg:right-[40px] ${isShow ? "sm:right-[15px]" : "sm:right-[-38px]"} sm:bottom-[99px] bottom-[61px] ${styles.floating_button_container}`}
    >
      {!isOpen && (
        <Fragment>
          <ImageComponent className="cursor-pointer" src="/img/FloatingMenu.png" height={70} width={66} alt="floating-button" onClick={handleClickFloatingButton} />
          {false ? (
            <div 
              className="absolute bottom-[30.61px] bg-white border-[3px] border-primary-700 rounded-[900px] p-1 cursor-pointer"
              onClick={() => setIsShow(prevState => !prevState)}
            >
              <IconComponent
                classname={isShow ? "rotate-[270deg]" : "rotate-[90deg]"}
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
          <Button Class="!self-end min-w-[208px] !px-2.5 flex items-center h-[44px]" onClick={() => setIsModalOpen(true)}>
            <div className="w-full flex flex-row gap-x-2.5">
              <ImageComponent
                className="w-5 h-5 self-center"
                src='/img/whatsapp-white.png' 
                height={20} 
                width={20}
              />
              <div className="text-[16px] leading-6 self-center">Hubungi Kami</div>
            </div>
          </Button>
          <Button Class="!self-end !min-w-[208px] !px-2.5 flex items-center h-[44px]" onClick={() => router.push(`${process.env.NEXT_PUBLIC_FAQ_WEB}`)}>
            <div className="w-full flex flex-row gap-x-2.5">
              <ImageComponent
                className="w-5 h-5 self-center"
                src='/img/faq.png' 
                height={20} 
                width={20}
              />
              <div className="text-[16px] leading-6 self-center">Pusat Bantuan / FAQ</div>
            </div>
          </Button>
          <div 
            className="border-[3px] border-primary-700 rounded-3xl p-2.5 !self-end bg-white w-fit"
            onClick={() => setIsOpen(false)}
          >
            <IconComponent
              src='/icons/silang.svg' 
              height={16} 
              width={16} 
              classname='stroke-primary-700 cursor-pointer'
            />
          </div>
        </div>
      )}
      <Dialog open={isModalOpen} onClose={() => {}} transition className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 z-[51] transition duration-300 ease-out data-[closed]:opacity-0">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className={`max-w-lg relative`}>
            <div className={`${styles.modal_apps_az_header} p-[8px] justify-end items-start rounded-t-[10px]`}>
              <button className='size-[20px] bg-[#FFFFFF] rounded-[50px] flex justify-center items-center' onClick={() => setIsModalOpen(false)}>
                <IconComponent
                  classname={`${styles.icon_silang_red}`}
                  src="/icons/silang.svg"
                  width={10}
                  height={10}
                />
              </button>
            </div>
            <div className={styles.modal_apps_az}>
              <div className="p-1 flex flex-col items-center">
                <span className="font-bold text-[17px] leading-[25.5px] text-center text-[#1b1b1b]">Hubungi Kami</span>
                <span className="font-medium text-[14px] leading-[21px] text-center text-[#1b1b1b] mt-6">Jika Anda membutuhkan bantuan dapat menghubungi nomor dibawah ini</span>
                <div className="font-medium text-[14px] leading-[21px] text-center text-primary-700 mt-2 flex flex-row">
                  <ImageComponent
                    className="w-5 h-5 self-center"
                    src='/img/hubungi-kami-blue.png' 
                    height={20} 
                    width={20}
                  />
                  <span>+62 811-3886-7000</span>
                </div>
                <span className="font-medium text-[14px] leading-[21px] text-center text-[#1b1b1b] mt-3">atau klik tombol dibawah ini</span>
                <Link
                  href={`https://wa.me/+6281138867000?`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    Class="mt-2 py-[7px] px-[15px]"
                  >
                    <div className="flex flex-row gap-x-2">
                      <ImageComponent
                        className="w-5 h-5 self-center"
                        src='/img/whatsapp.png' 
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
  )
}

export default FloatingButtonResponsive