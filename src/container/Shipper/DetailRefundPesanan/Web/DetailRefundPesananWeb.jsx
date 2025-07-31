"use client";

import { useParams } from "next/navigation";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import CardPayment from "@/components/Card/CardPayment";
import IconComponent from "@/components/IconComponent/IconComponent";
import { ModalDetailWaktuTunggu } from "@/components/Modal/ModalDetailWaktuTunggu";
import PageTitle from "@/components/PageTitle/PageTitle";
import { StepperContainer, StepperItem } from "@/components/Stepper/Stepper";
import { PaymentMethodIconFromTitle } from "@/lib/constants/detailpesanan/payment.enum";
import { formatDate } from "@/lib/utils/dateFormat";
import { idrFormat } from "@/lib/utils/formatters";
import { useGetRefundDetails } from "@/services/Shipper/detail-refund/getRefundDetails";
import { useGetWaitingTime } from "@/services/Shipper/detailpesanan/getWaitingTime";

const DetailRefundPesananWeb = () => {
  const params = useParams();

  const breadcrumbData = [
    { name: "Daftar Pesanan", href: "/daftarpesanan" },
    {
      name: "Detail Pesanan",
      href: `/daftarpesanan/detailpesanan/${params.orderId}`,
    },
    { name: "Detail Refund" },
  ];

  // Fetch refund details
  const { data: refundData } = useGetRefundDetails(params.orderId);
  // Extract data from API response
  const bank = refundData?.bankAccount;
  const breakdown = refundData?.refundBreakdown;

  const { data: waitingTimeRaw } = useGetWaitingTime(params.orderId);

  // Mapping ke format drivers untuk ModalDetailWaktuTunggu
  const waitingTimeDrivers = (waitingTimeRaw || []).map((item) => {
    // Helper function to safely convert date string to ISO string
    const safeDateToISO = (dateString) => {
      if (!dateString) return new Date().toISOString();
      try {
        const date = new Date(dateString);
        return isNaN(date.getTime())
          ? new Date().toISOString()
          : date.toISOString();
      } catch (error) {
        return new Date().toISOString();
      }
    };

    return {
      name: item.name || "Driver",
      durasiTotal: item.waitingTime
        ? `${Math.floor(item.waitingTime / 60)} Jam ${item.waitingTime % 60} Menit`
        : undefined,
      data: [
        {
          detail: `Plat: ${item.licensePlate || "-"}`,
          startDate: safeDateToISO(item.startWaitingTime),
          endDate: safeDateToISO(item.endWaitingTime),
          totalPrice: item.waitingFee || 0,
        },
      ],
    };
  });
  console.log(waitingTimeRaw, "waitingtime");
  return (
    <div className="mx-auto max-w-[1200px] pt-8">
      {/* Breadcrumb */}
      <BreadCrumb className="mb-6" data={breadcrumbData} />
      {/* Header */}
      <PageTitle>Detail Refund</PageTitle>

      <div className="mt-6 flex gap-4">
        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Refund Status */}
          <div className="rounded-xl bg-white px-8 py-6 shadow-sm">
            <div className="rounded-xl border px-4 py-5">
              <StepperContainer
                activeIndex={
                  refundData?.refundStatus === "REFUND_COMPLETED" ? 1 : 0
                }
                totalStep={2}
              >
                {[
                  {
                    label: "Pengembalian Dana Diproses",
                    icon: "/icons/stepper/stepper-check-circle.svg",
                    status: "PROCESS_REFUND",
                    subtitle: refundData?.requestedAt
                      ? formatDate(new Date(refundData.requestedAt))
                      : "-",
                  },
                  {
                    label: "Dana Terkirim",
                    icon: "/icons/stepper/stepper-check-circle.svg",
                    status: "DONE_REFUND",
                    subtitle: refundData?.processedAt
                      ? formatDate(new Date(refundData.processedAt))
                      : "-",
                  },
                ].map((step, index) => (
                  <StepperItem key={step.status} step={step} index={index} />
                ))}
              </StepperContainer>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold text-neutral-900">
              Rekening Pengembalian Dana
            </h2>

            <div className="grid grid-cols-[131px_1fr] gap-x-8 gap-y-5 text-xs font-medium leading-[1.2]">
              <span className="text-neutral-600">Nama Bank</span>
              <div className="flex items-center gap-2">
                {/* Optionally map bankName to icon if available */}
                <IconComponent
                  src={
                    PaymentMethodIconFromTitle[bank?.bankName] ||
                    "/icons/bank.svg"
                  }
                  width={16}
                  height={16}
                  alt={bank?.bankName || "Bank Logo"}
                />
                <span className="text-neutral-900">
                  {bank?.bankName || "-"}
                </span>
              </div>

              <span className="text-neutral-600">Nomor Rekening</span>
              <span className="text-neutral-900">
                {bank?.accountNumber || "-"}
              </span>

              <span className="text-neutral-600">Nama Pemilik Rekening</span>
              <span className="text-neutral-900">
                {bank?.accountHolderName || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Refund Details Sidebar */}
        <div className="flex max-h-[453px] w-[338px] flex-col gap-4">
          {/* Refund Breakdown */}
          <CardPayment.Root className="flex w-full flex-1 flex-col">
            <CardPayment.Header>Detail Pengembalian Dana</CardPayment.Header>

            <CardPayment.Body>
              <CardPayment.Section title="Biaya Pesan Jasa Angkut">
                <CardPayment.LineItem
                  label="Nominal Seluruh Pesan Jasa Angkut"
                  value={breakdown ? idrFormat(breakdown.originalAmount) : "-"}
                />
              </CardPayment.Section>

              <CardPayment.Section title="Biaya Waktu Tunggu">
                <div className="flex flex-col gap-0.5">
                  <CardPayment.LineItem
                    label="Nominal Waktu Tunggu (1 Driver)"
                    value={
                      breakdown ? idrFormat(breakdown.waitingTimeFee) : "-"
                    }
                  />
                  <ModalDetailWaktuTunggu drivers={waitingTimeDrivers} />
                </div>
              </CardPayment.Section>

              <CardPayment.Section title="Biaya Administrasi">
                <CardPayment.LineItem
                  label="Admin Pembatalan"
                  value={
                    breakdown ? `-${idrFormat(breakdown.penaltyAmount)}` : "-"
                  }
                  variant="danger"
                />
              </CardPayment.Section>

              <CardPayment.Section title="Biaya Lainnya">
                <CardPayment.LineItem
                  label="Admin Refund"
                  value={breakdown ? `-${idrFormat(breakdown.adminFee)}` : "-"}
                  variant="danger"
                />
              </CardPayment.Section>
            </CardPayment.Body>

            <CardPayment.Footer className="mt-auto">
              <CardPayment.Total
                label="Total Pengembalian Dana"
                value={breakdown ? idrFormat(breakdown.totalRefundAmount) : "-"}
                labelClassName="max-w-[148px]"
              />
            </CardPayment.Footer>
          </CardPayment.Root>

          {/* Download Button */}
          <Button
            iconLeft="/icons/download16.svg"
            variant="muatparts-primary-secondary"
            className="h-8 w-full"
            onClick={() => {}}
            appearance={{
              iconClassname: "text-primary-700",
            }}
            type="button"
          >
            <span className="pt-1">Unduh Bukti Pengembalian Dana</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetailRefundPesananWeb;
