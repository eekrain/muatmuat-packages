"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";

import { useAuth } from "@/hooks/use-auth";

import { cn } from "@/lib/utils";

const FloatingButton = () => {
  const router = useRouter();
  const [isShow, setIsShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  const handleClickFloatingButton = () => {
    if (isLoggedIn) {
      setIsOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-[99px] z-50 transition-[right] duration-300 ease-out",
        isShow ? "right-[15px]" : "-right-10",
        "md:bottom-20 md:right-10"
      )}
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
              className="absolute bottom-[30.61px] cursor-pointer rounded-full border-2 border-primary-700 bg-white p-1"
              onClick={() => setIsShow((prevState) => !prevState)}
            >
              <IconComponent
                className={cn(
                  "transition-transform",
                  isShow ? "rotate-[270deg]" : "rotate-90"
                )}
                height={14}
                width={14}
                src="/icons/arrow-blue-down.svg"
              />
            </div>
          ) : null}
        </Fragment>
      )}
      {isOpen && (
        <div className="flex flex-col gap-y-3">
          <Button
            className="!h-11 !px-2.5"
            onClick={() => {
              setIsModalOpen(true);
              setIsOpen(false);
            }}
            variant="muatparts-primary"
          >
            <div className="flex w-full flex-row gap-x-2.5">
              <ImageComponent
                className="h-5 w-5 self-center"
                src="/img/whatsapp-white.png"
                height={20}
                width={20}
                alt="WhatsApp"
              />
              <div className="self-center text-base leading-6">
                Hubungi Kami
              </div>
            </div>
          </Button>
          <Button
            className="!h-11 !px-2.5"
            onClick={() => router.push(`${process.env.NEXT_PUBLIC_FAQ_WEB}`)}
            variant="muatparts-primary"
          >
            <div className="flex w-full flex-row gap-x-2.5">
              <ImageComponent
                className="h-5 w-5 self-center"
                src="/img/faq.png"
                height={20}
                width={20}
                alt="FAQ"
              />
              <div className="self-center text-base leading-6">
                Pusat Bantuan / FAQ
              </div>
            </div>
          </Button>
          <button
            className="w-fit self-end rounded-full border-2 border-primary-700 bg-white p-2.5"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            <IconComponent
              src="/icons/silang.svg"
              height={16}
              width={16}
              className="cursor-pointer stroke-primary-700"
            />
          </button>
        </div>
      )}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        closeOnOutsideClick={false}
      >
        <ModalContent type="muatmuat" className="w-modal-small">
          <ModalHeader size="small" />
          <div className="px-6 py-9">
            <div className="flex flex-col items-center">
              <span className="text-center text-base font-bold leading-relaxed text-[#1b1b1b]">
                Hubungi Kami
              </span>
              <span className="mt-6 text-center text-sm font-medium leading-normal text-[#1b1b1b]">
                Jika Anda membutuhkan bantuan dapat menghubungi nomor dibawah
                ini
              </span>
              <div className="mt-2 flex flex-row items-center gap-x-1 text-center text-sm font-medium leading-normal text-primary-700">
                <ImageComponent
                  className="h-5 w-5"
                  src="/img/hubungi-kami-blue.png"
                  height={20}
                  width={20}
                  alt="Phone"
                />
                <span>+62 811-3886-7000</span>
              </div>
              <span className="mt-3 text-center text-sm font-medium leading-normal text-[#1b1b1b]">
                atau klik tombol dibawah ini
              </span>
              <Button asChild variant="muatparts-primary" className="mt-2">
                <Link
                  href="https://wa.me/6281138867000"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex flex-row items-center gap-x-2">
                    <ImageComponent
                      className="h-5 w-5"
                      src="/img/whatsapp.png"
                      height={20}
                      width={20}
                      alt="WhatsApp"
                    />
                    <span>Whatsapp</span>
                  </div>
                </Link>
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FloatingButton;
