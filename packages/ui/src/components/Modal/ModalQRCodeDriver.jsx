import { useGetDriverQRCodeById } from "@/services/Shipper/detailpesanan/getDriverQRCodeById";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTrigger,
} from "@/components/Modal/Modal";

import useDevice from "@/hooks/use-device";
import { useTranslation } from "@/hooks/use-translation";

import { getStatusScanMetadata } from "@/lib/normalizers/detailpesanan/getStatusScanMetadata";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

export const ModalQRCodeDriver = ({
  title = "QR Code Lokasi Muat & Bongkar",
  orderId,
  driverId,
  children,
  showShareButton = true,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useDevice();
  const { qrData } = useGetDriverQRCodeById({
    orderId,
    driverId,
  });
  console.log(qrData, "qrData");
  const statusScan = getStatusScanMetadata(qrData?.driverInfo?.statusScan);

  const handleCopyQrCode = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/orders/${orderId}/drivers/${driverId}/qr-code`
    );
    toast.success(
      t(
        "ModalQRCodeDriver.toastQRCodeCopied",
        {},
        "Link QR Code berhasil disalin"
      )
    );
  };

  if (!qrData) return null;

  return (
    <Modal closeOnOutsideClick={false}>
      <ModalTrigger>{children}</ModalTrigger>
      <ModalContent
        className={cn(isMobile ? "max-w-[328px]" : "w-modal-big")}
        appearance={{
          backgroudClassname: "px-4",
          closeButtonClassname: "size-4 md:size-5",
        }}
        type="muattrans"
      >
        <ModalHeader size="big" />
        <div className="flex w-full flex-col items-center gap-y-6 p-[18px] md:px-6 md:py-9">
          <div>
            <h1 className="mb-[18px] text-center text-base font-bold leading-[19.2px] text-neutral-900 md:mb-6">
              {t("ModalQRCodeDriver.titleQRCodeLocation", {}, title)}
            </h1>
            <div className="flex flex-col items-center gap-y-3">
              <BadgeStatusPesanan
                className="w-fit"
                variant={statusScan.hasScan ? "success" : "error"}
              >
                {statusScan.statusText}
              </BadgeStatusPesanan>

              <AvatarDriver
                name={qrData?.driverInfo?.name}
                image={qrData?.driverInfo?.driverImage}
                licensePlate={qrData?.driverInfo?.licensePlate}
                appearance={{
                  containerClassName: "gap-1",
                  nameClassName: "text-xs font-bold",
                  licensePlateClassName: "text-xxs",
                }}
              />
            </div>
          </div>
          <img src={qrData?.qrCodeImage} width={124} height={124} alt="" />
          <span className="text-center text-sm font-medium leading-[16.8px] text-neutral-900">
            {t(
              "ModalQRCodeDriver.instructionShowQRCode",
              {},
              "*Tunjukkan QR Code ini kepada pihak driver agar dapat melanjutkan ke proses muat."
            )}
          </span>
          {showShareButton && (
            <Button
              iconLeft="/icons/salin-qrc16.svg"
              onClick={handleCopyQrCode}
              variant="muatparts-primary"
            >
              {t("ModalQRCodeDriver.buttonShareQRCode", {}, "Bagikan QR Code")}
            </Button>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};
