"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Card, { CardContent } from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
// Assuming IconComponent is available
import { useGetVehicleDetail } from "@/services/Transporter/manajemen-armada/getVehiclesDetail";

// Helper component for creating the two-column detail rows
const DetailRow = ({ label, children, isLink = false }) => (
  <div className="flex items-center justify-between border-b py-4 last:border-b-0">
    <p className="text-sm text-neutral-600">{label}</p>
    <div
      className={`text-sm font-semibold ${isLink ? "text-success-600 underline" : "text-neutral-900"}`}
    >
      {children}
    </div>
  </div>
);

// Helper component for the blue section headers
const SectionHeader = ({ title }) => (
  <div className="flex items-center justify-between rounded-t-md bg-primary-50 px-6 py-4">
    <h3 className="font-bold text-primary-800">{title}</h3>
    <IconComponent
      src="/icons/chevron-up-blue.svg" // Replace with your chevron icon
      className="h-5 w-5"
    />
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

  // Helper function to format dates
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="flex flex-col gap-6">
      <BreadCrumb data={breadCrumbData} />

      {/* Main Details Card */}
      <Card className="!p-0">
        <CardContent className="!p-6">
          <DetailRow label="No. Polisi Kendaraan">
            {vehicle.licensePlate}
          </DetailRow>
          <DetailRow label="Jenis Truk">{vehicle.truckType.name}</DetailRow>
          <DetailRow label="Jenis Carrier">
            {vehicle.carrierType.name}
          </DetailRow>
          <DetailRow label="Merek Kendaraan">
            {vehicle.vehicleBrand.name}
          </DetailRow>
          <DetailRow label="Tipe Kendaraan">
            {vehicle.vehicleType.name}
          </DetailRow>
          <DetailRow label="Tahun Registrasi Kendaraan">
            {vehicle.registrationYear}
          </DetailRow>
          <DetailRow label="Dimensi Carrier">{`${vehicle.carrierLength}x${vehicle.carrierWidth}x${vehicle.carrierHeight} m`}</DetailRow>
        </CardContent>
      </Card>

      {/* Photos Card */}
      <Card className="!p-0">
        <SectionHeader title="Foto Armada" />
        <CardContent className="!p-6">
          {vehicle.photos.map((photo) => (
            <DetailRow
              key={photo.id}
              label={`Foto ${photo.photoType.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())} Kendaraan`}
            >
              <Image
                src={photo.photoUrl}
                alt={photo.photoName}
                width={48}
                height={48}
                className="rounded-md object-cover"
              />
            </DetailRow>
          ))}
        </CardContent>
      </Card>

      {/* Documents Card */}
      <Card className="!p-0">
        <SectionHeader title="Dokumen Armada" />
        <CardContent className="!p-6">
          <DetailRow label="Nomor Rangka">{vehicle.chassisNumber}</DetailRow>
          <DetailRow label="Masa Berlaku STNK">
            {formatDate(vehicle.stnkExpiryDate)}
          </DetailRow>
          {vehicle.documents.find((doc) => doc.documentType === "STNK") && (
            <DetailRow label="Foto STNK" isLink>
              <Link
                href={
                  vehicle.documents.find((doc) => doc.documentType === "STNK")
                    .documentUrl
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {
                  vehicle.documents.find((doc) => doc.documentType === "STNK")
                    .documentName
                }
              </Link>
            </DetailRow>
          )}
          <DetailRow label="KIR Kendaraan">{vehicle.kirNumber}</DetailRow>
          <DetailRow label="Masa Berlaku KIR">
            {formatDate(vehicle.kirExpiryDate)}
          </DetailRow>
          {vehicle.documents.find((doc) => doc.documentType === "KIR") && ( // Assuming 'KIR' is a possible documentType
            <DetailRow label="Foto Buku KIR" isLink>
              <Link
                href={
                  vehicle.documents.find((doc) => doc.documentType === "KIR")
                    .documentUrl
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {
                  vehicle.documents.find((doc) => doc.documentType === "KIR")
                    .documentName
                }
              </Link>
            </DetailRow>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
