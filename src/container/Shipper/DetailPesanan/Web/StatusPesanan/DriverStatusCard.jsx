import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { ModalQRCodeDriver } from "@/components/Modal/ModalQRCodeDriver";
import { StepperContainer, StepperItem } from "@/components/Stepper/Stepper";
import { useTranslation } from "@/hooks/use-translation";
import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";
import { getStatusDriverMetadata } from "@/lib/normalizers/detailpesanan/getStatusDriverMetadata";
import { cn } from "@/lib/utils";

import ModalDetailStatusDriver from "./ModalDetailStatusDriver";

export const DriverStatusCard = ({ driverStatus, orderId, orderStatus }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef(null);

  const nextSlide = () => {
    if (isTransitioning || currentIndex >= driverStatus.length - 1) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning || currentIndex <= 0) return;

    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  if (driverStatus.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Navigation Arrows */}
      {driverStatus.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0 || isTransitioning}
            className={cn(
              "absolute -left-4 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200",
              currentIndex === 0 || isTransitioning
                ? "cursor-not-allowed"
                : "hover:bg-gray-50 hover:shadow-xl"
            )}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            disabled={
              currentIndex === driverStatus.length - 1 || isTransitioning
            }
            className={cn(
              "absolute -right-4 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-200",
              currentIndex === driverStatus.length - 1 || isTransitioning
                ? "cursor-not-allowed"
                : "hover:bg-gray-50 hover:shadow-xl"
            )}
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </>
      )}
      <div ref={sliderRef} className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {driverStatus.map((driver) => (
            <DriverStatusCardItem
              key={driver.driverId}
              driver={driver}
              orderId={orderId}
              orderStatus={orderStatus}
            />
          ))}
        </div>
      </div>
      {/* Slider Indicator */}
      {driverStatus.length > 1 && (
        <div className="mt-3 flex justify-center">
          <SliderIndicator
            currentIndex={currentIndex}
            total={driverStatus.length}
            setCurrentIndex={setCurrentIndex}
          />
        </div>
      )}
    </div>
  );
};

// Slider indicator component using TailwindCSS
const SliderIndicator = ({ currentIndex, total, setCurrentIndex }) => (
  <div className="flex h-2 flex-row items-center gap-1">
    {Array.from({ length: total }).map((_, idx) => (
      <div
        key={idx}
        className={cn(
          "h-2 w-2 cursor-pointer rounded-full bg-neutral-400 transition-all duration-300",
          idx === currentIndex && "w-8 bg-primary-700"
        )}
        onClick={() => setCurrentIndex(idx)}
        aria-label={`Go to slide ${idx + 1}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setCurrentIndex(idx);
        }}
      />
    ))}
  </div>
);

const LIST_SHOW_MODAL_DETAIL_STATUS_DRIVER = [
  OrderStatusEnum.PREPARE_DOCUMENT,
  OrderStatusEnum.DOCUMENT_DELIVERY,
  OrderStatusEnum.WAITING_REPAYMENT_1,
  OrderStatusEnum.WAITING_REPAYMENT_2,
  OrderStatusEnum.CANCELED_BY_SHIPPER,
  OrderStatusEnum.COMPLETED,
];

const LIST_HIDE_DRIVER_STATUS = [
  OrderStatusEnum.SCHEDULED_FLEET,
  OrderStatusEnum.COMPLETED,
];

export const DriverStatusCardItem = ({
  driver,
  orderId,
  orderStatus,
  isOldDriver = false,
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const SHOW_DRIVER_STATUS =
    orderStatus !== OrderStatusEnum.WAITING_CONFIRMATION_CHANGES &&
    !orderStatus.startsWith("WAITING_PAYMENT") &&
    !LIST_SHOW_MODAL_DETAIL_STATUS_DRIVER.includes(orderStatus) &&
    !LIST_HIDE_DRIVER_STATUS.includes(driver.orderStatus);

  const statusMeta = getStatusDriverMetadata({
    driverStatus: driver.driverStatus,
    orderStatus: driver.orderStatus,
    t,
  });

  return (
    <>
      <div className="w-full flex-shrink-0">
        <div
          key={driver.driverId}
          className="flex w-full flex-col gap-y-5 rounded-xl border border-neutral-400 py-5"
        >
          <div className="flex flex-col gap-y-3 px-4">
            {SHOW_DRIVER_STATUS && (
              <div className="flex items-center gap-x-3">
                {driver.driverStatusTitle && (
                  <BadgeStatusPesanan
                    variant={statusMeta.variant}
                    className="w-fit"
                  >
                    {statusMeta.label}
                  </BadgeStatusPesanan>
                )}

                {/* Modal QR Code Supir */}
                {!orderStatus.startsWith("CANCELED") && !isOldDriver && (
                  <ModalQRCodeDriver
                    orderId={orderId}
                    driverId={driver.driverId}
                  >
                    <button className="flex items-center gap-x-1">
                      <span className="capsize text-xs font-medium leading-[14.4px] text-primary-700">
                        Tampilkan QR Code
                      </span>
                      <IconComponent
                        src="/icons/chevron-right.svg"
                        className="icon-blue"
                      />
                    </button>
                  </ModalQRCodeDriver>
                )}
              </div>
            )}
            <div className="flex items-center justify-between">
              <AvatarDriver
                name={driver.name}
                image={driver.driverImage}
                licensePlate={driver.licensePlate}
              />
              <div className="flex items-center gap-x-3">
                {driver.orderStatus?.startsWith("CANCELED") ||
                LIST_SHOW_MODAL_DETAIL_STATUS_DRIVER.includes(orderStatus) ? (
                  <ModalDetailStatusDriver driver={driver} />
                ) : (
                  <>
                    <Button
                      onClick={() => {}}
                      variant="muatparts-primary-secondary"
                    >
                      Hubungi Driver
                    </Button>
                    <Link href={`${pathname}/lacak-armada/${driver.driverId}`}>
                      <Button variant="muatparts-primary">Lacak Armada</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="w-full px-5">
            <StepperContainer
              activeIndex={driver.activeIndex || 0}
              totalStep={driver.stepperData?.length || 0}
            >
              {driver.stepperData?.map((step, index) => (
                <StepperItem key={step.status} step={step} index={index} />
              ))}
            </StepperContainer>
          </div>
        </div>
      </div>
    </>
  );
};
