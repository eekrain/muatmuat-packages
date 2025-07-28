import { useState } from "react";

import { isDev } from "@/lib/constants/is-dev";

import { DriverStatusCard } from "./DriverStatusCard";
import { KeteranganStatusPesanan } from "./KeteranganStatusPesanan";

export const OrderStatusSummary = ({ dataStatusPesanan }) => {
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
      <KeteranganStatusPesanan legendStatus={dataStatusPesanan?.legendStatus} />

      {dataStatusPesanan?.driverStatus.map((driver) => (
        <DriverStatusCard
          key={driver.driverId}
          driver={driver}
          orderId={dataStatusPesanan?.orderId}
          orderStatus={dataStatusPesanan?.orderStatus}
        />
      ))}

      {isDev && (
        <pre>{JSON.stringify(dataStatusPesanan?.legendStatus, null, 2)}</pre>
      )}
    </div>
  );
};
