import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import Button from "@/components/Button/Button";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import FormResponsiveLayout from "@/layout/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import DriverInfo from "./components/DriverInfo";
import MenuList from "./components/MenuList";
import OrderInfo from "./components/OrderInfo";
import RouteInfo from "./components/RouteInfo";
import TabsInfo from "./components/TabsInfo";

const DetailPesananScreen = () => {
  const navigation = useResponsiveNavigation();

  const [isOpenBottomsheet, setIsOpenBottomsheet] = useState(false);

  return (
    <FormResponsiveLayout
      title={{
        label: "Detail Pesanan",
      }}
      withMenu={{
        onClickInfo: () => alert("onClickInfo"),
        onClickMenu: () => setIsOpenBottomsheet(true),
      }}
      onClickBackButton={() => alert("onClickBackButton")}
    >
      <div className="space-y-2 bg-neutral-200">
        <OrderInfo />
        <DriverInfo />
        <TabsInfo />
        <RouteInfo />
      </div>

      <BottomSheet open={isOpenBottomsheet} onOpenChange={setIsOpenBottomsheet}>
        <BottomSheetContent>
          <BottomSheetHeader>Menu</BottomSheetHeader>
          <MenuList />
        </BottomSheetContent>
      </BottomSheet>

      <ResponsiveFooter className="flex gap-3">
        <Button
          variant="muatparts-primary"
          className="flex-1"
          onClick={() => alert("Simpan")}
          type="button"
        >
          Pesan Ulang
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};
export default DetailPesananScreen;
