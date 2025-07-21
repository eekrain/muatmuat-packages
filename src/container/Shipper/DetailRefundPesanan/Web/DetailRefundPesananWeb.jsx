"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

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

const DetailRefundPesananWeb = () => {
  const params = useParams();
  const [isDriverExpanded, setIsDriverExpanded] = useState(false);

  const breadcrumbData = [
    { name: "Daftar Pesanan", href: "/daftarpesanan" },
    {
      name: "Detail Pesanan",
      href: `/daftarpesanan/detailpesanan/${params.orderId}`,
    },
    { name: "Detail Refund" },
  ];
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
              <StepperContainer activeIndex={1} totalStep={2}>
                {[
                  {
                    label: "Pengembalian Dana Diproses",
                    icon: "/icons/stepper/stepper-check-circle.svg",
                    status: "PROCESS_REFUND",
                    subtitle: formatDate(new Date()),
                  },
                  {
                    label: "Dana Terkirim",
                    icon: "/icons/stepper/stepper-check-circle.svg",
                    status: "DONE_REFUND",
                    subtitle: formatDate(new Date()),
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

            <div className="leading-[1.2] grid grid-cols-[131px_1fr] gap-x-8 gap-y-5 text-xs font-medium">
              <span className="text-neutral-600">Nama Bank</span>
              <div className="flex items-center gap-2">
                <IconComponent
                  src={PaymentMethodIconFromTitle["BCA Virtual Account"]}
                  width={16}
                  height={16}
                />
                <span className="text-neutral-900">BCA Virtual Account</span>
              </div>

              <span className="text-neutral-600">Nomor Rekening</span>
              <span className="text-neutral-900">8659856847</span>

              <span className="text-neutral-600">Nama Pemilik Rekening</span>
              <span className="text-neutral-900">NOLA RISKA APRILIA PUTRI</span>
            </div>
          </div>
        </div>

        {/* Refund Details Sidebar */}
        <div className="flex max-h-[453px] w-[338px] flex-col gap-4">
          {/* Refund Breakdown */}
          <CardPayment.Root className="w-full flex-1">
            <CardPayment.Header>Detail Pengembalian Dana</CardPayment.Header>

            <CardPayment.Content noScroll>
              {/* Transportation Cost */}
              <CardPayment.ContainerItem title="Biaya Pesan Jasa Angkut">
                <CardPayment.Item
                  label="Nominal Seluruh Pesan Jasa Angkut"
                  value="Rp1.394.410"
                />
              </CardPayment.ContainerItem>

              {/* Waiting Time Cost */}
              <CardPayment.ContainerItem title="Biaya Waktu Tunggu">
                <div className="flex flex-col gap-0.5">
                  <CardPayment.Item
                    label="Nominal Waktu Tunggu (1 Driver)"
                    value={idrFormat(100000)}
                  />
                  <ModalDetailWaktuTunggu />
                </div>
              </CardPayment.ContainerItem>

              {/* Administration Cost */}
              <CardPayment.ContainerItem title="Biaya Administrasi">
                <CardPayment.Item
                  label="Admin Pembatalan"
                  value="-Rp100.000"
                  appearance={{
                    valueClassName: "text-red-500",
                  }}
                />
              </CardPayment.ContainerItem>

              {/* Other Costs */}
              <CardPayment.ContainerItem title="Biaya Lainnya">
                <CardPayment.Item
                  label="Admin Refund"
                  value="-Rp10.000"
                  appearance={{
                    valueClassName: "text-red-500",
                  }}
                />
              </CardPayment.ContainerItem>
            </CardPayment.Content>

            <CardPayment.FooterTotal
              label="Total Pengembalian Dana"
              value="Rp1.184.410"
              appearance={{
                labelClassName: "max-w-[148px]",
              }}
            />
          </CardPayment.Root>

          {/* Download Button */}
          <Button
            iconLeft="/icons/download16.svg"
            variant="muatparts-primary-secondary"
            className="h-8 w-full"
            onClick={() => {}}
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
