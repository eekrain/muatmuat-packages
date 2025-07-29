import { Fragment, useEffect, useState } from "react";

import ReactPlayer from "react-player";

import { generateThumbnail } from "@/lib/utils/services";

import IconComponent from "../IconComponent/IconComponent";
import ImageComponent from "../ImageComponent/ImageComponent";
import styles from "./ImagesPreview.module.scss";

const ImagesPreviewWeb = ({
  images,
  isOpen,
  setIsOpen,
  activeIndex,
  setActiveIndex,
}) => {
  const [play, setPlay] = useState(false);
  const arrowButtons = [
    {
      src: "/icons/chevron-left.svg",
      onClick: () => {
        if (activeIndex === 0) {
          setActiveIndex(images.length - 1);
        } else {
          setActiveIndex((prevState) => prevState - 1);
        }
      },
    },
    {
      src: "/icons/chevron-right.svg",
      onClick: () => {
        if (activeIndex === images.length - 1) {
          setActiveIndex(0);
        } else {
          setActiveIndex((prevState) => prevState + 1);
        }
      },
    },
  ];
  useEffect(() => {
    if (!isOpen) setPlay(isOpen);
    return () => setPlay(false);
  }, [isOpen]);
  return (
    <div
      className={`fixed inset-0 -top-[15px] z-[90] flex items-center justify-center ${!isOpen ? "hidden" : "block"}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Modal */}
      <div className="relative flex flex-col items-center gap-y-3 rounded-xl bg-white px-6 pb-3 pt-8">
        <button
          className="absolute right-[8px] top-[8px]"
          onClick={() => setIsOpen(false)}
        >
          <IconComponent
            className={styles.icon_primary}
            src="/icons/silang.svg"
            width={12.5}
            height={12.5}
          />
        </button>
        <div className="absolute top-1/2 z-[1] flex w-full -translate-y-1/2 justify-between px-3">
          {arrowButtons.map((button, key) => (
            <div
              className="flex cursor-pointer items-center justify-center rounded-3xl bg-neutral-50 p-1 shadow-muat"
              key={key}
              onClick={button.onClick}
            >
              <IconComponent src={button.src} size="medium" />
            </div>
          ))}
        </div>
        {images[activeIndex]?.includes("youtube.com") ||
        images[activeIndex]?.includes("youtu.be") ? (
          <ReactPlayer
            url={images[activeIndex]}
            width={544}
            height={306}
            playing={play}
            muted
            onPause={() => setPlay(false)}
          />
        ) : (
          <img
            src={images[activeIndex]}
            alt="active-review"
            className="relative h-[306px] w-[544px] select-none rounded-[9px] bg-neutral-900 object-contain"
          />
        )}
        <div className="flex items-center gap-x-4">
          {images.map((image, key) => (
            <Fragment key={key}>
              {image?.includes("youtube.com") || image?.includes("youtu.be") ? (
                <ReactPlayer
                  url={images[activeIndex]}
                  width={56}
                  height={56}
                  playing={play}
                  muted
                  onPause={() => setPlay(false)}
                />
              ) : (
                <ImageComponent
                  width={56}
                  height={56}
                  src={
                    image?.includes("youtube.com") ||
                    image?.includes("youtu.be")
                      ? generateThumbnail(image)
                      : image
                  }
                  alt="review"
                  // 24. THP 2 - MOD001 - MP - 016 - QC Plan - Web - MuatParts - Paket 024 B - Homepage Buyer - LB-0155
                  className={`size-14 cursor-pointer select-none rounded-md hover:border-2 hover:border-primary-700 ${activeIndex === key ? "border-2 border-primary-700" : "border-2 border-neutral-400"} `}
                  onClick={() => setActiveIndex(key)}
                />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImagesPreviewWeb;
