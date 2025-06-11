"use client";

import Card, { CardContent } from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import Stepper from "@/components/Stepper/Stepper";
import { TimelineContainer, TimelineItem } from "@/components/Timeline";
import { cn } from "@/lib/utils";

// Mock data untuk demo
const mockData = {
  kodeTransaksi: "INV/MT25AA001",
  statusBadge: {
    label: "Pesanan Terkonfirmasi",
    variant: "primary",
  },
  currentStep: 0,
  timelineSteps: [
    {
      label: "Pesanan Terkonfirmasi",
      icon: "/icons/check.svg",
      completed: true,
    },
    {
      label: "Proses Muat",
      icon: "/icons/truck.svg",
      completed: false,
    },
    {
      label: "Proses Bongkar",
      icon: "/icons/truck.svg",
      completed: false,
    },
    {
      label: "Dokumen Sedang Disiapkan",
      icon: "/icons/document.svg",
      completed: false,
    },
    {
      label: "Proses Pengiriman Dokumen",
      icon: "/icons/send.svg",
      completed: false,
    },
    {
      label: "Selesai",
      icon: "/icons/check-circle.svg",
      completed: false,
    },
  ],
};

// Badge Component
const StatusBadge = ({ label, variant = "primary" }) => {
  const variants = {
    primary: "bg-blue-50 text-blue-700",
    warning: "bg-yellow-50 text-yellow-700",
    success: "bg-green-50 text-green-700",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md px-2 py-1",
        "text-[12px] font-semibold leading-[14.4px]",
        variants[variant]
      )}
    >
      {label}
    </div>
  );
};

// Custom Timeline Content Component
const TimelineStepContent = ({ step, isActive }) => {
  return (
    <div className="flex min-w-[100px] flex-col items-center gap-2">
      {/* Icon Container - menggunakan styling yang konsisten dengan timeline-field */}
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300",
          isActive
            ? "border-[#FFC217] bg-[#FFC217]"
            : "border-neutral-400 bg-neutral-200"
        )}
      >
        <IconComponent
          src={step.icon}
          width={16}
          height={16}
          className={cn(isActive ? "text-[#461B02]" : "text-neutral-600")}
        />
      </div>

      {/* Label */}
      <span className="px-1 text-center text-[12px] font-semibold leading-[14.4px] text-neutral-900">
        {step.label}
      </span>
    </div>
  );
};

// Timeline Component menggunakan komponen Timeline yang tersedia
const StatusTimeline = ({ steps, currentStep }) => {
  return (
    <div className="w-full rounded-xl border border-neutral-400 bg-white p-5">
      {/* Horizontal scroll container untuk mobile */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <TimelineContainer className="relative flex flex-row items-start gap-4">
            {/* Background line untuk menghubungkan steps */}
            <div className="absolute left-8 right-8 top-4 z-0 h-0.5 bg-neutral-400"></div>

            {/* Active progress line */}
            {currentStep >= 0 && (
              <div
                className="absolute left-8 top-4 z-10 h-0.5 bg-[#FFC217] transition-all duration-500"
                style={{
                  width:
                    currentStep === 0
                      ? "8%"
                      : `${(currentStep / (steps.length - 1)) * 85}%`,
                  maxWidth: "calc(100% - 64px)",
                }}
              ></div>
            )}

            {steps.map((step, index) => (
              <TimelineItem
                key={index}
                variant="bullet"
                totalLength={steps.length}
                index={index}
                activeIndex={currentStep}
                className="relative z-20 flex min-w-[100px] flex-col items-center gap-2"
              >
                <TimelineStepContent
                  step={step}
                  isActive={index <= currentStep}
                />
              </TimelineItem>
            ))}
          </TimelineContainer>
        </div>
      </div>
    </div>
  );
};

// Header Component
const StatusPesananHeader = ({ kodeTransaksi, statusBadge }) => {
  return (
    <div className="flex w-full items-center gap-x-3">
      {/* Kode Pesanan */}
      <div className="flex w-[220px] flex-col gap-y-2">
        <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
          Kode Pesanan
        </span>
        <span className="text-[14px] font-bold leading-[16.8px] text-neutral-900">
          {kodeTransaksi}
        </span>
      </div>

      {/* Status Pesanan */}
      <div className="flex flex-col gap-y-2">
        <span className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
          Status Pesanan
        </span>
        <div className="flex flex-row flex-wrap items-start gap-2">
          <StatusBadge
            label={statusBadge.label}
            variant={statusBadge.variant}
          />
        </div>
      </div>
    </div>
  );
};

// Main Component
const StatusPesanan = ({
  kodeTransaksi = mockData.kodeTransaksi,
  statusBadge = mockData.statusBadge,
  currentStep = mockData.currentStep,
  timelineSteps = mockData.timelineSteps,
}) => {
  return (
    <Card className="w-full rounded-xl border-none">
      <CardContent className="px-9 py-6">
        <div className="flex flex-col items-end gap-6">
          {/* Header Section */}
          <StatusPesananHeader
            kodeTransaksi={kodeTransaksi}
            statusBadge={statusBadge}
          />

          {/* Timeline Section */}
          <div className="w-full rounded-xl border border-neutral-400 px-4 py-5">
            <Stepper
              steps={[
                {
                  label: "Armada Dijadwalkan",
                  icon: "/icons/stepper-scheduled.svg",
                },
                {
                  label: "Proses Muat",
                  icon: "/icons/stepper-box.svg",
                },
                {
                  label: "Proses Bongkar",
                  icon: "/icons/stepper-box-opened.svg",
                },
                {
                  label: "Dokumen Sedang Disiapkan",
                  icon: "/icons/stepper-document-preparing.svg",
                },
                {
                  label: "Proses Pengiriman Dokumen",
                  icon: "/icons/stepper-document-sending.svg",
                },
                {
                  label: "Selesai",
                  icon: "/icons/stepper-done.svg",
                },
              ]}
              currentStep={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusPesanan;
