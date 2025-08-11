import { useCallback, useEffect, useRef, useState } from "react";

import Button from "@/components/Button/Button";
import DropdownRadioBottomsheeet from "@/components/Dropdown/DropdownRadioBottomsheeet";
import { ResponsiveFooter } from "@/components/Footer/ResponsiveFooter";
import Checkbox from "@/components/Form/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import { InfoBottomsheet } from "@/components/Form/InfoBottomsheet";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { useTranslation } from "@/hooks/use-translation";
import FormResponsiveLayout from "@/layout/Shipper/ResponsiveLayout/FormResponsiveLayout";
import { useResponsiveNavigation } from "@/lib/responsive-navigation";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import {
  useLayananTambahanActions,
  useLayananTambahanStore,
} from "@/store/Shipper/forms/layananTambahanStore";
import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/Shipper/forms/sewaArmadaStore";

const LayananTambahanScreen = ({
  additionalServicesOptions,
  shippingOption,
}) => {
  const { t } = useTranslation();
  const navigation = useResponsiveNavigation();
  const isMountedRef = useRef(true);
  const [isSaving, setIsSaving] = useState(false);

  // Local state for handling form errors
  const [localFormErrors, setLocalFormErrors] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  const { setField: sewaArmadaSetField } = useSewaArmadaActions();

  const {
    formValues: tambahanFormValues,
    formErrors: tambahanFormErrors,
    setField: tambahanSetField,
  } = useLayananTambahanStore();

  const { setErrors: tambahanSetErrors } = useLayananTambahanActions();

  // Zustand store
  const {
    formValues: locationFormValues,
    formErrors: locationFormErrors,
    setField: locationSetField,
    validateLayananTambahan,
    setLocationPartial,
  } = useLocationFormStore();

  // SewaArmada store for additionalServices
  const additionalServices = useSewaArmadaStore(
    (s) => s.formValues.additionalServices
  );
  const shippingDetailsLocation = useSewaArmadaStore(
    (s) => s.formValues?.shippingDetailsLocation
  );
  const { setField: setSewaArmadaField } = useSewaArmadaActions();

  const { data: shippingOptionsData, trigger: fetchShippingOptions } =
    useSWRMutateHook(
      "v1/orders/shipping-options",
      "POST",
      undefined,
      {},
      {
        onError: (error) => {
          console.error("SWR Error fetching shipping options:", error);
          // Don't show error to user for this optional API call
        },
        onSuccess: () => {
          // Only update if component is still mounted
          if (isMountedRef.current) {
            // This will be handled by the effect
          }
        },
      }
    );

  const shippingOptions = shippingOptionsData?.Data.shippingOptions || [];

  // Clear opsi pengiriman error when user selects an option
  useEffect(() => {
    if (tambahanFormValues.opsiPegiriman && localFormErrors.opsiPegiriman) {
      setLocalFormErrors((prev) => ({
        ...prev,
        opsiPegiriman: undefined,
      }));
    }
  }, [tambahanFormValues.opsiPegiriman, localFormErrors.opsiPegiriman]);

  // Initialize shipping option from direct prop if provided
  useEffect(() => {
    // Skip if form is already initialized or if no shipping option provided
    if (isInitialized || !shippingOption?.id) return;

    // Format and set shipping option to match DeliveryEvidenceModal's structure
    tambahanSetField("opsiPegiriman", {
      id: shippingOption.id,
      courierName: shippingOption.courierName,
      originalCost: shippingOption.originalCost,
      originalInsurance: shippingOption.originalInsurance || 0,
    });

    // Enable the shipping service checkbox
    tambahanSetField("kirimBuktiFisik", true);

    // Default insurance to false (user can enable if needed)
    tambahanSetField("asuransiPengiriman", false);

    // Set initialized flag to true to prevent re-initialization
    setIsInitialized(true);
  }, [shippingOption, isInitialized, tambahanSetField]);

  // Initialize form with existing values from store (run once after mount if not initialized from prop)
  useEffect(() => {
    // Skip if already initialized (e.g., from shippingOption prop)
    if (isInitialized) return;

    const existingShippingService = additionalServices.find(
      (service) => service.withShipping
    );

    if (existingShippingService && existingShippingService.shippingDetails) {
      const { shippingDetails } = existingShippingService;

      // Set kirimBuktiFisik checkbox to true
      tambahanSetField("kirimBuktiFisik", true);

      // Set asuransi pengiriman
      if (shippingDetails.withInsurance) {
        tambahanSetField("asuransiPengiriman", true);
      }

      // Try to reconstruct opsi pengiriman from stored data
      if (existingShippingService.shippingCost) {
        const shippingCost = existingShippingService.shippingCost;

        // Search in shipping options by comparing originalCost instead of formatted price
        const foundOption = shippingOptions
          .flatMap((category) => category.expeditions || [])
          .find((option) => option.originalCost === shippingCost);

        if (foundOption) {
          tambahanSetField("opsiPegiriman", foundOption);
        }
      }
    } else {
      // No existing shipping service found
    }

    setIsInitialized(true);
  }, [additionalServices, isInitialized, tambahanSetField, shippingOptions]);

  // Populate location form from shippingDetailsLocation (separate from initialization)
  useEffect(() => {
    if (!isInitialized || !shippingDetailsLocation) return;

    console.log("🔄 Populating location form from shippingDetailsLocation");

    // Only populate if current form is empty to avoid overriding user changes
    if (!locationFormValues.namaPIC && shippingDetailsLocation.namaPIC) {
      locationSetField("namaPIC", shippingDetailsLocation.namaPIC);
    }
    if (!locationFormValues.noHPPIC && shippingDetailsLocation.noHPPIC) {
      locationSetField("noHPPIC", shippingDetailsLocation.noHPPIC);
    }
    if (
      !locationFormValues.detailLokasi &&
      shippingDetailsLocation.detailLokasi
    ) {
      locationSetField("detailLokasi", shippingDetailsLocation.detailLokasi);
    }

    // Set dataLokasi if exists and current dataLokasi is empty
    if (shippingDetailsLocation.dataLokasi && !locationFormValues.dataLokasi) {
      locationSetField("dataLokasi", shippingDetailsLocation.dataLokasi);
    }
  }, [
    isInitialized,
    shippingDetailsLocation,
    locationFormValues.namaPIC,
    locationFormValues.noHPPIC,
    locationFormValues.detailLokasi,
    locationFormValues.dataLokasi,
    locationSetField,
  ]);

  // Cleanup effect to handle component unmount
  useShallowCompareEffect(() => {
    return () => {
      isMountedRef.current = false;
      setIsSaving(false);
    };
  }, []);

  const handleFetchShippingOptions = useCallback(
    async ({ lat, long }) => {
      if (!lat || !long) {
        return; // Don't fetch if coordinates are missing
      }

      try {
        await fetchShippingOptions({ lat, long });
      } catch (error) {
        console.error("Error fetching shipping options:", error);
        // Don't show error to user for this optional API call
      }
    },
    [fetchShippingOptions]
  );

  useShallowCompareEffect(() => {
    if (locationFormValues.dataLokasi?.coordinates && isMountedRef.current) {
      handleFetchShippingOptions({
        lat: locationFormValues.dataLokasi.coordinates.latitude,
        long: locationFormValues.dataLokasi.coordinates.longitude,
      });
    }
  }, [locationFormValues.dataLokasi?.coordinates, handleFetchShippingOptions]);

  useShallowCompareEffect(() => {
    if (shippingOptions.length > 0 && isMountedRef.current) {
      sewaArmadaSetField("tempShippingOptions", shippingOptions);
    }
  }, [shippingOptions, sewaArmadaSetField]);

  // NOTE: Removed automatic useEffect clearing to prevent data loss
  // Data clearing now ONLY happens on manual user action via handleKirimBuktiFisikChange

  // Handle kirimBuktiFisik checkbox change - ONLY clear data on manual uncheck
  const handleKirimBuktiFisikChange = (checked) => {
    console.log("👤 User manually changed kirimBuktiFisik to:", checked);

    // Always update the checkbox state
    tambahanSetField("kirimBuktiFisik", checked);

    // When unchecked, ONLY remove from store but KEEP form data for reuse
    if (!checked) {
      console.log(
        "📝 User unchecked - removing service from store but keeping form data"
      );

      // Remove service from store
      const existingShippingService = additionalServices.find(
        (service) => service.withShipping
      );
      if (existingShippingService) {
        console.log("🗑️ Removing shipping service from store");
        const updatedServices = additionalServices.filter(
          (service) => !service.withShipping
        );
        setSewaArmadaField("additionalServices", updatedServices);
        setSewaArmadaField("shippingDetailsLocation", null);
      }

      // Clear any validation errors
      setLocalFormErrors({});

      // NOTE: Form data (opsiPegiriman, namaPIC, etc.) is preserved
      // User can recheck and data will still be there
      console.log("✅ Form data preserved for future use");
    }
  };

  const handleSaveLayananTambahan = () => {
    const isLocationFormValid = validateLayananTambahan();

    // Validate tambahan form - opsi pengiriman wajib jika kirim bukti fisik dicentang
    const tambahanErrors = {};
    if (
      tambahanFormValues.kirimBuktiFisik &&
      !tambahanFormValues.opsiPegiriman
    ) {
      tambahanErrors.opsiPegiriman = "Opsi Pengiriman wajib dipilih";
    }

    // Set errors to local state for UI display
    setLocalFormErrors(tambahanErrors);

    const isTambahanFormValid = Object.keys(tambahanErrors).length === 0;

    console.log("🔍 Validation results:", {
      isLocationFormValid,
      isTambahanFormValid,
      locationFormErrors,
      tambahanErrors,
    });

    if (!isLocationFormValid || !isTambahanFormValid) {
      // Count total errors from both form stores
      const locationErrorCount = Object.keys(locationFormErrors || {}).filter(
        (key) => locationFormErrors[key]
      ).length;
      const tambahanErrorCount = Object.keys(tambahanErrors).length;
      const totalErrors = locationErrorCount + tambahanErrorCount;

      console.log("❌ Validation failed. Total errors:", totalErrors);

      // Show toast if there are multiple errors
      if (totalErrors > 1) {
        toast.error(t("messageFieldKosong"));
      }
      return;
    }

    console.log("✅ Validation passed, proceeding to save");

    // Create newAdditionalService if kirimBuktiFisik is checked - similar to DeliveryEvidenceModal
    if (
      tambahanFormValues.kirimBuktiFisik &&
      tambahanFormValues.opsiPegiriman
    ) {
      console.log("🚚 Creating shipping service");

      const sendDeliveryEvidenceService = additionalServicesOptions.find(
        (item) => item.withShipping
      );

      if (sendDeliveryEvidenceService) {
        // Shipping and insurance costs are taken directly from the shipping option

        const newAdditionalService = {
          serviceId: sendDeliveryEvidenceService.additionalServiceId,
          withShipping: sendDeliveryEvidenceService.withShipping,
          shippingCost: Number(
            tambahanFormValues.opsiPegiriman.originalCost || 0
          ),
          shippingDetails: {
            shippingOptionId: tambahanFormValues.opsiPegiriman.id || null,
            courierName: tambahanFormValues.opsiPegiriman.courierName || "",
            withInsurance: tambahanFormValues.asuransiPengiriman,
            ...(tambahanFormValues.asuransiPengiriman && {
              insuranceCost: Number(
                tambahanFormValues.opsiPegiriman.originalInsurance || 0
              ),
            }),
            recipientName: locationFormValues.namaPIC,
            recipientPhone: locationFormValues.noHPPIC,
            destinationAddress: locationFormValues.dataLokasi.location.name,
            detailAddress: locationFormValues.detailLokasi,
            district: locationFormValues.dataLokasi.district.name,
            city: locationFormValues.dataLokasi.city.name,
            province: locationFormValues.dataLokasi.province.name,
            postalCode: locationFormValues.dataLokasi.postalCode.name,
            latitude: locationFormValues.dataLokasi.coordinates.latitude,
            longitude: locationFormValues.dataLokasi.coordinates.longitude,
          },
        };

        console.log("📦 New additional service created:", newAdditionalService);

        const existingIndex = additionalServices.findIndex(
          (service) => service.serviceId === newAdditionalService.serviceId
        );

        if (existingIndex !== -1) {
          // Update existing service
          console.log("🔄 Updating existing service at index:", existingIndex);
          const updatedServices = [...additionalServices];
          updatedServices[existingIndex] = newAdditionalService;
          setSewaArmadaField("additionalServices", updatedServices);
        } else {
          // Add new service
          console.log("➕ Adding new service");
          setSewaArmadaField("additionalServices", [
            newAdditionalService,
            ...additionalServices,
          ]);
        }

        // Set shipping details location - same as DeliveryEvidenceModal
        console.log("📍 Setting shipping details location");
        setSewaArmadaField("shippingDetailsLocation", locationFormValues);
      }
    } else if (!tambahanFormValues.kirimBuktiFisik) {
      console.log(
        "📝 Kirim bukti fisik not checked, saving without shipping service"
      );
    }

    // Clear errors on successful validation
    setLocalFormErrors({});
    console.log("✅ Save process completed successfully");

    // Navigate back and remove LayananTambahan from URL
    console.log("🔙 Navigating back from LayananTambahan");

    // Use popTo root to ensure clean navigation
    navigation.popTo("/");

    // // Alternative: Clean URL manually if needed
    // setTimeout(() => {
    //   const url = new URL(window.location);
    //   if (url.searchParams.get("screen")?.includes("LayananTambahan")) {
    //     url.searchParams.delete("screen");
    //     window.history.replaceState({}, "", url.toString());
    //     console.log("🧹 Cleaned LayananTambahan from URL");
    //   }
    // }, 50);
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
    "Opsi Pengiriman wajib dipilih": "errorOpsiPengirimanRequired",
  };

  return (
    <FormResponsiveLayout
      onClickBackButton={() => {
        navigation.popTo("/");
      }}
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
                onChange={(e) => handleKirimBuktiFisikChange(e.checked)}
              />

              <InfoBottomsheet title={t("checkboxKirimBuktiFisik")}>
                <span className="text-sm font-medium leading-[15.4px] text-neutral-900">
                  {t("descKirimBuktiFisik")}
                </span>
              </InfoBottomsheet>
            </div>

            <span className="ml-6 text-sm font-medium leading-[15.4px] text-neutral-600">
              {tambahanFormValues.opsiPegiriman &&
              tambahanFormValues.opsiPegiriman.originalCost
                ? (() => {
                    const shippingPrice = parseInt(
                      (
                        tambahanFormValues.opsiPegiriman.originalCost || 0
                      ).toString()
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
                      className={
                        isKirimBuktiFisikDisabled
                          ? "text-primary-400"
                          : "icon-fill-primary-700"
                      }
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
                              locationSetField(
                                "noHPPIC",
                                contacts[0].tel[0].replace("+62", "0")
                              );
                            } else {
                              alert(t("messageNoPhoneNumber"));
                            }
                          } catch {
                            // Silently handle contact picker errors
                          }
                        } else {
                          alert(t("messageContactPickerNotSupported"));
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
                        className={`break-words text-xs font-medium leading-[14.4px] text-neutral-900 max-[600px]:text-sm max-[600px]:font-semibold max-[600px]:leading-[15.4px]`}
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
              <button
                className={cn(
                  "flex h-8 items-center gap-x-2 rounded-md border border-neutral-600 bg-neutral-50 px-2",
                  isKirimBuktiFisikDisabled || isLocationDisabled
                    ? "cursor-not-allowed border-neutral-600 bg-neutral-200 hover:border-neutral-600"
                    : "cursor-pointer"
                )}
                onClick={() => {
                  navigation.push("/SearchKecamatan", {
                    kecamatanList: locationFormValues.dataLokasi?.kecamatanList,
                  });
                }}
                disabled={isKirimBuktiFisikDisabled || isLocationDisabled}
              >
                <IconComponent src="/icons/search16.svg" />
                <span
                  className={cn(
                    "text-sm font-semibold leading-[15.4px]",
                    locationFormValues.dataLokasi?.district
                      ? "text-neutral-900"
                      : "text-neutral-600"
                  )}
                >
                  {locationFormValues.dataLokasi?.district?.name ||
                    t("placeholderKecamatan")}
                </span>
              </button>
              {/* <DropdownRadioBottomsheeet
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
              /> */}
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
                      navigation.push("/OpsiPengiriman", { shippingOptions });
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
                      {shippingOption?.id ? (
                        <>
                          <span
                            className={`text-neutral-900} text-sm font-semibold leading-[15.4px]`}
                          >
                            {shippingOption.courierName}
                          </span>
                          <span className="text-xs font-medium leading-[13.2px] text-neutral-900">
                            {shippingOption.originalCost
                              ? `Rp${shippingOption.originalCost.toLocaleString("id-ID")}`
                              : ""}
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
                {shippingOption?.id ? (
                  <Checkbox
                    disabled={isKirimBuktiFisikDisabled}
                    checked={tambahanFormValues.asuransiPengiriman}
                    onChange={(e) =>
                      tambahanSetField("asuransiPengiriman", e.checked)
                    }
                    label={`Pakai Asuransi Pengiriman (Rp${shippingOption.originalInsurance.toLocaleString("id-ID")})`}
                    className="!text-xs !font-medium !leading-[15.6px]"
                  />
                ) : null}
              </div>
              {tambahanFormErrors?.opsiPegiriman ||
              localFormErrors?.opsiPegiriman ? (
                <span className="text-xs font-medium leading-[13.2px] text-error-400">
                  {t(
                    errorMessageMap[
                      tambahanFormErrors?.opsiPegiriman ||
                        localFormErrors?.opsiPegiriman
                    ] ||
                      tambahanFormErrors?.opsiPegiriman ||
                      localFormErrors?.opsiPegiriman
                  )}
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
          disabled={isSaving}
        >
          {isSaving ? "Menyimpan..." : t("buttonSimpan")}
        </Button>
      </ResponsiveFooter>
    </FormResponsiveLayout>
  );
};

export default LayananTambahanScreen;
