import CardPayment from "@/components/Card/CardPayment";
import IconComponent from "@/components/IconComponent/IconComponent";
import { ModalDetailOverloadMuatan } from "@/components/Modal/ModalDetailOverloadMuatan";
import { ModalDetailWaktuTunggu } from "@/components/Modal/ModalDetailWaktuTunggu";

import { useTranslation } from "@/hooks/use-translation";

import { idrFormat } from "@/lib/utils/formatters";

import { ORDER_STATUS } from "@/utils/CS/orderStatus";

const AdditionalCostDetail = ({ costBreakdown, order }) => {
  console.log({ costBreakdown });

  // Mock data for ModalDetailWaktuTunggu component
  const waitingTimeDriversData = [
    {
      name: "Bagus Dharmawan",
      plateNumber: "B 1234 ABC",
      transporter: "PT Transport Sejahtera",
      durasiTotal: "15 jam 30 menit",
      data: [
        {
          detail: "Lokasi Muat 1",
          totalPrice: 75000,
          startDate: "2024-10-01T08:00:00Z",
          endDate: "2024-10-01T15:30:00Z",
        },
        {
          detail: "Lokasi Muat 2",
          totalPrice: 75000,
          startDate: "2024-10-01T08:00:00Z",
          endDate: "2024-10-01T15:30:00Z",
        },
        {
          detail: "Lokasi Bongkar 1",
          totalPrice: 50000,
          startDate: "2024-10-02T09:00:00Z",
          endDate: "2024-10-02T14:00:00Z",
        },
        {
          detail: "Lokasi Bongkar 2",
          totalPrice: 50000,
          startDate: "2024-10-02T09:00:00Z",
          endDate: "2024-10-02T14:00:00Z",
        },
      ],
    },
    {
      name: "Ragil Poetra",
      plateNumber: "B 5678 DEF",
      transporter: "CV Logistik Mandiri",
      durasiTotal: "18 jam 45 menit",
      data: [
        {
          detail: "Lokasi Muat - Pabrik Tekstil Bandung",
          totalPrice: 90000,
          startDate: "2024-10-01T07:30:00Z",
          endDate: "2024-10-01T16:15:00Z",
        },
        {
          detail: "Lokasi Bongkar - Mall Central Bekasi",
          totalPrice: 60000,
          startDate: "2024-10-02T10:30:00Z",
          endDate: "2024-10-02T18:30:00Z",
        },
      ],
    },
    {
      name: "Ahmad Susanto",
      plateNumber: "B 9012 GHI",
      transporter: "UD Angkutan Nusantara",
      durasiTotal: "12 jam 15 menit",
      data: [
        {
          detail: "Lokasi Muat - Pelabuhan Tanjung Priok",
          totalPrice: 45000,
          startDate: "2024-10-01T06:00:00Z",
          endDate: "2024-10-01T13:15:00Z",
        },
        {
          detail: "Lokasi Bongkar - Terminal Cargo Cengkareng",
          totalPrice: 35000,
          startDate: "2024-10-02T08:00:00Z",
          endDate: "2024-10-02T12:00:00Z",
        },
      ],
    },
  ];

  // Dummy data for overload modal
  const overloadDriversData = [
    {
      driverName: "Bagus Dharmawan",
      amount: 150000,
      overloadWeight: "1.500 kg",
    },
    {
      driverName: "Ragil Poetra",
      amount: 200000,
      overloadWeight: "2.000 kg",
    },
    {
      driverName: "Ahmad Susanto",
      amount: 100000,
      overloadWeight: "1.000 kg",
    },
  ];

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
            <ModalDetailWaktuTunggu drivers={waitingTimeDriversData} />
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
            <ModalDetailOverloadMuatan drivers={overloadDriversData} />
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
