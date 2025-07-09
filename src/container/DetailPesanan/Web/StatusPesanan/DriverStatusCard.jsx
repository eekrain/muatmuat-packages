import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";
import { StepperContainer, StepperItem } from "@/components/Stepper/Stepper";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { useGetDriverQRCodeById } from "@/services/detailpesanan/getDriverQRCodeById";

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
  <div className="z-30 flex h-2 w-14 flex-row items-center gap-1">
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
  OrderStatusEnum.WAITING_REPAYMENT_1,
  OrderStatusEnum.WAITING_REPAYMENT_2,
  OrderStatusEnum.PREPARE_DOCUMENT,
  OrderStatusEnum.DOCUMENT_DELIVERY,
  OrderStatusEnum.COMPLETED,
];

export const DriverStatusCardItem = ({ driver, orderId, orderStatus }) => {
  const pathname = usePathname();

  const { qrData } = useGetDriverQRCodeById({
    orderId,
    driverId: driver.driverId,
  });

  const statusScan = () => {
    const splitStatus = qrData?.driverInfo.statusScan?.split?.("_") || [];
    let hasScan = false;
    let statusTitle = "";
    let statusText = "";
    if (splitStatus.length < 3) return { hasScan, statusText, statusTitle };

    statusTitle = `QR Code Lokasi ${splitStatus[2][0].toUpperCase()}${splitStatus[2].slice(1).toLowerCase()}${splitStatus[3] ? ` ${splitStatus[3]}` : ""}`;

    if (splitStatus[0] === "BELUM" && splitStatus[1] === "SCAN") {
      hasScan = false;
    } else if (splitStatus[0] === "SUDAH" && splitStatus[1] === "SCAN") {
      hasScan = true;
    }

    if (hasScan) {
      statusText = `Sudah Scan di Lokasi ${splitStatus[2][0].toUpperCase()}${splitStatus[2].slice(1).toLowerCase()}${splitStatus[3] ? ` ${splitStatus[3]}` : ""}`;
    } else {
      statusText = `Belum Scan di Lokasi ${splitStatus[2][0].toUpperCase()}${splitStatus[2].slice(1).toLowerCase()}${splitStatus[3] ? ` ${splitStatus[3]}` : ""}`;
    }

    return {
      statusTitle: statusTitle,
      hasScan,
      statusText: statusText,
    };
  };

  const handleCopyQrCode = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_ASSET_REVERSE}/orders/${orderId}/drivers/${driver.driverId}/qr-code`
    );
    toast.success("Link QR Code berhasil disalin");
  };

  return (
    <>
      <div className="w-full flex-shrink-0">
        <div
          key={driver.driverId}
          className="flex w-full flex-col gap-y-5 rounded-xl border border-neutral-400 px-4 py-5"
        >
          <div className="flex flex-col gap-y-3">
            {!orderStatus.startsWith("WAITING") &&
              !LIST_SHOW_MODAL_DETAIL_STATUS_DRIVER.includes(orderStatus) && (
                <div className="flex items-center gap-x-3">
                  {driver.driverStatusTitle && (
                    <BadgeStatusPesanan
                      variant={
                        driver.orderStatus?.startsWith("CANCELED")
                          ? "error"
                          : driver.orderStatus === OrderStatusEnum.COMPLETED
                            ? "success"
                            : "primary"
                      }
                      className="w-fit"
                    >
                      {driver.driverStatusTitle}
                    </BadgeStatusPesanan>
                  )}

                  {/* Modal QR Code Supir */}
                  {qrData && (
                    <Modal closeOnOutsideClick={false}>
                      <ModalTrigger>
                        <button className="flex items-center gap-x-1">
                          <span className="text-[12px] font-medium leading-[14.4px] text-primary-700">
                            Tampilkan QR Code
                          </span>
                          <IconComponent
                            src="/icons/chevron-right.svg"
                            className="icon-blue"
                          />
                        </button>
                      </ModalTrigger>
                      <ModalContent className="w-modal-big">
                        <ModalHeader size="big" />
                        <div className="flex w-full flex-col items-center gap-y-6 px-6 py-9">
                          <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
                            {/* {statusScan().statusTitle} */}
                            QR Code Lokasi Muat & Bongkar
                          </h1>
                          <div className="flex flex-col items-center gap-y-3">
                            <BadgeStatusPesanan
                              className="w-fit"
                              variant={
                                statusScan().hasScan ? "success" : "error"
                              }
                            >
                              {statusScan().statusText}
                            </BadgeStatusPesanan>

                            <AvatarDriver
                              name={qrData?.driverInfo.name}
                              image={qrData?.driverInfo.driverImage}
                              licensePlate={qrData?.driverInfo.licensePlate}
                            />
                          </div>
                          <img
                            src={qrData?.qrCodeImage}
                            width={124}
                            height={124}
                            alt=""
                          />
                          <span className="text-center text-[14px] font-medium leading-[16.8px] text-neutral-900">
                            *Tunjukkan QR Code ini kepada pihak driver agar
                            dapat melanjutkan ke proses muat.
                          </span>
                          <Button
                            iconLeft="/icons/salin-qrc16.svg"
                            onClick={handleCopyQrCode}
                            variant="muatparts-primary"
                          >
                            Bagikan QR Code
                          </Button>
                        </div>
                      </ModalContent>
                    </Modal>
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
                {driver.statusDriver?.startsWith("CANCELED") ||
                LIST_SHOW_MODAL_DETAIL_STATUS_DRIVER.includes(orderStatus) ? (
                  <ModalDetailStatusDriver />
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
    </>
  );
};
