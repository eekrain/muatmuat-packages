import CardPayment from "@/components/Card/CardPayment";
import { useTranslation } from "@/hooks/use-translation";
import { idrFormat } from "@/lib/utils/formatters";

const RingkasanPendapatan = ({ dataOrderDetail }) => {
  const { t } = useTranslation();
  return (
    <div className="sticky top-[120px] h-fit min-w-[338px]">
      <CardPayment.Root className="flex-1">
        <CardPayment.Header>Ringkasan Pendapatan</CardPayment.Header>
        <CardPayment.Body>
          <CardPayment.CollapsibleSection title={t("titleDetailPesanan")}>
            <CardPayment.Section title={t("titleBiayaPesanJasaAngkut")}>
              <CardPayment.LineItem
                // 25. 30 - Web - LB - 0253
                label={`Nominal Pesanan Jasa Angkut (${dataOrderDetail?.truckCount} Unit)`}
                labelClassName="max-w-[170px]"
                value={idrFormat(dataOrderDetail?.incomeSummary.transportFee)}
              />
            </CardPayment.Section>
            {/* 25. 30 - Web - LB - 0253 */}
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
          </CardPayment.CollapsibleSection>
        </CardPayment.Body>
        <CardPayment.Footer>
          <CardPayment.Total
            label="Total Pendapatan"
            value={idrFormat(dataOrderDetail?.incomeSummary.totalPrice)}
          />
        </CardPayment.Footer>
      </CardPayment.Root>
    </div>
  );
};

export default RingkasanPendapatan;
