"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { Alert } from "@/components/Badge/Alert";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import PageTitle from "@/components/PageTitle/PageTitle";
import { StepperContainer, StepperItem } from "@/components/Stepper/Stepper";
import { PaymentMethodIconFromTitle } from "@/lib/constants/detailpesanan/payment.enum";
import { cn } from "@/lib/utils";
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

                  <Modal>
                    <ModalTrigger>
                      <button className="text-[12px] font-medium leading-[14.4px] text-primary-700">
                        Lihat Detail Waktu Tunggu
                      </button>
                    </ModalTrigger>
                    <ModalContent className="flex w-[578px] flex-col gap-y-4 p-6">
                      {/* Header */}
                      <h2 className="text-center text-[16px] font-bold leading-[19.2px] text-neutral-900">
                        Detail Waktu Tunggu
                      </h2>

                      <Alert variant="secondary" className="my-3 font-semibold">
                        Free untuk 12 jam awal dan dikenakan biaya waktu tunggu
                        lebih dari 12 jam
                      </Alert>

                      {/* Driver Section */}
                      <div className="space-y-6">
                        <div>
                          {/* Driver Header */}
                          <div
                            className={cn(
                              "flex cursor-pointer items-center justify-between"
                            )}
                            onClick={() =>
                              setIsDriverExpanded(!isDriverExpanded)
                            }
                          >
                            <h3 className="text-sm font-semibold text-neutral-900">
                              Driver : Daffa Toldo
                            </h3>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 text-neutral-500 transition-transform duration-200",
                                isDriverExpanded && "rotate-180"
                              )}
                            />
                          </div>

                          {/* Expandable Content */}
                          <div
                            className={cn(
                              "overflow-hidden transition-all duration-300 ease-in-out",
                              isDriverExpanded
                                ? "mt-3 max-h-[200px] opacity-100"
                                : "mt-0 max-h-0 opacity-0",
                              "text-xs font-medium leading-[1.2]"
                            )}
                          >
                            {/* Loading Location Details */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-neutral-900">
                                  Lokasi Muat 1 : 1 Jam 59 Menit
                                </span>
                                <span className="text-neutral-900">
                                  Rp100.000
                                </span>
                              </div>
                              <div className="text-neutral-600">
                                22 Nov 2024 15:00 WIB s/d 22 Nov 2024 16:59 WIB
                              </div>
                            </div>
                          </div>
                        </div>

                        <hr className="border-neutral-400" />
                        <div className="flex items-center justify-between text-base font-bold text-neutral-900">
                          <span className="">Total</span>
                          <span className="">Rp100.000</span>
                        </div>
                      </div>
                    </ModalContent>
                  </Modal>
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
