"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Card, { CardContent } from "@/components/Card/Card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import IconComponent from "@/components/IconComponent/IconComponent";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useGetVehicleDetail } from "@/services/Transporter/manajemen-armada/getVehiclesDetail";

const DetailRow = ({
  label,
  children,
  isLink = false,
  hasBorderBottom = true,
}) => (
  <div
    className={`flex items-center justify-between py-4 ${hasBorderBottom ? "border-b-[0.5px] border-neutral-600" : ""}`}
  >
    <p className="text-sm text-neutral-700">{label}</p>
    <div
      className={`text-sm font-semibold ${isLink ? "text-success-400 underline" : "font-bold text-neutral-900"}`}
    >
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

  if (isLoading) return <div>Loading vehicle details...</div>;
  if (error) return <div>Failed to load data. Please try again.</div>;

  const vehicle = data?.vehicle;
  if (!vehicle) return <div>No vehicle data found.</div>;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="flex flex-col gap-6 py-8">
      <BreadCrumb data={breadCrumbData} />
      <PageTitle>Detail Armada</PageTitle>

      {/* Main Details Card (remains static) */}
      <Card className="shadow-muat rounded-2xl border-none p-2 pb-4 pl-2 pr-2 pt-4">
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
          </div>
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="rounded-t-xl bg-primary-50 px-6 hover:no-underline">
              <h3 className="font-bold text-primary-800">Foto Armada</h3>
              <IconComponent
                src="/icons/chevron-down.svg"
                className="h-5 w-5 transition-transform duration-300"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6">
                {/* We get the 'index' and the 'array' from the map function */}
                {vehicle.photos.map((photo, index, array) => (
                  <DetailRow
                    key={photo.id}
                    label={`Foto ${photo.photoType.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())} Kendaraan`}
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
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="rounded-t-xl bg-primary-50 px-6 hover:no-underline">
              <h3 className="font-bold text-primary-800">Dokumen Armada</h3>
              <IconComponent
                src="/icons/chevron-down.svg"
                className="h-5 w-5 transition-transform duration-300"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6">
                <DetailRow label="Nomor Rangka">
                  {vehicle.chassisNumber}
                </DetailRow>
                <DetailRow label="Masa Berlaku STNK">
                  {formatDate(vehicle.stnkExpiryDate)}
                </DetailRow>
                {vehicle.documents.find(
                  (doc) => doc.documentType === "STNK"
                ) && (
                  <DetailRow label="Foto STNK" isLink>
                    <Link
                      href={
                        vehicle.documents.find(
                          (doc) => doc.documentType === "STNK"
                        ).documentUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {
                        vehicle.documents.find(
                          (doc) => doc.documentType === "STNK"
                        ).documentName
                      }
                    </Link>
                  </DetailRow>
                )}
                <DetailRow label="KIR Kendaraan">{vehicle.kirNumber}</DetailRow>
                <DetailRow label="Masa Berlaku KIR">
                  {formatDate(vehicle.kirExpiryDate)}
                </DetailRow>
                {vehicle.documents.find(
                  (doc) => doc.documentType === "KIR"
                ) && (
                  <DetailRow label="Foto Buku KIR" isLink>
                    <Link
                      href={
                        vehicle.documents.find(
                          (doc) => doc.documentType === "KIR"
                        ).documentUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {
                        vehicle.documents.find(
                          (doc) => doc.documentType === "KIR"
                        ).documentName
                      }
                    </Link>
                  </DetailRow>
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
