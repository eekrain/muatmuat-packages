import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

// import { TimelineContainer, TimelineContentAddress, TimelineItem } from '@/components/Timeline';
import { ChevronDown, ChevronUp } from "lucide-react";

import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal";
import { ModalTrigger } from "@/components/Modal/Modal";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTriggerWithSeparator,
} from "@/components/Tabs/Tabs";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";
import { ORDER_STATUS } from "@/utils/CS/orderStatus";

import RingkasanPesanan from "./RingkasanPesanan";
import RiwayatHubungiTable from "./RiwayatHubungiTable";

// --- Helper Components ---

const InfoItem = ({ label, value }) => (
  <div className="flex min-w-[200px] max-w-[200px] flex-col gap-y-2">
    <span className="text-xs font-medium text-neutral-600">{label}</span>
    <span className="text-sm font-bold">{value}</span>
  </div>
);

const ContactDetail = ({ icon, name, phone, address, fleet }) => {
  const infoData = [
    ...(fleet ? [{ icon: "/icons/transporter16.svg", value: fleet }] : []),
    { icon: "/icons/phone16.svg", value: phone },
    { icon: "/icons/marker-outline.svg", value: address },
  ];
  return (
    <div className="flex items-center gap-x-2">
      <div className="flex size-[40px] items-center justify-center">
        <Image
          alt={name}
          className="rounded-[32px] border border-neutral-400"
          src="/img/avatar2.png"
          width={40}
          height={40}
        />
      </div>
      <div className="flex w-[621px] flex-col gap-y-3">
        <p className="text-sm font-bold">{name}</p>
        <div className="flex items-center gap-x-2 text-xs font-medium">
          {infoData.map((item, index) => (
            <Fragment key={index}>
              {index === 0 ? null : (
                <div className="size-[2px] rounded-full bg-neutral-600" />
              )}
              <div className="flex items-center gap-x-1">
                <IconComponent
                  src={item.icon}
                  className="text-muat-trans-secondary-900"
                />
                <span>{item.value}</span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      {fleet ? null : (
        <Button variant="muattrans-primary" onClick={() => {}}>
          Hubungi
        </Button>
      )}
    </div>
  );
};

const DetailTambahanBiaya = ({ breadcrumbData, report = {} }) => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("ringkasan-pesanan");
  const [isPicExpanded, setIsPicExpanded] = useState(false);
  const [isPaymentDetailExpanded, setIsPaymentDetailExpanded] = useState(true);
  const [isModalOverloadMuatanOpen, setIsModalOverloadMuatanOpen] =
    useState(true);

  // Extract data from report prop with fallbacks
  const {
    order = {},
    shipper = {},
    transporters = [],
    contact_summary = {},
    cost_breakdown = {},
    payment_deadline = null,
  } = report;

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case ORDER_STATUS.COMPLETED:
        return "success";
      case ORDER_STATUS.PENDING:
        return "warning";
      default:
        return "warning";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case ORDER_STATUS.COMPLETED:
        return "Selesai";
      case ORDER_STATUS.PENDING:
        return "Menunggu Pelunasan";
      default:
        return "Menunggu Pelunasan";
    }
  };

  const tabItems = [
    {
      value: "ringkasan-pesanan",
      label: "Ringkasan Pesanan",
    },
    {
      value: "riwayat-hubungi",
      label: "Riwayat Hubungi",
    },
  ];

  return (
    <div className="mx-auto flex max-w-[1232px] flex-col gap-y-4 py-6">
      <BreadCrumb data={breadcrumbData} />
      <div className="flex items-center gap-x-3">
        <IconComponent
          onClick={() => router.back()}
          src="/icons/arrow-left24.svg"
          size="medium"
          className="text-primary-700"
        />
        <h1 className="text-xl font-bold text-neutral-900">
          Detail Tambahan Biaya
        </h1>
      </div>

      <Tabs
        className="flex flex-col gap-y-4"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="w-fit justify-start">
          {tabItems.map((tabItem, key) => (
            <TabsTriggerWithSeparator
              key={key}
              value={tabItem.value}
              activeColor="primary-700"
              className="px-6 !text-base text-neutral-900"
              showSeparator={key !== tabItems.length - 1}
            >
              <span className="whitespace-nowrap">{tabItem.label}</span>
            </TabsTriggerWithSeparator>
          ))}
        </TabsList>

        <TabsContent value="ringkasan-pesanan">
          <div className="flex gap-x-4">
            {/* Left Column */}
            <div className="flex w-full max-w-[878px] flex-col gap-y-4">
              <Card className="rounded-xl border-none">
                <div className="flex items-center gap-x-3 px-8 py-6">
                  <InfoItem
                    label="Telah Dihubungi Oleh"
                    value={contact_summary.last_contacted_by || "-"}
                  />
                  <InfoItem
                    label="Terakhir Dihubungi"
                    value={formatDate(contact_summary.last_contacted_at)}
                  />
                  <InfoItem
                    label="Jumlah Dihubungi"
                    value={`${contact_summary.total_contacts || 0} Kali`}
                  />
                  {order.status === "COMPLETED" ? null : (
                    <InfoItem
                      label="Lama Belum Dibayarkan"
                      value={`${contact_summary.days_unpaid} Hari`}
                    />
                  )}
                </div>
              </Card>

              <Card className="rounded-xl border-none">
                <div className="flex flex-col gap-y-6 px-8 py-6">
                  <div className="flex items-center gap-x-3">
                    <InfoItem label="No. Pesanan" value={order.code || "-"} />
                    <div className="flex w-[300px] flex-col gap-y-2">
                      <span className="text-xs font-medium text-neutral-600">
                        Status Pesanan
                      </span>
                      <BadgeStatusPesanan
                        variant={getStatusBadgeVariant(order.status)}
                        className="w-fit"
                      >
                        {getStatusText(order.status)}
                      </BadgeStatusPesanan>
                    </div>
                    <InfoItem
                      label="Jumlah Armada"
                      value={`${order.fleet_count || 0} Unit`}
                    />
                  </div>
                  <div className="flex flex-col gap-y-5 rounded-xl border border-neutral-400 px-4 py-5">
                    <div className="flex flex-col gap-y-3 border-b border-b-neutral-400 pb-5">
                      <h3 className="text-sm font-bold">Informasi Shipper</h3>
                      <ContactDetail
                        icon="/icons/business-user.svg"
                        name={shipper.company_name || shipper.name || "-"}
                        phone={shipper.phone || "-"}
                        address={shipper.location || "-"}
                      />
                    </div>
                    <div className="flex flex-col gap-y-3">
                      <h3 className="text-sm font-bold">
                        Informasi Transporter
                      </h3>
                      {transporters.length > 0 ? (
                        transporters.map((transporter, index) => (
                          <ContactDetail
                            key={index}
                            icon="/icons/truck-02.svg"
                            name={transporter.name || "-"}
                            phone={transporter.phone || "-"}
                            address={transporter.location || "-"}
                            fleet={`${transporter.fleet_count || 0} Unit`}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-neutral-500">
                          Tidak ada data transporter
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
              {true && <RingkasanPesanan />}
            </div>

            {/* Right Column */}

            {/* <div className="sticky top-[120px] h-fit min-w-[338px]">
              <CardPayment.Root className="flex-1">
                <CardPayment.Header>
                  {order.status === ORDER_STATUS.COMPLETED
                    ? "Ringkasan Pembayaran"
                    : "Detail Tambahan Biaya"}
                </CardPayment.Header>
                <CardPayment.Body>
                  <CardPayment.CollapsibleSection
                    title={t("titleDetailPesanan")}
                  >
                    <CardPayment.Section title={t("titleBiayaPesanJasaAngkut")}>
                      <CardPayment.LineItem
                        label={`Nominal Pesanan Jasa Angkut (${dataOrderDetail?.truckCount} Unit)`}
                        labelClassName="max-w-[170px]"
                        value={idrFormat(
                          dataOrderDetail?.incomeSummary.transportFee
                        )}
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
                      value={idrFormat(
                        dataOrderDetail?.incomeSummary.totalPrice
                      )}
                    />
                  </CardPayment.CollapsibleSection>
                </CardPayment.Body>
                <CardPayment.Footer>
                  <CardPayment.Total
                    label="Total Tambahan Biaya"
                    value={idrFormat(cost_breakdown.total_amount || 0)}
                  />
                </CardPayment.Footer>
              </CardPayment.Root>
            </div> */}

            <div className="lg:col-span-1">
              <Card className="sticky top-8 h-fit border-0">
                <Collapsible
                  open={isPaymentDetailExpanded}
                  onOpenChange={setIsPaymentDetailExpanded}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-6">
                    <h2 className="text-base font-bold text-neutral-900">
                      Ringkasan Pembayaran
                    </h2>
                    {isPaymentDetailExpanded ? (
                      <ChevronUp className="h-5 w-5 text-neutral-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-neutral-600" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-6 pb-6">
                    <div className="space-y-3 border-b border-neutral-200 pb-4">
                      <h3 className="text-sm font-semibold text-neutral-900">
                        Detail Pesanan
                      </h3>
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-600">
                          Batas Waktu Pembayaran
                        </span>
                        <span className="font-semibold text-neutral-900">
                          {formatDate(payment_deadline)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-600">
                          Opsi Pembayaran
                        </span>
                        <div className="flex items-center gap-1">
                          <IconComponent
                            src="/icons/bca.svg"
                            width={24}
                            height={16}
                          />
                          <span className="font-semibold text-neutral-900">
                            BCA Virtual Account
                          </span>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <div className="space-y-4 px-6 pb-6 pt-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">
                        Biaya Waktu Tunggu
                      </span>
                      <span className="font-semibold text-neutral-900">
                        {idrFormat(cost_breakdown.waiting_time_cost || 0)}
                      </span>
                    </div>
                    <p className="-mt-1 text-xs text-neutral-600">
                      Nominal Waktu Tunggu
                    </p>
                    <Modal>
                      <ModalTrigger>
                        <button
                          type="button"
                          className="text-xs font-medium text-primary-700 hover:underline"
                        >
                          Lihat Detail Waktu Tunggu
                        </button>
                      </ModalTrigger>
                      <ModalContent className="w-[578px] p-6">
                        <h2 className="text-center text-base font-bold">
                          Detail Waktu Tunggu
                        </h2>
                        <p className="mt-4 text-center text-sm">
                          Detail biaya waktu tunggu akan ditampilkan di sini.
                        </p>
                      </ModalContent>
                    </Modal>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">
                        Biaya Overload Muatan
                      </span>
                      <span className="font-semibold text-neutral-900">
                        {idrFormat(cost_breakdown.overload_cost || 0)}
                      </span>
                    </div>
                    <p className="-mt-1 text-xs text-neutral-600">
                      Nominal Overload Muatan
                    </p>
                    <Modal>
                      <ModalTrigger>
                        <button
                          type="button"
                          className="text-xs font-medium text-primary-700 hover:underline"
                        >
                          Lihat Detail Overload Muatan
                        </button>
                      </ModalTrigger>
                      <ModalContent className="w-[578px] p-6">
                        <h2 className="text-center text-base font-bold">
                          Detail Overload Muatan
                        </h2>
                        <p className="mt-4 text-center text-sm">
                          Detail biaya overload muatan akan ditampilkan di sini.
                        </p>
                      </ModalContent>
                    </Modal>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-neutral-600">Biaya Lainnya</p>
                      <p className="text-xs text-neutral-600">
                        Admin Layanan{" "}
                        {cost_breakdown.tax_amount ? "& Pajak" : ""}
                      </p>
                    </div>
                    <span className="font-semibold text-neutral-900">
                      {idrFormat(
                        (cost_breakdown.admin_fee || 0) +
                          (cost_breakdown.tax_amount || 0)
                      )}
                    </span>
                  </div>

                  <hr className="border-dashed border-neutral-300" />

                  <div className="flex justify-between text-base font-bold text-neutral-900">
                    <span>Total Tambahan Biaya</span>
                    <span>{idrFormat(cost_breakdown.total_amount || 0)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="riwayat-hubungi">
          <div className="mt-6 text-center">
            <RiwayatHubungiTable />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailTambahanBiaya;
