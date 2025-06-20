import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import Stepper from "@/components/Stepper/Stepper";
import { useGetDriverQRCodeById } from "@/services/detailpesanan/getDriverQRCodeById";

const DriverStatusCard = ({ dataStatusPesanan, dataDriver }) => {
  const pathname = usePathname();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const { qrData } = useGetDriverQRCodeById({
    orderId: dataStatusPesanan.orderId,
    driverId: dataStatusPesanan.driverStatus[0].driverId,
  });

  const statusScan = () => {
    const splitStatus = qrData?.driverInfo.statusScan?.split?.("_") || [];
    let hasScan = false;
    let statusTitle = "";
    let statusText = "";
    if (splitStatus.length !== 4) return { hasScan, statusText, statusTitle };

    statusTitle = `QR Code Lokasi ${splitStatus[2][0].toUpperCase()}${splitStatus[2].slice(1).toLowerCase()} ${splitStatus[3]}`;

    if (splitStatus[0] === "BELUM" && splitStatus[1] === "SCAN") {
      hasScan = false;
    } else if (splitStatus[0] === "SUDAH" && splitStatus[1] === "SCAN") {
      hasScan = true;
    }

    if (hasScan) {
      statusText = `Sudah Scan Lokasi ${splitStatus[2][0].toUpperCase()}${splitStatus[2].slice(1).toLowerCase()} ${splitStatus[3]}`;
    } else {
      statusText = `Belum Scan Lokasi ${splitStatus[2][0].toUpperCase()}${splitStatus[2].slice(1).toLowerCase()} ${splitStatus[3]}`;
    }

    return { statusTitle, hasScan, statusText };
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
              {/* {statusScan().statusTitle} */}
              QR Code Lokasi Muat & Bongkar
            </h1>
            <div className="flex flex-col items-center gap-y-3">
              <BadgeStatusPesanan
                className="w-fit"
                variant={statusScan().hasScan ? "success" : "error"}
              >
                {statusScan().statusText}
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
