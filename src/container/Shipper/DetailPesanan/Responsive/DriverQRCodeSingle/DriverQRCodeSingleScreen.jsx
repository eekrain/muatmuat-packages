import { useMemo, useState } from "react";

import { useGetDriverQRCodeById } from "@/services/Shipper/detailpesanan/getDriverQRCodeById";

import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";

import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";

import { BottomsheetShareVia } from "../DriverQRCodeMulti/BottomsheetShareVia";
import DriverCard from "./components/DriverCard";
import QRCode from "./components/QRCode";

const DriverQRCodeSingleScreen = () => {
  const params = useResponsiveRouteParams();
  const [isOpenShareVia, setIsOpenShareVia] = useState(false);
  const navigation = useResponsiveNavigation();

  const { qrData } = useGetDriverQRCodeById({
    driverId: params.driverId,
    orderId: params.orderId,
  });
  console.log("🚀 ~ DriverQRCodeSingleScreen ~ qrData:", qrData);

  const title = useMemo(() => {
    if (!qrData?.driverInfo?.statusScan) return "";
    const split = parseInt(
      qrData?.driverInfo?.statusScan.split("_").slice(-1)[0]
    );
    const index = !isNaN(split) ? split : "";

    if (qrData?.driverInfo?.statusScan.includes("MUAT"))
      return `QR Code Lokasi Muat ${index}`;
    else return `QR Code Lokasi Bongkar ${index}`;
  }, [qrData?.driverInfo?.statusScan]);

  return (
    <FormResponsiveLayout
      title={{
        label: title,
      }}
      withMenu={{
        onClickShare: () => setIsOpenShareVia(true),
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <div className="space-y-2 bg-neutral-200">
        <DriverCard qrData={qrData} />
        <QRCode qrData={qrData} />
      </div>

      <BottomsheetShareVia
        open={isOpenShareVia}
        onOpenChange={setIsOpenShareVia}
        shareUrl={qrData?.shareLink}
        qrCodeImage={qrData?.qrCodeImage}
      />
    </FormResponsiveLayout>
  );
};
export default DriverQRCodeSingleScreen;
