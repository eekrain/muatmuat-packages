import { useState } from "react";

import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import {
  useResponsiveNavigation,
  useResponsiveRouteParams,
} from "@/lib/responsive-navigation";
import { useGetDriverQRCodeById } from "@/services/Shipper/detailpesanan/getDriverQRCodeById";

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
  return (
    <FormResponsiveLayout
      title={{
        label: "QR Code Lokasi Muat",
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
      />
    </FormResponsiveLayout>
  );
};
export default DriverQRCodeSingleScreen;
