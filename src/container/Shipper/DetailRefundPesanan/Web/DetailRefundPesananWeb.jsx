"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
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

            <div className="grid grid-cols-[131px_1fr] gap-x-8 gap-y-5 text-xs font-medium leading-[1.2]">
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
        <div className="w-80 space-y-4">
          {/* Refund Breakdown */}
          <div className="overflow-hidden rounded-xl bg-white font-medium shadow-sm">
            <div className="px-5 py-6">
              <h3 className="mb-6 text-base font-bold text-neutral-900">
                Detail Pengembalian Dana
              </h3>

              <div className="space-y-6">
                {/* Transportation Cost */}
                <div>
                  <h4 className="mb-3 h-[10px] text-sm font-semibold text-neutral-900">
                    Biaya Pesan Jasa Angkut
                  </h4>
                  <div className="flex items-start justify-between gap-2">
                    <span className="w-[190px] text-xs text-neutral-600">
                      Nominal Seluruh Pesan Jasa Angkut
                    </span>
                    <span className="pt-[2px] text-xs text-neutral-900">
                      Rp1.394.410
                    </span>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex h-[8px] w-full items-start justify-between">
                    <span className="w-[190px] text-[12px] font-medium leading-[14.4px] text-neutral-600">
                      Nominal Waktu Tunggu (1 Driver)
                    </span>
                    <span className="text-right text-[12px] font-medium leading-[14.4px] text-neutral-900">
                      {idrFormat(100000)}
                    </span>
                  </div>

                  <ModalDetailWaktuTunggu />
                </div>

                {/* Administration Cost */}
                <div>
                  <h4 className="mb-3 h-[10px] text-sm font-semibold text-neutral-900">
                    Biaya Administrasi
                  </h4>
                  <div className="flex items-start justify-between gap-2">
                    <span className="w-[190px] text-xs text-neutral-600">
                      Admin Pembatalan
                    </span>
                    <span className="text-xs text-red-500">-Rp100.000</span>
                  </div>
                </div>

                {/* Other Costs */}
                <div>
                  <h4 className="mb-3 h-[10px] text-sm font-semibold text-neutral-900">
                    Biaya Lainnya
                  </h4>
                  <div className="flex items-start justify-between gap-2">
                    <span className="w-[190px] text-xs text-neutral-600">
                      Admin Refund
                    </span>
                    <span className="text-xs text-red-500">-Rp10.000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="px-5 py-6 shadow-[0px_4px_11px_0px_#41414140]">
              <div className="flex items-start justify-between">
                <span className="text-base font-bold text-neutral-900">
                  Total Pengembalian Dana
                </span>
                <span className="text-base font-bold text-neutral-900">
                  Rp1.184.410
                </span>
              </div>
            </div>
          </div>

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
