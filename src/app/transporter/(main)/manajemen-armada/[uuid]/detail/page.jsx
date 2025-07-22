"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Card, { CardContent } from "@/components/Card/Card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import IconComponent from "@/components/IconComponent/IconComponent";
import PageTitle from "@/components/PageTitle/PageTitle";
import { cn } from "@/lib/utils";
import { useGetVehicleDetail } from "@/services/Transporter/manajemen-armada/getVehiclesDetail";

// This component remains unchanged and works as intended.
const DetailRow = ({
  label,
  children,
  isLink = false,
  hasBorderBottom = false,
}) => (
  <div
    className={cn(
      "flex h-full w-full flex-row justify-between pb-4 pt-4 first:pt-0 last:pb-0",
      hasBorderBottom && "border-b-[0.5px] border-neutral-600"
    )}
  >
    <p className="text-xs font-medium text-neutral-700">{label}</p>
    <div className={cn("text-sm font-semibold", isLink && "text-success-400")}>
      {children}
    </div>
  </div>
);

const Page = () => {
  const { uuid } = useParams();
  const { data, error, isLoading } = useGetVehicleDetail(uuid);

  const breadCrumbData = [
    { name: "Manajemen Armada", href: "/manajemen-armada" },
    { name: "Armada Aktif", href: "/active-armada?tab=active" },
    { name: "Detail Armada" },
  ];

  // Loading and error states
  if (isLoading) return <div>Loading vehicle details...</div>;
  if (error) return <div>Failed to load data. Please try again.</div>;

  const vehicle = data?.vehicle;
  if (!vehicle) return <div>No vehicle data found.</div>;

  // Helper function to format dates
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

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
    <div className="flex flex-col gap-2 py-6">
      <BreadCrumb data={breadCrumbData} />
      <PageTitle>Detail Armada</PageTitle>

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
            >{`${formatDate(vehicle.gpsInstallationEstimateStartDate)} s/d ${formatDate(vehicle.gpsInstallationEstimateEndDate)}`}</DetailRow>
          </div>

          {/* Vehicle Photos Section */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="rounded-t-xl bg-primary-50 px-6 hover:no-underline">
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
                    label={`Foto ${photo.photoType
                      .toLowerCase()
                      .replace(/^\w/, (c) => c.toUpperCase())} Kendaraan`}
                    hasBorderBottom={index < array.length - 1}
                  >
                    <div className="relative h-[68px] w-[68px]">
                      <Image
                        src={photo.photoUrl}
                        alt={photo.photoName}
                        fill={true}
                        className="rounded-md object-cover"
                      />
                    </div>
                  </DetailRow>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Vehicle Documents Section */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="rounded-t-xl bg-primary-50 px-6 hover:no-underline">
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
  );
};

export default Page;
