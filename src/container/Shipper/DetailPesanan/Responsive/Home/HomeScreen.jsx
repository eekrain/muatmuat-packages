import { useParams } from "next/navigation";
import { useState } from "react";

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
} from "@/components/Bottomsheet/Bottomsheet";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useGetDetailPesananData } from "@/services/Shipper/detailpesanan/getDetailPesananData";

import { BottomsheetMenuList } from "./components/BottomsheetMenuList";
import { DriverInfo } from "./components/DriverInfo";
import { DriverQRCodeAlert } from "./components/DriverQRCodeAlert";
import { FleetStatusAlert } from "./components/FleetStatusAlert";
import { FooterButton } from "./components/FooterButton";
import { MethodInfo } from "./components/MethodInfo";
import { OrderInfo } from "./components/OrderInfo";
import { PaymentDetail } from "./components/PaymentDetail";
import { RouteInfo } from "./components/RouteInfo";
import { TabsInfo } from "./components/TabsInfo";
import { TransactionSummary } from "./components/TransactionSummary";

const DEBUG_MODE = false;

const DetailPesananScreen = ({
  dataDetailPIC,
  dataRingkasanPembayaran,
  documentShippingDetail,
}) => {
  const params = useParams();
  const { data: dataDetailPesanan, isLoading: isLoadingDetailPesanan } =
    useGetDetailPesananData(params.orderId);

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
        {false && (
          <PaymentDetail dataRingkasanPembayaran={dataRingkasanPembayaran} />
        )}

        {false && <FleetStatusAlert />}
        {false && <DriverQRCodeAlert />}

        <OrderInfo dataStatusPesanan={dataDetailPesanan?.dataStatusPesanan} />

        {dataDetailPesanan?.dataStatusPesanan && (
          <DriverInfo
            driverStatus={dataDetailPesanan?.dataStatusPesanan?.driverStatus}
            orderId={dataDetailPesanan?.dataStatusPesanan?.orderId}
            orderStatus={dataDetailPesanan?.dataStatusPesanan?.orderStatus}
          />
        )}

        <TabsInfo dataDetailPIC={dataDetailPIC} />

        {true && <RouteInfo />}
        {false && <MethodInfo method={"va_bca"} />}
        {false && (
          <TransactionSummary documentShippingDetail={documentShippingDetail} />
        )}
      </div>

      <BottomsheetMenuList
        open={isOpenBottomsheet}
        onOpenChange={setIsOpenBottomsheet}
      />

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
        {false && (
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Total Tambahan Biaya</div>
            <div className="text-sm font-bold">Rp1.021.583</div>
          </div>
        )}
        <FooterButton
          orderStatus={dataDetailPesanan?.dataStatusPesanan?.orderStatus}
        />
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};
export default DetailPesananScreen;
