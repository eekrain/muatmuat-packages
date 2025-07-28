import { useCallback, useState } from "react";

import { EllipsisVertical } from "lucide-react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTrigger,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import { useSwipe } from "@/hooks/use-swipe";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} Driver
 * @property {string} name
 * @property {string} driverImage
 * @property {string} licensePlate
 * @property {string} driverStatusTitle
 * @property {string} [orderStatus]
 * @property {string} [driverId]
 */

const Root = ({ children, className }) => (
  <div className={cn("w-full border-b-2 border-[#461B02] bg-white", className)}>
    {children}
  </div>
);

const Header = ({ status, onMenuClick }) => (
  <div className="flex w-full items-center justify-between">
    <BadgeStatusPesanan
      variant="primary"
      className="bg-primary-50 !px-2 !py-1 text-sm font-semibold text-primary-700"
    >
      {status}
    </BadgeStatusPesanan>
    <BottomSheet>
      <BottomSheetTrigger asChild>
        <button
          aria-label="More options"
          className="absolute right-4 top-5 z-10 bg-white p-1" // Positioned absolutely
        >
          <EllipsisVertical className="h-6 w-6 rounded-full text-black" />
        </button>
      </BottomSheetTrigger>
      <BottomSheetContent>
        <BottomSheetHeader>Menu</BottomSheetHeader>
        <div className="mt-6 flex flex-col items-start gap-4 px-4 pb-6">
          <button className="text-sm font-semibold">Lihat Semua Driver</button>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  </div>
);

const Body = ({ driver }) => (
  <div className="w-full">
    <AvatarDriver
      name={driver.name}
      image={driver.driverImage}
      licensePlate={driver.licensePlate}
      classNames={{
        root: "gap-3",
        avatar: "w-10 h-10",
        name: "text-base font-semibold text-neutral-900 leading-[1.1]",
        licensePlate: "text-xs font-medium text-neutral-900 leading-[1.1]",
        licenseIcon: "text-muat-trans-secondary-900 w-3 h-3",
      }}
    />
  </div>
);

const Footer = ({ onContact, onTrack }) => (
  <div className="flex w-full gap-3">
    <Button
      variant="muatparts-primary-secondary"
      onClick={onContact}
      className="h-7 w-full !rounded-[20px] !border-primary-700 !text-xs !font-semibold !text-primary-700"
    >
      Hubungi Driver
    </Button>
    <Button
      variant="muatparts-primary"
      onClick={onTrack}
      className="h-7 w-full !rounded-[20px] bg-primary-700 !text-xs !font-semibold text-white"
    >
      Lacak Armada
    </Button>
  </div>
);

const Pagination = ({ count, activeIndex, className }) => {
  if (count <= 1) return null;
  return (
    <div
      className={cn("flex items-center justify-center gap-1 pt-4", className)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            i === activeIndex ? "w-8 bg-primary-700" : "w-2 bg-neutral-400"
          )}
        />
      ))}
    </div>
  );
};

/**
 * The main slider component that orchestrates everything.
 * @param {{ drivers: Driver[] }} props
 */
export default function DriverInfoSlider({
  driverStatus = [],
  orderId,
  orderStatus,
}) {
  console.log("🚀 ~ driverStatus:", driverStatus);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, driverStatus.length - 1));
  }, [driverStatus.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const { dragOffset, swipeHandlers } = useSwipe({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
  });

  if (!driverStatus || driverStatus.length === 0) {
    return null;
  }

  return (
    <Root>
      <div className="overflow-hidden" {...swipeHandlers}>
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            // Apply both the slide position and the real-time drag offset
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
          }}
        >
          {driverStatus.map((driver, index) => (
            <div key={index} className="box-border w-full flex-shrink-0 p-5">
              <div className="flex w-full flex-col items-start gap-4">
                <Header
                  status={driver.driverStatusTitle}
                  onMenuClick={() => alert(`Menu for ${driver.name}`)}
                />
                <Body driver={driver} />
                <Footer
                  onContact={() => alert(`Contacting ${driver.name}`)}
                  onTrack={() => alert(`Tracking ${driver.name}`)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination
        count={driverStatus.length}
        activeIndex={currentIndex}
        className="pb-5"
      />
    </Root>
  );
}
