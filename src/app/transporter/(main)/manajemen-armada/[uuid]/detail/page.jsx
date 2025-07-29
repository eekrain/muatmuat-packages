"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

import { Alert } from "@/components/Alert/Alert";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import Card, { CardContent } from "@/components/Card/Card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import IconComponent from "@/components/IconComponent/IconComponent";
// Import both LightboxProvider and LightboxPreview
import {
  LightboxPreview,
  LightboxProvider,
} from "@/components/Lightbox/Lightbox";
import PageTitle from "@/components/PageTitle/PageTitle";
import { cn } from "@/lib/utils";
import { useGetVehicleDetail } from "@/services/Transporter/manajemen-armada/getVehiclesDetail";

const DetailRow = ({
  label,
  children,
  isLink = false,
  hasBorderBottom = false,
}) => (
  <div
    className={cn(
      "flex h-full w-full flex-row items-center justify-between pb-4 pt-4 first:pt-0 last:pb-0",
      hasBorderBottom && "border-b-[0.5px] border-neutral-600"
    )}
  >
    <p className="text-xs font-medium text-neutral-700">{label}</p>
    <div className={cn("text-sm font-semibold", isLink && "text-success-400")}>
      {children}
    </div>
  </div>
);

const VehiclesPhotoTranslate = {
  FRONT: "Depan",
  BACK: "Belakang",
  LEFT: "Kiri",
  RIGHT: "Kanan",
};

const Page = () => {
  const { uuid } = useParams();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const { data, error, isLoading } = useGetVehicleDetail(uuid);
  console.log(data);

  // Dynamic breadcrumb based on "from" parameter
  const getBreadcrumbData = () => {
    const base = [{ name: "Manajemen Armada", href: "/manajemen-armada" }];

    // Add intermediate breadcrumb based on where user came from
    if (from === "active") {
      base.push({
        name: "Armada Aktif",
        href: "/manajemen-armada?tab=active",
      });
    } else if (from === "inactive") {
      base.push({
        name: "Armada Nonaktif",
        href: "/manajemen-armada?tab=inactive",
      });
    } else if (from === "process") {
      base.push({
        name: "Proses Pendaftaran",
        href: "/manajemen-armada?tab=process",
      });
    } else if (from === "archive") {
      base.push({
        name: "Arsip",
        href: "/manajemen-armada?tab=archive",
      });
    } else if (from === "expired") {
      base.push({
        name: "Perlu Pembaruan STNK/KIR",
        href: "/manajemen-armada/expired",
      });
    }

    // Add current page
    base.push({ name: "Detail Armada" });

    return base;
  };

  const breadCrumbData = getBreadcrumbData();

  if (isLoading) return <div>Loading vehicle details...</div>;
  if (error) return <div>Failed to load data. Please try again.</div>;

  const vehicle = data?.vehicle;
  if (!vehicle) return <div>No vehicle data found.</div>;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Create an array of image URLs to pass to the LightboxProvider
  const vehicleImages = vehicle.photos.map((photo) => photo.photoUrl);

  const documentRows = [];
  documentRows.push(
    <DetailRow key="nomor-rangka" label="Nomor Rangka">
      {vehicle.chassisNumber}
    </DetailRow>
  );
  documentRows.push(
    <DetailRow key="stnk-expiry" label="Masa Berlaku STNK">
      {formatDate(vehicle.stnkExpiryDate)}
    </DetailRow>
  );

  const stnkDoc = vehicle.documents.find((doc) => doc.documentType === "STNK");
  if (stnkDoc) {
    documentRows.push(
      <DetailRow key="stnk-doc" label="Foto STNK" isLink>
        <Link
          href={stnkDoc.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {stnkDoc.documentName}
        </Link>
      </DetailRow>
    );
  }

  const pajakDoc = vehicle.documents.find(
    (doc) => doc.documentType === "VEHICLE_TAX"
  );
  if (pajakDoc) {
    documentRows.push(
      <DetailRow key="pajak-doc" label="Foto Pajak Kendaraan" isLink>
        <Link
          href={pajakDoc.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {pajakDoc.documentName}
        </Link>
      </DetailRow>
    );
  }

  documentRows.push(
    <DetailRow key="kir-number" label="KIR Kendaraan">
      {vehicle.kirNumber}
    </DetailRow>
  );
  documentRows.push(
    <DetailRow key="kir-expiry" label="Masa Berlaku KIR">
      {formatDate(vehicle.kirExpiryDate)}
    </DetailRow>
  );

  const kirDoc = vehicle.documents.find((doc) => doc.documentType === "KIR");
  if (kirDoc) {
    documentRows.push(
      <DetailRow key="kir-doc" label="Foto Buku KIR" isLink>
        <Link
          href={kirDoc.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {kirDoc.documentName}
        </Link>
      </DetailRow>
    );
  }

  return (
    // 1. Wrap your component with LightboxProvider
    <LightboxProvider images={vehicleImages} title="Foto Armada">
      <div className="flex flex-col gap-4 pb-11 pt-6">
        <BreadCrumb data={breadCrumbData} />
        <div className="flex items-center justify-between">
          <PageTitle className="mb-0">Detail Armada</PageTitle>
          <Link href={`/manajemen-armada/${uuid}/ubah`}>
            <Button className="h-[32px] w-[112px]">Ubah</Button>
          </Link>
        </div>

        <Alert size="big" variant="error">
          <div className="flex flex-col gap-1">
            <h1 className="text-xs font-bold">
              Verifikasi Data Driver Anda Ditolak!
            </h1>
            <p className="text-xs font-medium">
              Alasan verifikasi ditolak: {vehicle.rejectReason}
            </p>
          </div>
        </Alert>

        <Card className="shadow-muat rounded-2xl border-none">
          <CardContent className="space-y-5 !p-6">
            <div>
              <DetailRow hasBorderBottom={false} label="No. Polisi Kendaraan">
                {vehicle.licensePlate}
              </DetailRow>
              <DetailRow hasBorderBottom={false} label="Jenis Truk">
                {vehicle.truckType.name}
              </DetailRow>
              <DetailRow hasBorderBottom={false} label="Jenis Carrier">
                {vehicle.carrierType.name}
              </DetailRow>
              <DetailRow hasBorderBottom={false} label="Merek Kendaraan">
                {vehicle.vehicleBrand.name}
              </DetailRow>
              <DetailRow hasBorderBottom={false} label="Tipe Kendaraan">
                {vehicle.vehicleType.name}
              </DetailRow>
              <DetailRow
                hasBorderBottom={false}
                label="Tahun Registrasi Kendaraan"
              >
                {vehicle.registrationYear}
              </DetailRow>
              <DetailRow
                hasBorderBottom={false}
                label="Dimensi Carrier"
              >{`${vehicle.carrierLength}x${vehicle.carrierWidth}x${vehicle.carrierHeight} m`}</DetailRow>
              <DetailRow
                hasBorderBottom={false}
                label="Dimensi Estimasi Tanggal Pemasangan GPS*"
              >{`${formatDate(
                vehicle.gpsInstallationEstimateStartDate
              )} s/d ${formatDate(
                vehicle.gpsInstallationEstimateEndDate
              )}`}</DetailRow>
            </div>

            {/* Vehicle Photos Section */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="rounded-t-md bg-primary-50 px-6 hover:no-underline">
                <h3 className="font-semibold">Foto Armada</h3>
                <IconComponent
                  src="/icons/chevron-down.svg"
                  className="h-5 w-5 transition-transform duration-300"
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4">
                  {vehicle.photos.map((photo, index, array) => (
                    <DetailRow
                      key={photo.id}
                      label={`Foto ${
                        VehiclesPhotoTranslate[photo.photoType] ||
                        photo.photoType
                      } Kendaraan`}
                      hasBorderBottom={index < array.length - 1}
                    >
                      {/* 2. Replace the old image with LightboxPreview */}
                      <LightboxPreview
                        image={photo.photoUrl}
                        alt={photo.photoName}
                        index={index}
                      />
                    </DetailRow>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Vehicle Documents Section */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="rounded-t-md bg-primary-50 px-6 hover:no-underline">
                <h3 className="font-semibold">Dokumen Armada</h3>
                <IconComponent
                  src="/icons/chevron-down.svg"
                  className="h-5 w-5 transition-transform duration-300"
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4">
                  {documentRows.map((row, index) =>
                    React.cloneElement(row, {
                      hasBorderBottom: index < documentRows.length - 1,
                    })
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      </div>
    </LightboxProvider>
  );
};

export default Page;
