"use client";

import { useState } from "react";

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
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { toast } from "@/lib/toast";

import { LocationDropdownInput } from "../../InputLocationDropdown/LocationDropdownInput";

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
    defaultValues: {
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
      addressType: "",
      locationData: {
        latitude: 7.2575,
        longitude: 112.7521,
        location: "",
        district: "",
        city: "Surabaya",
        province: "Jawa Timur",
        postalCode: "",
        placeId: "",
      },
      bankId: "",
      accountNumber: "",
      accountName: "",
    },
  });

  // Watch form values for real-time validation
  const watchedValues = watch();

  // Define options for form fields
  const badanUsahaOptions = [
    { label: "PT (Perseroan Terbatas)", value: "PT" },
    { label: "CV (Commanditaire Vennootschap)", value: "CV" },
    { label: "UD (Usaha Dagang)", value: "UD" },
    { label: "Koperasi", value: "Koperasi" },
    { label: "Lainnya", value: "Lainnya" },
  ];

  const kecamatanOptions = [
    { label: "Gubeng", value: "gubeng" },
    { label: "Tambaksari", value: "tambaksari" },
    { label: "Wonokromo", value: "wonokromo" },
    { label: "Sawahan", value: "sawahan" },
    { label: "Tegalsari", value: "tegalsari" },
  ];

  const kodePosOptions = [
    { label: "60282", value: "60282" },
    { label: "60283", value: "60283" },
    { label: "60284", value: "60284" },
    { label: "60285", value: "60285" },
  ];

  const bankOptions = [
    { label: "Bank BCA", value: "bca" },
    { label: "Bank BNI", value: "bni" },
    { label: "Bank BRI", value: "bri" },
    { label: "Bank Mandiri", value: "mandiri" },
    { label: "Bank CIMB Niaga", value: "cimb" },
  ];

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
    console.log("Form data:", data);
  };

  console.log("Watched values:", watchedValues);

  const { trigger: uploadLogoTrigger, isMutating: isUploadingLogo } =
    useSWRMutateHook(
      "v1/orders/upload", // MODIFIED: Endpoint diubah sesuai referensi
      "POST",
      undefined,
      undefined,
      {
        onSuccess: (data) => {
          // MODIFIED: Struktur response diubah sesuai referensi
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
      }
    );

  const handleLogoUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // Memanggil trigger dari hook SWR. Callback onSuccess/onError akan menangani sisanya.
    await uploadLogoTrigger(formData);
  };

  const handleMapPositionChange = (newCoordinates) => {
    setCoordinates(newCoordinates);
    setValue("locationData.latitude", newCoordinates.latitude.toString());
    setValue("locationData.longitude", newCoordinates.longitude.toString());
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
                  onSelectLocation={(location) =>
                    setValue("locationData.location", location.Title)
                  }
                  errorMessage={errors.locationData?.location?.message}
                />
              </div>

              <FormLabel required>Kecamatan</FormLabel>
              <div>
                <SelectFilterRadix
                  options={kecamatanOptions}
                  value={watchedValues.locationData?.district}
                  onChange={(value) => setValue("locationData.district", value)}
                  placeholder="Pilih Kecamatan"
                  errorMessage={errors.locationData?.district?.message}
                />
              </div>

              <FormLabel required>Kota</FormLabel>
              <p className="text-xs font-medium">
                {watchedValues.locationData?.city || "-"}
              </p>

              <FormLabel required>Provinsi</FormLabel>
              <p className="text-xs font-medium">
                {watchedValues.locationData?.province || "-"}
              </p>

              <FormLabel required>Kode Pos</FormLabel>
              <div>
                <SelectFilterRadix
                  options={kodePosOptions}
                  value={watchedValues.locationData?.postalCode}
                  onChange={(value) =>
                    setValue("locationData.postalCode", value)
                  }
                  placeholder="Pilih Kode Pos"
                  errorMessage={errors.locationData?.postalCode?.message}
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
                            onSelectLocation={(location) =>
                              setValue("locationData.location", location.Title)
                            }
                            errorMessage={
                              errors.locationData?.location?.message
                            }
                            showClearButton={true}
                          />
                        </div>

                        <Button
                          type="submit"
                          variant="muattrans-primary"
                          className="px-8"
                          disabled={isUploadingLogo}
                        >
                          {isUploadingLogo ? "Mengunggah..." : "Simpan"}
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
      <div className="mt-6 flex items-end justify-end">
        <Button type="submit" variant="muattrans-primary" className="px-8">
          Simpan
        </Button>
      </div>
    </form>
  );
}

export default InformasiPendaftar;
