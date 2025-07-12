import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import ContentUlasan from "./components/ContentUlasan";
import HeaderComponentUlasan from "./components/HeaderComponentUlasan";

const UlasanScreen = () => {
  const navigation = useResponsiveNavigation();
  const [isOpenBottomsheet, setIsOpenBottomsheet] = useState(false);
  const [isOpenInfo, setIsOpenInfo] = useState(false);

  return (
    <FormResponsiveLayout
      title={{
        label: "Ulasan",
      }}
      withMenu={{
        onClickInfo: () => setIsOpenInfo(true),
        onClickMenu: () => setIsOpenBottomsheet(true),
      }}
      onClickBackButton={() => alert("onClickBackButton")}
    >
      <div className="mb-16 space-y-2 bg-neutral-200">
        <HeaderComponentUlasan />
        {[0, 1, 2, 3, 4].map((_, i) => (
          <ContentUlasan key={i} />
        ))}
      </div>

      <BottomSheet open={isOpenBottomsheet} onOpenChange={setIsOpenBottomsheet}>
        <BottomSheetContent>
          <BottomSheetHeader>Menu</BottomSheetHeader>
        </BottomSheetContent>
      </BottomSheet>

      <BottomSheet open={isOpenInfo} onOpenChange={setIsOpenInfo}>
        <BottomSheetContent>
          <BottomSheetHeader>Informasi</BottomSheetHeader>
        </BottomSheetContent>
      </BottomSheet>

      <ResponsiveFooter className="flex gap-3"></ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default UlasanScreen;
