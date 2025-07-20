"use client";

import * as HoverCard from "@radix-ui/react-hover-card";

import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { useTranslation } from "@/hooks/use-translation";

export const DownloadPopover = () => {
  const { t } = useTranslation();

  return (
    <HoverCard.Root openDelay={0} closeDelay={200}>
      <HoverCard.Trigger asChild>
        <a
          className="relative flex cursor-pointer items-center gap-1 text-xs font-medium no-underline"
          href={`${process.env.NEXT_PUBLIC_INTERNAL_WEB}register/download_apps`}
        >
          <div className="flex items-center gap-x-1">
            <IconComponent src="/icons/mobile.svg" />
            <span className="leading-[12px] text-xs font-semibold capsize">
              {t("linkDownloadMuatMuat")}
            </span>
          </div>
        </a>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          className="shadow-muat z-20 flex w-[392px] items-center gap-6 rounded-xl bg-white p-8 shadow-lg"
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
