import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

const QRCodeScreen = () => {
  const [isOpenBottomsheet, setIsOpenBottomsheet] = useState(false);
  const navigation = useResponsiveNavigation();

  return (
    <FormResponsiveLayout
      title={{
        label: "QR Code Lokasi Muat 1",
      }}
      withMenu={{
        onClickInfo: () => alert("onClickInfo"),
        onClickMenu: () => setIsOpenBottomsheet(true),
      }}
      onClickBackButton={() => navigation.pop()}
    >
      <div className="space-y-2 bg-neutral-200"></div>

      <BottomSheet open={isOpenBottomsheet} onOpenChange={setIsOpenBottomsheet}>
        <BottomSheetContent>
          <BottomSheetHeader>Menu</BottomSheetHeader>
        </BottomSheetContent>
      </BottomSheet>
    </FormResponsiveLayout>
  );
};
export default QRCodeScreen;
