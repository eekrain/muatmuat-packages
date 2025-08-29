import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";

import { getStatusScanMetadata } from "@/lib/normalizers/detailpesanan/getStatusScanMetadata";

const DriverCard = ({ qrData }) => {
  const metadata = qrData?.driverInfo?.statusScan
    ? getStatusScanMetadata(qrData?.driverInfo?.statusScan)
    : null;
  if (!qrData) return null;

  return (
    <div className="box-border flex w-full flex-col items-center justify-center bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        {/* Status Badge */}
        <BadgeStatusPesanan
          variant={metadata?.hasScan ? "success" : "error"}
          className="w-fit text-sm font-semibold"
        >
          {metadata?.statusText}
        </BadgeStatusPesanan>

        <AvatarDriver
          name={qrData?.driverInfo?.name}
          image={qrData?.driverInfo?.driverImage}
          licensePlate={qrData?.driverInfo?.licensePlate}
        />
      </div>
    </div>
  );
};

export default DriverCard;
