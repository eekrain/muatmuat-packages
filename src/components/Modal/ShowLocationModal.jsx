import React from "react";
import { useState } from "react";

import { Alert } from "@/components/Alert/Alert";
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { MapContainer } from "@/components/MapContainer/MapContainer";
import { Modal, ModalContent } from "@/components/Modal/Modal";

// --- Komponen Modal Lokasi ---
// Komponen ini dikhususkan untuk menampilkan detail lokasi dalam modal.
const LocationDetailModal = ({ isOpen, onOpenChange, locationData }) => {
  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="w-[980px] p-0" type="muatmuat">
        <div className="grid grid-cols-3">
          {/* Kolom Peta */}
          <div className="col-span-2">
            <MapContainer
              coordinates={{
                latitude: locationData.coordinates.latitude,
                longitude: locationData.coordinates.longitude,
              }}
              className="h-[520px] w-full"
              zoom={15}
            />
          </div>
          {/* Kolom Detail Lokasi */}
          <div className="col-span-1 bg-white p-6">
            <h2 className="mb-4 text-lg font-bold text-neutral-900">
              Lihat Lokasi
            </h2>
            <div className="flex items-start gap-3">
              <IconComponent
                src="/icons/location.svg"
                className="mt-1 h-5 w-5 flex-shrink-0 text-neutral-600"
                alt="Ikon Lokasi"
              />
              <p className="text-sm font-medium leading-relaxed text-neutral-800">
                {locationData.fullAddress}
              </p>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

// --- Komponen Baris Detail yang Dapat Digunakan Kembali ---
const DetailRow = ({
  label,
  value,
  valueClassName = "text-neutral-900",
  isStriped = false,
  isHeader = false,
}) => {
  if (isHeader) {
    return (
      <div className="px-4 py-4">
        <h3 className="text-base font-bold text-neutral-900">{label}</h3>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-3 gap-4 px-4 py-4 ${
        isStriped ? "bg-neutral-100" : "bg-white"
      }`}
    >
      <dt className="text-sm font-medium text-neutral-600">{label}</dt>
      <dd className={`col-span-2 text-sm font-semibold ${valueClassName}`}>
        {value}
      </dd>
    </div>
  );
};

// --- Komponen Halaman Utama ---
const CompanyProfileInfo = () => {
  // State untuk mengontrol visibilitas modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fungsi untuk membuka modal
  const handleOpenModal = () => setIsModalOpen(true);

  // Data mock dipindahkan ke sini
  const companyData = {
    registrant: {
      name: "Fernando Torres",
      title: "Chief Marketing Officer",
      whatsapp: "081234567910",
      email: "torres.marketing@mail.com",
    },
    company: {
      logoUrl: "https://picsum.photos/100?random=1",
      name: "PT Kalimantan Timur Jaya Sentosa Makmur Sejahtera Internasional",
      entity: "PT/ PT Tbk",
      phone: "0812-0987-6543",
    },
    location: {
      fullAddress:
        "Jl. Anggrek No. 123, RT 05 RW 09, Kel. Mekarsari, Kec. Cimanggis, Kota Depok, Provinsi Jawa Barat, Kode Pos 16452, Dekat Warung Bu Tini, belakang minimarket, sebelah bengkel motor, sekitar 200 meter dari halte Transdepok Mekarsari.",
      shortAddress:
        "Jl. Anggrek No. 123, RT 05 RW 09, Kel. Mekarsari, Kec. Cimanggis, Kota Depok, Provinsi Jawa Barat, Kode Pos 16452",
      district: "Cimanggis",
      city: "Depok",
      province: "Jawa Barat",
      postalCode: "16452",
      coordinates: {
        latitude: -6.3937,
        longitude: 106.8286,
      },
    },
    bank: {
      name: "Bank Central Asia (BCA)",
      accountNumber: "21454322",
      accountHolder: "Fernando Torres",
    },
  };

  // Buat satu array dari semua baris untuk striping berkelanjutan
  const allRows = [
    // Header dan Informasi Pendaftar
    { type: "header", label: "Informasi Pendaftar" },
    {
      type: "data",
      label: "Nama Lengkap Pendaftar",
      value: companyData.registrant.name,
    },
    {
      type: "data",
      label: "Jabatan Pendaftar",
      value: companyData.registrant.title,
    },
    {
      type: "data",
      label: "No. Whatsapp Pendaftar",
      value: companyData.registrant.whatsapp,
    },
    {
      type: "data",
      label: "Email Pendaftar",
      value: companyData.registrant.email,
    },

    // Header dan Informasi Perusahaan
    { type: "header", label: "Informasi Perusahaan" },
    {
      type: "data",
      label: "Logo Perusahaan",
      value: (
        <ImageComponent
          src={companyData.company.logoUrl}
          alt="Company Logo"
          width={72}
          height={72}
          className="rounded-full object-cover"
        />
      ),
    },
    { type: "data", label: "Nama Perusahaan", value: companyData.company.name },
    { type: "data", label: "Badan Usaha", value: companyData.company.entity },
    {
      type: "data",
      label: "No. Telepon Perusahaan",
      value: companyData.company.phone,
    },

    // Header dan Lokasi Perusahaan
    { type: "header", label: "Lokasi Perusahaan" },
    { type: "data", label: "Alamat", value: companyData.location.fullAddress },
    { type: "data", label: "Lokasi", value: companyData.location.shortAddress },
    { type: "data", label: "Kecamatan", value: companyData.location.district },
    { type: "data", label: "Kota", value: companyData.location.city },
    { type: "data", label: "Provinsi", value: companyData.location.province },
    { type: "data", label: "Kode Pos", value: companyData.location.postalCode },
    {
      type: "data",
      label: "Titik Lokasi",
      value: (
        <dd className="relative col-span-2 h-[180px] w-full overflow-hidden rounded-lg">
          <MapContainer
            coordinates={companyData.location.coordinates}
            className="h-full w-full rounded-lg"
            viewOnly={true}
            textLabel="Lokasi Perusahaan"
            draggableMarker={false}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            {/* Tombol ini sekarang memicu modal */}
            <Button variant="muattrans-primary" onClick={handleOpenModal}>
              Lihat Lokasi
            </Button>
          </div>
        </dd>
      ),
    },

    // Header dan Informasi Rekening
    { type: "header", label: "Informasi Rekening Perusahaan" },
    { type: "data", label: "Nama Bank", value: companyData.bank.name },
    {
      type: "data",
      label: "Nomor Rekening",
      value: companyData.bank.accountNumber,
    },
    {
      type: "data",
      label: "Nama Pemilik Rekening",
      value: companyData.bank.accountHolder,
    },
  ];

  return (
    <>
      <Card className="max-h-fit border-neutral-300 bg-white p-0">
        <div className="px-6 py-4">
          <h2 className="mb-1 text-xl font-bold text-neutral-900">
            Data Perusahaan
          </h2>

          <Alert
            variant="warning"
            className="-ms-4 mt-4 flex items-center bg-white"
          >
            <span className="text-sm font-medium text-neutral-800">
              Data Perusahaan akan ditampilkan pada profilmu untuk pengguna
              lainnya.
            </span>
          </Alert>
        </div>

        <div className="mt-2">
          {allRows.map((row, index) => {
            if (row.type === "header") {
              return (
                <DetailRow
                  key={`header-${index}`}
                  label={row.label}
                  isHeader={true}
                />
              );
            }
            // Logika untuk menghitung striping yang benar
            const dataRowIndex =
              allRows.slice(0, index + 1).filter((r) => r.type === "data")
                .length - 1;
            const isStriped = dataRowIndex % 2 === 0;
            return (
              <DetailRow
                key={`data-${index}`}
                label={row.label}
                value={row.value}
                isStriped={isStriped}
              />
            );
          })}
        </div>
      </Card>

      {/* Render komponen modal dan kontrol visibilitasnya dengan state */}
      <LocationDetailModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        locationData={{
          fullAddress: companyData.location.fullAddress,
          coordinates: companyData.location.coordinates,
        }}
      />
    </>
  );
};

export default CompanyProfileInfo;
