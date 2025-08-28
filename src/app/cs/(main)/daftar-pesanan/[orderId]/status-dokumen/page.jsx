"use client";

import { useParams } from "next/navigation";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";

import { TabStatusDokumen } from "@/container/CS/DetailPesanan/TabStatusDokumen/TabStatusDokumen";

const StatusDokumenPage = () => {
  const params = useParams();

  const breadcrumbData = [
    { name: "Dashboard", url: "/cs/dashboard" },
    { name: "Daftar Pesanan", url: "/cs/daftar-pesanan" },
    { name: "Status Dokumen", url: "#", active: true },
  ];

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-y-6 py-6">
      <BreadCrumb data={breadcrumbData} maxWidth={111} />

      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">
            Status Dokumen Pesanan
          </h1>
          <div className="text-sm text-neutral-600">
            Order ID: {params.orderId}
          </div>
        </div>

        <TabStatusDokumen orderId={params.orderId} />
      </div>
    </div>
  );
};

export default StatusDokumenPage;
