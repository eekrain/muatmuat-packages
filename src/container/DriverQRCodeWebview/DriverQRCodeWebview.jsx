import { useParams } from "next/navigation";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import { useGetDriverQRCodeById } from "@/services/detailpesanan/getDriverQRCodeById";

const DriverQRCodeWebview = () => {
  const params = useParams();
  const { qrData } = useGetDriverQRCodeById({
    orderId: params.orderId,
    driverId: params.driverId,
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
    <div className="flex justify-center px-4 pt-8">
      <div className="flex w-full max-w-[450px] flex-col items-center gap-y-6 border border-neutral-400 bg-neutral-50 px-6 py-9">
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
        <img
          src={qrData?.qrCodeImage}
          className="h-[124px] w-[124px] object-contain"
          alt="QR Code Lokasi Muat & Bongkar"
        />
        <span className="text-center text-[14px] font-medium leading-[16.8px] text-neutral-900">
          *Tunjukkan QR Code ini kepada pihak driver agar dapat melanjutkan ke
          proses muat.
        </span>
        <Button
          iconLeft="/icons/salin-qrc16.svg"
          onClick={() => {}}
          variant="muatparts-primary"
        >
          Bagikan QR Code
        </Button>
      </div>
    </div>
  );
};

export default DriverQRCodeWebview;
