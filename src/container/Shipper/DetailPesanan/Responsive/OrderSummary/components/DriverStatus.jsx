import { AvatarDriver } from "@/components/Avatar/AvatarDriver";
import { BadgeStatusPesanan } from "@/components/Badge/BadgeStatusPesanan";
import Button from "@/components/Button/Button";
import {
  StepperContainer,
  StepperItemResponsive,
} from "@/components/Stepper/Stepper";

export const DriverStatus = ({ status = "Proses Muat" }) => {
  const statusClasses = {
    Selesai: "bg-green-500",
    "Dalam Proses": "bg-yellow-500",
    Dibatalkan: "bg-red-500",
    "Proses Muat": "bg-blue-500",
  };

  const list = [
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
    // {
    //   label: "Dokumen Disiapkan",
    //   status: "PREPARE_DOCUMENT",
    //   icon: "/icons/stepper/stepper-document-preparing.svg",
    // },
    {
      label: "Pengiriman Dokumen",
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
            Proses Muat
          </BadgeStatusPesanan>
        )}
        {true && (
          <BadgeStatusPesanan
            variant="primary"
            className="w-full text-sm font-semibold"
          >
            Dokumen Sedang Disiapkan
          </BadgeStatusPesanan>
        )}
        {false && (
          <BadgeStatusPesanan
            variant="primary"
            className="w-full text-sm font-semibold"
          >
            Proses Muat
          </BadgeStatusPesanan>
        )}
        <StepperContainer activeIndex={3} totalStep={list.length}>
          {list.map((step, index) => (
            <StepperItemResponsive key={step.label} step={step} index={index} />
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
  );
};
