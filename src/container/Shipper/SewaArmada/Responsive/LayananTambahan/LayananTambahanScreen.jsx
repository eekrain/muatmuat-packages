import Button from "@/components/Button/Button";
import DropdownRadioBottomsheeet from "@/components/Dropdown/DropdownRadioBottomsheeet";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import Checkbox from "@/components/Form/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { useLayananTambahanStore } from "@/store/Shipper/forms/layananTambahanStore";
import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";

const LayananTambahanScreen = ({ additionalServicesOptions }) => {
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
      return;
    }
    navigation.pop();
  };
  console.log("locatin", locationFormValues);
  const otherAdditionalServices = useShallowMemo(
    () => additionalServicesOptions.filter((item) => !item.withShipping),
    [additionalServicesOptions]
  );

  return (
    <FormResponsiveLayout
      title={{
        label: "Layanan Tambahan",
      }}
    >
      <div className="mb-16 flex flex-col gap-y-2 bg-neutral-200">
        {/* Form Container Utama */}
        <div className="flex flex-col gap-6 rounded-none bg-white p-5 px-4">
          {/* Section 1: Checkbox Kirim Bukti Fisik */}
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center gap-x-1 text-neutral-900">
              <Checkbox
                label="Kirim Bukti Fisik Penerimaan Barang"
                checked={tambahanFormValues.kirimBuktiFisik}
                onChange={(e) => tambahanSetField("kirimBuktiFisik", e.checked)}
              />

              <InfoBottomsheet title="Kirim Bukti Fisik Penerimaan Barang">
                <span className="text-[14px] font-medium leading-[15.4px] text-neutral-900">
                  Pilih opsi ini jika kamu ingin dokumen surat jalan atau
                  dokumen pendukung lainnya, dikembalikan ke alamat tujuan yang
                  kamu isikan. Biaya pengiriman akan mengikuti alamat tujuan
                  tersebut.
                </span>
              </InfoBottomsheet>
            </div>

            <span className="ml-6 text-[14px] font-medium leading-[15.4px] text-neutral-600">
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
                    const total = shippingPrice + insurancePrice;
                    return `Rp${total.toLocaleString("id-ID")}`;
                  })()
                : "Rp-"}
            </span>
          </div>

          {/* Section 2: Form Fields */}
          <div className="flex w-full flex-col gap-6">
            {/* Nama Penerima Field */}
            <FormContainer>
              <FormLabel required>Nama Penerima</FormLabel>
              <Input
                placeholder="Masukkan Nama Penerima"
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
                              alert("No phone number found.");
                            }
                          } catch (ex) {
                            console.error("Contact Picker failed", ex);
                          }
                        } else {
                          alert(
                            "Contact Picker API is not supported on this browser."
                          );
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
                errorMessage={locationFormErrors?.namaPIC}
              />
            </FormContainer>

            {/* Nomor Handphone Penerima Field */}
            <FormContainer>
              <FormLabel required>Nomor Handphone Penerima</FormLabel>
              <Input
                placeholder="Contoh: 08xxxxxxxx"
                name="noHPPIC"
                type="text"
                value={locationFormValues.noHPPIC}
                onChange={(e) => locationSetField("noHPPIC", e.target.value)}
                status={locationFormErrors?.noHPPIC ? "error" : null}
                errorMessage={locationFormErrors?.noHPPIC}
              />
            </FormContainer>

            {/* Alamat Tujuan Field */}
            <FormContainer>
              <FormLabel required>Alamat Tujuan</FormLabel>
              <div
                className=""
                onClick={() => {
                  navigation.push("/PencarianLokasi", {
                    config: {
                      afterLocationSelected: () => {
                        navigation.popTo("/LayananTambahan", {});
                      },
                    },
                    layout: {
                      title: "Cari Lokasi Alamat Tujuan",
                    },
                  });
                }}
              >
                <Input
                  placeholder="Masukkan Alamat Tujuan"
                  name="namaLokasi"
                  type="text"
                  value={locationFormValues?.dataLokasi?.location?.name}
                  // Ga perlu onChange ini input kan cuman redirect ke pencarian lokasi
                  onChange={() => {}}
                  errorMessage={locationFormErrors?.dataLokasi}
                />
              </div>
            </FormContainer>

            {/* Detail Alamat Tujuan Field */}
            <FormContainer className="h-[78px]">
              <FormLabel required>Detail Alamat Tujuan</FormLabel>
              <Input
                disabled={!locationFormValues?.dataLokasi?.location?.name}
                maxLength={500}
                placeholder="Masukkan Detail Alamat Tujuan"
                name="detailLokasi"
                type="text"
                value={locationFormValues.detailLokasi}
                onChange={(e) =>
                  locationSetField("detailLokasi", e.target.value)
                }
                errorMessage={locationFormErrors?.detailLokasi}
                supportiveText={`${locationFormValues.detailLokasi.length}/500`}
              />
            </FormContainer>

            {/* Kecamatan Field */}
            <FormContainer>
              <FormLabel required>Kecamatan</FormLabel>
              <DropdownRadioBottomsheeet
                disabled={!locationFormValues?.dataLokasi?.location?.name}
                className="w-full"
                title="Kecamatan"
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
                saveLabel="Simpan"
                placeHolder="Pilih Kecamatan"
              />
            </FormContainer>

            {/* Kabupaten/Kota Display */}
            <div className="flex flex-col gap-y-4">
              <span className="leading-[15.4px text-[14px] font-semibold text-neutral-900">
                Kabupaten/Kota
              </span>
              <span className="flex h-2 items-center text-[12px] font-semibold leading-[13.2px] text-black">
                {locationFormValues.dataLokasi?.city?.name || "-"}
              </span>
            </div>

            {/* Provinsi Display */}
            <div className="flex flex-col gap-y-4">
              <span className="leading-[15.4px text-[14px] font-semibold text-neutral-900">
                Provinsi
              </span>
              <span className="flex h-2 items-center text-[12px] font-semibold leading-[13.2px] text-black">
                {locationFormValues.dataLokasi?.province?.name || "-"}
              </span>
            </div>

            {/* Kode Pos Field */}
            <FormContainer>
              <FormLabel required>Kode Pos</FormLabel>
              <DropdownRadioBottomsheeet
                disabled={!locationFormValues?.dataLokasi?.location?.name}
                className="w-full"
                title="Kode Pos"
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
                saveLabel="Simpan"
                placeHolder="Pilih Kode Pos"
              />
            </FormContainer>

            {/* Section 3: Pilih Opsi Pengiriman */}
            <div className="flex flex-col gap-y-3">
              <div className="flex w-full cursor-pointer flex-col gap-y-3 rounded-md bg-primary-50 px-4 py-2">
                <button
                  className={`flex w-full items-center justify-between ${locationFormValues.opsiPegiriman ? "border-b border-b-neutral-400 pb-3" : ""}`}
                  onClick={() =>
                    navigation.push("/OpsiPengiriman", { shippingData })
                  }
                >
                  <div className="flex items-center gap-x-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white p-1.5">
                      <IconComponent src="/icons/transporter16.svg" />
                    </div>
                    <div className="flex flex-col items-start gap-y-2">
                      {tambahanFormValues.opsiPegiriman ? (
                        <>
                          <span className="text-[14px] font-semibold leading-[15.4px] text-neutral-900">
                            {tambahanFormValues.opsiPegiriman.courier}
                          </span>
                          <span className="text-[12px] font-medium leading-[13.2px] text-neutral-900">
                            {tambahanFormValues.opsiPegiriman.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-[14px] font-semibold leading-[15.4px] text-primary-700">
                          Pilih Opsi Pengiriman
                        </span>
                      )}
                    </div>
                  </div>
                  <IconComponent
                    src="/icons/chevron-right24.svg"
                    size="medium"
                  />
                </button>
                {tambahanFormValues.opsiPegiriman ? (
                  <Checkbox
                    checked={tambahanFormValues.asuransiPengiriman}
                    onChange={(e) =>
                      tambahanSetField("asuransiPengiriman", e.checked)
                    }
                    label="Pakai Asuransi Pengiriman (Rp10.000)"
                    className="!text-[12px] !font-medium !leading-[15.6px]"
                  />
                ) : null}
              </div>
              {tambahanFormErrors?.opsiPegiriman ? (
                <span className="text-[12px] font-medium leading-[13.2px] text-error-400">
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
              <span className="flex items-center text-[14px] font-bold leading-[15.4px] text-neutral-900">
                Layanan Tambahan Lainnya
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
                        <InfoBottomsheet title="Bantuan Tambahan">
                          <p className="text-[14px] font-medium leading-[15.4px] text-neutral-900">
                            {service.description}
                          </p>
                        </InfoBottomsheet>
                      </FormLabel>
                      <span className="ml-6 text-[14px] font-medium leading-[15.4px] text-neutral-600">
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
          Simpan
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default LayananTambahanScreen;
