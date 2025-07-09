import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import DriverCard from "./components/DriverCard";
import QRCode from "./components/QRCode";
import ShareVia from "./components/ShareVia";

const QRCodeScreen = () => {
  const [isOpenShareVia, setIsOpenShareVia] = useState(false);
  const navigation = useResponsiveNavigation();

  return (
    <FormResponsiveLayout
      title={{
        label: "QR Code Lokasi Muat 1",
      }}
      withMenu={{
        onClickShare: () => setIsOpenShareVia(true),
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <div className="space-y-2 bg-neutral-200">
        <DriverCard />
        <QRCode />
      </div>

      <BottomSheet open={isOpenShareVia} onOpenChange={setIsOpenShareVia}>
        <BottomSheetContent>
          <BottomSheetHeader>Bagikan</BottomSheetHeader>
          <ShareVia />
        </BottomSheetContent>
      </BottomSheet>
    </FormResponsiveLayout>
  );
};
export default QRCodeScreen;
