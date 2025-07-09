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
import { useGetOrderDetail } from "@/services/detailpesanan/getDetailPesananData";

import { DriverInfo } from "./components/DriverInfo";
import { DriverQRCodeAlert } from "./components/DriverQRCodeAlert";
import { MenuList } from "./components/MenuList";
import { OrderInfo } from "./components/OrderInfo";
import { RouteInfo } from "./components/RouteInfo";
import { TabsInfo } from "./components/TabsInfo";

const DetailPesananScreen = () => {
  const navigation = useResponsiveNavigation();

  const [isOpenBottomsheet, setIsOpenBottomsheet] = useState(false);

  const [isOpenInfo, setIsOpenInfo] = useState(false);

  const { data } = useGetOrderDetail("12345");

  return (
    <FormResponsiveLayout
      title={{
        label: "Detail Pesanan",
      }}
      withMenu={{
        onClickInfo: () => setIsOpenInfo(true),
        onClickMenu: () => setIsOpenBottomsheet(true),
      }}
      onClickBackButton={() => alert("onClickBackButton")}
    >
      <div className="mb-16 space-y-2 bg-neutral-200">
        {false && <DriverQRCodeAlert />}
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

      <BottomSheet open={isOpenInfo} onOpenChange={setIsOpenInfo}>
        <BottomSheetContent>
          <BottomSheetHeader>Informasi</BottomSheetHeader>
          {/* <pre className="h-[700px] overflow-y-scroll">
            {JSON.stringify(data, null, 2)}
          </pre> */}
          <div className="px-4 py-6 text-sm font-medium">
            QR Code diperlukan agar driver dapat melanjutkan proses muat atau
            bongkar barang.
          </div>
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
