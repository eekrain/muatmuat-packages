"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import ModalLihatLokasi from "@/app/cs/(main)/user/components/ModalLihatLokasi";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/IconComponent/IconComponent";
import { MapContainer } from "@/components/MapContainer/MapContainer";
import { TabsContent } from "@/components/Tabs/Tabs";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "@/lib/toast";
import { useGetTransporterDetails } from "@/services/CS/transporters/getTransporterDetails";

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

const FileRow = ({ label, fileName, isOdd = false }) => {
  const { t } = useTranslation();

  return (
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
        {t("DataTransporterTab.buttonViewFile", {}, "Lihat File")}
      </Button>
    </div>
  );
};

const ContactRow = ({ picNumber, name, position, phone, isOdd = false }) => {
  const { t } = useTranslation();

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      toast.success(
        t(
          "DataTransporterTab.messageSuccessPhoneCopied",
          {},
          "No. HP PIC berhasil disalin"
        )
      );
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = phone;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success(
        t(
          "DataTransporterTab.messageSuccessPhoneCopied",
          {},
          "No. HP PIC berhasil disalin"
        )
      );
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
          title={t(
            "DataTransporterTab.tooltipCopyPhoneNumber",
            {},
            "Salin nomor telepon"
          )}
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

const MapPlaceholder = ({ coordinates }) => {
  const { t } = useTranslation();

  // Don't render map if coordinates are invalid
  if (
    !coordinates ||
    coordinates.latitude === null ||
    coordinates.longitude === null
  ) {
    return (
      <div className="relative h-[154px] w-64">
        <div className="flex h-[122px] w-full items-center justify-center rounded-lg bg-neutral-100">
          <p className="text-sm text-neutral-500">
            {t(
              "DataTransporterTab.messageLocationNotAvailable",
              {},
              "Lokasi tidak tersedia"
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[154px] w-64">
      <MapContainer
        coordinates={coordinates}
        className="h-[122px] w-full rounded-lg"
        viewOnly={true}
        textLabel={t(
          "DataTransporterTab.labelCompanyLocation",
          {},
          "Lokasi Perusahaan"
        )}
        draggableMarker={false}
      />
      {/* Modal for viewing location */}
      <ModalLihatLokasi
        coordinates={coordinates}
        companyName="PT Kalimantan Timur Jaya Sentosa Makmur Sejahtera Internasional"
        address="Jl. Anggrek No. 123, RT 05 RW 09, Kel. Mekarsari, Kec. Cimanggis, Kota Depok, Provinsi Jawa Barat, Kode Pos 16452"
        shortAddress="Jl. Anggrek No. 123, RT 05 RW 09"
      >
        <div className="bottom-0 left-0 right-0">
          <Button
            variant="muattrans-primary"
            className="w-full rounded-none rounded-b-lg text-xs"
          >
            {t("DataTransporterTab.buttonViewLocation", {}, "Lihat Lokasi")}
          </Button>
        </div>
      </ModalLihatLokasi>
    </div>
  );
};

const DataTransporterTab = () => {
  const { t } = useTranslation();
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const params = useParams();
  const transporterId = params.id;

  const {
    data: apiResponse,
    error,
    isLoading,
  } = useGetTransporterDetails(transporterId);

  // Extract transporter details from API response
  const transporterData = apiResponse?.Data;

  useEffect(() => {
    if (
      transporterData?.company?.latitude &&
      transporterData?.company?.longitude
    ) {
      const lat = parseFloat(transporterData.company.latitude);
      const lng = parseFloat(transporterData.company.longitude);

      // Only set coordinates if they are valid numbers
      if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) {
        setCoordinates({
          latitude: lat,
          longitude: lng,
        });
      } else {
        // Set default coordinates for Jakarta if invalid
        setCoordinates({
          latitude: -6.2088,
          longitude: 106.8456,
        });
      }
    }
  }, [transporterData]);

  // Loading state
  if (isLoading) {
    return (
      <TabsContent value="data-transporter">
        <div className="mt-4 flex h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold">
              {t(
                "DataTransporterTab.messageLoadingTransporterData",
                {},
                "Memuat data transporter..."
              )}
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              {t(
                "DataTransporterTab.messageLoadingPleaseWait",
                {},
                "Mohon tunggu sebentar"
              )}
            </p>
          </div>
        </div>
      </TabsContent>
    );
  }

  // Error state
  if (error || !transporterData) {
    return (
      <TabsContent value="data-transporter">
        <div className="mt-4 flex h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-error-500">
              {t(
                "DataTransporterTab.messageErrorOccurred",
                {},
                "Terjadi Kesalahan"
              )}
            </p>
            <p className="mt-2 text-sm text-neutral-600">
              {t(
                "DataTransporterTab.messageErrorFailedToLoadData",
                {},
                "Gagal memuat data transporter"
              )}
            </p>
          </div>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="data-transporter">
      <div className="mt-4 flex flex-col gap-4 pb-20">
        {/* Data Transporter Section */}
        <div className="overflow-hidden rounded-xl bg-white shadow-muat">
          <div className="flex items-center px-6 py-6">
            <h2 className="flex-1 text-lg font-semibold text-black">
              {t(
                "DataTransporterTab.titleDataTransporter",
                {},
                "Data Transporter"
              )}
            </h2>
          </div>

          <div className="flex flex-col">
            {/* Informasi Pendaftar */}
            <SectionHeader
              title={t(
                "DataTransporterTab.titleRegistrantInformation",
                {},
                "Informasi Pendaftar"
              )}
            />
            <DataRow
              label={t(
                "DataTransporterTab.labelRegistrantFullName",
                {},
                "Nama Lengkap Pendaftar"
              )}
              value={transporterData.registrant?.fullName || "-"}
              isOdd={true}
            />
            <DataRow
              label={t(
                "DataTransporterTab.labelRegistrantPosition",
                {},
                "Jabatan Pendaftar"
              )}
              value={transporterData.registrant?.position || "-"}
            />
            <DataRow
              label={t(
                "DataTransporterTab.labelRegistrantWhatsappNumber",
                {},
                "No. Whatsapp Pendaftar"
              )}
              value={transporterData.registrant?.whatsappNumber || "-"}
              isOdd={true}
            />
            <DataRow
              label={t(
                "DataTransporterTab.labelRegistrantEmail",
                {},
                "Email Pendaftar"
              )}
              value={transporterData.registrant?.email || "-"}
            />

            {/* Informasi Perusahaan */}
            <SectionHeader
              title={t(
                "DataTransporterTab.titleCompanyInformation",
                {},
                "Informasi Perusahaan"
              )}
            />
            <DataRow
              label={t(
                "DataTransporterTab.labelCompanyName",
                {},
                "Nama Perusahaan"
              )}
              value={transporterData.company?.name || "-"}
              isOdd={true}
            />
            <DataRow
              label={t(
                "DataTransporterTab.labelBusinessEntity",
                {},
                "Badan Usaha"
              )}
              value={transporterData.company?.businessEntity || "-"}
            />
            <DataRow
              label={t(
                "DataTransporterTab.labelCompanyPhoneNumber",
                {},
                "No. Telepon Perusahaan"
              )}
              value={transporterData.company?.phoneNumber || "-"}
              isOdd={true}
            />

            {/* Lokasi Perusahaan */}
            <SectionHeader
              title={t(
                "DataTransporterTab.titleCompanyLocation",
                {},
                "Lokasi Perusahaan"
              )}
            />
            <DataRow
              label={t("DataTransporterTab.labelAddress", {}, "Alamat")}
              value={transporterData.company?.address || "-"}
              isOdd={true}
              isMultiline={true}
            />
            <DataRow
              label={t("DataTransporterTab.labelLocation", {}, "Lokasi")}
              value={`${transporterData.company?.address || ""}`}
            />
            <DataRow
              label={t("DataTransporterTab.labelDistrict", {}, "Kecamatan")}
              value={transporterData.company?.district || "-"}
              isOdd={true}
            />
            <DataRow
              label={t("DataTransporterTab.labelCity", {}, "Kota")}
              value={transporterData.company?.city || "-"}
            />
            <DataRow
              label={t("DataTransporterTab.labelProvince", {}, "Provinsi")}
              value={transporterData.company?.province || "-"}
              isOdd={true}
            />
            <DataRow
              label={t("DataTransporterTab.labelPostalCode", {}, "Kode Pos")}
              value={transporterData.company?.postalCode || "-"}
            />

            {/* Map Location */}
            <div className="flex gap-8 bg-neutral-100 px-6 py-4">
              <div className="flex w-44 items-start text-xs font-medium text-neutral-600">
                {t("DataTransporterTab.labelLocationPoint", {}, "Titik Lokasi")}
              </div>
              <div className="flex-1">
                <MapPlaceholder coordinates={coordinates} />
              </div>
            </div>

            {/* Informasi Rekening Perusahaan */}
            <SectionHeader
              title={t(
                "DataTransporterTab.titleCompanyBankInformation",
                {},
                "Informasi Rekening Perusahaan"
              )}
            />
            <DataRow
              label={t("DataTransporterTab.labelBankName", {}, "Nama Bank")}
              value={transporterData.bank?.bankName || "-"}
              isOdd={true}
            />
            <DataRow
              label={t(
                "DataTransporterTab.labelAccountNumber",
                {},
                "No. Rekening"
              )}
              value="21454322"
            />
            <DataRow
              label={t(
                "DataTransporterTab.labelAccountHolderName",
                {},
                "Nama Pemilik Rekening"
              )}
              value={transporterData.bank?.accountHolderName || "-"}
              isOdd={true}
            />
          </div>
        </div>

        {/* Kelengkapan Legalitas Section */}
        <div className="overflow-hidden rounded-xl bg-white shadow-muat">
          <div className="flex px-6 py-6">
            <h2 className="flex-1 text-lg font-semibold text-black">
              {t(
                "DataTransporterTab.titleLegalDocuments",
                {},
                "Kelengkapan Legalitas"
              )}
            </h2>
          </div>

          <div className="flex flex-col">
            <FileRow
              label={t("DataTransporterTab.labelNIB", {}, "NIB")}
              fileName={
                transporterData.documents?.nib?.files?.[0] ? "NIB.pdf" : "-"
              }
              isOdd={true}
            />
            <DataRow
              label={t("DataTransporterTab.labelNIBNumber", {}, "No. NIB")}
              value={transporterData.documents?.nib?.number || "-"}
            />
            <FileRow
              label={t(
                "DataTransporterTab.labelCompanyNPWP",
                {},
                "NPWP Perusahaan"
              )}
              fileName={
                transporterData.documents?.npwp?.files?.[0] ? "NPWP.pdf" : "-"
              }
              isOdd={true}
            />
            <DataRow
              label={t(
                "DataTransporterTab.labelNPWPNumber",
                {},
                "No. NPWP Perusahaan"
              )}
              value={transporterData.documents?.npwp?.number || "-"}
            />
            <FileRow
              label={t(
                "DataTransporterTab.labelRegistrantKTP",
                {},
                "KTP Pendaftar/Pemegang Akun"
              )}
              fileName={
                transporterData.documents?.ktp?.files?.[0] ? "KTP.pdf" : "-"
              }
              isOdd={true}
            />
            <DataRow
              label={t(
                "DataTransporterTab.labelKTPNumber",
                {},
                "No. KTP Pendaftar/Pemegang Akun"
              )}
              value={transporterData.documents?.ktp?.number || "-"}
              isMultiline={true}
            />
            <FileRow
              label={t(
                "DataTransporterTab.labelEstablishmentDeed",
                {},
                "Cover Akta Pendirian"
              )}
              fileName="akta_pendirian.pdf"
              isOdd={true}
            />
            <FileRow
              label={t(
                "DataTransporterTab.labelMinistryDecreeEstablishment",
                {},
                "SK Kemenkumham dari Akta Pendirian"
              )}
              fileName="SK Pendirian.pdf"
            />
            <FileRow
              label={t(
                "DataTransporterTab.labelAmendmentDeed",
                {},
                "Cover Akta Perubahan"
              )}
              fileName="cover_akta_perubahan.pdf"
              isOdd={true}
            />
            <FileRow
              label={t(
                "DataTransporterTab.labelMinistryDecreeAmendment",
                {},
                "SK Kemenkumham dari Akta Perubahan"
              )}
              fileName="SK Perubahan.pdf"
            />

            {/* Multiple Files Row */}
            <div className="flex gap-8 bg-neutral-100 px-6 py-4">
              <div className="flex w-44 items-start text-xs font-medium text-neutral-600">
                {t(
                  "DataTransporterTab.labelStandardCertificate",
                  {},
                  "Sertifikat Standar"
                )}
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
                {t("DataTransporterTab.buttonViewFile", {}, "Lihat File")}
              </Button>
            </div>
          </div>
        </div>

        {/* Kontak PIC Section */}
        <div className="overflow-hidden rounded-xl bg-white shadow-muat">
          <div className="flex px-6 py-6">
            <h2 className="flex-1 text-lg font-semibold text-black">
              {t("DataTransporterTab.titleContactPIC", {}, "Kontak PIC")}
            </h2>
          </div>

          <div className="flex flex-col">
            {transporterData.contacts?.map((contact, index) => (
              <ContactRow
                key={contact.level || index}
                picNumber={`PIC ${contact.level || index + 1}`}
                name={contact.name || "-"}
                position={contact.position || "-"}
                phone={contact.phoneNumber || "-"}
                isOdd={index % 2 !== 0}
              />
            ))}

            {/* Emergency Contact */}
            {transporterData.emergency && (
              <>
                <SectionHeader
                  title={t(
                    "DataTransporterTab.titleEmergencyContact",
                    {},
                    "Kontak Darurat"
                  )}
                />
                <ContactRow
                  picNumber="Emergency"
                  name={transporterData.emergency.name || "-"}
                  position={transporterData.emergency.position || "-"}
                  phone={transporterData.emergency.phoneNumber || "-"}
                  isOdd={true}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default DataTransporterTab;
