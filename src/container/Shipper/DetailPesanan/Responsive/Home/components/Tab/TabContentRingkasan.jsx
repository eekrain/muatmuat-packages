import { TabsContent } from "@/components/Tabs/Tabs";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

import AdditionalFeesDetail from "../AdditionalFeesDetail";
import { MethodInfo } from "../MethodInfo";
import { TransactionSummary } from "../TransactionSummary";
import { InformasiArmadaFragment } from "../fragments/InformasiArmadaFragment";
import { InformasiMuatanFragment } from "../fragments/InformasiMuatanFragment";
import { LocationRouteFragment } from "../fragments/LocationRouteFragment";
import { WaktuMuatFragment } from "../fragments/WaktuMuatFragment";

const BLACKLIST_ROUTE_INFO = [
  OrderStatusEnum.PREPARE_FLEET,
  OrderStatusEnum.WAITING_PAYMENT_1,
  OrderStatusEnum.WAITING_PAYMENT_2,
];

export const TabContentRingkasan = ({
  dataStatusPesanan,
  dataRingkasanPesanan,
  dataRingkasanPembayaran,
  documentShippingDetail,
}) => {
  return (
    <TabsContent value="ringkasan" className="mb-28 space-y-2 bg-neutral-200">
      <InformasiArmadaFragment 
        dataStatusPesanan={dataStatusPesanan}
        dataRingkasanPesanan={dataRingkasanPesanan}
      >
        <WaktuMuatFragment dataRingkasanPesanan={dataRingkasanPesanan} />
      </InformasiArmadaFragment>

      {!BLACKLIST_ROUTE_INFO.includes(dataStatusPesanan?.orderStatus) && (
        <div className="bg-white px-4 py-5 shadow-sm">
          <LocationRouteFragment dataRingkasanPesanan={dataRingkasanPesanan} />

          <hr className="my-6" />

          <InformasiMuatanFragment
            dataRingkasanPesanan={dataRingkasanPesanan}
          />
        </div>
      )}
      {dataRingkasanPembayaran && (
        <MethodInfo dataRingkasanPembayaran={dataRingkasanPembayaran} />
      )}
      {dataRingkasanPembayaran && (
        <TransactionSummary 
          dataRingkasanPembayaran={dataRingkasanPembayaran}
          documentShippingDetail={documentShippingDetail} 
        />
      )}
      {dataRingkasanPembayaran?.priceCharge && (
        <AdditionalFeesDetail priceCharge={dataRingkasanPembayaran.priceCharge} />
      )}
    </TabsContent>
  );
};
