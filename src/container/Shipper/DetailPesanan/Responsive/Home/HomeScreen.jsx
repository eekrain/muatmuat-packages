import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";

import { DriverInfo } from "./components/DriverInfo";
import { DriverQRCodeAlert } from "./components/DriverQRCodeAlert";
import { FleetStatusAlert } from "./components/FleetStatusAlert";
import { FooterButton } from "./components/FooterButton";
import { MenuList } from "./components/MenuList";
import { MethodInfo } from "./components/MethodInfo";
import { OrderInfo } from "./components/OrderInfo";
import { PaymentDetail } from "./components/PaymentDetail";
import { RouteInfo } from "./components/RouteInfo";
import { TabsInfo } from "./components/TabsInfo";
import { TransactionSummary } from "./components/TransactionSummary";

const DetailPesananScreen = ({
  dataDetailPIC,
  dataRingkasanPembayaran,
  documentShippingDetail,
}) => {
  const DEBUG_MODE = false;

  const navigation = useResponsiveNavigation();

  const [isOpenBottomsheet, setIsOpenBottomsheet] = useState(false);

  const [isOpenInfo, setIsOpenInfo] = useState(false);

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
        {/* <img src="/img/mock-va.png" alt="" /> */}
        {true && (
          <PaymentDetail dataRingkasanPembayaran={dataRingkasanPembayaran} />
        )}

        {false && <FleetStatusAlert />}
        {false && <DriverQRCodeAlert />}
        <OrderInfo />
        {true && <DriverInfo />}
        <TabsInfo dataDetailPIC={dataDetailPIC} />
        {true && <RouteInfo />}
        {true && <MethodInfo method={"va_bca"} />}
        {true && (
          <TransactionSummary documentShippingDetail={documentShippingDetail} />
        )}
      </div>

      <BottomSheet open={isOpenBottomsheet} onOpenChange={setIsOpenBottomsheet}>
        <BottomSheetContent>
          <MenuList />
        </BottomSheetContent>
      </BottomSheet>

      <BottomSheet open={isOpenInfo} onOpenChange={setIsOpenInfo}>
        <BottomSheetContent>
          <BottomSheetHeader>
            {DEBUG_MODE ? "Log" : "Lokasi Bongkar"}
          </BottomSheetHeader>
          {DEBUG_MODE ? (
            <pre className="h-[700px] overflow-y-scroll">
              {JSON.stringify(data, null, 2)}
            </pre>
          ) : (
            <img src="/img/mock-bongkar.png" alt="" className="px-4 py-5" />

            // <div className="px-4 py-6 text-sm font-medium">
            //   QR Code diperlukan agar driver dapat melanjutkan proses muat atau
            //   bongkar barang.
            // </div>
          )}
        </BottomSheetContent>
      </BottomSheet>

      <ResponsiveFooter className="flex flex-col gap-3">
        {false && (
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Total Biaya</div>
            <div className="text-sm font-bold">Rp1.021.583</div>
          </div>
        )}
        <FooterButton />
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};
export default DetailPesananScreen;
