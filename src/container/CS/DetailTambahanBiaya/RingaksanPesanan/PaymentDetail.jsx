import { useParams } from "next/navigation";

import { useGetOverloadDetails } from "@/services/CS/laporan/tambahan-biaya/detail-tambahan-biaya/getOverloadDetails";
import { useGetWaitingTimeDetails } from "@/services/CS/laporan/tambahan-biaya/detail-tambahan-biaya/getWaitingTimeDetails";

import CardPayment from "@/components/Card/CardPayment";
import IconComponent from "@/components/IconComponent/IconComponent";

import { ModalDetailOverloadMuatan } from "@/container/CS/DetailTambahanBiaya/RingaksanPesanan/ModalDetailOverloadMuatan";

import { useTranslation } from "@/hooks/use-translation";

import { idrFormat } from "@/lib/utils/formatters";

import { ORDER_STATUS } from "@/utils/CS/orderStatus";

import { ModalDetailWaktuTunggu } from "./ModalDetailWaktuTunggu";

const AdditionalCostDetail = ({ costBreakdown, order }) => {
  const params = useParams();
  const { data: dataWaitingTimeDetails } = useGetWaitingTimeDetails(
    params.uuid
  );
  const { data: dataOverlodaDetails } = useGetOverloadDetails(params.uuid);

  return (
    <>
      <CardPayment.Section title="Biaya Waktu Tunggu">
        <div className="flex flex-col gap-y-3">
          <CardPayment.LineItem
            label={`Nominal Waktu Tunggu (${order?.fleet_count} Driver)`}
            labelClassName="max-w-[190px]"
            value={idrFormat(costBreakdown?.waiting_time_cost)}
          />
          <div className="flex items-start">
            <ModalDetailWaktuTunggu
              drivers={dataWaitingTimeDetails?.drivers || []}
              grandTotal={dataWaitingTimeDetails?.grandTotal || 0}
            />
          </div>
        </div>
      </CardPayment.Section>
      <CardPayment.Section title="Biaya Overload Muatan">
        <div className="flex flex-col gap-y-3">
          <CardPayment.LineItem
            label={`Nominal Overload Muatan (2.000 kg)`}
            labelClassName="max-w-[190px]"
            value={idrFormat(costBreakdown?.overload_cost)}
          />
          {/* Sementara */}
          <div className="flex items-start">
            <ModalDetailOverloadMuatan
              drivers={dataOverlodaDetails?.drivers || []}
              grandTotal={dataOverlodaDetails?.grandTotal || 0}
            />
          </div>
        </div>
      </CardPayment.Section>
      <CardPayment.Section title="Biaya Lainnya">
        <CardPayment.LineItem
          label="Admin Layanan"
          labelClassName="max-w-[180px]"
          value={idrFormat(costBreakdown?.admin_fee)}
        />
      </CardPayment.Section>
    </>
  );
};

const AdditionalCostDetailContainer = ({ costBreakdown, order }) => {
  if (order.status === ORDER_STATUS.COMPLETED) {
    return (
      <CardPayment.CollapsibleSection title="Detail Pesanan">
        <CardPayment.LineItem
          label="Waktu Pembayaran"
          labelClassName="max-w-[148px]"
          value="06 Jun 2024 19:00 WIB"
        />
        <CardPayment.LineItem
          label="Opsi Pembayaran"
          labelClassName="max-w-[148px]"
          value={
            <div className="flex items-center gap-x-2">
              <IconComponent src="/icons/bca16.svg" />
              <span>BCA Virtual Account</span>
            </div>
          }
        />
        <AdditionalCostDetail costBreakdown={costBreakdown} order={order} />
      </CardPayment.CollapsibleSection>
    );
  }
  return <AdditionalCostDetail costBreakdown={costBreakdown} order={order} />;
};

const PaymentDetail = ({ costBreakdown, order, paymentDeadline }) => {
  const { t } = useTranslation();

  return (
    <div className="sticky top-[120px] h-fit min-w-[338px]">
      <div className="sticky top-[120px] h-fit min-w-[338px]">
        <CardPayment.Root className="flex-1">
          <CardPayment.Header>
            {order.status === ORDER_STATUS.COMPLETED
              ? "Ringkasan Pembayaran"
              : "Detail Tambahan Biaya"}
          </CardPayment.Header>
          <CardPayment.Body>
            <AdditionalCostDetailContainer
              costBreakdown={costBreakdown}
              order={order}
            />
            {/* <CardPayment.CollapsibleSection title={t("titleDetailPesanan")}>
              <CardPayment.Section title={t("titleBiayaPesanJasaAngkut")}>
                <CardPayment.LineItem
                  label={`Nominal Pesanan Jasa Angkut (${order?.fleet_count} Unit)`}
                  labelClassName="max-w-[170px]"
                  value={idrFormat(dataOrderDetail?.incomeSummary.transportFee)}
                />
              </CardPayment.Section>
              <CardPayment.Section title="Layanan Tambahan">
                <CardPayment.LineItem
                  label={t("labelNominalBantuanTambahan")}
                  value={idrFormat(
                    dataOrderDetail?.incomeSummary.additionalServiceFee
                  )}
                />
              </CardPayment.Section>
              <CardPayment.Section title="Potongan PPh">
                <CardPayment.LineItem
                  label="Nominal Potongan PPh"
                  value={`-${idrFormat(dataOrderDetail?.incomeSummary.taxAmount)}`}
                  valueClassName="text-error-400"
                />
              </CardPayment.Section>
              <CardPayment.LineItem
                className="mt-3"
                labelClassName="text-sm font-semibold text-neutral-900"
                valueClassName="text-sm font-semibold text-neutral-900"
                label="Sub Total"
                value={idrFormat(dataOrderDetail?.incomeSummary.totalPrice)}
              />
            </CardPayment.CollapsibleSection> */}
          </CardPayment.Body>
          <CardPayment.Footer>
            <CardPayment.Total
              className="items-start gap-x-[62px]"
              label="Total Tambahan Biaya"
              value={idrFormat(costBreakdown.total_amount || 0)}
            />
          </CardPayment.Footer>
        </CardPayment.Root>
      </div>
    </div>
  );
};

export default PaymentDetail;
