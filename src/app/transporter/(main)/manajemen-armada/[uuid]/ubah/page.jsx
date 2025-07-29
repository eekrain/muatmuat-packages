"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import { Alert } from "@/components/Alert/Alert";
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

const createFleetInformationSchema = (t) =>
  v.object({
    licensePlate: v.pipe(
      v.string(t("errorLicensePlateRequired")),
      v.minLength(1, t("errorLicensePlateRequired")),
      v.custom(
        (value) => value.trim().split(" ").length >= 2,
        t("errorInvalidLicensePlateFormat")
      )
    ),
    truckTypeId: v.pipe(
      v.string(t("errorTruckTypeRequired")),
      v.minLength(1, t("errorTruckTypeRequired"))
    ),
    carrierTruckId: v.pipe(
      v.string(t("errorCarrierTypeRequired")),
      v.minLength(1, t("errorCarrierTypeRequired"))
    ),
    vehicleBrandId: v.pipe(
      v.string(t("errorVehicleBrandRequired")),
      v.minLength(1, t("errorVehicleBrandRequired"))
    ),
    vehicleBrandName: v.optional(v.string()),
    vehicleTypeId: v.pipe(
      v.string(t("errorVehicleTypeRequired")),
      v.minLength(1, t("errorVehicleTypeRequired"))
    ),
    vehicleTypeName: v.optional(v.string()),
    registrationYear: v.pipe(
      v.string(t("errorRegistrationYearRequired")),
      v.minLength(1, t("errorRegistrationYearRequired"))
    ),
    carrierLength: v.optional(v.string()),
    carrierWidth: v.optional(v.string()),
    carrierHeight: v.optional(v.string()),
    carrierDimensionUnit: v.optional(v.string()),
    chassisNumber: v.pipe(
      v.string(t("errorChassisNumberRequired")),
      v.minLength(10, t("errorChassisNumberMinLength"))
    ),
    stnkExpiryDate: v.pipe(
      v.date(t("errorStnkExpiryRequired")),
      v.custom((date) => date !== null, t("errorStnkExpiryRequired"))
    ),
    kirNumber: v.pipe(
      v.string(t("errorKirNumberRequired")),
      v.minLength(1, t("errorKirNumberRequired"))
    ),
    kirExpiryDate: v.pipe(
      v.date(t("errorKirExpiryRequired")),
      v.custom((date) => date !== null, t("errorKirExpiryRequired"))
    ),
    gpsInstallationEstimateStartDate: v.pipe(
      v.date(t("errorGpsStartDateRequired")),
      v.custom((date) => date !== null, t("errorGpsStartDateRequired"))
    ),
    gpsInstallationEstimateEndDate: v.pipe(
      v.date(t("errorGpsEndDateRequired")),
      v.custom((date) => date !== null, t("errorGpsEndDateRequired"))
    ),
    imgDepan: v.custom((value) => value !== null, t("errorFrontPhotoRequired")),
    imgBelakang: v.custom(
      (value) => value !== null,
      t("errorBackPhotoRequired")
    ),
    imgKanan: v.custom((value) => value !== null, t("errorRightPhotoRequired")),
    imgKiri: v.custom((value) => value !== null, t("errorLeftPhotoRequired")),
    docStnk: v.custom((value) => value !== null, t("errorStnkPhotoRequired")),
    docPajak: v.custom(
      (value) => value !== null,
      t("errorVehicleTaxPhotoRequired")
    ),
    docKir: v.custom((value) => value !== null, t("errorKirBookPhotoRequired")),
  });

const inputAppearance = {
  containerClassName: "rounded-[7px] bg-white",
};

const selectClass =
  "w-[328px] rounded-[7px] disabled:bg-gray-200 disabled:text-gray-700 disabled:border-gray-700";
const labelClass = "w-[220px] text-sm text-[#7B7B7B] flex items-center";

const Page = () => {
  const router = useRouter();
  const { uploadDocument } = useDocumentUpload();
  const { uuid } = useParams();
  const { data, error, isLoading } = useGetVehicleDetail(uuid);
  const { t, isTranslationsReady } = useTranslation();

  const fleetInformationSchema = isTranslationsReady
    ? createFleetInformationSchema(t)
    : v.object({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
    reset,
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

  const [imgDepan, setImgDepan] = useState(null);
  const [imgBelakang, setImgBelakang] = useState(null);
  const [imgKanan, setImgKanan] = useState(null);
  const [imgKiri, setImgKiri] = useState(null);
  const [docStnk, setDocStnk] = useState(null);
  const [docPajak, setDocPajak] = useState(null);
  const [docKir, setDocKir] = useState(null);

  const [panjang, setPanjang] = useState("");
  const [lebar, setLebar] = useState("");
  const [tinggi, setTinggi] = useState("");

  const markFieldAsTouched = (fieldName) => {
    trigger(fieldName);
  };

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

  useEffect(() => {
    if (data?.vehicle) {
      const vehicle = data.vehicle;
      const formData = {
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
        imgDepan: null,
        imgBelakang: null,
        imgKanan: null,
        imgKiri: null,
        docStnk: null,
        docPajak: null,
        docKir: null,
      };
      reset(formData);
      setPanjang(vehicle.carrierLength?.toString() || "");
      setLebar(vehicle.carrierWidth?.toString() || "");
      setTinggi(vehicle.carrierHeight?.toString() || "");

      if (vehicle.photos && Array.isArray(vehicle.photos)) {
        setImgDepan(
          vehicle.photos.find((p) => p.photoType === "FRONT")?.photoUrl || null
        );
        setImgBelakang(
          vehicle.photos.find((p) => p.photoType === "BACK")?.photoUrl || null
        );
        setImgKanan(
          vehicle.photos.find((p) => p.photoType === "RIGHT")?.photoUrl || null
        );
        setImgKiri(
          vehicle.photos.find((p) => p.photoType === "LEFT")?.photoUrl || null
        );
      }

      if (vehicle.documents && Array.isArray(vehicle.documents)) {
        const stnkDoc = vehicle.documents.find(
          (d) => d.documentType === "STNK"
        );
        const pajakDoc = vehicle.documents.find(
          (d) => d.documentType === "VEHICLE_TAX"
        );
        const kirDoc = vehicle.documents.find((d) => d.documentType === "KIR");
        if (stnkDoc)
          setDocStnk({ url: stnkDoc.documentUrl, name: stnkDoc.documentName });
        if (pajakDoc)
          setDocPajak({
            url: pajakDoc.documentUrl,
            name: pajakDoc.documentName,
          });
        if (kirDoc)
          setDocKir({ url: kirDoc.documentUrl, name: kirDoc.documentName });
      }
    }
  }, [data, reset]);

  const handleChange = (field, value) => {
    setValue(field, value, { shouldValidate: true });
  };

  const handleLicensePlateChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9\s]/g, "");
    handleChange("licensePlate", value);
  };

  const handleChassisNumberChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    handleChange("chassisNumber", value.slice(0, 17));
  };

  const renderError = (fieldName) => {
    return errors[fieldName] && errors[fieldName].message ? (
      <div className="mt-1 text-xs text-red-500">
        {errors[fieldName].message}
      </div>
    ) : null;
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
  const [isDocumentExampleOpen, setIsDocumentExampleOpen] = useState(false);
  const { data: documentExamples, isLoading: isLoadingDocumentExamples } =
    useGetVehiclesDocumentExample();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isTranslationsReady || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-medium">{t("messageLoading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-500">{t("errorLoadFleetData")}</div>
      </div>
    );
  }

  const BREADCRUMB = [
    { name: t("titleFleetManagement"), href: "/manajemen-armada" },
    { name: t("titleEditFleet") },
  ];

  const photoList = [
    { src: imgDepan, label: t("labelExampleFrontPhoto") },
    { src: imgBelakang, label: t("labelExampleBackPhoto") },
    { src: imgKanan, label: t("labelExampleRightPhoto") },
    { src: imgKiri, label: t("labelExampleLeftPhoto") },
  ];

  const onSubmit = async (formData) => {
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
        carrierLength: Number(formData.carrierLength) || undefined,
        carrierWidth: Number(formData.carrierWidth) || undefined,
        carrierHeight: Number(formData.carrierHeight) || undefined,
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
            photoType: "RIGHT",
            photoUrl: imgKanan,
            photoName: "RIGHT.jpg",
          },
          imgKiri && {
            photoType: "LEFT",
            photoUrl: imgKiri,
            photoName: "LEFT.jpg",
          },
        ].filter(Boolean),
        documents: dokumenList,
      };
      await postNewVehicle(payload, "DUMMY_TOKEN");
      toast.success("Data armada berhasil diperbarui");
      router.push("/transporter/manajemen-armada");
    } catch (err) {
      setSubmitError(err?.Message?.Text || t("errorSaveFailed"));
      toast.error(err?.Message?.Text || t("errorSaveFailed"));
    } finally {
      setIsSubmitting(false);
      setIsSaveModalOpen(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-[818px] py-6">
        <BreadCrumb data={BREADCRUMB} />
        <PageTitle className="mt-4">{t("titleEditFleet")}</PageTitle>

        <Alert variant="warning" size="big" className="mb-6">
          <div className="flex flex-col gap-2">
            <div className="font-bold text-neutral-900">
              {t("titleWarningNotice")}
            </div>
            <div className="text-neutral-900">{t("descWarningNotice")}</div>
          </div>
        </Alert>

        <Card className="mb-6 !border-none">
          <CardHeader className="!border-b-0 pb-4 text-xl font-semibold">
            {t("titleFleetInformation")}
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-[220px_400px] gap-x-6 gap-y-5">
              <div className={labelClass}>{t("labelLicensePlate")}</div>
              <div>
                <Input
                  {...register("licensePlate")}
                  placeholder={t("placeholderLicensePlate")}
                  value={watch("licensePlate")}
                  onChange={handleLicensePlateChange}
                  onBlur={() => markFieldAsTouched("licensePlate")}
                  className="w-[328px]"
                  appearance={inputAppearance}
                />
                {renderError("licensePlate")}
              </div>

              <div className={labelClass}>{t("labelTruckType")}</div>
              <div>
                <SelectFilterRadix
                  options={
                    isLoadingTruckTypes
                      ? []
                      : truckTypes.map((item) => ({
                          label: item.name,
                          value: item.id,
                          image: item.icon,
                        }))
                  }
                  value={watch("truckTypeId")}
                  onChange={(val) => {
                    handleChange("truckTypeId", val);
                    handleChange("carrierTruckId", "");
                  }}
                  placeholder={t("placeholderTruckType")}
                  className={selectClass}
                  classNameOptions="h-12"
                />
                {renderError("truckTypeId")}
              </div>

              <div className={labelClass}>{t("labelCarrierType")}</div>
              <div>
                <SelectFilterRadix
                  options={
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
                      : []
                  }
                  value={watch("carrierTruckId")}
                  onChange={(val) => handleChange("carrierTruckId", val)}
                  placeholder={t("placeholderCarrierType")}
                  disabled={!watch("truckTypeId") || isLoadingCarrier}
                  className={selectClass}
                  classNameOptions="h-12"
                />
                {renderError("carrierTruckId")}
              </div>

              <div className={labelClass}>{t("labelVehicleBrand")}</div>
              <div>
                <SelectFilterRadix
                  addData
                  addLabel={t("buttonAddVehicleBrand")}
                  options={brands.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                  value={watch("vehicleBrandId")}
                  onChange={(val) => {
                    handleChange("vehicleBrandId", val);
                    handleChange("vehicleTypeId", "");
                  }}
                  placeholder={t("placeholderVehicleBrand")}
                  disabled={isLoadingBrands}
                  addModalTitle={t("buttonAddVehicleBrand")}
                  addModalPlaceholder={t("placeholderAddVehicleBrand")}
                  addModalErrorMessage={t("errorInvalidBrandName")}
                  onAddNew={(newBrand) =>
                    handleChange("vehicleBrandName", newBrand)
                  }
                  className={selectClass}
                />
                {renderError("vehicleBrandId")}
              </div>

              <div className={labelClass}>{t("labelVehicleType")}</div>
              <div>
                <SelectFilterRadix
                  addData
                  addLabel={t("buttonAddVehicleType")}
                  options={
                    watch("vehicleBrandId") && !isLoadingTypes
                      ? filteredTypes.map((item) => ({
                          label: item.name,
                          value: item.id,
                        }))
                      : []
                  }
                  value={watch("vehicleTypeId")}
                  onChange={(val) => handleChange("vehicleTypeId", val)}
                  placeholder={t("placeholderVehicleType")}
                  disabled={!watch("vehicleBrandId") || isLoadingTypes}
                  addModalTitle={t("buttonAddVehicleType")}
                  addModalPlaceholder={t("placeholderAddVehicleType")}
                  addModalErrorMessage={t("errorInvalidTypeName")}
                  onAddNew={(newType) =>
                    handleChange("vehicleTypeName", newType)
                  }
                  className={selectClass}
                />
                {renderError("vehicleTypeId")}
              </div>

              <div className={labelClass}>{t("labelRegistrationYear")}</div>
              <div>
                <Select
                  options={years}
                  value={watch("registrationYear")}
                  onChange={(val) => handleChange("registrationYear", val)}
                  placeholder={t("placeholderSelectYear")}
                  className={`${selectClass} ${watch("registrationYear") ? "text-neutral-900" : ""}`}
                />
                {renderError("registrationYear")}
              </div>

              <div className={labelClass}>{t("labelCarrierDimensions")}</div>
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
                  value={watch("carrierDimensionUnit")}
                  onChange={(val) => handleChange("carrierDimensionUnit", val)}
                  placeholder="m"
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
                  {[
                    {
                      name: "imgDepan",
                      text: "labelFrontView",
                      idx: 0,
                      value: imgDepan,
                      setter: setImgDepan,
                    },
                    {
                      name: "imgBelakang",
                      text: "labelBackView",
                      idx: 1,
                      value: imgBelakang,
                      setter: setImgBelakang,
                    },
                    {
                      name: "imgKanan",
                      text: "labelRightView",
                      idx: 2,
                      value: imgKanan,
                      setter: setImgKanan,
                    },
                    {
                      name: "imgKiri",
                      text: "labelLeftView",
                      idx: 3,
                      value: imgKiri,
                      setter: setImgKiri,
                    },
                  ].map(({ name, text, idx, value, setter }) => (
                    <div key={name}>
                      <ImageUploaderWeb
                        uploadText={t(text)}
                        className="h-[120px] w-[120px]"
                        value={value}
                        onUpload={(img) => {
                          setter(img);
                          markFieldAsTouched(name);
                        }}
                        onClick={() => {
                          setIsPreviewOpen(true);
                          setActivePreviewIdx(idx);
                        }}
                      />
                      {renderError(name)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="ms-44 mt-2 text-center text-xs text-neutral-500">
                {t("descPhotoUpload")}
              </div>
            </div>
          </CardContent>
        </Card>

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
                }}
              >
                {t("linkHere")}
              </a>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-[220px_328px] gap-x-6 gap-y-5">
              <div className={labelClass}>{t("labelChassisNumber")}</div>
              <div>
                <Input
                  {...register("chassisNumber")}
                  placeholder={t("placeholderChassisNumber")}
                  value={watch("chassisNumber")}
                  onChange={handleChassisNumberChange}
                  className="w-[328px]"
                  appearance={inputAppearance}
                />
                {renderError("chassisNumber")}
              </div>
              <div className={labelClass}>{t("labelStnkExpiry")}</div>
              <div>
                <DatePicker
                  value={watch("stnkExpiryDate")}
                  onChange={(val) => handleChange("stnkExpiryDate", val)}
                  placeholder={t("placeholderStnkExpiry")}
                  className="w-[328px]"
                />
                {renderError("stnkExpiryDate")}
              </div>
              <div className={labelClass}>{t("labelStnkPhoto")}</div>
              <div className="w-[328px]">
                <FileUploadDocument
                  value={docStnk}
                  onSuccess={(doc) => {
                    setDocStnk(doc);
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
                  }}
                  maxSize={10}
                  acceptedFormats={[".jpg", ".jpeg", ".png", ".pdf"]}
                />
                {renderError("docPajak")}
              </div>
              <div className={labelClass}>{t("labelVehicleKir")}</div>
              <div>
                <Input
                  {...register("kirNumber")}
                  placeholder={t("placeholderKirNumber")}
                  className="w-[328px]"
                  appearance={inputAppearance}
                />
                {renderError("kirNumber")}
              </div>
              <div className={labelClass}>{t("labelKirExpiry")}</div>
              <div>
                <DatePicker
                  value={watch("kirExpiryDate")}
                  onChange={(val) => handleChange("kirExpiryDate", val)}
                  placeholder={t("placeholderKirExpiry")}
                  className="w-[328px]"
                />
                {renderError("kirExpiryDate")}
              </div>
              <div className={labelClass}>{t("labelKirBookPhoto")}</div>
              <div className="w-[328px]">
                <FileUploadDocument
                  value={docKir}
                  onSuccess={(doc) => {
                    setDocKir(doc);
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
                    value={watch("gpsInstallationEstimateStartDate")}
                    onChange={(val) =>
                      handleChange("gpsInstallationEstimateStartDate", val)
                    }
                    placeholder={t("placeholderStartDate")}
                    className="w-[200px]"
                  />
                  {renderError("gpsInstallationEstimateStartDate")}
                </div>
                <span className="mt-2 text-sm text-neutral-600">
                  {t("labelTo")}
                </span>
                <div>
                  <DatePicker
                    value={watch("gpsInstallationEstimateEndDate")}
                    onChange={(val) =>
                      handleChange("gpsInstallationEstimateEndDate", val)
                    }
                    placeholder={t("placeholderEndDate")}
                    className="w-[200px]"
                  />
                  {renderError("gpsInstallationEstimateEndDate")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="ml-auto mt-8 flex w-[620px] justify-end gap-4">
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
            onClick={handleSubmit(() => setIsSaveModalOpen(true))}
            disabled={isSubmitting}
          >
            {t("buttonSave")}
          </Button>
        </div>

        {isPreviewOpen && (
          <Modal open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <div className="flex flex-col items-center p-6">
              <div className="mb-4 text-center text-lg font-bold">
                {photoList[activePreviewIdx].label}
              </div>
              {/* Carousel component here */}
            </div>
          </Modal>
        )}

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
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("buttonSaving") : t("buttonYes")}
                </Button>
              </div>
              {submitError && (
                <div className="mt-2 text-xs text-red-500">{submitError}</div>
              )}
            </div>
          </ModalContent>
        </Modal>

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
                  onClick={() => router.push("/manajemen-armada")}
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
