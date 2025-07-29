"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

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
import { useTranslation } from "@/hooks/use-translation";
import {
  postNewVehicle,
  useGetBrandsVehicles,
  useGetDataJenisTruk,
  useGetDataTypeCarrier,
  useGetVehiclesDocumentExample,
  useGetVehiclesExamplePhoto,
  useGetVehiclesTypes,
} from "@/services/Transporter/manajemen-armada/getDataFormArmada";

const Page = () => {
  const router = useRouter();
  const { uploadDocument } = useDocumentUpload();
  const { t, isTranslationsReady } = useTranslation();

  // Valibot validation schema for fleet information form
  const fleetInformationSchema = v.object({
    // Required fields
    licensePlate: v.pipe(
      v.string("Nomor polisi wajib diisi"),
      v.minLength(1, "Nomor polisi wajib diisi"),
      v.custom((value) => {
        const parts = value.trim().split(" ");
        return parts.length >= 2;
      }, "Format nomor polisi tidak valid")
    ),
    truckTypeId: v.pipe(
      v.string("Jenis truk wajib dipilih"),
      v.minLength(1, "Jenis truk wajib dipilih")
    ),
    carrierTruckId: v.pipe(
      v.string("Jenis carrier wajib dipilih"),
      v.minLength(1, "Jenis carrier wajib dipilih")
    ),
    vehicleBrandId: v.pipe(
      v.string("Merek kendaraan wajib dipilih atau diisi"),
      v.minLength(1, "Merek kendaraan wajib dipilih atau diisi")
    ),
    vehicleBrandName: v.optional(v.string()),
    vehicleTypeId: v.pipe(
      v.string("Tipe kendaraan wajib dipilih atau diisi"),
      v.minLength(1, "Tipe kendaraan wajib dipilih atau diisi")
    ),
    vehicleTypeName: v.optional(v.string()),
    registrationYear: v.pipe(
      v.string("Tahun registrasi wajib dipilih"),
      v.minLength(1, "Tahun registrasi wajib dipilih")
    ),

    // Optional carrier dimensions
    carrierLength: v.optional(v.string()),
    carrierWidth: v.optional(v.string()),
    carrierHeight: v.optional(v.string()),
    carrierDimensionUnit: v.optional(v.string()),

    // Required fields for documents
    chassisNumber: v.pipe(
      v.string("Nomor rangka wajib diisi"),
      v.minLength(1, "Nomor rangka wajib diisi"),
      v.minLength(10, "Nomor rangka minimal 10 digit")
    ),
    stnkExpiryDate: v.pipe(
      v.date("Masa berlaku STNK wajib dipilih"),
      v.custom((date) => date !== null, "Masa berlaku STNK wajib dipilih")
    ),
    kirNumber: v.pipe(
      v.string("Nomor KIR wajib diisi"),
      v.minLength(1, "Nomor KIR wajib diisi")
    ),
    kirExpiryDate: v.pipe(
      v.date("Masa berlaku KIR wajib dipilih"),
      v.custom((date) => date !== null, "Masa berlaku KIR wajib dipilih")
    ),
    gpsInstallationEstimateStartDate: v.pipe(
      v.date("Tanggal mulai pemasangan GPS wajib dipilih"),
      v.custom(
        (date) => date !== null,
        "Tanggal mulai pemasangan GPS wajib dipilih"
      )
    ),
    gpsInstallationEstimateEndDate: v.pipe(
      v.date("Tanggal selesai pemasangan GPS wajib dipilih"),
      v.custom(
        (date) => date !== null,
        "Tanggal selesai pemasangan GPS wajib dipilih"
      )
    ),

    // Image validations
    imgDepan: v.custom(
      (value) => value !== null,
      "Foto tampak depan wajib diupload"
    ),
    imgBelakang: v.custom(
      (value) => value !== null,
      "Foto tampak belakang wajib diupload"
    ),
    imgKanan: v.custom(
      (value) => value !== null,
      "Foto tampak kanan wajib diupload"
    ),
    imgKiri: v.custom(
      (value) => value !== null,
      "Foto tampak kiri wajib diupload"
    ),

    // Document validations
    docStnk: v.custom((value) => value !== null, "Foto STNK wajib diupload"),
    docPajak: v.custom(
      (value) => value !== null,
      "Foto pajak kendaraan wajib diupload"
    ),
    docKir: v.custom((value) => value !== null, "Foto buku KIR wajib diupload"),
  });

  const inputAppearance = {
    containerClassName: "rounded-[7px] bg-white",
  };

  const selectClass =
    "w-[328px] rounded-[7px] disabled:bg-gray-200 disabled:text-gray-700 disabled:border-gray-700";
  const labelClass = "w-[220px] text-sm text-[#7B7B7B] flex items-center";
  const labelClassOptional =
    "w-[220px] font-medium italic text-neutral-500 text-right flex items-center";

  // Initialize form with react-hook-form and valibot resolver
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    trigger,
    clearErrors,
  } = useForm({
    resolver: valibotResolver(fleetInformationSchema),
    mode: "onChange",
    defaultValues: {
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
      imgDepan: null,
      imgBelakang: null,
      imgKanan: null,
      imgKiri: null,
      docStnk: null,
      docPajak: null,
      docKir: null,
    },
  });

  // State untuk gambar dan dokumen
  const [imgDepan, setImgDepan] = useState(null);
  const [imgBelakang, setImgBelakang] = useState(null);
  const [imgKanan, setImgKanan] = useState(null);
  const [imgKiri, setImgKiri] = useState(null);
  const [docStnk, setDocStnk] = useState(null);
  const [docPajak, setDocPajak] = useState(null);
  const [docKir, setDocKir] = useState(null);

  // Function untuk menandai field sebagai touched
  const markFieldAsTouched = (fieldName) => {
    trigger(fieldName);
  };

  // Update form values when images/documents change
  useEffect(() => {
    setValue("imgDepan", imgDepan);
    setValue("imgBelakang", imgBelakang);
    setValue("imgKanan", imgKanan);
    setValue("imgKiri", imgKiri);
    setValue("docStnk", docStnk);
    setValue("docPajak", docPajak);
    setValue("docKir", docKir);
  }, [
    imgDepan,
    imgBelakang,
    imgKanan,
    imgKiri,
    docStnk,
    docPajak,
    docKir,
    setValue,
  ]);

  const handleChange = (field, value) => {
    setValue(field, value);
    trigger(field);
  };

  const handleDimensionChange = (dim) => {
    setValue("carrierLength", dim.p);
    setValue("carrierWidth", dim.l);
    setValue("carrierHeight", dim.t);
    trigger("carrierLength");
    trigger("carrierWidth");
    trigger("carrierHeight");
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
    if (!errors[fieldName] || !errors[fieldName].message) return null;

    // Map error messages to translation keys
    const errorMessageMap = {
      "Nomor polisi wajib diisi": "errorLicensePlateRequired",
      "Format nomor polisi tidak valid": "errorInvalidLicensePlateFormat",
      "Jenis truk wajib dipilih": "errorTruckTypeRequired",
      "Jenis carrier wajib dipilih": "errorCarrierTypeRequired",
      "Merek kendaraan wajib dipilih atau diisi": "errorVehicleBrandRequired",
      "Tipe kendaraan wajib dipilih atau diisi": "errorVehicleTypeRequired",
      "Tahun registrasi wajib dipilih": "errorRegistrationYearRequired",
      "Nomor rangka wajib diisi": "errorChassisNumberRequired",
      "Nomor rangka minimal 10 digit": "errorChassisNumberMinLength",
      "Masa berlaku STNK wajib dipilih": "errorStnkExpiryRequired",
      "Nomor KIR wajib diisi": "errorKirNumberRequired",
      "Masa berlaku KIR wajib dipilih": "errorKirExpiryRequired",
      "Tanggal mulai pemasangan GPS wajib dipilih": "errorGpsStartDateRequired",
      "Tanggal selesai pemasangan GPS wajib dipilih": "errorGpsEndDateRequired",
      "Foto tampak depan wajib diupload": "errorFrontPhotoRequired",
      "Foto tampak belakang wajib diupload": "errorBackPhotoRequired",
      "Foto tampak kanan wajib diupload": "errorRightPhotoRequired",
      "Foto tampak kiri wajib diupload": "errorLeftPhotoRequired",
      "Foto STNK wajib diupload": "errorStnkPhotoRequired",
      "Foto pajak kendaraan wajib diupload": "errorVehicleTaxPhotoRequired",
      "Foto buku KIR wajib diupload": "errorKirBookPhotoRequired",
    };

    const originalMessage = errors[fieldName].message;
    const translationKey = errorMessageMap[originalMessage];
    const translatedMessage = translationKey
      ? t(translationKey)
      : originalMessage;

    return <div className="mt-1 text-xs text-red-500">{translatedMessage}</div>;
  };

  // Helper function untuk render input dengan error styling
  const renderInputWithError = (fieldName, inputProps) => {
    const hasError = !!errors[fieldName];
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
    const hasError = !!errors[fieldName];
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
    const hasError = !!errors[fieldName];
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
    (item) => item.vehicleBrandId === watch("vehicleBrandId")
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 }, (_, i) => {
    const year = (currentYear - i).toString();
    return { label: year, value: year };
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activePreviewIdx, setActivePreviewIdx] = useState(0);

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

  // Show loading state while translations are not ready
  if (!isTranslationsReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  // Define BREADCRUMB with translated labels
  const BREADCRUMB = [
    { name: t("titleFleetManagement"), href: "/manajemen-armada" },
    { name: t("titleAddFleet") },
  ];

  // Define photoList with translated labels
  const photoList = [
    { src: imgDepan, label: t("labelExampleFrontPhoto") },
    { src: imgBelakang, label: t("labelExampleBackPhoto") },
    { src: imgKanan, label: t("labelExampleRightPhoto") },
    { src: imgKiri, label: t("labelExampleLeftPhoto") },
  ];

  return (
    <>
      <div className="mx-auto max-w-[818px] py-6">
        <BreadCrumb data={BREADCRUMB} />
        <PageTitle className="mt-4">{t("titleAddFleet")}</PageTitle>

        {/* Informasi Armada */}
        <Card className="mb-6 !border-none">
          <CardHeader className="!border-b-0 pb-4 text-xl font-semibold">
            {t("titleFleetInformation")}
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-[220px_400px] gap-x-6 gap-y-5">
              <div className={labelClass}>{t("labelLicensePlate")}</div>
              {renderInputWithError("licensePlate", {
                placeholder: t("placeholderLicensePlate"),
                value: watch("licensePlate"),
                onChange: handleLicensePlateChange,
                onKeyDown: handleLicensePlateKeyDown,
                className: "w-[328px]",
              })}

              <div className={labelClass}>{t("labelTruckType")}</div>
              {renderSelectWithError("truckTypeId", {
                options: isLoadingTruckTypes
                  ? []
                  : truckTypes.map((item) => ({
                      label: item.name,
                      value: item.id,
                      image: item.icon,
                    })),
                value: watch("truckTypeId"),
                onChange: (val) => {
                  handleChange("truckTypeId", val);
                  handleChange("carrierTruckId", "");
                },
                placeholder: t("placeholderTruckType"),
                classNameOptions: "h-12",
              })}

              <div className={labelClass}>{t("labelCarrierType")}</div>
              {renderSelectWithError("carrierTruckId", {
                options:
                  watch("truckTypeId") && !isLoadingCarrier
                    ? carrierTypes
                        .filter(
                          (item) => item.truckTypeId === watch("truckTypeId")
                        )
                        .map((item) => ({
                          label: item.name,
                          value: item.id,
                          image: item.icon,
                        }))
                    : [],
                value: watch("carrierTruckId"),
                onChange: (val) => handleChange("carrierTruckId", val),
                placeholder: t("placeholderCarrierType"),
                disabled: !watch("truckTypeId") || isLoadingCarrier,
                classNameOptions: "h-12",
              })}

              <div className={labelClass}>{t("labelVehicleBrand")}</div>
              {renderSelectWithError("vehicleBrandId", {
                addData: true,
                addLabel: t("buttonAddVehicleBrand"),
                options: brands.map((item) => ({
                  label: item.name,
                  value: item.id,
                })),
                value: watch("vehicleBrandId"),
                onChange: (val) => {
                  handleChange("vehicleBrandId", val);
                  handleChange("vehicleTypeId", "");
                },
                placeholder: t("placeholderVehicleBrand"),
                disabled: isLoadingBrands,
                addModalTitle: t("buttonAddVehicleBrand"),
                addModalPlaceholder: t("placeholderAddVehicleBrand"),
                addModalMinLength: 3,
                addModalValidate: (val) => /^[a-zA-Z0-9\s]+$/.test(val),
                addModalErrorMessage: t("errorInvalidBrandName"),
                onAddNew: (newBrand) => {
                  handleChange("vehicleBrandName", newBrand);
                },
              })}

              <div className={labelClass}>{t("labelVehicleType")}</div>
              {renderSelectWithError("vehicleTypeId", {
                addData: true,
                addLabel: t("buttonAddVehicleType"),
                options:
                  watch("vehicleBrandId") && !isLoadingTypes
                    ? filteredTypes.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))
                    : [],
                value: watch("vehicleTypeId"),
                onChange: (val) => handleChange("vehicleTypeId", val),
                placeholder: t("placeholderVehicleType"),
                disabled: !watch("vehicleBrandId") || isLoadingTypes,
                addModalTitle: t("buttonAddVehicleType"),
                addModalPlaceholder: t("placeholderAddVehicleType"),
                addModalMinLength: 3,
                addModalValidate: (val) => /^[a-zA-Z0-9\s]+$/.test(val),
                addModalErrorMessage: t("errorInvalidTypeName"),
                onAddNew: (newType) => {
                  handleChange("vehicleTypeName", newType);
                },
              })}

              <div className={labelClass}>{t("labelRegistrationYear")}</div>
              <div>
                <Select
                  options={years}
                  value={watch("registrationYear")}
                  onChange={(val) => handleChange("registrationYear", val)}
                  placeholder={t("placeholderSelectYear")}
                  className={
                    selectClass +
                    (watch("registrationYear") ? " text-neutral-900" : "") +
                    (errors.registrationYear ? " border-red-500" : "")
                  }
                  onOpenChange={(open) => {
                    if (!open) markFieldAsTouched("registrationYear");
                  }}
                />
                {renderError("registrationYear")}
              </div>

              <div className={labelClass}>{t("labelCarrierDimensions")}</div>
              <div className="flex w-[328px] gap-2">
                <DimensionInput
                  value={{
                    p: watch("carrierLength"),
                    l: watch("carrierWidth"),
                    t: watch("carrierHeight"),
                  }}
                  onChange={handleDimensionChange}
                />
                <Select
                  options={[
                    { label: "m", value: "m" },
                    { label: "cm", value: "cm" },
                  ]}
                  value={watch("carrierDimensionUnit")}
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
            {t("titleFleetPhotos")}
            <div className="mt-2 flex items-center gap-1 text-sm">
              <span className="font-normal">{t("linkViewPhotoExamples")}</span>
              <a
                href="#"
                className="font-medium text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPhotoExampleOpen(true);
                  setActivePhotoExampleIdx(0);
                }}
              >
                {t("linkHere")}
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="mt-2 grid grid-cols-[180px_1fr] items-start gap-x-3 gap-y-2">
                <div>
                  <div className="mb-1 text-sm font-normal text-neutral-500">
                    {t("labelFleetPhotos")}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {t("descLicensePlateVisibility")}
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <ImageUploaderWeb
                      uploadText={t("labelFrontView")}
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
                      uploadText={t("labelBackView")}
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
                      uploadText={t("labelRightView")}
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
                      uploadText={t("labelLeftView")}
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
                {t("descPhotoUpload")}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dokumen Armada */}
        <Card className="mb-6 !border-none">
          <CardHeader className="!border-b-0 pb-4 text-xl font-semibold">
            {t("titleFleetDocuments")}
            <div className="mt-2 flex items-center gap-1 text-sm">
              <span className="font-normal">
                {t("linkViewDocumentExamples")}
              </span>
              <a
                href="#"
                className="font-medium text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDocumentExampleOpen(true);
                  setActiveDocumentExampleIdx(0);
                }}
              >
                {t("linkHere")}
              </a>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-[220px_328px] gap-x-6 gap-y-5">
              <div className={labelClass}>{t("labelChassisNumber")}</div>
              {renderInputWithError("chassisNumber", {
                placeholder: t("placeholderChassisNumber"),
                value: watch("chassisNumber"),
                onChange: handleChassisNumberChange,
                className: "w-[328px]",
              })}

              <div className={labelClass}>{t("labelStnkExpiry")}</div>
              {renderDatePickerWithError("stnkExpiryDate", {
                value: watch("stnkExpiryDate"),
                onChange: (val) => handleChange("stnkExpiryDate", val),
                placeholder: t("placeholderStnkExpiry"),
              })}

              <div className={labelClass}>{t("labelStnkPhoto")}</div>
              <div className="w-[500px]">
                <FileUploadDocument
                  value={docStnk}
                  onSuccess={(doc) => {
                    setDocStnk(doc);
                    markFieldAsTouched("docStnk");
                    clearErrors("docStnk"); // Add this line
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

              <div className={labelClass}>{t("labelVehicleTaxPhoto")}</div>
              <div className="w-[328px]">
                <FileUploadDocument
                  value={docPajak}
                  onSuccess={(doc) => {
                    setDocPajak(doc);
                    markFieldAsTouched("docPajak");
                    clearErrors("docPajak"); // Add this line
                    console.log("Pajak file uploaded:", doc);
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

              <div className={labelClass}>{t("labelVehicleKir")}</div>
              {renderInputWithError("kirNumber", {
                placeholder: t("placeholderKirNumber"),
                value: watch("kirNumber"),
                onChange: (e) => handleChange("kirNumber", e.target.value),
                className: "w-[328px]",
              })}

              <div className={labelClass}>{t("labelKirExpiry")}</div>
              {renderDatePickerWithError("kirExpiryDate", {
                value: watch("kirExpiryDate"),
                onChange: (val) => handleChange("kirExpiryDate", val),
                placeholder: t("placeholderKirExpiry"),
              })}

              <div className={labelClass}>{t("labelKirBookPhoto")}</div>
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
            {t("titleGpsInstallation")}
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-start gap-x-6">
              <div className={labelClass}>{t("labelGpsInstallationDate")}</div>
              <div className="flex items-start gap-2">
                <div>
                  <DatePicker
                    className={`w-[200px] ${errors.gpsInstallationEstimateStartDate ? "border-red-500" : ""}`}
                    value={watch("gpsInstallationEstimateStartDate")}
                    onChange={(val) =>
                      handleChange("gpsInstallationEstimateStartDate", val)
                    }
                    placeholder={t("placeholderStartDate")}
                    onOpenChange={(open) => {
                      if (!open)
                        markFieldAsTouched("gpsInstallationEstimateStartDate");
                    }}
                  />
                  {renderError("gpsInstallationEstimateStartDate")}
                </div>
                <span className="mt-2 text-sm text-neutral-600">
                  {t("labelTo")}
                </span>
                <div>
                  <DatePicker
                    className={`w-[200px] ${errors.gpsInstallationEstimateEndDate ? "border-red-500" : ""}`}
                    value={watch("gpsInstallationEstimateEndDate")}
                    onChange={(val) =>
                      handleChange("gpsInstallationEstimateEndDate", val)
                    }
                    placeholder={t("placeholderEndDate")}
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
            {t("buttonCancel")}
          </Button>
          <Button
            variant="muattrans-primary"
            className="h-[44px] w-[120px] text-base"
            onClick={handleSubmit(async (data) => {
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
                  ...data,
                  registrationYear: Number(data.registrationYear),
                  carrierLength: Number(data.carrierLength) || undefined,
                  carrierWidth: Number(data.carrierWidth) || undefined,
                  carrierHeight: Number(data.carrierHeight) || undefined,
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
                setSubmitError(err?.Message?.Text || t("errorSaveFailed"));
              } finally {
                setIsSubmitting(false);
              }
            })}
            disabled={isSubmitting}
          >
            {t("buttonSave")}
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
                  aria-label={t("buttonPrevious")}
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
                  aria-label={t("buttonNext")}
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
                  <div className="text-center">{t("messageLoading")}</div>
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
                  <div className="text-center">
                    {t("messageNoPhotoExamples")}
                  </div>
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
                  <div className="text-center">{t("messageLoading")}</div>
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
                              {t("linkViewPdf")}
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
                    {t("messageNoDocumentExamples")}
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
                {t("titleConfirmSave")}
              </h1>
              <div className="flex items-center gap-x-2">
                <Button
                  variant="muattrans-primary-secondary"
                  className="h-[44px] w-[120px] text-base"
                  onClick={() => setIsSaveModalOpen(false)}
                  disabled={isSubmitting}
                >
                  {t("buttonNo")}
                </Button>
                <Button
                  variant="muattrans-primary"
                  className="h-[44px] w-[120px] text-base"
                  onClick={() => {
                    setIsSaveModalOpen(false);
                    router.push("/manajemen-armada");
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("buttonSaving") : t("buttonYes")}
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
                {t("titleConfirmCancel")}
              </p>
              <div className="flex items-center gap-x-2">
                <Button
                  variant="muattrans-primary-secondary"
                  className="h-[44px] w-[120px] text-base"
                  onClick={() => router.push("/transporter/manajemen-armada")}
                >
                  {t("buttonYes")}
                </Button>
                <Button
                  variant="muattrans-primary"
                  className="h-[44px] w-[120px] text-base"
                  onClick={() => setIsCancelModalOpen(false)}
                >
                  {t("buttonCancel")}
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
