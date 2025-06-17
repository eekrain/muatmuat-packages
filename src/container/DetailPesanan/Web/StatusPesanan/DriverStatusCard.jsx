import Image from "next/image";
import { useState } from "react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import Stepper from "@/components/Stepper/Stepper";

const DriverStatusCard = ({ stepperData }) => {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  return (
    <>
      <div className="flex w-full flex-col gap-y-5 rounded-xl border border-neutral-400 px-4 py-5">
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center gap-x-3">
            <BadgeStatusPesanan className="w-fit">
              Menuju ke Lokasi Muat 1
            </BadgeStatusPesanan>
            <button
              className="flex items-center gap-x-1"
              onClick={() => setIsQrModalOpen(true)}
            >
              <span className="text-[12px] font-medium leading-[14.4px] text-primary-700">
                Tampilkan QR Code
              </span>
              <IconComponent
                src="/icons/chevron-right.svg"
                className="icon-blue"
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Image
                className="rounded-[30px]"
                src="/img/muatan2.png"
                width={40}
                height={40}
              />
              <div className="flex flex-col gap-y-3">
                <span className="text-[12px] font-bold leading-[14.4px] text-neutral-900">
                  Noel Gallagher
                </span>
                <div className="flex items-center gap-x-1">
                  <IconComponent
                    src="/icons/transporter12.svg"
                    width={12}
                    height={12}
                  />
                  <span className="text-[10px] font-medium leading-[13px] text-neutral-900">
                    AE 666 LBA
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-3">
              <Button onClick={() => {}} variant="muatparts-primary-secondary">
                Hubungi Driver
              </Button>
              <Button onClick={() => {}} variant="muatparts-primary">
                Lacak Armada
              </Button>
            </div>
          </div>
        </div>
        <Stepper
          steps={stepperData.timeline}
          currentStep={stepperData.activeIndex}
        />
      </div>

      {/* Modal QR Code Supir */}
      <Modal
        closeOnOutsideClick={false}
        open={isQrModalOpen}
        onOpenChange={setIsQrModalOpen}
      >
        <ModalContent className="w-modal-small">
          <ModalHeader size="big" />
          <div className="flex w-full flex-col items-center gap-y-6 px-6 py-9">
            <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
              QR Code Lokasi Muat 1
            </h1>
            <div className="flex flex-col items-center gap-y-3">
              <BadgeStatusPesanan className="w-fit" variant="error">
                Belum Scan di Lokasi Muat 1
              </BadgeStatusPesanan>
              <div className="flex items-center gap-x-2">
                <Image
                  className="rounded-[30px]"
                  src="/img/muatan2.png"
                  width={40}
                  height={40}
                />
                <div className="flex flex-col gap-y-3">
                  <span className="text-[12px] font-bold leading-[14.4px] text-neutral-900">
                    Noel Gallagher
                  </span>
                  <div className="flex items-center gap-x-1">
                    <IconComponent
                      src="/icons/transporter12.svg"
                      width={12}
                      height={12}
                    />
                    <span className="text-[10px] font-medium leading-[13px] text-neutral-900">
                      AE 666 LBA
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Image src="/img/qr-driver.png" width={124} height={124} />
            <span className="text-center text-[14px] font-medium leading-[16.8px] text-neutral-900">
              *Tunjukkan QR Code ini kepada pihak driver agar dapat melanjutkan
              ke proses muat.
            </span>
            <Button
              iconLeft="/icons/salin-qrc16.svg"
              onClick={() => {}}
              variant="muatparts-primary"
            >
              Bagikan QR Code
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DriverStatusCard;
