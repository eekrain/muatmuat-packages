import Button from "@/components/Button/Button";
import DropdownRadioBottomsheeet from "@/components/Dropdown/DropdownRadioBottomsheeet";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import Checkbox from "@/components/Form/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useTranslation } from "@/hooks/use-translation";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { useLayananTambahanStore } from "@/store/Shipper/forms/layananTambahanStore";
import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";

const LayananTambahanScreen = ({ additionalServicesOptions }) => {
  const { t } = useTranslation();
  const navigation = useResponsiveNavigation();
  const shippingData = [
    {
      category: "Pengiriman Instant",
      options: [
        {
          courier: "Gojek",
          price: "Rp30.000",
          estimation:
            "Estimasi Tiba : Hari ini (3 jam setelah dikirim Penjual)",
        },
        {
          courier: "Grab Express",
          price: "Rp25.000",
          estimation:
            "Estimasi Tiba : Hari ini (3 jam setelah dikirim Penjual)",
        },
      ],
    },
    {
      category: "Regular",
      options: [
        {
          courier: "JNT",
          price: "Rp30.000",
          estimation: "Estimasi Tiba : 20 - 25 Okt",
        },
        {
          courier: "JNE",
          price: "Rp25.000",
          estimation: "Estimasi Tiba : 20 - 25 Okt",
        },
      ],
    },
    {
      category: "Kargo",
      options: [
        {
          courier: "JNT Cargo",
          price: "Rp30.000",
          estimation: "Estimasi Tiba : 20 - 25 Okt",
        },
        {
          courier: "JNE Trucking",
          price: "Rp25.000",
          estimation: "Estimasi Tiba : 20 - 25 Okt",
        },
      ],
    },
  ];

  const {
    formValues: tambahanFormValues,
    formErrors: tambahanFormErrors,
    setField: tambahanSetField,
  } = useLayananTambahanStore();

  // Zustand store
  const {
    formValues: locationFormValues,
    formErrors: locationFormErrors,
    setField: locationSetField,
    validateLayananTambahan,
    setLocationPartial,
  } = useLocationFormStore();

  const handleSaveLayananTambahan = () => {
    const isFormValid = validateLayananTambahan();
    console.log("🚀 ~ LayananTambahanScreen ~ formErrors:", locationFormErrors);
    if (!isFormValid) {
      // Count total errors from both form stores
      const locationErrorCount = Object.keys(locationFormErrors || {}).filter(
        (key) => locationFormErrors[key]
      ).length;
      const tambahanErrorCount = Object.keys(tambahanFormErrors || {}).filter(
        (key) => tambahanFormErrors[key]
      ).length;
      const totalErrors = locationErrorCount + tambahanErrorCount;

      // Show toast if there are multiple errors
      if (totalErrors > 1) {
        toast.error(t("messageFieldKosong"));
      }
      return;
    }
    navigation.pop();
  };

  const otherAdditionalServices = useShallowMemo(
    () => additionalServicesOptions.filter((item) => !item.withShipping),
    [additionalServicesOptions]
  );

  const isLocationDisabled = !locationFormValues?.dataLokasi?.location?.name;
  const isKirimBuktiFisikDisabled = !tambahanFormValues.kirimBuktiFisik;

  // Hitung total harga layanan tambahan lainnya yang dicentang
  const selectedAdditionalServices =
    tambahanFormValues.additionalServices || [];
  const additionalServicesTotal = selectedAdditionalServices.reduce(
    (sum, selected) => {
      const found = additionalServicesOptions.find(
        (opt) => opt.additionalServiceId === selected.serviceId
      );
      return found ? sum + Number(found.price) : sum;
    },
    0
  );

  const errorMessageMap = {
    "Nama Penerima wajib diisi": "errorNamaPenerimaRequired",
    "Nama Penerima minimal 3 karakter": "errorNamaPenerimaMin3",
    "Penulisan Nama Penerima tidak valid": "errorNamaPenerimaInvalid",
    "Nomor Handphone Penerima wajib diisi": "errorNoHPPenerimaRequired",
    "Nomor Handphone Penerima minimal 8 digit": "errorNoHPPenerimaMin8",
    "Nomor handphone Penerima tidak valid": "errorNoHPPenerimaInvalid",
    "Format No. HP Penerima salah": "errorNoHPPenerimaFormat",
    "Alamat Tujuan wajib diisi": "errorAlamatTujuanRequired",
    "Detail Alamat Tujuan wajib diisi": "errorDetailAlamatTujuanRequired",
    "Detail Alamat Tujuan minimal 3 karakter": "errorDetailAlamatTujuanMin3",
    "Kecamatan wajib diisi": "errorKecamatanRequired",
    "Kode Pos wajib diisi": "errorKodePosRequired",
  };

  return (
    <FormResponsiveLayout
      title={{
        label: t("titleLayananTambahanScreen"), // Layanan Tambahan
      }}
    >
      <div className="mb-16 flex flex-col gap-y-2 bg-neutral-200">
        {/* Form Container Utama */}
        <div className="flex flex-col gap-6 rounded-none bg-white p-5 px-4">
          {/* Section 1: Checkbox Kirim Bukti Fisik */}
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-1 text-neutral-900">
              <Checkbox
                label={t("checkboxKirimBuktiFisik")} // Kirim Bukti Fisik Penerimaan Barang
                checked={tambahanFormValues.kirimBuktiFisik}
                onChange={(e) => tambahanSetField("kirimBuktiFisik", e.checked)}
              />

              <InfoBottomsheet title={t("checkboxKirimBuktiFisik")}>
                <span className="text-sm font-medium leading-[15.4px] text-neutral-900">
                  {t("descKirimBuktiFisik")}
                </span>
              </InfoBottomsheet>
            </div>

            <span className="ml-6 text-sm font-medium leading-[15.4px] text-neutral-600">
              {tambahanFormValues.opsiPegiriman
                ? (() => {
                    const shippingPrice = parseInt(
                      tambahanFormValues.opsiPegiriman.price.replace(
                        /[^\d]/g,
                        ""
                      )
                    );
                    const insurancePrice = tambahanFormValues.asuransiPengiriman
                      ? 10000
                      : 0;
                    // Tambahkan harga layanan tambahan lainnya ke total
                    const total =
                      shippingPrice + insurancePrice + additionalServicesTotal;
                    return `Rp${total.toLocaleString("id-ID")}`;
                  })()
                : t("labelTotalPrice")}
            </span>
          </div>

          {/* Section 2: Form Fields */}
          <div className="flex w-full flex-col gap-6">
            {/* Nama Penerima Field */}
            <FormContainer>
              <FormLabel required>{t("labelNamaPenerima")}</FormLabel>
              <Input
                disabled={isKirimBuktiFisikDisabled}
                placeholder={t("placeholderNamaPenerima")}
                icon={{
                  right: (
                    <IconComponent
                      className="icon-fill-primary-700"
                      src="/icons/kontak-perusahaan16.svg"
                      onClick={async () => {
                        if (
                          "contacts" in navigator &&
                          "select" in navigator.contacts
                        ) {
                          const props = ["name", "tel"];
                          const opts = { multiple: false };

                          try {
                            const contacts = await navigator.contacts.select(
                              props,
                              opts
                            );
                            if (
                              contacts.length > 0 &&
                              contacts[0].tel &&
                              contacts[0].tel.length > 0
                            ) {
                              locationSetField("namaPIC", contacts[0].name[0]);
                              locationSetField("noHPPIC", contacts[0].tel[0]);
                            } else {
                              alert(t("messageNoPhoneNumber"));
                            }
                          } catch (ex) {
                            console.error("Contact Picker failed", ex);
                          }
                        } else {
                          alert(t("messageContactPickerNotSupported"));
                          console.warn("navigator.contacts is not available.");
                        }
                      }}
                    />
                  ),
                }}
                name="namaPIC"
                type="text"
                value={locationFormValues.namaPIC}
                onChange={(e) => locationSetField("namaPIC", e.target.value)}
                status={locationFormErrors?.namaPIC ? "error" : null}
                errorMessage={
                  locationFormErrors?.namaPIC
                    ? t(
                        errorMessageMap[locationFormErrors.namaPIC] ||
                          locationFormErrors.namaPIC
                      )
                    : undefined
                }
              />
            </FormContainer>

            {/* Nomor Handphone Penerima Field */}
            <FormContainer>
              <FormLabel required>{t("labelNoHPPenerima")}</FormLabel>
              <Input
                disabled={isKirimBuktiFisikDisabled}
                placeholder={t("placeholderNoHPPenerima")}
                name="noHPPIC"
                type="text"
                value={locationFormValues.noHPPIC}
                onChange={(e) => locationSetField("noHPPIC", e.target.value)}
                status={locationFormErrors?.noHPPIC ? "error" : null}
                errorMessage={
                  locationFormErrors?.noHPPIC
                    ? t(
                        errorMessageMap[locationFormErrors.noHPPIC] ||
                          locationFormErrors.noHPPIC
                      )
                    : undefined
                }
              />
            </FormContainer>

            {/* Alamat Tujuan Field */}
            <FormContainer>
              <FormLabel required>{t("labelAlamatTujuan")}</FormLabel>
              <div
                className={`${isKirimBuktiFisikDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => {
                  if (!isKirimBuktiFisikDisabled) {
                    navigation.push("/PencarianLokasi", {
                      config: {
                        afterLocationSelected: () => {
                          navigation.popTo("/LayananTambahan", {});
                        },
                      },
                      layout: {
                        title: t("titlePilihLokasiAlamatTujuan"),
                      },
                    });
                  }
                }}
              >
                {locationFormValues?.dataLokasi?.location?.name ? (
                  <div className="flex w-full flex-col gap-y-2">
                    <div
                      className={`min-h-[32px] w-full rounded-md border px-3 py-2 ${locationFormErrors?.dataLokasi ? "border-error-400" : "border-neutral-600"} ${isKirimBuktiFisikDisabled ? "cursor-not-allowed border-neutral-600 bg-neutral-200" : "bg-neutral-50"}`}
                    >
                      <div
                        className={`break-words text-xs font-medium leading-[14.4px] max-[600px]:text-sm max-[600px]:font-semibold max-[600px]:leading-[15.4px] ${isKirimBuktiFisikDisabled ? "text-neutral-600" : "text-neutral-900"}`}
                      >
                        {locationFormValues?.dataLokasi?.location?.name}
                      </div>
                    </div>
                    {locationFormErrors?.dataLokasi && (
                      <span className="text-xs font-medium text-error-400">
                        {locationFormErrors?.dataLokasi}
                      </span>
                    )}
                  </div>
                ) : (
                  <Input
                    disabled={isKirimBuktiFisikDisabled}
                    placeholder={t("placeholderAlamatTujuan")}
                    name="namaLokasi"
                    type="text"
                    value=""
                    // Ga perlu onChange ini input kan cuman redirect ke pencarian lokasi
                    onChange={() => {}}
                    errorMessage={
                      locationFormErrors?.dataLokasi
                        ? t(
                            errorMessageMap[locationFormErrors.dataLokasi] ||
                              locationFormErrors.dataLokasi
                          )
                        : undefined
                    }
                  />
                )}
              </div>
            </FormContainer>

            {/* Detail Alamat Tujuan Field */}
            <FormContainer className="h-[78px]">
              <FormLabel required>{t("labelDetailAlamatTujuan")}</FormLabel>
              <Input
                disabled={isKirimBuktiFisikDisabled || isLocationDisabled}
                maxLength={500}
                placeholder={t("placeholderDetailAlamatTujuan")}
                name="detailLokasi"
                type="text"
                value={locationFormValues.detailLokasi}
                onChange={(e) =>
                  locationSetField("detailLokasi", e.target.value)
                }
                errorMessage={
                  isLocationDisabled
                    ? ""
                    : locationFormErrors?.detailLokasi
                      ? t(
                          errorMessageMap[locationFormErrors.detailLokasi] ||
                            locationFormErrors.detailLokasi
                        )
                      : undefined
                }
                supportiveText={`${locationFormValues.detailLokasi.length}/500`}
              />
            </FormContainer>

            {/* Kecamatan Field */}
            <FormContainer>
              <FormLabel required>{t("labelKecamatan")}</FormLabel>
              <DropdownRadioBottomsheeet
                disabled={isKirimBuktiFisikDisabled || isLocationDisabled}
                className="w-full"
                title={t("labelKecamatan")}
                options={
                  locationFormValues.dataLokasi?.kecamatanList?.map((item) => ({
                    label: item.name,
                    value: item.value,
                  })) || []
                }
                value={locationFormValues.dataLokasi?.district?.value}
                onChange={(value) => {
                  const kecamatanFound =
                    locationFormValues.dataLokasi?.kecamatanList.find(
                      (item) => item.value === value
                    );
                  setLocationPartial({
                    district: {
                      name: kecamatanFound.name,
                      value: kecamatanFound.value,
                    },
                  });
                }}
                saveLabel={t("buttonSave")}
                placeHolder={t("placeholderKecamatan")}
              />
            </FormContainer>

            {/* Kabupaten/Kota Display */}
            <div className="flex flex-col gap-y-4">
              <span className="leading-[15.4px text-sm font-semibold text-neutral-900">
                {t("labelCity")}
              </span>
              <span className="flex h-2 items-center text-xs font-semibold leading-[13.2px] text-black">
                {locationFormValues.dataLokasi?.city?.name || "-"}
              </span>
            </div>

            {/* Provinsi Display */}
            <div className="flex flex-col gap-y-4">
              <span className="leading-[15.4px text-sm font-semibold text-neutral-900">
                {t("labelProvince")}
              </span>
              <span className="flex h-2 items-center text-xs font-semibold leading-[13.2px] text-black">
                {locationFormValues.dataLokasi?.province?.name || "-"}
              </span>
            </div>

            {/* Kode Pos Field */}
            <FormContainer>
              <FormLabel required>{t("labelKodePos")}</FormLabel>
              <DropdownRadioBottomsheeet
                disabled={isKirimBuktiFisikDisabled || isLocationDisabled}
                className="w-full"
                title={t("labelKodePos")}
                options={
                  locationFormValues.dataLokasi?.postalCodeList?.map(
                    (item) => ({
                      label: item.name,
                      value: item.value,
                    })
                  ) || []
                }
                value={locationFormValues.dataLokasi?.postalCode?.value}
                onChange={(value) => {
                  const postalCodeFound =
                    locationFormValues.dataLokasi?.postalCodeList.find(
                      (item) => item.value === value
                    );
                  setLocationPartial({
                    postalCode: {
                      name: postalCodeFound.name,
                      value: postalCodeFound.value,
                    },
                  });
                }}
                saveLabel={t("buttonSave")}
                placeHolder={t("placeholderKodePos")}
              />
            </FormContainer>

            {/* Section 3: Pilih Opsi Pengiriman */}
            <div className="flex flex-col gap-y-3">
              <div
                className={`flex w-full cursor-pointer flex-col gap-y-3 rounded-md px-4 py-2 ${isKirimBuktiFisikDisabled || isLocationDisabled ? "cursor-not-allowed bg-neutral-200" : "cursor-pointer bg-primary-50"}`}
              >
                <button
                  className={`flex w-full items-center justify-between ${locationFormValues.opsiPegiriman ? "border-b border-b-neutral-400 pb-3" : ""}`}
                  onClick={() => {
                    if (!isKirimBuktiFisikDisabled || isLocationDisabled) {
                      navigation.push("/OpsiPengiriman", { shippingData });
                    }
                  }}
                  disabled={isKirimBuktiFisikDisabled || isLocationDisabled}
                >
                  <div className="flex items-center gap-x-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white p-1.5">
                      <IconComponent
                        src="/icons/transporter16.svg"
                        color={
                          isKirimBuktiFisikDisabled || isLocationDisabled
                            ? "gray"
                            : undefined
                        }
                      />
                    </div>
                    <div className="flex flex-col items-start gap-y-2">
                      {tambahanFormValues.opsiPegiriman ? (
                        <>
                          <span
                            className={`text-sm font-semibold leading-[15.4px] ${isKirimBuktiFisikDisabled || isLocationDisabled ? "text-neutral-600" : "text-neutral-900"}`}
                          >
                            {tambahanFormValues.opsiPegiriman.courier}
                          </span>
                          <span className="text-xs font-medium leading-[13.2px] text-neutral-900">
                            {tambahanFormValues.opsiPegiriman.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-semibold leading-[15.4px] text-primary-700">
                          {t("buttonPilihOpsiPengiriman")}
                        </span>
                      )}
                    </div>
                  </div>
                  <IconComponent
                    src="/icons/chevron-right24.svg"
                    size="medium"
                    color={
                      isKirimBuktiFisikDisabled || isLocationDisabled
                        ? "gray"
                        : undefined
                    }
                  />
                </button>
                {tambahanFormValues.opsiPegiriman ? (
                  <Checkbox
                    checked={tambahanFormValues.asuransiPengiriman}
                    onChange={(e) =>
                      tambahanSetField("asuransiPengiriman", e.checked)
                    }
                    label={t("checkboxAsuransiPengiriman")}
                    className="!text-xs !font-medium !leading-[15.6px]"
                  />
                ) : null}
              </div>
              {tambahanFormErrors?.opsiPegiriman ? (
                <span className="text-xs font-medium leading-[13.2px] text-error-400">
                  {tambahanFormErrors?.opsiPegiriman}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Section 4: Layanan Tambahan Lainnya */}
        {otherAdditionalServices.length > 0 ? (
          <div className="flex w-full flex-col gap-y-6 rounded-none bg-white p-5 px-4">
            {/* Section Header */}
            <button
              className="flex h-5 w-full flex-row items-center justify-between gap-4"
              onClick={() =>
                tambahanSetField(
                  "showOtherAdditionalServices",
                  !tambahanFormValues.showOtherAdditionalServices
                )
              }
            >
              <span className="flex items-center text-sm font-bold leading-[15.4px] text-neutral-900">
                {t("titleLayananTambahanLainnya")}
              </span>
              <IconComponent
                src="/icons/chevron-up20.svg"
                width={20}
                height={20}
              />
            </button>

            {/* Services List Container */}
            {tambahanFormValues.showOtherAdditionalServices ? (
              <div className="flex flex-col gap-y-4">
                {otherAdditionalServices.map((service, key) => {
                  // Check if this service is already in the additionalServices array
                  const isSelected = tambahanFormValues.additionalServices.some(
                    (selectedService) =>
                      selectedService.serviceId === service.additionalServiceId
                  );
                  return (
                    <div className="flex flex-col gap-y-2" key={key}>
                      <FormLabel>
                        <Checkbox
                          label={service.name}
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.checked) {
                              // Add the service to the array if checked
                              tambahanSetField("additionalServices", [
                                ...tambahanFormValues.additionalServices,
                                {
                                  serviceId: service.additionalServiceId,
                                  withShipping: service.withShipping,
                                },
                              ]);
                            } else {
                              // Remove the service from the array if unchecked
                              tambahanSetField(
                                "additionalServices",
                                tambahanFormValues.additionalServices.filter(
                                  (selectedService) =>
                                    selectedService.serviceId !==
                                    service.additionalServiceId
                                )
                              );
                            }
                          }}
                        />
                        <InfoBottomsheet title={t("titleBantuanTambahan")}>
                          <p className="text-sm font-medium leading-[15.4px] text-neutral-900">
                            {service.description}
                          </p>
                        </InfoBottomsheet>
                      </FormLabel>
                      <span className="ml-6 text-sm font-medium leading-[15.4px] text-neutral-600">
                        {`Rp.${Number(service.price).toLocaleString("id-ID")}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <ResponsiveFooter className="flex gap-3">
        <Button
          variant="muatparts-primary"
          className="flex-1"
          onClick={handleSaveLayananTambahan}
          type="button"
        >
          {t("buttonSimpan")}
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default LayananTambahanScreen;
