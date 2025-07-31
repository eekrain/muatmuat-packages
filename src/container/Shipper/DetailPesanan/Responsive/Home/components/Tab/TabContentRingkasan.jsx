import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import { TabsContent } from "@/components/Tabs/Tabs";
import { OrderStatusEnum } from "@/lib/constants/detailpesanan/detailpesanan.enum";
import { formatDate } from "@/lib/utils/dateFormat";

import { MethodInfo } from "../MethodInfo";
import { RouteInfo } from "../RouteInfo";
import { TransactionSummary } from "../TransactionSummary";

const BLACKLIST_ROUTE_INFO = [
  OrderStatusEnum.PREPARE_FLEET,
  OrderStatusEnum.WAITING_PAYMENT_1,
  OrderStatusEnum.WAITING_PAYMENT_2,
];

export const TabContentRingkasan = ({
  dataStatusPesanan,
  dataRingkasanPesanan,
  documentShippingDetail,
}) => {
  return (
    <TabsContent value="ringkasan" className="space-y-2 bg-neutral-200">
      <div className="bg-neutral-50 px-4 py-5">
        <h3 className="mb-4 text-sm font-semibold text-neutral-900">
          Informasi Armada
        </h3>
        <div className="mb-6 flex items-center gap-3">
          <LightboxProvider image="/img/truck.png">
            <LightboxPreview image="/img/truck.png" />
          </LightboxProvider>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-neutral-900">
              Box - Colt Diesel Engkel
            </p>
            <p className="text-sm font-medium text-neutral-900">
              Kebutuhan : {dataStatusPesanan?.totalUnit || 0} Unit
            </p>
          </div>
        </div>

        <h3 className="mb-4 text-sm font-semibold text-neutral-900">
          Waktu Muat
        </h3>
        <p className="text-xs font-semibold text-neutral-900">
          {formatDate(dataRingkasanPesanan?.loadTimeStart)}
          {dataRingkasanPesanan?.loadTimeEnd
            ? ` s/d ${formatDate(dataRingkasanPesanan?.loadTimeEnd)}`
            : ""}
        </p>
      </div>

      {!BLACKLIST_ROUTE_INFO.includes(dataStatusPesanan?.orderStatus) && (
        <RouteInfo dataDetailPesanan={dataRingkasanPesanan} />
      )}
      {true && <MethodInfo method={"va_bca"} />}
      {true && (
        <TransactionSummary documentShippingDetail={documentShippingDetail} />
      )}
    </TabsContent>
  );
};
