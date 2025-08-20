import { TabsContent } from "@/components/Tabs/Tabs";
import { OrderStatusEnum } from "@/lib/constants/Shipper/detailpesanan/detailpesanan.enum";

import AdditionalFeesDetail from "../AdditionalFeesDetail";
import { MethodInfo } from "../MethodInfo";
import RepaymentPaymentMethod from "../RepaymentPaymentMethod";
import { TransactionSummary } from "../TransactionSummary";
import UpdateOrderFeeSummary from "../UpdateOrderFeeSummary";
import { InformasiArmadaFragment } from "../fragments/InformasiArmadaFragment";
import { InformasiMuatanFragment } from "../fragments/InformasiMuatanFragment";
import { LocationRouteFragment } from "../fragments/LocationRouteFragment";
import { WaktuMuatFragment } from "../fragments/WaktuMuatFragment";

const LIST_HIDE_METHOD_INFO = [
  OrderStatusEnum.WAITING_PAYMENT_2,
  OrderStatusEnum.WAITING_PAYMENT_4,
  OrderStatusEnum.WAITING_REPAYMENT_2,
];

const SHOW_UPDATE_ORDER_FEE = [
  OrderStatusEnum.WAITING_PAYMENT_3,
  OrderStatusEnum.WAITING_PAYMENT_4,
];

const BLACKLIST_SHOW_TRANSACTION_SUMMARY = [
  OrderStatusEnum.WAITING_CONFIRMATION_CHANGES,
];

export const TabContentRingkasan = ({
  dataStatusPesanan,
  dataRingkasanPesanan,
  dataRingkasanPembayaran,
  documentShippingDetail,
  waitingTimeRaw,
  paymentMethods,
}) => {
  return (
    <TabsContent value="ringkasan" className="space-y-2 bg-neutral-200">
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
      {dataRingkasanPembayaran?.orderStatus === "WAITING_PAYMENT_3" &&
      dataRingkasanPembayaran?.priceChange ? (
        <RepaymentPaymentMethod paymentMethods={paymentMethods} />
      ) : null}

      {dataRingkasanPembayaran && !LIST_HIDE_METHOD_INFO && (
        <MethodInfo dataRingkasanPembayaran={dataRingkasanPembayaran} />
      )}

      {/* 25. 18 - Web - LB - 0294 */}
      {dataStatusPesanan?.orderStatus !== OrderStatusEnum.COMPLETED ? (
        <>
          {dataRingkasanPembayaran && dataRingkasanPembayaran?.priceCharge ? (
            <AdditionalFeesDetail
              priceCharge={dataRingkasanPembayaran.priceCharge}
              waitingTimeRaw={waitingTimeRaw}
            />
          ) : SHOW_UPDATE_ORDER_FEE.includes(dataStatusPesanan?.orderStatus) ? (
            <UpdateOrderFeeSummary
              dataRingkasanPembayaran={dataRingkasanPembayaran}
            />
          ) : !BLACKLIST_SHOW_TRANSACTION_SUMMARY.includes(
              dataStatusPesanan?.orderStatus
            ) ? (
            <TransactionSummary
              dataRingkasanPembayaran={dataRingkasanPembayaran}
              documentShippingDetail={documentShippingDetail}
            />
          ) : null}
        </>
      ) : null}
    </TabsContent>
  );
};
