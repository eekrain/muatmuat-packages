import ReactPlayer from "react-player";

import IconComponent from "../IconComponent/IconComponent";
import styles from "./ImagesPreview.module.scss";

const ImagesPreviewResponsive = ({
  images,
  isOpen,
  setIsOpen,
  activeIndex,
  setActiveIndex,
  full = false,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`${full ? "fixed" : "absolute"} bottom-0 left-0 right-0 top-0 z-[90] min-h-screen overflow-y-auto bg-neutral-900`}
    >
      <div
        className="absolute left-4 top-4 z-[1] cursor-pointer"
        onClick={() => setIsOpen(false)}
      >
        <IconComponent
          className={styles.icon_white}
          src="/icons/silang.svg"
          size="medium"
        />
      </div>
      <div className="flex min-h-[725px] flex-col justify-between bg-neutral-900 pb-12">
        {images[activeIndex]?.includes("youtube.com") ||
        images[activeIndex]?.includes("youtu.be") ? (
          <ReactPlayer
            url={images[activeIndex]}
            width={360}
            height={553}
            stopOnUnmount
            playing={false}
          />
        ) : (
          <img
            src={images[activeIndex]}
            alt="active-review"
            className="relative mx-auto h-[553px] w-[360px] select-none rounded-[9px] bg-neutral-900 object-contain"
          />
        )}

        <div className={`overflow-x-auto pl-4 ${styles.images_container}`}>
          <div className="flex flex-nowrap items-center gap-x-2.5 py-4">
            {images.map((image, key) => (
              <div
                className={`flex-shrink-0 rounded-[4px] hover:border-4 hover:border-[#C22716] ${activeIndex === key ? "border-4 border-[#C22716]" : ""} `}
                key={key}
              >
                {image?.includes("youtube.com") ||
                image?.includes("youtu.be") ? (
                  <ReactPlayer
                    url={image}
                    width={80}
                    height={80}
                    stopOnUnmount
                    playing={false}
                  />
                ) : (
                  <img
                    src={image}
                    alt="review"
                    className="h-20 w-20 cursor-pointer select-none rounded-[4px] object-cover"
                    onClick={() => setActiveIndex(key)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesPreviewResponsive;
