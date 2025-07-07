import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
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
    </FormResponsiveLayout>
  );
};
export default DetailPesananScreen;
