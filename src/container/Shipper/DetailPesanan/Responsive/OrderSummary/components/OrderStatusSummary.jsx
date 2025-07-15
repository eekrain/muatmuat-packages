import { useState } from "react";

import { ChevronUp } from "lucide-react";

import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import {
  StepperContainer,
  StepperItemResponsive,
} from "@/components/Stepper/Stepper";
import { cn } from "@/lib/utils";

export const OrderStatusSummary = () => {
  const [isOpen, setIsOpen] = useState(true);

  const statusList = [
    {
      label: "Pesanan Terkonfirmasi",
      status: "CONFIRMED",
      icon: "/icons/stepper/stepper-scheduled.svg",
    },
    {
      label: "Proses Muat",
      status: "LOADING",
      icon: "/icons/stepper/stepper-box.svg",
    },
    {
      label: "Proses Bongkar",
      status: "UNLOADING",
      icon: "/icons/stepper/stepper-box-opened.svg",
    },
    {
      label: "Menunggu Pelunasan",
      status: "WAITING_REPAYMENT",
      icon: "/icons/stepper/stepper-repayment.svg",
    },
    {
      label: "Dokumen Sedang Disiapkan",
      status: "PREPARE_DOCUMENT",
      icon: "/icons/stepper/stepper-document-preparing.svg",
    },
    {
      label: "Proses Pengiriman Dokumen",
      status: "DOCUMENT_DELIVERY",
      icon: "/icons/stepper/stepper-document-sending.svg",
    },
    {
      label: "Selesai",
      status: "COMPLETED",
      icon: "/icons/stepper/stepper-completed.svg",
    },
  ];

  return (
    <div className="space-y-2">
      {/* Order Legends Section */}
      <div className="bg-white px-4 py-5">
        {/* Collapsible Header */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-sm p-0 outline-none"
          aria-expanded={isOpen}
          aria-controls="collapsible-legends"
        >
          <h3 className="font-bold text-neutral-900">
            Keterangan Status Pesanan
          </h3>
          <div className="flex-shrink-0">
            <ChevronUp
              className={cn(
                "h-4 w-4 text-gray-600 transition-transform duration-300 ease-in-out",
                isOpen ? "rotate-0" : "rotate-180"
              )}
            />
          </div>
        </button>

        {/* Collapsible Content */}
        <div
          id="collapsible-legends"
          className={cn(
            "flex flex-col gap-3 overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-[1000px] pt-3 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          {statusList.map((item) => (
            <div key={item.status} className="flex items-center gap-2">
              <div className="relative flex h-6 w-6 items-center justify-center rounded-full border border-[#FFC217] bg-[#FFC217] transition-all duration-300">
                <IconComponent
                  src={item.icon}
                  width={16}
                  height={16}
                  className="text-muat-trans-primary-900"
                />
              </div>
              <span className="text-xs font-semibold text-neutral-900">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Driver Status Section */}
      <div className="box-border flex w-full flex-col items-center justify-center bg-white p-5">
        <div className="flex w-full flex-col items-start gap-4">
          <AvatarDriver
            name="Noel Gallagher"
            image="https://picsum.photos/50"
            licensePlate="B 123456"
          />

          {/* Status Badge */}
          {false && (
            <BadgeStatusPesanan
              variant="primary"
              className="w-full text-sm font-semibold"
            >
              Dokumen Sedang Disiapkan
            </BadgeStatusPesanan>
          )}
          {true && (
            <BadgeStatusPesanan
              variant="warning"
              className="w-full text-sm font-semibold"
            >
              Menunggu Pelunasan
            </BadgeStatusPesanan>
          )}

          <StepperContainer activeIndex={3} totalStep={statusList.length}>
            {statusList.map((step, index) => (
              <StepperItemResponsive
                key={step.label}
                step={step}
                index={index}
              />
            ))}
          </StepperContainer>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex w-full flex-row items-center justify-center gap-3">
          <Button
            variant="muatparts-primary-secondary"
            className="h-7 w-full text-xs font-semibold"
          >
            Detail Status Driver
          </Button>
        </div>
      </div>
    </div>
  );
};
