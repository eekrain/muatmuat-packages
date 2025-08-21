import { useState } from "react";

import PropTypes from "prop-types";

import { Alert } from "@/components/Alert/Alert";
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import IconComponent from "@/components/IconComponent/IconComponent";
import ImageComponent from "@/components/ImageComponent/ImageComponent";
import { MapContainer } from "@/components/MapContainer/MapContainer";
import { Modal, ModalContent } from "@/components/Modal";

// --- Lihat Lokasi Modal Component ---
const LihatLokasiModal = ({ isOpen, onClose }) => {
  // Data dummy untuk koordinat lokasi di Surabaya dan alamat
  const locationData = {
    coordinates: {
      latitude: -7.288,
      longitude: 112.731,
    },
    address: "Jl. Anggrek No. 123, RT 05 RW 09",
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-[992px] p-6">
        {/* Konten Utama: Grid 2 Kolom */}
        <div className="grid grid-cols-3 gap-6">
          {/* Kolom Kiri: Peta */}
          <div className="col-span-2">
            <div className="h-[480px] w-full overflow-hidden rounded-lg">
              <MapContainer
                coordinates={locationData.coordinates}
                textLabel="Lokasi Terpilih"
                className="h-full w-full"
              />
            </div>
          </div>

          {/* Kolom Kanan: Detail Alamat */}
          <div className="col-span-1">
            <h2 className="mb-6 text-lg font-bold leading-6 text-neutral-900">
              Lihat Lokasi
            </h2>
            <div className="flex items-start gap-3">
              <IconComponent
                src="/icons/marker-lokasi-muat.svg"
                width={24}
                height={24}
                alt="Ikon Lokasi"
              />
              <p className="pt-0.5 text-sm font-medium leading-5 text-neutral-800">
                {locationData.address}
              </p>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

// --- Reusable Detail Row Component ---
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
      className={`grid grid-cols-3 gap-4 px-4 py-4 ${isStriped ? "bg-neutral-100" : "bg-white"}`}
    >
      <dt className="text-sm font-medium text-neutral-600">{label}</dt>
      <dd className={`col-span-2 text-sm font-semibold ${valueClassName}`}>
        {value}
      </dd>
    </div>
  );
};

// --- Main Page Component ---
const CompanyProfileInfo = ({ userProfile }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    console.log("modal open");
    setIsModalOpen(true);
  };

  const companyData = {
    registrant: {
      name: userProfile?.name || "Fernando Torres",
      title: userProfile?.position || "Chief Marketing Officer",
      whatsapp: userProfile?.phone || "081234567910",
      email: userProfile?.email || "torres.marketing@mail.com",
    },
    company: {
      logoUrl:
        userProfile.transporter?.companyLogo &&
        !userProfile.transporter.companyLogo.endsWith(".webp")
          ? userProfile.transporter.companyLogo
          : "https://picsum.photos/100?random=1",
      name:
        userProfile.transporter?.companyName ||
        "PT Kalimantan Timur Jaya Sentosa Makmur Sejahtera Internasional",
      entity: userProfile.transporter?.companyEntity || "PT/ PT Tbk",
      phone: userProfile.transporter?.companyPhone || "0812-0987-6543",
    },
    location: {
      fullAddress:
        userProfile.transporter?.companyAddress ||
        "Jl. Anggrek No. 123, RT 05 RW 09, Kel. Mekarsari, Kec. Cimanggis, Kota Depok, Provinsi Jawa Barat, Kode Pos 16452, Dekat Warung Bu Tini, belakang minimarket, sebelah bengkel motor, sekitar 200 meter dari halte Transdepok Mekarsari.",
      shortAddress:
        userProfile.transporter?.companyAddress ||
        "Jl. Anggrek No. 123, RT 05 RW 09, Kel. Mekarsari, Kec. Cimanggis, Kota Depok, Provinsi Jawa Barat, Kode Pos 16452",
      district: userProfile.transporter?.district || "Cimanggis",
      city: userProfile.transporter?.city || "Depok",
      province: userProfile.transporter?.province || "Jawa Barat",
      postalCode: userProfile.transporter?.postalCode || "16452",
      pinLocation: (
        <div className="relative col-span-2 w-1/2 overflow-hidden rounded-lg">
          <div className="relative h-36 w-full">
            <MapContainer
              coordinates={{
                latitude: -6.3937,
                longitude: 106.8286,
              }}
              className="h-full w-full rounded-lg"
              viewOnly={true}
              textLabel="Lokasi Perusahaan"
              draggableMarker={false}
            />
          </div>
          <Button
            onClick={handleOpenModal}
            className="w-full rounded-none bg-muat-trans-primary-400 py-4 text-center font-sans text-muat-trans-secondary-900 transition-colors hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Lihat Lokasi
          </Button>
        </div>
      ),
    },
    bank: {
      name: userProfile?.banks?.[0]?.bankName || "Bank Central Asia (BCA)",
      accountNumber: userProfile?.banks?.[0]?.accountNumber || "21454322",
      accountHolder:
        userProfile?.banks?.[0]?.accountHolderName || "Fernando Torres",
    },
  };

  // Create a single array of all rows for continuous striping
  const allRows = [
    // Header and Informasi Pendaftar
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

    // Header and Informasi Perusahaan
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

    // Header and Lokasi Perusahaan
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
      value: companyData.location.pinLocation,
    },

    // Header and Informasi Rekening
    { type: "header", label: "Informasi Rekening Perusahaan" },
    { type: "data", label: "Nama Bank", value: companyData.bank.name },
    {
      type: "data",
      label: "No. Rekening",
      value: companyData.bank.accountNumber,
    },
    {
      type: "data",
      label: "Nama Pemilik Rekening",
      value: companyData.bank.accountHolder,
    },
  ];
  console.log(userProfile, "transporter");

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

      {/* Modal Component */}
      <LihatLokasiModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

CompanyProfileInfo.propTypes = {
  userProfile: PropTypes.object,
};

export default CompanyProfileInfo;
