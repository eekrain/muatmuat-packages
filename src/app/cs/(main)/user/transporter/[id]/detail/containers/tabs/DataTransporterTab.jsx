"use client";

import ModalLihatLokasi from "@/app/cs/(main)/user/components/ModalLihatLokasi";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { MapContainer } from "@/components/MapContainer/MapContainer";
import { TabsContent } from "@/components/Tabs/Tabs";
import { toast } from "@/lib/toast";

const SectionHeader = ({ title }) => (
  <div className="flex items-center px-6 py-4">
    <h3 className="text-xs font-semibold text-black">{title}</h3>
  </div>
);

const DataRow = ({ label, value, isOdd = false, isMultiline = false }) => (
  <div
    className={`flex gap-8 px-6 py-4 ${isOdd ? "bg-neutral-100" : "bg-white"}`}
  >
    <div className="flex w-44 items-start text-xs font-medium text-neutral-600">
      {label}
    </div>
    <div
      className={`flex-1 text-xs font-medium text-black ${isMultiline ? "leading-relaxed" : ""}`}
    >
      {value}
    </div>
  </div>
);

const FileRow = ({ label, fileName, isOdd = false }) => (
  <div
    className={`flex items-center gap-8 px-6 py-4 ${isOdd ? "bg-neutral-100" : "bg-white"}`}
  >
    <div className="flex w-44 items-center text-xs font-medium text-neutral-600">
      {label}
    </div>
    <div className="flex-1 text-xs font-medium text-success-500">
      {fileName}
    </div>
    <Button
      variant="muattrans-primary-secondary"
      className="h-8 rounded-full text-xs"
    >
      Lihat File
    </Button>
  </div>
);

const ContactRow = ({ picNumber, name, position, phone, isOdd = false }) => {
  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      toast.success("No. HP PIC berhasil disalin");
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = phone;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("No. HP PIC berhasil disalin");
    }
  };

  return (
    <div
      className={`flex items-center gap-11 px-6 py-4 ${isOdd ? "bg-neutral-100" : "bg-white"}`}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full">
          <IconComponent
            src="/icons/profile16.svg"
            className="text-muat-trans-secondary-900"
          />
        </div>
        <span className="w-10 text-xs font-medium text-neutral-600">
          {picNumber}
        </span>
      </div>

      <div className="w-48 text-xs font-medium text-black">{name}</div>

      <div className="w-48 text-xs font-medium text-black">{position}</div>

      <div className="w-24 text-xs font-medium text-black">{phone}</div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleCopyPhone}
          className="flex h-[18px] w-[18px] items-center justify-center rounded transition-colors hover:bg-neutral-100"
          title="Salin nomor telepon"
        >
          <IconComponent
            src="/icons/salin.svg"
            className="h-[18px] w-[18px] text-primary-700"
          />
        </button>
        <IconComponent
          src="/icons/driver-whatsapp.svg"
          className="h-[18px] w-[18px] text-primary-700"
        />
      </div>
    </div>
  );
};

const MapPlaceholder = () => (
  <div className="relative h-[154px] w-64">
    <MapContainer
      coordinates={{
        latitude: -6.3937,
        longitude: 106.8286,
      }}
      className="h-[122px] w-full rounded-lg"
      viewOnly={true}
      textLabel="Lokasi Perusahaan"
      draggableMarker={false}
    />
    {/* Modal for viewing location */}
    <ModalLihatLokasi
      coordinates={{
        latitude: -6.3937,
        longitude: 106.8286,
      }}
      companyName="PT Kalimantan Timur Jaya Sentosa Makmur Sejahtera Internasional"
      address="Jl. Anggrek No. 123, RT 05 RW 09, Kel. Mekarsari, Kec. Cimanggis, Kota Depok, Provinsi Jawa Barat, Kode Pos 16452"
      shortAddress="Jl. Anggrek No. 123, RT 05 RW 09"
    >
      <div className="bottom-0 left-0 right-0">
        <Button
          variant="muattrans-primary"
          className="w-full rounded-none rounded-b-lg text-xs"
        >
          Lihat Lokasi
        </Button>
      </div>
    </ModalLihatLokasi>
  </div>
);

const DataTransporterTab = () => {
  return (
    <TabsContent value="data-transporter">
      <div className="mt-4 flex flex-col gap-4 pb-20">
        {/* Data Transporter Section */}
        <div className="overflow-hidden rounded-xl bg-white shadow-muat">
          <div className="flex items-center px-6 py-6">
            <h2 className="flex-1 text-lg font-semibold text-black">
              Data Transporter
            </h2>
          </div>

          <div className="flex flex-col">
            {/* Informasi Pendaftar */}
            <SectionHeader title="Informasi Pendaftar" />
            <DataRow
              label="Nama Lengkap Pendaftar"
              value="Fernando Torres"
              isOdd={true}
            />
            <DataRow
              label="Jabatan Pendaftar"
              value="Chief Marketing Officer"
            />
            <DataRow
              label="No. Whatsapp Pendaftar"
              value="0812345678910"
              isOdd={true}
            />
            <DataRow
              label="Email Pendaftar"
              value="torres.marketing@mail.com"
            />

            {/* Informasi Perusahaan */}
            <SectionHeader title="Informasi Perusahaan" />
            <DataRow
              label="Nama Perusahaan"
              value="PT Kalimantan Timur Jaya Sentosa Makmur Sejahtera Internasional"
              isOdd={true}
            />
            <DataRow label="Badan Usaha" value="PT/ PT Tbk" />
            <DataRow
              label="No. Telepon Perusahaan"
              value="0812-0987-6543"
              isOdd={true}
            />

            {/* Lokasi Perusahaan */}
            <SectionHeader title="Lokasi Perusahaan" />
            <DataRow
              label="Alamat"
              value="Jl. Anggrek No. 123, RT 05 RW 09, Kel. Mekarsari, Kec. Cimanggis, Kota Depok, Provinsi Jawa Barat, Kode Pos 16452. Dekat Warung Bu Tini, belakang minimarket, sebelah bengkel motor, sekitar 200 meter dari halte Transdepok Mekarsari."
              isOdd={true}
              isMultiline={true}
            />
            <DataRow
              label="Lokasi"
              value="Jl. Anggrek No. 123, RT 05 RW 09, Kel. Mekarsari, Kec. Cimanggis, Kota Depok, Provinsi Jawa Barat, Kode Pos 16452"
            />
            <DataRow label="Kecamatan" value="Cimanggis" isOdd={true} />
            <DataRow label="Kota" value="Depok" />
            <DataRow label="Provinsi" value="Jawa Barat" isOdd={true} />
            <DataRow label="Kode Pos" value="16452" />

            {/* Map Location */}
            <div className="flex gap-8 bg-neutral-100 px-6 py-4">
              <div className="flex w-44 items-start text-xs font-medium text-neutral-600">
                Titik Lokasi
              </div>
              <div className="flex-1">
                <MapPlaceholder />
              </div>
            </div>

            {/* Informasi Rekening Perusahaan */}
            <SectionHeader title="Informasi Rekening Perusahaan" />
            <DataRow
              label="Nama Bank"
              value="Bank Central Asia (BCA)"
              isOdd={true}
            />
            <DataRow label="Badan Usaha" value="21454322" />
            <DataRow
              label="Nama Pemilik Rekening"
              value="Fernando Torres"
              isOdd={true}
            />
          </div>
        </div>

        {/* Kelengkapan Legalitas Section */}
        <div className="overflow-hidden rounded-xl bg-white shadow-muat">
          <div className="flex px-6 py-6">
            <h2 className="flex-1 text-lg font-semibold text-black">
              Kelengkapan Legalitas
            </h2>
          </div>

          <div className="flex flex-col">
            <FileRow label="NIB" fileName="NIB.jpg" isOdd={true} />
            <DataRow label="No. NIB" value="9120000792674" />
            <FileRow label="NPWP Perusahaan" fileName="NPWP.pdf" isOdd={true} />
            <DataRow label="No. NPWP Perusahaan" value="0925429434070004" />
            <FileRow
              label="KTP Pendaftar/Pemegang Akun"
              fileName="KTP.pdf"
              isOdd={true}
            />
            <DataRow
              label="No. KTP Pendaftar/Pemegang Akun"
              value="01679765443368363"
              isMultiline={true}
            />
            <FileRow
              label="Cover Akta Pendirian"
              fileName="akta_pendirian.pdf"
              isOdd={true}
            />
            <FileRow
              label="SK Kemenkumham dari Akta Pendirian"
              fileName="SK Pendirian.pdf"
            />
            <FileRow
              label="Cover Akta Perubahan"
              fileName="cover_akta_perubahan.pdf"
              isOdd={true}
            />
            <FileRow
              label="SK Kemenkumham dari Akta Perubahan"
              fileName="SK Perubahan.pdf"
            />

            {/* Multiple Files Row */}
            <div className="flex gap-8 bg-neutral-100 px-6 py-4">
              <div className="flex w-44 items-start text-xs font-medium text-neutral-600">
                Sertifikat Standar
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <div className="text-xs font-medium text-success-500">
                  123456789012...pdf
                </div>
                <div className="text-xs font-medium text-success-500">
                  File2.pdf
                </div>
                <div className="text-xs font-medium text-success-500">
                  File3.pdf
                </div>
                <div className="text-xs font-medium text-success-500">
                  File4.pdf
                </div>
                <div className="text-xs font-medium text-success-500">
                  File5.pdf
                </div>
              </div>
              <Button
                variant="muattrans-primary-secondary"
                className="h-8 self-start rounded-full text-xs"
              >
                Lihat File
              </Button>
            </div>
          </div>
        </div>

        {/* Kontak PIC Section */}
        <div className="overflow-hidden rounded-xl bg-white shadow-muat">
          <div className="flex px-6 py-6">
            <h2 className="flex-1 text-lg font-semibold text-black">
              Kontak PIC
            </h2>
          </div>

          <div className="flex flex-col">
            <ContactRow
              picNumber="PIC 1"
              name="Tralalero Tralala"
              position="Staff Marketing"
              phone="0812-3456-1111"
              isOdd={true}
            />
            <ContactRow
              picNumber="PIC 2"
              name="Bombardino Crocodilo"
              position="Staff Marketing"
              phone="0812-3456-2222"
            />
            <ContactRow
              picNumber="PIC 3"
              name="Tung Sahur"
              position="Staff Customer Service"
              phone="0812-3456-3333"
              isOdd={true}
            />
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default DataTransporterTab;
