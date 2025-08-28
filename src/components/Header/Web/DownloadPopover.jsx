"use client";

import { useEffect, useState } from "react";

import * as HoverCard from "@radix-ui/react-hover-card";

import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";

import { useTranslation } from "@/hooks/use-translation";

import { useOverlayAction } from "@/store/Shared/overlayStore";

export const DownloadPopover = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { setIsOverlayActive } = useOverlayAction();

  useEffect(() => {
    setIsOverlayActive(open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <HoverCard.Root
      open={open}
      onOpenChange={setOpen}
      openDelay={0}
      closeDelay={200}
    >
      <HoverCard.Trigger asChild>
        <a
          className="relative flex cursor-pointer items-center gap-1 text-xs font-medium no-underline"
          href={`${process.env.NEXT_PUBLIC_INTERNAL_WEB}register/download_apps`}
        >
          <div className="flex items-center gap-x-1">
            <IconComponent src="/icons/mobile.svg" />
            <span className="capsize text-xs font-semibold leading-[12px]">
              {t("linkDownloadMuatMuat")}
            </span>
          </div>
        </a>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          className="z-50 flex w-[392px] items-center gap-6 rounded-xl bg-white p-8 shadow-muat"
          sideOffset={5}
          side="bottom"
          align="start"
          alignOffset={0}
        >
          <ImageComponent
            src="/img/qr-downloadapps.png"
            width={132}
            height={132}
            alt="download"
          />

          <div className="flex flex-col items-center justify-center gap-4">
            <span className="text-center text-sm font-semibold text-[#1b1b1b]">
              {t("labelScanQr")}
            </span>
            <a
              href="https://play.google.com/store/apps/developer?id=PT.+AZLOGISTIK+DOT+COM"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ImageComponent
                loading="lazy"
                src="/icons/play-store.svg"
                alt="Download Apps"
              />
            </a>
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};
