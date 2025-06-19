import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import Stepper from "@/components/Stepper/Stepper";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { useGetDriverQRCodeById } from "@/services/detailpesanan/getDriverQRCodeById";

const DriverStatusCard = ({ dataStatusPesanan, dataDriver }) => {
  const pathname = usePathname();
  const params = useParams();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const { qrData } = useGetDriverQRCodeById({
    orderId: dataStatusPesanan.orderId,
    driverId: dataStatusPesanan.driverStatus[0].driverId,
  });
  console.log("🚀 ~ file: DriverStatusCard.jsx:20 ~ qrData:", qrData);

  const modalTitle = () => {
    const status = dataDriver.statusDriver.split("_");
    if (status[0] === OrderStatusEnum.LOADING) {
      return `QR Code Lokasi Muat ${status[1]}`;
    } else if (status[0] === OrderStatusEnum.UNLOADING) {
      return `QR Code Lokasi Bongkar ${status[1]}`;
    }
  };

  return (
    <>
      <div
        key={dataDriver.driverId}
        className="flex w-full flex-col gap-y-5 rounded-xl border border-neutral-400 px-4 py-5"
      >
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center gap-x-3">
            <BadgeStatusPesanan className="w-fit">
              {dataDriver.statusTitle}
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
            <AvatarDriver
              name={dataDriver.name}
              image={dataDriver.driverPhoto}
              licensePlate={dataDriver.licensePlate}
            />
            <div className="flex items-center gap-x-3">
              <Button onClick={() => {}} variant="muatparts-primary-secondary">
                Hubungi Driver
              </Button>
              <Link href={`${pathname}/lacak-armada/${dataDriver.driverId}`}>
                <Button variant="muatparts-primary">Lacak Armada</Button>
              </Link>
            </div>
          </div>
        </div>
        <Stepper
          steps={dataStatusPesanan.statusHistory.stepper}
          currentStep={dataStatusPesanan.statusHistory.activeIndex}
        />
      </div>
      {/* Modal QR Code Supir */}
      <Modal
        closeOnOutsideClick={false}
        open={isQrModalOpen && qrData}
        onOpenChange={setIsQrModalOpen}
      >
        <ModalContent className="w-modal-small">
          <ModalHeader size="big" />
          <div className="flex w-full flex-col items-center gap-y-6 px-6 py-9">
            <h1 className="text-[16px] font-bold leading-[19.2px] text-neutral-900">
              {modalTitle()}
            </h1>
            <div className="flex flex-col items-center gap-y-3">
              <BadgeStatusPesanan
                className="w-fit"
                variant={qrData?.driverInfo?.hasScan ? "success" : "error"}
              >
                {qrData?.driverInfo.statusScan}
              </BadgeStatusPesanan>

              <AvatarDriver
                name={qrData?.driverInfo.name}
                image={qrData?.driverInfo.driverImage}
                licensePlate={qrData?.driverInfo.licensePlate}
              />
            </div>
            <img src={qrData?.qrCodeImage} width={124} height={124} alt="" />
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
