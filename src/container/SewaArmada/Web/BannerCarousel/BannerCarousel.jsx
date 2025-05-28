import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import ImageComponent from "@/components/ImageComponent/ImageComponent";

const BannerCarousel = ({
  banners,
  autoplaySpeed = 5000,
  showControls = true,
  showIndicators = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayTimerRef = useRef(null);

  const totalBanners = banners.length;

  // Handle navigation
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalBanners);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + totalBanners) % totalBanners
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Setup autoplay
  useEffect(() => {
    if (autoplaySpeed > 0) {
      autoplayTimerRef.current = setInterval(goToNext, autoplaySpeed);
    }
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplaySpeed, currentIndex]);

  // Pause on hover
  const handleMouseEnter = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (autoplaySpeed > 0) {
      autoplayTimerRef.current = setInterval(goToNext, autoplaySpeed);
    }
  };

  return (
    <div
      className="relative mx-auto h-[250px] w-[1054px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative mx-auto h-[250px] w-[1000px] overflow-hidden rounded-xl">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute left-0 top-0 h-full w-full transition-opacity duration-500 ${
              index === currentIndex ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
          >
            <Image
              src={banner.imageUrl}
              alt={banner.altText || "Banner image"}
              fill
              sizes="1000px"
              style={{
                objectFit: "cover",
                borderRadius: "12px",
              }}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {showControls && (
        <div className="absolute bottom-[42%] left-0 right-0 top-[42%] flex justify-between">
          {/* <IconComponent
            src="/icons/chevron-left40.svg"
            width={40}
            height={40}
          /> */}
          <button
            className="z-10 flex size-[40px] items-center justify-center rounded-full bg-white shadow-lg"
            onClick={goToPrev}
          >
            <ImageComponent
              src="/icons/chevron-left16-2.svg"
              width={9}
              height={16}
            />
          </button>
          {/* <button
            onClick={goToPrev}
            className="w-[40px] h-[40px] bg-white rounded-full shadow-lg flex items-center justify-center z-10"
            aria-label="Previous banner"
          >
            <IconComponent src="/icons/chevron-left40.svg" width={40} height={40} />
          </button> */}
          <button
            onClick={goToNext}
            className="z-10 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white shadow-lg"
            aria-label="Next banner"
          >
            <ImageComponent
              src="/icons/chevron-right16-2.svg"
              width={9}
              height={16}
            />
          </button>
        </div>
      )}

      {/* Indicator Dots */}
      {showIndicators && (
        <div className="absolute bottom-[16px] left-1/2 flex -translate-x-1/2 transform gap-[8px]">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-[8px] ${
                index === currentIndex
                  ? "w-[32px] rounded-[14px] bg-white"
                  : "w-[8px] rounded-full bg-white opacity-50"
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;
