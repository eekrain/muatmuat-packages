"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import PageTitle from "@/components/PageTitle/PageTitle";

import TransporterDetailContainer from "./containers/TransporterDetailContainer";

export default function TransporterDetailPage() {
  const params = useParams();
  const transporterId = params.id;

  const [aktifState, setAktifState] = useState(false);

  const breadcrumbData = [
    { name: "Daftar User", href: "/user" },
    { name: "Transporter", href: "/user" },
    { name: "Detail Transporter" },
  ];

  return (
    <div className="mx-auto my-6 max-h-screen w-full max-w-[1280px] space-y-4 px-6">
      <BreadCrumb data={breadcrumbData} />
      <div className="flex items-center justify-between">
        <PageTitle href="/user">Detail Transporter</PageTitle>
        <Button
          onClick={() => setAktifState(!aktifState)}
          variant={
            aktifState
              ? "muattrans-primary-secondary"
              : "muattrans-error-secondary"
          }
        >
          {aktifState ? "Aktifkan" : "Non Aktifkan"}
        </Button>
      </div>
      <TransporterDetailContainer transporterId={transporterId} />
    </div>
  );
}
