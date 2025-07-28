"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Alert } from "@/components/Alert/Alert";
import { PhotoExampleCarousel } from "@/components/BannerCarousel/PhotoExampleCarousel";
import BreadCrumb from "@/components/Breadcrumb/Breadcrumb";
import Button from "@/components/Button/Button";
import Card, { CardContent, CardHeader } from "@/components/Card/Card";
import DatePicker from "@/components/DatePicker/DatePicker";
import FileUploadDocument from "@/components/FileUpload/FileUploadDocument";
import DimensionInput from "@/components/Form/DimensionInput";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import SelectFilterRadix from "@/components/Form/SelectFilterRadix";
import ImageUploaderWeb from "@/components/ImageUploader/ImageUploaderWeb";
import { Modal, ModalContent, ModalHeader } from "@/components/Modal/Modal";
import PageTitle from "@/components/PageTitle/PageTitle";
import Toaster from "@/components/Toaster/Toaster";
import { useDocumentUpload } from "@/hooks/use-document-upload";
import { toast } from "@/lib/toast";
import {
  postNewVehicle,
  useGetBrandsVehicles,
  useGetDataJenisTruk,
  useGetDataTypeCarrier,
  useGetVehiclesDocumentExample,
  useGetVehiclesExamplePhoto,
  useGetVehiclesTypes,
} from "@/services/Transporter/manajemen-armada/getDataFormArmada";
import { useGetVehicleDetail } from "@/services/Transporter/manajemen-armada/getVehiclesDetail";

const BREADCRUMB = [
  { name: "Manajemen Armada", href: "/manajemen-armada" },
  { name: "Ubah Armada" },
];

const inputAppearance = {
  containerClassName: "rounded-[7px] bg-white",
};

const selectClass =
  "w-[328px] rounded-[7px] disabled:bg-gray-200 disabled:text-gray-700 disabled:border-gray-700";
const labelClass = "w-[220px] text-sm text-[#7B7B7B] flex items-center";
const labelClassOptional =
  "w-[220px] font-medium italic text-neutral-500 text-right flex items-center";

const Page = () => {
  const router = useRouter();
  const { uploadDocument } = useDocumentUpload();
  const { uuid } = useParams();
  const { data, error, isLoading } = useGetVehicleDetail(uuid);

  const [formData, setFormData] = useState({
    licensePlate: "",
    truckTypeId: "",
    carrierTruckId: "",
    vehicleBrandId: "",
    vehicleBrandName: "",
    vehicleTypeId: "",
    vehicleTypeName: "",
    registrationYear: "",
    carrierLength: "",
    carrierWidth: "",
    carrierHeight: "",
    carrierDimensionUnit: "m",
    chassisNumber: "",
    stnkExpiryDate: null,
    kirNumber: "",
    kirExpiryDate: null,
    gpsInstallationEstimateStartDate: null,
    gpsInstallationEstimateEndDate: null,
  });

  // State untuk gambar dan dokumen
  const [imgDepan, setImgDepan] = useState(null);
  const [imgBelakang, setImgBelakang] = useState(null);
  const [imgKanan, setImgKanan] = useState(null);
  const [imgKiri, setImgKiri] = useState(null);
  const [docStnk, setDocStnk] = useState(null);
  const [docPajak, setDocPajak] = useState(null);
  const [docKir, setDocKir] = useState(null);

  // State untuk dimensi (DimensionInput memerlukan state terpisah)
  const [panjang, setPanjang] = useState("");
  const [lebar, setLebar] = useState("");
  const [tinggi, setTinggi] = useState("");

  // State untuk validasi errors
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Function untuk menandai field sebagai touched
  const markFieldAsTouched = (fieldName) => {
    setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  // Validasi real-time
  useEffect(() => {
    const newErrors = {};

    // Validasi field wajib
    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = "Nomor polisi wajib diisi";
    } else if (formData.licensePlate.trim().split(" ").length < 2) {
      newErrors.licensePlate = "Format nomor polisi tidak valid";
    }

    if (!formData.truckTypeId) {
      newErrors.truckTypeId = "Jenis truk wajib dipilih";
    }

    if (!formData.carrierTruckId) {
      newErrors.carrierTruckId = "Jenis carrier wajib dipilih";
    }

    if (!formData.vehicleBrandId && !formData.vehicleBrandName) {
      newErrors.vehicleBrandId = "Merek kendaraan wajib dipilih atau diisi";
    }

    if (!formData.vehicleTypeId && !formData.vehicleTypeName) {
      newErrors.vehicleTypeId = "Tipe kendaraan wajib dipilih atau diisi";
    }

    if (!formData.registrationYear) {
      newErrors.registrationYear = "Tahun registrasi wajib dipilih";
    }

    if (!formData.chassisNumber.trim()) {
      newErrors.chassisNumber = "Nomor rangka wajib diisi";
    } else if (formData.chassisNumber.trim().length < 10) {
      newErrors.chassisNumber = "Nomor rangka minimal 10 digit";
    }

    if (!formData.stnkExpiryDate) {
      newErrors.stnkExpiryDate = "Masa berlaku STNK wajib dipilih";
    }

    if (!formData.kirNumber.trim()) {
      newErrors.kirNumber = "Nomor KIR wajib diisi";
    }

    if (!formData.kirExpiryDate) {
      newErrors.kirExpiryDate = "Masa berlaku KIR wajib dipilih";
    }

    if (!formData.gpsInstallationEstimateStartDate) {
      newErrors.gpsInstallationEstimateStartDate =
        "Tanggal mulai pemasangan GPS wajib dipilih";
    }

    if (!formData.gpsInstallationEstimateEndDate) {
      newErrors.gpsInstallationEstimateEndDate =
        "Tanggal selesai pemasangan GPS wajib dipilih";
    }

    // Validasi foto
    if (!imgDepan) {
      newErrors.imgDepan = "Foto tampak depan wajib diupload";
    }

    if (!imgBelakang) {
      newErrors.imgBelakang = "Foto tampak belakang wajib diupload";
    }

    if (!imgKanan) {
      newErrors.imgKanan = "Foto tampak kanan wajib diupload";
    }

    if (!imgKiri) {
      newErrors.imgKiri = "Foto tampak kiri wajib diupload";
    }

    // Validasi dokumen
    if (!docStnk) {
      newErrors.docStnk = "Foto STNK wajib diupload";
    }

    if (!docPajak) {
      newErrors.docPajak = "Foto pajak kendaraan wajib diupload";
    }

    if (!docKir) {
      newErrors.docKir = "Foto buku KIR wajib diupload";
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [
    formData,
    imgDepan,
    imgBelakang,
    imgKanan,
    imgKiri,
    docStnk,
    docPajak,
    docKir,
  ]);

  // Populate form with existing vehicle data
  useEffect(() => {
    if (data?.vehicle) {
      // console.log("Vehicle data received:", data.vehicle);
      const vehicle = data.vehicle;

      setFormData({
        licensePlate: vehicle.licensePlate || "",
        truckTypeId: vehicle.truckType?.id || "",
        carrierTruckId: vehicle.carrierType?.id || "",
        vehicleBrandId: vehicle.vehicleBrand?.id || "",
        vehicleBrandName: vehicle.vehicleBrand?.name || "",
        vehicleTypeId: vehicle.vehicleType?.id || "",
        vehicleTypeName: vehicle.vehicleType?.name || "",
        registrationYear: vehicle.registrationYear?.toString() || "",
        carrierLength: vehicle.carrierLength?.toString() || "",
        carrierWidth: vehicle.carrierWidth?.toString() || "",
        carrierHeight: vehicle.carrierHeight?.toString() || "",
        carrierDimensionUnit: vehicle.carrierDimensionUnit || "m",
        chassisNumber: vehicle.chassisNumber || "",
        stnkExpiryDate: vehicle.stnkExpiryDate
          ? new Date(vehicle.stnkExpiryDate)
          : null,
        kirNumber: vehicle.kirNumber || "",
        kirExpiryDate: vehicle.kirExpiryDate
          ? new Date(vehicle.kirExpiryDate)
          : null,
        gpsInstallationEstimateStartDate:
          vehicle.gpsInstallationEstimateStartDate
            ? new Date(vehicle.gpsInstallationEstimateStartDate)
            : null,
        gpsInstallationEstimateEndDate: vehicle.gpsInstallationEstimateEndDate
          ? new Date(vehicle.gpsInstallationEstimateEndDate)
          : null,
      });

      // Set dimension state (for DimensionInput component)
      setPanjang(vehicle.carrierLength?.toString() || "");
      setLebar(vehicle.carrierWidth?.toString() || "");
      setTinggi(vehicle.carrierHeight?.toString() || "");

      // Set photos
      if (vehicle.photos && Array.isArray(vehicle.photos)) {
        const photos = vehicle.photos;
        setImgDepan(
          photos.find((p) => p.photoType === "FRONT")?.photoUrl || null
        );
        setImgBelakang(
          photos.find((p) => p.photoType === "BACK")?.photoUrl || null
        );
        setImgKanan(
          photos.find((p) => p.photoType === "RIGHT")?.photoUrl || null
        );
        setImgKiri(
          photos.find((p) => p.photoType === "LEFT")?.photoUrl || null
        );
      }

      // Set documents
      if (vehicle.documents && Array.isArray(vehicle.documents)) {
        const documents = vehicle.documents;
        const stnkDoc = documents.find((d) => d.documentType === "STNK");
        const pajakDoc = documents.find(
          (d) => d.documentType === "VEHICLE_TAX"
        );
        const kirDoc = documents.find((d) => d.documentType === "KIR");

        if (stnkDoc) {
          setDocStnk({
            url: stnkDoc.documentUrl,
            name: stnkDoc.documentName,
          });
        }

        if (pajakDoc) {
          setDocPajak({
            url: pajakDoc.documentUrl,
            name: pajakDoc.documentName,
          });
        }

        if (kirDoc) {
          setDocKir({
            url: kirDoc.documentUrl,
            name: kirDoc.documentName,
          });
        }
      }
    }
  }, [data]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleDimensionChange = (dim) => {
    setFormData((prev) => ({
      ...prev,
      carrierLength: dim.p,
      carrierWidth: dim.l,
      carrierHeight: dim.t,
    }));
  };

  const handleLicensePlateChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    let depan = value.slice(0, 2).replace(/[^A-Z]/g, "");
    let sisa = value.slice(depan.length);
    let tengah = "";
    let belakang = "";
    for (let i = 0; i < sisa.length; i++) {
      if (tengah.length < 4 && /[0-9]/.test(sisa[i])) {
        tengah += sisa[i];
      } else if (tengah.length < 1 && /[A-Z]/.test(sisa[i])) {
        break;
      } else if (tengah.length >= 1 && /[A-Z]/.test(sisa[i])) {
        belakang += sisa[i];
        if (belakang.length === 3) break;
      }
    }
    let formatted = depan;
    if (tengah) formatted += ` ${tengah}`;
    if (belakang) formatted += ` ${belakang}`;
    handleChange("licensePlate", formatted.trim());
  };

  const handleLicensePlateKeyDown = (e) => {
    const value = e.target.value.toUpperCase();
    const parts = value.split(" ");
    if (parts.length >= 3) {
      // Sudah di bagian ketiga, hanya boleh huruf
      if (e.key.length === 1 && /[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  const handleChassisNumberChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    handleChange("chassisNumber", value.slice(0, 17));
  };

  // Helper function untuk render error message
  const renderError = (fieldName) => {
    return errors[fieldName] && touchedFields[fieldName] ? (
      <div className="mt-1 text-xs text-red-500">{errors[fieldName]}</div>
    ) : null;
  };

  // Helper function untuk render input dengan error styling
  const renderInputWithError = (fieldName, inputProps) => {
    const hasError = !!errors[fieldName] && !!touchedFields[fieldName];
    return (
      <div>
        <Input
          {...inputProps}
          appearance={{
            ...inputAppearance,
            containerClassName: `rounded-[7px] bg-white ${hasError ? "border-red-500" : ""}`,
          }}
          onBlur={() => markFieldAsTouched(fieldName)}
        />
        {renderError(fieldName)}
      </div>
    );
  };

  // Helper function untuk render select dengan error styling
  const renderSelectWithError = (fieldName, selectProps) => {
    const hasError = !!errors[fieldName] && !!touchedFields[fieldName];
    return (
      <div>
        <SelectFilterRadix
          {...selectProps}
          className={`${selectClass} ${hasError ? "border-red-500" : ""}`}
          onOpenChange={(open) => {
            if (!open) markFieldAsTouched(fieldName);
          }}
        />
        {renderError(fieldName)}
      </div>
    );
  };

  // Helper function untuk render date picker dengan error styling
  const renderDatePickerWithError = (fieldName, datePickerProps) => {
    const hasError = !!errors[fieldName] && !!touchedFields[fieldName];
    return (
      <div>
        <DatePicker
          {...datePickerProps}
          className={`w-[328px] ${hasError ? "border-red-500" : ""}`}
          onOpenChange={(open) => {
            if (!open) markFieldAsTouched(fieldName);
          }}
        />
        {renderError(fieldName)}
      </div>
    );
  };

  const { data: truckTypes, isLoading: isLoadingTruckTypes } =
    useGetDataJenisTruk();
  const { data: carrierTypes, isLoading: isLoadingCarrier } =
    useGetDataTypeCarrier();
  const { data: brands, isLoading: isLoadingBrands } = useGetBrandsVehicles();
  const { data: vehicleTypes, isLoading: isLoadingTypes } =
    useGetVehiclesTypes();
  const filteredTypes = vehicleTypes.filter(
    (item) => item.vehicleBrandId === formData.vehicleBrandId
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 }, (_, i) => {
    const year = (currentYear - i).toString();
    return { label: year, value: year };
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activePreviewIdx, setActivePreviewIdx] = useState(0);

  const photoList = [
    { src: imgDepan, label: "Contoh Foto Tampak Depan Kendaraan" },
    { src: imgBelakang, label: "Contoh Foto Tampak Belakang Kendaraan" },
    { src: imgKanan, label: "Contoh Foto Tampak Kanan Kendaraan" },
    { src: imgKiri, label: "Contoh Foto Tampak Kiri Kendaraan" },
  ];

  const [isPhotoExampleOpen, setIsPhotoExampleOpen] = useState(false);
  const { data: photoExamples, isLoading: isLoadingPhotoExamples } =
    useGetVehiclesExamplePhoto();
  const [activePhotoExampleIdx, setActivePhotoExampleIdx] = useState(0);

  const [isDocumentExampleOpen, setIsDocumentExampleOpen] = useState(false);
  const { data: documentExamples, isLoading: isLoadingDocumentExamples } =
    useGetVehiclesDocumentExample();
  const [activeDocumentExampleIdx, setActiveDocumentExampleIdx] = useState(0);

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Loading and error handling
  if (isLoading) {
    return (
      <div className="mx-auto max-w-[818px] py-6">
        <BreadCrumb data={BREADCRUMB} />
        <PageTitle className="mt-4">Ubah Armada</PageTitle>
        <div className="flex h-64 items-center justify-center">
          <div className="text-lg">Memuat data armada...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-[818px] py-6">
        <BreadCrumb data={BREADCRUMB} />
        <PageTitle className="mt-4">Ubah Armada</PageTitle>
        <div className="flex h-64 items-center justify-center">
          <div className="text-lg text-red-500">Gagal memuat data armada</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-[818px] py-6">
        <BreadCrumb data={BREADCRUMB} />
        <PageTitle className="mt-4">Ubah Armada</PageTitle>

        {/* Warning Alert */}
        <Alert variant="warning" size="big" className="mb-6">
          <div className="flex flex-col gap-2">
            <div className="font-bold text-neutral-900">
              Hal yang perlu diperhatikan sebelum ubah data armada
            </div>
            <div className="text-neutral-900">
              Setelah kamu melakukan pembaruan pada data armada, kami perlu
              memverifikasi kembali data tersebut. Armada yang di-edit tidak
              dapat ditugaskan untuk sementara waktu hingga kami selesai
              melakukan verifikasi data.
            </div>
          </div>
        </Alert>

        {/* Informasi Armada */}
        <Card className="mb-6 !border-none">
          <CardHeader className="!border-b-0 pb-4 text-xl font-semibold">
            Informasi Armada
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-[220px_400px] gap-x-6 gap-y-5">
              <div className={labelClass}>No. Polisi Kendaraan*</div>
              {renderInputWithError("licensePlate", {
                placeholder: "Contoh : L 1234 TY",
                value: formData.licensePlate,
                onChange: handleLicensePlateChange,
                onKeyDown: handleLicensePlateKeyDown,
                className: "w-[328px]",
              })}

              <div className={labelClass}>Jenis Truk*</div>
              {renderSelectWithError("truckTypeId", {
                options: isLoadingTruckTypes
                  ? []
                  : truckTypes.map((item) => ({
                      label: item.name,
                      value: item.id,
                      image: item.icon,
                    })),
                value: formData.truckTypeId,
                onChange: (val) => {
                  handleChange("truckTypeId", val);
                  handleChange("carrierTruckId", "");
                },
                placeholder: "Pilih Jenis Truk",
                classNameOptions: "h-12",
              })}

              <div className={labelClass}>Jenis Carrier*</div>
              {renderSelectWithError("carrierTruckId", {
                options:
                  formData.truckTypeId && !isLoadingCarrier
                    ? carrierTypes
                        .filter(
                          (item) => item.truckTypeId === formData.truckTypeId
                        )
                        .map((item) => ({
                          label: item.name,
                          value: item.id,
                          image: item.icon,
                        }))
                    : [],
                value: formData.carrierTruckId,
                onChange: (val) => handleChange("carrierTruckId", val),
                placeholder: "Pilih Jenis Carrier",
                disabled: !formData.truckTypeId || isLoadingCarrier,
                classNameOptions: "h-12",
              })}

              <div className={labelClass}>Merek Kendaraan*</div>
              {renderSelectWithError("vehicleBrandId", {
                addData: true,
                addLabel: "Tambah Merek Kendaraan",
                options: brands.map((item) => ({
                  label: item.name,
                  value: item.id,
                })),
                value: formData.vehicleBrandId,
                onChange: (val) => {
                  handleChange("vehicleBrandId", val);
                  handleChange("vehicleTypeId", "");
                },
                placeholder: "Pilih Merek Kendaraan",
                disabled: isLoadingBrands,
                addModalTitle: "Tambah Merek Kendaraan",
                addModalPlaceholder: "Masukkan Merek Kendaraan",
                addModalMinLength: 3,
                addModalValidate: (val) => /^[a-zA-Z0-9\s]+$/.test(val),
                addModalErrorMessage: "Nama merek tidak valid",
                onAddNew: (newBrand) => {
                  handleChange("vehicleBrandName", newBrand);
                },
              })}

              <div className={labelClass}>Tipe Kendaraan*</div>
              {renderSelectWithError("vehicleTypeId", {
                addData: true,
                addLabel: "Tambah Tipe Kendaraan",
                options:
                  formData.vehicleBrandId && !isLoadingTypes
                    ? filteredTypes.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))
                    : [],
                value: formData.vehicleTypeId,
                onChange: (val) => handleChange("vehicleTypeId", val),
                placeholder: "Pilih Tipe Kendaraan",
                disabled: !formData.vehicleBrandId || isLoadingTypes,
                addModalTitle: "Tambah Tipe Kendaraan",
                addModalPlaceholder: "Masukkan Tipe Kendaraan",
                addModalMinLength: 3,
                addModalValidate: (val) => /^[a-zA-Z0-9\s]+$/.test(val),
                addModalErrorMessage: "Nama tipe tidak valid",
                onAddNew: (newType) => {
                  handleChange("vehicleTypeName", newType);
                },
              })}

              <div className={labelClass}>Tahun Registrasi Kendaraan*</div>
              <div>
                <Select
                  options={years}
                  value={formData.registrationYear}
                  onChange={(val) => handleChange("registrationYear", val)}
                  placeholder="Pilih Tahun"
                  className={
                    selectClass +
                    (formData.registrationYear ? " text-neutral-900" : "") +
                    (errors.registrationYear && touchedFields.registrationYear
                      ? " border-red-500"
                      : "")
                  }
                  onOpenChange={(open) => {
                    if (!open) markFieldAsTouched("registrationYear");
                  }}
                />
                {renderError("registrationYear")}
              </div>

              <div className={labelClass}>Dimensi Carrier (Optional)</div>
              <div className="flex w-[328px] gap-2">
                <DimensionInput
                  manual={{
                    panjang: { value: panjang, setValue: setPanjang },
                    lebar: { value: lebar, setValue: setLebar },
                    tinggi: { value: tinggi, setValue: setTinggi },
                  }}
                />
                <Select
                  options={[
                    { label: "m", value: "m" },
                    { label: "cm", value: "cm" },
                  ]}
                  value={formData.carrierDimensionUnit}
                  onChange={(val) => handleChange("carrierDimensionUnit", val)}
                  placeholder="m"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Foto Armada */}
        <Card className="mb-6 !border-none">
          <CardHeader className="!border-b-0 pb-0 text-xl font-semibold">
            Foto Armada
            <div className="mt-2 flex items-center gap-1 text-sm">
              <span className="font-normal">Lihat contoh foto armada</span>
              <a
                href="#"
                className="font-medium text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPhotoExampleOpen(true);
                  setActivePhotoExampleIdx(0);
                }}
              >
                di sini
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="mt-2 grid grid-cols-[180px_1fr] items-start gap-x-3 gap-y-2">
                <div>
                  <div className="mb-1 text-sm font-normal text-neutral-500">
                    Foto Armada*
                  </div>
                  <div className="text-xs text-neutral-500">
                    Pastikan plat kendaraan terlihat jelas.
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <ImageUploaderWeb
                      uploadText={"Tampak Depan"}
                      className="h-[120px] w-[120px]"
                      value={imgDepan}
                      onUpload={(img) => {
                        setImgDepan(img);
                        markFieldAsTouched("imgDepan");
                      }}
                      onClick={() => {
                        setIsPreviewOpen(true);
                        setActivePreviewIdx(0);
                      }}
                    />
                    {renderError("imgDepan")}
                  </div>
                  <div>
                    <ImageUploaderWeb
                      uploadText={"Tampak Belakang"}
                      className="h-[120px] w-[120px]"
                      value={imgBelakang}
                      onUpload={(img) => {
                        setImgBelakang(img);
                        markFieldAsTouched("imgBelakang");
                      }}
                      onClick={() => {
                        setIsPreviewOpen(true);
                        setActivePreviewIdx(1);
                      }}
                    />
                    {renderError("imgBelakang")}
                  </div>
                  <div>
                    <ImageUploaderWeb
                      uploadText={"Tampak Kanan"}
                      className="h-[120px] w-[120px]"
                      value={imgKanan}
                      onUpload={(img) => {
                        setImgKanan(img);
                        markFieldAsTouched("imgKanan");
                      }}
                      onClick={() => {
                        setIsPreviewOpen(true);
                        setActivePreviewIdx(2);
                      }}
                    />
                    {renderError("imgKanan")}
                  </div>
                  <div>
                    <ImageUploaderWeb
                      uploadText={"Tampak Kiri"}
                      className="h-[120px] w-[120px]"
                      value={imgKiri}
                      onUpload={(img) => {
                        setImgKiri(img);
                        markFieldAsTouched("imgKiri");
                      }}
                      onClick={() => {
                        setIsPreviewOpen(true);
                        setActivePreviewIdx(3);
                      }}
                    />
                    {renderError("imgKiri")}
                  </div>
                </div>
              </div>
              <div className="ms-44 mt-2 text-center text-xs text-neutral-500">
                Unggah 1 gambar pada masing-masing tipe dengan format
                .jpg/.jpeg/.png, besar file maks. 10MB
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dokumen Armada */}
        <Card className="mb-6 !border-none">
          <CardHeader className="!border-b-0 pb-4 text-xl font-semibold">
            Dokumen Armada
            <div className="mt-2 flex items-center gap-1 text-sm">
              <span className="font-normal">Lihat contoh dokumen armada</span>
              <a
                href="#"
                className="font-medium text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDocumentExampleOpen(true);
                  setActiveDocumentExampleIdx(0);
                }}
              >
                di sini
              </a>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-[220px_328px] gap-x-6 gap-y-5">
              <div className={labelClass}>Nomor Rangka*</div>
              {renderInputWithError("chassisNumber", {
                placeholder: "Nomor Rangka Maksimal 17 Digit",
                value: formData.chassisNumber,
                onChange: handleChassisNumberChange,
                className: "w-[328px]",
              })}

              <div className={labelClass}>Masa Berlaku STNK*</div>
              {renderDatePickerWithError("stnkExpiryDate", {
                value: formData.stnkExpiryDate,
                onChange: (val) => handleChange("stnkExpiryDate", val),
                placeholder: "Pilih Tanggal Masa Berlaku STNK",
              })}

              <div className={labelClass}>Foto STNK*</div>
              <div className="w-[328px]">
                <FileUploadDocument
                  value={docStnk}
                  onSuccess={(doc) => {
                    setDocStnk(doc);
                    markFieldAsTouched("docStnk");
                    // console.log("STNK file uploaded:", doc);
                  }}
                  onError={(err) => {
                    console.error("STNK file upload error:", err);
                    markFieldAsTouched("docStnk");
                  }}
                  maxSize={10}
                  acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                />
                {renderError("docStnk")}
              </div>

              <div className={labelClass}>Foto Pajak Kendaraan*</div>
              <div className="w-[328px]">
                <FileUploadDocument
                  value={docPajak}
                  onSuccess={(doc) => {
                    setDocPajak(doc);
                    markFieldAsTouched("docPajak");
                    // console.log("Pajak file uploaded:", doc);
                  }}
                  onError={(err) => {
                    console.error("Pajak file upload error:", err);
                    markFieldAsTouched("docPajak");
                  }}
                  maxSize={10}
                  acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                />
                {renderError("docPajak")}
              </div>

              <div className={labelClass}>KIR Kendaraan*</div>
              {renderInputWithError("kirNumber", {
                placeholder: "Contoh : SBY 123456",
                value: formData.kirNumber || "",
                onChange: (e) => handleChange("kirNumber", e.target.value),
                className: "w-[328px]",
              })}

              <div className={labelClass}>Masa Berlaku KIR*</div>
              {renderDatePickerWithError("kirExpiryDate", {
                value: formData.kirExpiryDate,
                onChange: (val) => handleChange("kirExpiryDate", val),
                placeholder: "Pilih Tanggal Masa Berlaku KIR",
              })}

              <div className={labelClass}>Foto Buku KIR*</div>
              <div className="w-[328px]">
                <FileUploadDocument
                  value={docKir}
                  onSuccess={(doc) => {
                    setDocKir(doc);
                    markFieldAsTouched("docKir");
                    // console.log("KIR file uploaded:", doc);
                  }}
                  onError={(err) => {
                    console.error("KIR file upload error:", err);
                    markFieldAsTouched("docKir");
                  }}
                  maxSize={10}
                  acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                />
                {renderError("docKir")}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informasi Pemasangan GPS */}
        <Card className="mb-6 !border-none">
          <CardHeader className="!border-b-0 pb-4 text-xl font-semibold">
            Informasi Pemasangan GPS
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-start gap-x-6">
              <div className={labelClass}>Estimasi Tanggal Pemasangan GPS*</div>
              <div className="flex items-start gap-2">
                <div>
                  <DatePicker
                    className={`w-[200px] ${errors.gpsInstallationEstimateStartDate && touchedFields.gpsInstallationEstimateStartDate ? "border-red-500" : ""}`}
                    value={formData.gpsInstallationEstimateStartDate}
                    onChange={(val) =>
                      handleChange("gpsInstallationEstimateStartDate", val)
                    }
                    placeholder="Tanggal Mulai"
                    onOpenChange={(open) => {
                      if (!open)
                        markFieldAsTouched("gpsInstallationEstimateStartDate");
                    }}
                  />
                  {renderError("gpsInstallationEstimateStartDate")}
                </div>
                <span className="mt-2 text-sm text-neutral-600">s/d</span>
                <div>
                  <DatePicker
                    className={`w-[200px] ${errors.gpsInstallationEstimateEndDate && touchedFields.gpsInstallationEstimateEndDate ? "border-red-500" : ""}`}
                    value={formData.gpsInstallationEstimateEndDate}
                    onChange={(val) =>
                      handleChange("gpsInstallationEstimateEndDate", val)
                    }
                    placeholder="Tanggal Selesai"
                    onOpenChange={(open) => {
                      if (!open)
                        markFieldAsTouched("gpsInstallationEstimateEndDate");
                    }}
                  />
                  {renderError("gpsInstallationEstimateEndDate")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="ml-auto mt-8 flex w-[620px] justify-end gap-4">
          {/* {submitError && (
            <div className="mr-4 self-center text-sm text-red-500">
              {submitError}
            </div>
          )} */}
          <Button
            variant="muattrans-primary-secondary"
            className="h-[44px] w-[120px] text-base"
            onClick={() => setIsCancelModalOpen(true)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            variant="muattrans-primary"
            className="h-[44px] w-[120px] text-base"
            onClick={() => {
              if (!isFormValid) {
                // Mark semua field sebagai touched untuk menampilkan semua error
                const allFields = [
                  "licensePlate",
                  "truckTypeId",
                  "carrierTruckId",
                  "vehicleBrandId",
                  "vehicleTypeId",
                  "registrationYear",
                  "chassisNumber",
                  "stnkExpiryDate",
                  "kirNumber",
                  "kirExpiryDate",
                  "gpsInstallationEstimateStartDate",
                  "gpsInstallationEstimateEndDate",
                  "imgDepan",
                  "imgBelakang",
                  "imgKanan",
                  "imgKiri",
                  "docStnk",
                  "docPajak",
                  "docKir",
                ];
                const touchedUpdate = {};
                allFields.forEach((field) => (touchedUpdate[field] = true));
                setTouchedFields(touchedUpdate);
                setSubmitError("Terdapat field yang kosong");
                toast.error("Terdapat field yang kosong");
                return;
              }
              setIsSaveModalOpen(true);
            }}
            // disabled={isSubmitting}
          >
            Simpan
          </Button>
        </div>

        {/* Modal Carousel Preview Foto */}
        {isPreviewOpen && (
          <Modal open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <div className="flex flex-col items-center p-6">
              <div className="mb-4 text-center text-lg font-bold">
                {photoList[activePreviewIdx].label}
              </div>
              <div className="relative flex w-full max-w-2xl items-center justify-center">
                <button
                  onClick={() =>
                    setActivePreviewIdx((prev) =>
                      prev === 0 ? photoList.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-10 z-10 rounded-full bg-white p-2 shadow"
                  style={{ left: "-32px" }}
                  aria-label="Sebelumnya"
                >
                  &#60;
                </button>
                <img
                  src={photoList[activePreviewIdx].src}
                  alt={photoList[activePreviewIdx].label}
                  className="max-h-[350px] max-w-full rounded-lg object-contain"
                  style={{ minHeight: "200px", background: "#f3f3f3" }}
                />
                <button
                  onClick={() =>
                    setActivePreviewIdx((prev) =>
                      prev === photoList.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-0 z-10 rounded-full bg-white p-2 shadow"
                  style={{ right: "-32px" }}
                  aria-label="Berikutnya"
                >
                  &#62;
                </button>
              </div>
              <div className="mt-4 flex gap-2">
                {photoList.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo.src}
                    alt={photo.label}
                    className={`h-16 w-16 cursor-pointer rounded-md border-2 ${activePreviewIdx === idx ? "border-primary-700" : "border-transparent"}`}
                    onClick={() => setActivePreviewIdx(idx)}
                    style={{ objectFit: "cover", background: "#f3f3f3" }}
                  />
                ))}
              </div>
            </div>
          </Modal>
        )}

        {/* Modal Contoh Foto Armada */}
        {isPhotoExampleOpen && (
          <Modal open={isPhotoExampleOpen} onOpenChange={setIsPhotoExampleOpen}>
            <ModalContent className="min-w-[708px] max-w-[708px]">
              <div className="flex flex-col items-center p-6">
                {isLoadingPhotoExamples ? (
                  <div className="text-center">Memuat...</div>
                ) : photoExamples.length > 0 ? (
                  <>
                    <div className="mb-2 text-center text-lg font-bold capitalize">
                      {photoExamples[activePhotoExampleIdx]?.description}
                    </div>
                    <PhotoExampleCarousel
                      images={photoExamples}
                      index={activePhotoExampleIdx}
                      onIndexChange={setActivePhotoExampleIdx}
                      height={391}
                      showIndicators={false}
                      width={660}
                    />
                    <div className="mt-2 flex gap-4">
                      {photoExamples.map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo.photoUrl}
                          alt={photo.description}
                          className={`h-14 w-14 cursor-pointer rounded-md border-2 ${activePhotoExampleIdx === idx ? "border-primary-700" : "border-transparent"}`}
                          onClick={() => setActivePhotoExampleIdx(idx)}
                          style={{ objectFit: "cover", background: "#f3f3f3" }}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center">Tidak ada data contoh foto.</div>
                )}
              </div>
            </ModalContent>
          </Modal>
        )}

        {/* Modal Contoh Dokumen Armada */}
        {isDocumentExampleOpen && (
          <Modal
            open={isDocumentExampleOpen}
            onOpenChange={setIsDocumentExampleOpen}
          >
            <ModalContent className="min-w-[708px] max-w-[708px]">
              <div className="flex flex-col items-center p-6">
                {isLoadingDocumentExamples ? (
                  <div className="text-center">Memuat...</div>
                ) : documentExamples.length > 0 ? (
                  <>
                    <div className="mb-2 text-center text-lg font-bold capitalize">
                      {documentExamples[activeDocumentExampleIdx]?.description}
                    </div>
                    <PhotoExampleCarousel
                      images={documentExamples.map((doc, idx) => ({
                        ...doc,
                        url: doc.documentUrl,
                        alt: doc.description,
                        id: doc.documentType || idx,
                      }))}
                      index={activeDocumentExampleIdx}
                      onIndexChange={setActiveDocumentExampleIdx}
                      height={391}
                      width={660}
                      showIndicators={false}
                      renderImage={(doc) =>
                        doc.documentUrl.endsWith(".pdf") ? (
                          <div className="flex h-full w-full flex-col items-center justify-center bg-neutral-100">
                            <img
                              src="/icons/pdf-icon.svg"
                              alt="PDF"
                              className="mb-2 h-16 w-16"
                            />
                            <a
                              href={doc.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 underline"
                            >
                              Lihat PDF
                            </a>
                          </div>
                        ) : (
                          <img
                            src={doc.documentUrl}
                            alt={doc.description}
                            className="h-full w-full bg-neutral-100 object-contain"
                            style={{ minHeight: 391, minWidth: 660 }}
                          />
                        )
                      }
                    />
                    <div className="mt-2 flex gap-4">
                      {documentExamples.map((doc, idx) =>
                        doc.documentUrl.endsWith(".pdf") ? (
                          <div
                            key={idx}
                            className={`flex h-14 w-14 cursor-pointer flex-col items-center justify-center rounded-md border-2 ${activeDocumentExampleIdx === idx ? "border-primary-700" : "border-transparent"} bg-neutral-100`}
                            onClick={() => setActiveDocumentExampleIdx(idx)}
                          >
                            <img
                              src="/icons/pdf-icon.svg"
                              alt="PDF"
                              className="h-8 w-8"
                            />
                          </div>
                        ) : (
                          <img
                            key={idx}
                            src={doc.documentUrl}
                            alt={doc.description}
                            className={`h-14 w-14 cursor-pointer rounded-md border-2 ${activeDocumentExampleIdx === idx ? "border-primary-700" : "border-transparent"}`}
                            onClick={() => setActiveDocumentExampleIdx(idx)}
                            style={{
                              objectFit: "cover",
                              background: "#f3f3f3",
                            }}
                          />
                        )
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    Tidak ada data contoh dokumen.
                  </div>
                )}
              </div>
            </ModalContent>
          </Modal>
        )}

        {/* Save Confirmation Modal */}
        <Modal open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
          <ModalContent type="muatmuat" className="w-[386px]">
            <ModalHeader size="small" />
            <div className="flex flex-col items-center gap-y-6 px-6 py-9">
              <h1 className="text-base font-bold leading-[19.2px] text-neutral-900">
                Apakah kamu yakin menyimpan data ini?
              </h1>
              <div className="flex items-center gap-x-2">
                <Button
                  variant="muattrans-primary-secondary"
                  className="h-[44px] w-[120px] text-base"
                  onClick={() => setIsSaveModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Tidak
                </Button>
                <Button
                  variant="muattrans-primary"
                  className="h-[44px] w-[120px] text-base"
                  onClick={async () => {
                    setIsSubmitting(true);
                    setSubmitError("");
                    try {
                      const dokumenList = [
                        docStnk && {
                          documentType: "STNK",
                          documentUrl: docStnk.url,
                          documentName: docStnk.name,
                        },
                        docPajak && {
                          documentType: "VEHICLE_TAX",
                          documentUrl: docPajak.url,
                          documentName: docPajak.name,
                        },
                        docKir && {
                          documentType: "KIR",
                          documentUrl: docKir.url,
                          documentName: docKir.name,
                        },
                      ].filter(Boolean);
                      const payload = {
                        ...formData,
                        registrationYear: Number(formData.registrationYear),
                        carrierLength:
                          Number(formData.carrierLength) || undefined,
                        carrierWidth:
                          Number(formData.carrierWidth) || undefined,
                        carrierHeight:
                          Number(formData.carrierHeight) || undefined,
                        photos: [
                          imgDepan && {
                            photoType: "FRONT",
                            photoUrl: imgDepan,
                            photoName: "FRONT.jpg",
                          },
                          imgBelakang && {
                            photoType: "BACK",
                            photoUrl: imgBelakang,
                            photoName: "BACK.jpg",
                          },
                          imgKanan && {
                            photoType: "LEFT",
                            photoUrl: imgKanan,
                            photoName: "LEFT.jpg",
                          },
                          imgKiri && {
                            photoType: "RIGHT",
                            photoUrl: imgKiri,
                            photoName: "RIGHT.jpg",
                          },
                        ].filter(Boolean),
                        documents: dokumenList,
                      };
                      // TODO: Ganti dengan token asli user
                      const token = "DUMMY_TOKEN";
                      await postNewVehicle(payload, token);
                      setIsSaveModalOpen(false);
                      router.push("/manajemen-armada");
                    } catch (err) {
                      setSubmitError(
                        err?.Message?.Text || "Gagal menyimpan data"
                      );
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Ya"}
                </Button>
              </div>
            </div>
          </ModalContent>
        </Modal>

        {/* Cancel Confirmation Modal */}
        <Modal open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
          <ModalContent type="muatmuat" className="w-[496px]">
            <ModalHeader type="muatmuat" size="small" />
            <div className="flex flex-col items-center gap-y-6 px-6 py-9">
              <p className="text-center text-base font-medium leading-[22.4px] text-neutral-900">
                Apakah kamu yakin ingin berpindah halaman? Data yang telah diisi
                tidak akan disimpan
              </p>
              <div className="flex items-center gap-x-2">
                <Button
                  variant="muattrans-primary-secondary"
                  className="h-[44px] w-[120px] text-base"
                  onClick={() => router.push("/transporter/manajemen-armada")}
                >
                  Ya
                </Button>
                <Button
                  variant="muattrans-primary"
                  className="h-[44px] w-[120px] text-base"
                  onClick={() => setIsCancelModalOpen(false)}
                >
                  Batal
                </Button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      </div>
      <Toaster />
    </>
  );
};

export default Page;
