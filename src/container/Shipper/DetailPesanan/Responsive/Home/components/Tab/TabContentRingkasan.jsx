import { TabsContent } from "@/components/Tabs/Tabs";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";

import AdditionalFeesDetail from "../AdditionalFeesDetail";
import { MethodInfo } from "../MethodInfo";
import RepaymentPaymentMethod from "../RepaymentPaymentMethod";
import { TransactionSummary } from "../TransactionSummary";
import { InformasiArmadaFragment } from "../fragments/InformasiArmadaFragment";
import { InformasiMuatanFragment } from "../fragments/InformasiMuatanFragment";
import { LocationRouteFragment } from "../fragments/LocationRouteFragment";
import { WaktuMuatFragment } from "../fragments/WaktuMuatFragment";

const LIST_HIDE_METHOD_INFO = [
  OrderStatusEnum.WAITING_PAYMENT_2,
  OrderStatusEnum.WAITING_PAYMENT_4,
  OrderStatusEnum.WAITING_REPAYMENT_2,
];

export const TabContentRingkasan = ({
  dataStatusPesanan,
  dataRingkasanPesanan,
  dataRingkasanPembayaran,
  documentShippingDetail,
  waitingTimeRaw,
}) => {
  return (
    <TabsContent value="ringkasan" className="mb-28 space-y-2 bg-neutral-200">
      <InformasiArmadaFragment
        dataStatusPesanan={dataStatusPesanan}
        dataRingkasanPesanan={dataRingkasanPesanan}
      >
        <WaktuMuatFragment dataRingkasanPesanan={dataRingkasanPesanan} />
      </InformasiArmadaFragment>

      <div className="bg-white px-4 py-5 shadow-sm">
        <LocationRouteFragment dataRingkasanPesanan={dataRingkasanPesanan} />

        <hr className="my-6" />

        <InformasiMuatanFragment dataRingkasanPesanan={dataRingkasanPesanan} />
      </div>

      {/* Ganti sendiri pakek logic menunggu pelunasan, ditoggle dulu sementara */}
      {false ? <RepaymentPaymentMethod /> : null}

      {dataRingkasanPembayaran && !LIST_HIDE_METHOD_INFO && (
        <MethodInfo dataRingkasanPembayaran={dataRingkasanPembayaran} />
      )}

      {dataRingkasanPembayaran && dataRingkasanPembayaran?.priceCharge ? (
        <AdditionalFeesDetail
          priceCharge={dataRingkasanPembayaran.priceCharge}
          waitingTimeRaw={waitingTimeRaw}
        />
      ) : (
        <TransactionSummary
          dataRingkasanPembayaran={dataRingkasanPembayaran}
          documentShippingDetail={documentShippingDetail}
        />
      )}
    </TabsContent>
  );
};
