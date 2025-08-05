"use client";

import { useEffect, useRef, useState } from "react";

import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import * as v from "valibot";

import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
import ImageUploudWithModal from "@/components/FileUpload/ImageUploudWithModal";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import SelectFilterRadix from "@/components/Form/SelectFilterRadix";
import { MyTextArea } from "@/components/Form/TextArea";
import { MapContainer } from "@/components/MapContainer/MapContainer";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { normalizePostalCodeData } from "@/hooks/use-location/normalizer";
import { useLocationSearch } from "@/hooks/use-location/use-location-search";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { toast } from "@/lib/toast";
import { useTransporterFormStore } from "@/store/CS/forms/registerTransporter";

import { LocationDropdownInput } from "../../InputLocationDropdown/LocationDropdownInput";
import { SearchPostal } from "../../InputLocationDropdown/SearchPostal";

const informasiPendaftarSchema = v.object({
  transporterId: v.optional(v.string()),

  registrantName: v.pipe(
    v.string("Nama pendaftar wajib diisi"),
    v.minLength(3, "Nama pendaftar minimal 3 karakter"),
    v.regex(/^[a-zA-Z0-9 ]+$/, "Nama tidak boleh mengandung simbol")
  ),

  registrantPosition: v.pipe(v.string(), v.minLength(1, "Jabatan wajib diisi")),
  registrantWhatsapp: v.pipe(
    v.custom(
      (value) => value && typeof value === "string" && value.trim() !== "",
      "Nomor Whatsapp wajib diisi"
    ),
    v.string(),
    v.minLength(8, "Nomor Whatsapp minimal 8 digit"),
    v.regex(/^08[0-9]{6,11}$/, "Format No. Whatsapp salah")
  ),

  registrantEmail: v.pipe(
    v.string(),
    v.minLength(1, "Email wajib diisi"),
    v.email("Penulisan email salah")
  ),

  companyLogo: v.pipe(
    v.string(),
    v.minLength(1, "Logo Perusahaan wajib diisi")
  ),

  companyName: v.pipe(
    v.string(),
    v.minLength(1, "Nama perusahaan wajib diisi")
  ),
  businessEntityType: v.enum(
    ["PT", "CV", "UD", "Koperasi", "Lainnya"],
    "Bentuk usaha tidak valid"
  ),
  companyPhone: v.pipe(
    v.string(),
    v.minLength(1, "Nomor telepon wajib diisi"),
    v.regex(
      /^08[0-9]{8,11}$/,
      "Format nomor telepon tidak valid (contoh: 08xxxxxxxxxx)"
    )
  ),

  companyAddress: v.pipe(
    v.string(),
    v.minLength(1, "Alamat perusahaan wajib diisi")
  ),
  locationData: v.object({
    location: v.pipe(v.string(), v.minLength(1, "Lokasi wajib diisi")),
    latitude: v.pipe(v.string(), v.minLength(1, "Latitude wajib diisi")),
    longitude: v.pipe(v.string(), v.minLength(1, "Longitude wajib diisi")),
    district: v.pipe(v.string(), v.minLength(1, "Kecamatan wajib diisi")),
    city: v.optional(v.string()),
    province: v.optional(v.string()),
    postalCode: v.pipe(v.string(), v.minLength(1, "Kode pos wajib diisi")),
    placeId: v.pipe(
      v.string(),
      v.minLength(1, "Lokasi harus dipilih dari Google Maps")
    ),
    kecamatanList: v.optional(v.array(v.any())), // Tambahkan ini
    postalCodeList: v.optional(v.array(v.any())), // Tambahkan ini
  }),

  bankId: v.pipe(v.string(), v.minLength(1, "Bank wajib diisi")),
  accountNumber: v.pipe(
    v.string(),
    v.minLength(1, "Nomor rekening wajib diisi")
  ),
  accountName: v.pipe(
    v.string(),
    v.minLength(1, "Nama pemilik rekening wajib diisi")
  ),
});

function InformasiPendaftar() {
  const [coordinates, setCoordinates] = useState({
    latitude: -7.254235,
    longitude: 112.736583,
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const [isModalDropdownOpen, setIsModalDropdownOpen] = useState(false);
  const [isPostalCodeModalOpen, setIsPostalCodeModalOpen] = useState(false);
  const [modalInputLocationError, setModalInputLocationError] = useState("");
  const [tempLocation, setTempLocation] = useState(null);
  const debounceTimeoutRef = useRef(null);

  const FORM_KEY = "newTransporterRegistration";
  const setForm = useTransporterFormStore((state) => state.setForm);
  const initialData = useTransporterFormStore((state) =>
    state.getForm(FORM_KEY)
  );

  const {
    setValue,
    handleSubmit,
    register,
    formState: { errors },
    trigger,
    getValues,
    watch,
  } = useForm({
    resolver: valibotResolver(informasiPendaftarSchema),
    defaultValues: initialData || {
      transporterId: "uuid-transporter",
      registrantName: "",
      registrantPosition: "",
      registrantWhatsapp: "",
      registrantEmail: "",
      companyLogo: "",
      companyName: "",
      businessEntityType: "",
      companyPhone: "",
      companyAddress: "",
      locationData: {
        latitude: 7.2575,
        longitude: 112.7521,
        location: "",
        district: "",
        city: "",
        province: "",
        postalCode: "",
        placeId: "",
        kecamatanList: [], // Tambahkan ini
        postalCodeList: [], // Tambahkan ini
      },
      bankId: "",
      accountNumber: "",
      accountName: "",
    },
  });

  const watchedValues = watch();

  const locationSearch = useLocationSearch();

  const [dynamicKecamatanOptions, setDynamicKecamatanOptions] = useState([]);
  const [dynamicKodePosOptions, setDynamicKodePosOptions] = useState([]);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  const clearLocationData = () => {
    const fieldsToReset = [
      "locationData.location",
      "locationData.latitude",
      "locationData.longitude",
      "locationData.district",
      "locationData.city",
      "locationData.province",
      "locationData.postalCode",
      "locationData.placeId",
    ];
    fieldsToReset.forEach((field) => setValue(field, ""));

    // Reset state & tampilan lainnya
    setDynamicKecamatanOptions([]);
    setDynamicKodePosOptions([]);
    locationSearch.setAutoCompleteSearchPhrase("");
    setCoordinates({ latitude: -7.254235, longitude: 112.736583 }); // Reset ke default
  };

  const updateFormWithLocationData = (locationData) => {
    setValue("locationData.location", locationData.location?.name || "", {
      shouldValidate: true,
    });
    setValue(
      "locationData.latitude",
      locationData.coordinates?.latitude.toString() || "",
      { shouldValidate: true }
    );
    setValue(
      "locationData.longitude",
      locationData.coordinates?.longitude.toString() || "",
      { shouldValidate: true }
    );
    setValue("locationData.district", locationData.district?.value || "", {
      shouldValidate: true,
    });
    setValue("locationData.city", locationData.city?.name || " ", {
      shouldValidate: true,
    });
    setValue("locationData.province", locationData.province?.name || " ", {
      shouldValidate: true,
    });
    setValue("locationData.postalCode", locationData.postalCode?.value || "", {
      shouldValidate: true,
    });
    setValue("locationData.placeId", locationData.location?.value || "", {
      shouldValidate: true,
    });
    setValue("locationData.kecamatanList", locationData.kecamatanList || []);
    setValue("locationData.postalCodeList", locationData.postalCodeList || []);

    locationSearch.setAutoCompleteSearchPhrase(
      locationData.location?.name || ""
    );

    if (
      locationData.kecamatanList &&
      Array.isArray(locationData.kecamatanList)
    ) {
      const formatted = locationData.kecamatanList.map((kec) => ({
        label: kec.name,
        value: kec.value,
      }));
      setDynamicKecamatanOptions(formatted);
    }
    if (
      locationData.postalCodeList &&
      Array.isArray(locationData.postalCodeList)
    ) {
      const formatted = locationData.postalCodeList.map((pc) => ({
        label: pc.name,
        value: pc.value,
      }));
      setDynamicKodePosOptions(formatted);
    }
    if (locationData.coordinates) {
      setCoordinates(locationData.coordinates);
    }
  };

  useEffect(() => {
    // Jalankan hanya jika ada data awal yang dipulihkan
    if (initialData) {
      console.log("Rehydrating UI options from initialData...");

      // Rehidrasi opsi kecamatan
      const savedKecamatanList = initialData.locationData?.kecamatanList;
      if (
        savedKecamatanList &&
        Array.isArray(savedKecamatanList) &&
        savedKecamatanList.length > 0
      ) {
        const formattedKecamatan = savedKecamatanList.map((kec) => ({
          label: kec.name,
          value: kec.value,
        }));
        setDynamicKecamatanOptions(formattedKecamatan);
      }

      // Rehidrasi opsi kode pos
      const savedPostalCodeList = initialData.locationData?.postalCodeList;
      if (
        savedPostalCodeList &&
        Array.isArray(savedPostalCodeList) &&
        savedPostalCodeList.length > 0
      ) {
        const formattedPostalCode = savedPostalCodeList.map((pc) => ({
          label: pc.name,
          value: pc.value,
        }));
        setDynamicKodePosOptions(formattedPostalCode);
      }
    }
  }, [initialData]);

  const handleSelectLocation = (result) => {
    if (!result) return;

    // Cek apakah data distrik/kecamatan ada
    if (!result.district?.value) {
      // Jika TIDAK ADA:
      // 1. Simpan data yang belum lengkap
      setTempLocation(result);
      // 2. Siapkan frase pencarian untuk modal
      locationSearch.setLocationPostalCodeSearchPhrase(
        result.postalCode?.value === "00000"
          ? ""
          : result.postalCode?.value || ""
      );
      // 3. Buka modal
      setIsPostalCodeModalOpen(true);
    } else {
      // Jika LENGKAP: Langsung update form
      updateFormWithLocationData(result);
    }
  };

  const [postalCodeErrorMessage, setPostalCodeErrorMessage] = useState("");
  const handleConfirmPostalCode = (selectedOption) => {
    if (!tempLocation || !selectedOption) return;

    const normalizedPostalData = normalizePostalCodeData(selectedOption);
    const finalLocationData = {
      ...tempLocation,
      ...normalizedPostalData,
    };
    updateFormWithLocationData(finalLocationData);
    setIsPostalCodeModalOpen(false);
    setTempLocation(null);
  };

  const badanUsahaOptions = [
    { label: "PT (Perseroan Terbatas)", value: "PT" },
    { label: "CV (Commanditaire Vennootschap)", value: "CV" },
    { label: "UD (Usaha Dagang)", value: "UD" },
    { label: "Koperasi", value: "Koperasi" },
    { label: "Lainnya", value: "Lainnya" },
  ];

  const bankOptions = [
    { label: "Bank BCA", value: "bca" },
    { label: "Bank BNI", value: "bni" },
    { label: "Bank BRI", value: "bri" },
    { label: "Bank Mandiri", value: "mandiri" },
    { label: "Bank CIMB Niaga", value: "cimb" },
  ];

  const handleLocationInteraction = (isModal = false) => {
    if (watchedValues.locationData.placeId) {
      setIsConfirmClearOpen(true);
    } else {
      isModal ? setIsModalDropdownOpen(true) : setIsMainDropdownOpen(true);
    }
  };

  const handleLocationInputChange = (e) => {
    const value = e.currentTarget.value;
    locationSearch.setAutoCompleteSearchPhrase(value);
    if (!watchedValues.locationData.placeId) {
      if (!isMainDropdownOpen) setIsMainDropdownOpen(true);
    }
  };

  const modalContentRef = useRef(null);

  const isAllRequiredFieldsEmpty = () => {
    const values = getValues();

    const requiredFields = [
      "registrantName",
      "registrantPosition",
      "registrantWhatsapp",
      "registrantEmail",
      "companyLogo",
      "companyName",
      "businessEntityType",
      "companyPhone",
      "companyAddress",
      "bankId",
      "accountNumber",
      "accountName",
    ];

    return requiredFields.every((fieldPath) => {
      const value = fieldPath
        .split(".")
        .reduce((obj, key) => obj?.[key], values);
      if (typeof value === "string") return value.trim() === "";
      return value === null;
    });
  };

  const handleValidateAndSubmit = async (e) => {
    e.preventDefault();

    const isValid = await trigger();

    if (!isValid) {
      if (isAllRequiredFieldsEmpty()) {
        toast.error("Isi semua inputan yang bertanda bintang (*)");
      }
      return;
    }

    handleSubmit(onSubmit)();
  };

  const onSubmit = (data) => {
    console.log("Form submitted. Data in react-hook-form:", data);
    console.log("Final data is already in Zustand store.");
    setForm(FORM_KEY, data);
    toast.success("Informasi pendaftar berhasil disimpan!");
  };

  const { trigger: uploadLogoTrigger, isMutating: isUploadingLogo } =
    useSWRMutateHook("v1/orders/upload", "POST", undefined, undefined, {
      onSuccess: (data) => {
        if (data.Data && data.Data.photoUrl) {
          const imageUrl = data.Data.photoUrl;
          setValue("companyLogo", imageUrl, { shouldValidate: true });
          toast.success("Logo berhasil diunggah.");
        } else {
          toast.error("Gagal mendapatkan URL gambar dari server.");
        }
      },
      onError: (error) => {
        const message =
          error?.response?.data?.Message?.Text || "Gagal mengunggah foto.";
        toast.error(message);
        console.error("Upload Error:", error);
      },
    });

  const handleLogoUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await uploadLogoTrigger(formData);
  };

  const handleMapPositionChange = (newCoordinates) => {
    setCoordinates(newCoordinates);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        console.log("Fetching location for new coordinates:", newCoordinates);
        const result =
          await locationSearch.getLocationByLatLong(newCoordinates);
        if (result) {
          handleSelectLocation(result);
        }
      } catch (error) {
        console.error("Failed to fetch location on marker move:", error);
        toast.error("Gagal mendapatkan informasi lokasi.");
      }
    }, 500);
  };

  return (
    <form onSubmit={handleValidateAndSubmit} className="w-full">
      <Card className={"rounded-xl border-none p-6"}>
        <div className="max-w-[75%]">
          <h3 className="mb-4 text-lg font-semibold">Data Perusahaan</h3>
          <div>
            <h3 className="mb-6 text-sm font-semibold">Informasi Pendaftar</h3>
            <FormContainer>
              <FormLabel required>Nama Lengkap Pendaftar</FormLabel>
              <Input
                type="text"
                placeholder="Masukkan Nama Lengkap Pendaftar"
                {...register("registrantName")}
                errorMessage={errors.registrantName?.message}
              />

              <FormLabel required>Jabatan Pendaftar</FormLabel>
              <Input
                type="text"
                placeholder="Masukkan Jabatan Pendaftar"
                {...register("registrantPosition")}
                errorMessage={errors.registrantPosition?.message}
              />

              <FormLabel required>No. Whatsapp Pendaftar</FormLabel>
              <Input
                type="number"
                placeholder="Contoh: 08xxxxxxxxxx"
                {...register("registrantWhatsapp")}
                errorMessage={errors.registrantWhatsapp?.message}
              />

              <FormLabel required>Email Pendaftar</FormLabel>
              <Input
                type="email"
                placeholder="Masukkan Email Pendaftar"
                {...register("registrantEmail")}
                errorMessage={errors.registrantEmail?.message}
              />
            </FormContainer>
          </div>

          <div>
            <h3 className="my-6 text-sm font-semibold">Informasi Perusahaan</h3>
            <FormContainer>
              <FormLabel required>Logo Perusahaan</FormLabel>
              <div>
                <ImageUploudWithModal
                  onSuccess={handleLogoUpload}
                  initialImageUrl={watchedValues.companyLogo}
                />
                {errors.companyLogo && (
                  <p className="mt-1 text-xs font-medium text-error-400">
                    {errors.companyLogo.message}
                  </p>
                )}
              </div>

              <FormLabel required>Nama Perusahaan</FormLabel>
              <Input
                type="text"
                placeholder="Masukkan Nama Perusahaan"
                {...register("companyName")}
                errorMessage={errors.companyName?.message}
              />

              <FormLabel required>Badan Usaha</FormLabel>
              <Select
                options={badanUsahaOptions}
                value={watchedValues.businessEntityType}
                onChange={(value) => setValue("businessEntityType", value)}
                placeholder="Pilih Badan Usaha"
                errorMessage={errors.businessEntityType?.message}
              />

              <FormLabel required>No. Telepon Perusahaan</FormLabel>
              <Input
                type="number"
                placeholder="Contoh: 08xxxxxxxxxx"
                {...register("companyPhone")}
                errorMessage={errors.companyPhone?.message}
              />
            </FormContainer>
          </div>

          <div className="flex flex-col">
            <h3 className="my-6 text-sm font-semibold">Informasi Lokasi</h3>
            <FormContainer>
              <FormLabel required>Alamat</FormLabel>
              <MyTextArea
                placeholder="Contoh : Nama Jalan (bila tidak diemukan), Gedung, No. Rumah/Patokan, Blok/Unit"
                maxLength={225}
                value={watch("companyAddress")}
                onChange={(e) => setValue("companyAddress", e.target.value)}
                errorMessage={errors.companyAddress?.message}
                appearance={{
                  inputClassName: "h-[80px]",
                }}
              />

              <FormLabel required>Lokasi</FormLabel>
              <div>
                <LocationDropdownInput
                  markerIcon={""}
                  placeholder="Cari lokasi"
                  className="mb-4 w-full"
                  value={watchedValues.locationData?.location}
                  onInputClick={() => handleLocationInteraction()}
                  onInputChange={handleLocationInputChange}
                  onSelectLocation={handleSelectLocation}
                  errorMessage={errors.locationData?.location?.message}
                  {...locationSearch}
                  isDropdownSearchOpen={isMainDropdownOpen}
                  setIsDropdownSearchOpen={setIsMainDropdownOpen}
                  onResolvedLocation={handleSelectLocation}
                />
              </div>

              <FormLabel required>Kecamatan</FormLabel>
              <div>
                <SelectFilterRadix
                  options={dynamicKecamatanOptions}
                  value={watchedValues.locationData?.district}
                  onChange={(value) => setValue("locationData.district", value)}
                  placeholder="Pilih Kecamatan"
                  errorMessage={errors.locationData?.district?.message}
                  disabled={
                    dynamicKecamatanOptions.length === 0 &&
                    !watchedValues.locationData?.district
                  }
                />
              </div>

              <FormLabel required>Kota</FormLabel>
              <p className="mt-2 text-xs font-medium">
                {watchedValues.locationData?.city || "-"}
              </p>

              <FormLabel required>Provinsi</FormLabel>
              <p className="mt-2 text-xs font-medium">
                {watchedValues.locationData?.province || "-"}
              </p>

              <FormLabel required>Kode Pos</FormLabel>
              <div>
                <SelectFilterRadix
                  options={dynamicKodePosOptions}
                  value={watchedValues.locationData?.postalCode}
                  onChange={(value) =>
                    setValue("locationData.postalCode", value)
                  }
                  placeholder="Pilih Kode Pos"
                  errorMessage={errors.locationData?.postalCode?.message}
                  disabled={
                    dynamicKodePosOptions.length === 0 &&
                    !watchedValues.locationData?.postalCode
                  }
                />
              </div>

              <FormLabel required>Titik Lokasi</FormLabel>
              <div>
                <button
                  type="button"
                  className="relative h-[154px] w-[80%] overflow-hidden rounded-lg"
                  onClick={() => setIsLocationModalOpen(true)}
                >
                  <MapContainer
                    coordinates={coordinates}
                    onPositionChange={handleMapPositionChange}
                    className="pointer-events-none h-full w-full"
                    textLabel={`${coordinates.latitude}, ${coordinates.longitude}`}
                  />
                  <div className="hover absolute bottom-0 right-0 w-full rounded-b-lg bg-muat-trans-primary-400 px-4 py-1 text-center text-white transition-colors hover:bg-muat-trans-primary-500">
                    <span className="text-sm font-semibold text-muat-trans-primary-900">
                      Atur Pin Lokasi
                    </span>
                  </div>
                </button>
                {(errors.locationData?.latitude ||
                  errors.locationData?.longitude) && (
                  <p className="mt-1 text-xs font-medium text-error-400">
                    Titik lokasi wajib diisi
                  </p>
                )}

                <Modal
                  open={isLocationModalOpen}
                  onOpenChange={setIsLocationModalOpen}
                  closeOnOutsideClick
                >
                  <ModalContent
                    type="muatmuat"
                    size="big"
                    className="w-[920px]"
                    appearance={{
                      closeButtonClassname: "!size-8",
                    }}
                    ref={modalContentRef}
                  >
                    <div className="flex gap-4 px-6 py-4">
                      <MapContainer
                        coordinates={coordinates}
                        onPositionChange={handleMapPositionChange}
                        className="h-[380px] w-[600px]"
                        textLabel={`${coordinates.latitude}, ${coordinates.longitude}`}
                      />
                      <div className="my-4 flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="mb-4 text-lg font-semibold">
                            Atur Pin Lokasi
                          </h3>
                          <LocationDropdownInput
                            placeholder="Cari lokasi"
                            markerIcon="/icons/marker-lokasi-muat.svg"
                            className="mb-4 w-full"
                            value={watchedValues.locationData?.location}
                            onInputClick={() => handleLocationInteraction(true)}
                            onInputChange={handleLocationInputChange}
                            onSelectLocation={handleSelectLocation}
                            errorMessage={
                              errors.locationData?.location?.message ||
                              modalInputLocationError
                            }
                            showClearButton={true}
                            {...locationSearch}
                            isDropdownSearchOpen={isModalDropdownOpen}
                            setIsDropdownSearchOpen={setIsModalDropdownOpen}
                            portalContainer={modalContentRef.current}
                            onResolvedLocation={handleSelectLocation}
                          />
                        </div>

                        <Button
                          type="submit"
                          variant="muattrans-primary"
                          className="mx-auto flex w-auto"
                          onClick={() => {
                            if (!watchedValues.locationData.placeId) {
                              setModalInputLocationError(
                                "Titik Lokasi wajib diisi"
                              );
                              return;
                            }
                            setIsLocationModalOpen(false);
                            setValue(
                              "locationData.latitude",
                              coordinates.latitude.toString(),
                              { shouldValidate: true }
                            );
                            setValue(
                              "locationData.longitude",
                              coordinates.longitude.toString(),
                              { shouldValidate: true }
                            );
                            setModalInputLocationError("");
                          }}
                        >
                          Simpan Lokasi
                        </Button>
                      </div>
                    </div>
                  </ModalContent>
                </Modal>
              </div>
            </FormContainer>
          </div>

          <div>
            <h3 className="my-6 text-sm font-semibold">
              Informasi Rekening Perusahaan
            </h3>
            <FormContainer>
              <FormLabel required>Nama Bank</FormLabel>
              <div>
                <SelectFilterRadix
                  options={bankOptions}
                  value={watchedValues.bankId}
                  onChange={(value) => setValue("bankId", value)}
                  placeholder="Pilih Bank"
                  errorMessage={errors.bankId?.message}
                />
              </div>

              <FormLabel required>Nomor Rekening</FormLabel>
              <Input
                type="number"
                placeholder="Masukkan Nomor Rekening"
                {...register("accountNumber")}
                errorMessage={errors.accountNumber?.message}
              />

              <FormLabel required>Nama Pemilik Rekening</FormLabel>
              <Input
                type="text"
                placeholder="Masukkan Nama Pemilik Rekening"
                {...register("accountName")}
                errorMessage={errors.accountName?.message}
              />
            </FormContainer>
          </div>
        </div>
      </Card>
      <ConfirmationModal
        isOpen={isConfirmClearOpen}
        setIsOpen={setIsConfirmClearOpen}
        description={{
          text: "Apakah kamu yakin ingin mengganti lokasi?",
        }}
        cancel={{
          text: "Tidak",
          onClick: () => setIsConfirmClearOpen(false),
          classname: "w-[100px]",
        }}
        confirm={{
          text: "Ya",
          onClick: () => {
            clearLocationData();
            setIsConfirmClearOpen(false);
            setTimeout(() => {
              setIsMainDropdownOpen(true);
            }, 100);
          },
          classname: "w-[100px]",
        }}
      />
      <Modal
        open={isPostalCodeModalOpen}
        onOpenChange={setIsPostalCodeModalOpen}
        closeOnOutsideClick={false}
        withCloseButton={false}
      >
        <ModalContent>
          <div className="relative w-[472px] space-y-6 p-6">
            <div className="text-center text-sm font-bold">
              Cari Kelurahan/Kecamatan/Kode Pos
            </div>
            <div className="min-h-[1px] w-full border border-solid border-stone-300 bg-stone-300" />
            <SearchPostal
              name="search"
              placeholder="Cari Kelurahan/Kecamatan/Kode Pos"
              searchValue={locationSearch.locationPostalCodeSearchPhrase}
              setSearchValue={locationSearch.setLocationPostalCodeSearchPhrase}
              icon={{ left: "/icons/search.svg" }}
              options={locationSearch.postalCodeAutoCompleteResult}
              getOptionLabel={(option) => option.Description} // Sesuaikan dengan data Anda
              onSelectValue={handleConfirmPostalCode} // Hubungkan ke handler baru
              errorMessage={postalCodeErrorMessage}
            />
          </div>
          <div className="flex items-center justify-center gap-2 pb-4">
            <Button
              variant="muattrans-primary-secondary"
              onClick={() => {
                setIsPostalCodeModalOpen(false);
                setPostalCodeErrorMessage("");
              }}
            >
              Batalkan
            </Button>
            <Button
              variant="muattrans-primary"
              onClick={() => {
                const selectedOption =
                  locationSearch.postalCodeAutoCompleteResult.find(
                    (option) =>
                      option.Description ===
                      locationSearch.locationPostalCodeSearchPhrase
                  );
                handleConfirmPostalCode(selectedOption);
                if (!selectedOption) {
                  setPostalCodeErrorMessage(
                    "Kelurahan/Kecamatan/Kode Pos wajib diisi"
                  );
                } else {
                  setPostalCodeErrorMessage("");
                }
              }}
            >
              Simpan
            </Button>
          </div>
        </ModalContent>
      </Modal>
      <div className="mt-6 flex items-end justify-end">
        <Button type="submit" variant="muattrans-primary" className="px-8">
          Simpan
        </Button>
      </div>
    </form>
  );
}

export default InformasiPendaftar;
