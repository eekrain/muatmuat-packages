"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { useGetShipperById } from "@/services/CS/shippers/getShipperById";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import PageTitle from "@/components/PageTitle/PageTitle";

import HubungiModal from "../../../components/HubungiModal";

const DetailShipperPage = () => {
  const params = useParams();
  const { data } = useGetShipperById(params.id);
  const breadcrumbItems = [
    { name: "Daftar User", href: "#" },
    { name: "Shipper", href: "#" },
    { name: "Detail Shipper" },
  ];

  const shipperDetails = [
    { label: "Nama", value: data?.Data.fullName || "-" },
    { label: "Nama Perusahaan", value: data?.Data.companyName || "-" },
    { label: "Alamat Perusahaan", value: data?.Data.companyAddress || "-" },
    { label: "No. Whatsapp", value: data?.Data.whatsappNumber || "-" },
    { label: "Email", value: data?.Data.email || "-" },
    {
      label: "Pesanan Aktif",
      value: (
        <div className="flex items-center gap-3">
          <span>
            {data?.Data.activeOrders > 0
              ? `${data?.Data.activeOrders} Pesanan`
              : "Tidak ada pesanan"}{" "}
          </span>
          <Link
            href={`/daftar-pesanan/pesanan-aktif?shipper=${params.id}`}
            className="text-xs font-medium text-primary-700 hover:underline"
          >
            Lihat Pesanan
          </Link>
        </div>
      ),
    },
    {
      label: "Riwayat Pesanan",
      value: (
        <div className="flex items-center gap-3">
          <span>
            {data?.Data.completedOrders > 0
              ? `${data?.Data.completedOrders} Pesanan`
              : "Tidak ada pesanan"}{" "}
          </span>
          <Link
            href={`/daftar-pesanan/riwayat?shipper=${params.id}`}
            className="text-xs font-medium text-primary-700 hover:underline"
          >
            Lihat Pesanan
          </Link>
        </div>
      ),
    },
  ];

  const [isHubungiModalOpen, setIsHubungiModalOpen] = useState(false);

  return (
    <main className="flex flex-col gap-4 p-6 lg:px-10">
      <BreadCrumb data={breadcrumbItems} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* <Link href="#">
            <IconComponent
              name="arrow-left"
              width={24}
              height={24}
              className="text-primary-700"
              src="/icons/arrow-left.svg"
            />
          </Link> */}
          <PageTitle>Detail Shipper</PageTitle>
        </div>
        <Button
          onClick={() => setIsHubungiModalOpen(true)}
          variant="muattrans-primary"
          className="h-8 min-w-[112px] rounded-full !px-6 !py-2"
        >
          Hubungi
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl bg-white pt-6 shadow-muat">
        <h2 className="mb-4 px-6 text-lg font-semibold text-neutral-900">
          Data Umum
        </h2>
        <div className="flex flex-col">
          {shipperDetails.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-start gap-8 px-6 py-4 ${
                index % 2 === 0 ? "bg-neutral-100" : "bg-white"
              }`}
            >
              <p className="w-[178px] flex-shrink-0 text-xs font-medium text-neutral-600">
                {item.label}
              </p>
              <div className="flex-1 text-xs font-medium text-neutral-900">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
      <HubungiModal
        isOpen={isHubungiModalOpen}
        onClose={() => setIsHubungiModalOpen(false)}
        contacts={{
          pics: data?.Data.contacts || [],
          emergencyContact: data?.Data.emergency,
          companyContact: data?.Data.picPhone,
        }}
      />
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </main>
  );
};

export default DetailShipperPage;
