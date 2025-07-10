import { useEffect, useState } from "react";

import Button from "@/components/Button/Button";
import { DropdownJasaPengiriman } from "@/components/Dropdown/DropdownJasaPengiriman";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import { InputLocationManagementDropdown } from "@/components/LocationManagement/Web/InputLocationManagementDropdown/InputLocationManagementDropdown";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import TextArea from "@/components/TextArea/TextArea";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
import { useSWRMutateHook } from "@/hooks/use-swr";
import { useLocationFormStore } from "@/store/forms/locationFormStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

const DeliveryEvidenceModal = ({
  isOpen,
  setIsOpen,
  modalType,
  additionalServicesOptions,
}) => {
  const [deliveryEvidenceFormValues, setDeliveryEvidenceFormValues] = useState({
    shippingOptionId: null,
    withInsurance: false,
  });
  const [deliveryEvidenceFormErrors, setDeliveryEvidenceFormErrors] = useState(
    {}
  );

  const additionalServices = useSewaArmadaStore(
    (s) => s.formValues.additionalServices
  );

  const { setField } = useSewaArmadaActions();
  const {
    formValues: locationFormValues,
    formErrors: locationFormErrors,
    setField: setLocationField,
    validateLayananTambahan,
    setLocationPartial,
    reset: resetLocationForm,
  } = useLocationFormStore();

  const dataLokasi = useLocationFormStore((s) => s.formValues.dataLokasi);
  const detailLokasi = useLocationFormStore((s) => s.formValues.detailLokasi);

  // Fetch shipping options when location data is complete
  const { data: shippingOptionsData, trigger: fetchShippingOptions } =
    useSWRMutateHook("v1/orders/shipping-options");

  const shippingOptions = shippingOptionsData?.Data.shippingOptions || [];
  const handleFetchShippingOptions = async ({ lat, long }) =>
    await fetchShippingOptions({ lat, long });

  useShallowCompareEffect(() => {
    if (dataLokasi?.coordinates) {
      handleFetchShippingOptions({
        lat: dataLokasi.coordinates.latitude,
        long: dataLokasi.coordinates.longitude,
      });
    }
  }, [dataLokasi?.coordinates]);

  useShallowCompareEffect(() => {
    if (shippingOptions.length > 0) {
      setField("tempShippingOptions", shippingOptions);
    }
  }, [shippingOptions]);

  const selectedShippingOptions = useShallowMemo(() => {
    if (!shippingOptions || shippingOptions?.length === 0) {
      return null;
    }
    const shippingOption = shippingOptions
      .flatMap((option) => option.expeditions)
      .find(
        (expedition) =>
          expedition.id === deliveryEvidenceFormValues.shippingOptionId
      );
    if (!shippingOption) {
      return null;
    }
    return {
      expedition: shippingOption,
      hasInsurance: deliveryEvidenceFormValues.withInsurance,
      insurancePrice: shippingOption.originalInsurance,
    };
  }, [
    shippingOptions,
    deliveryEvidenceFormValues.shippingOptionId,
    deliveryEvidenceFormValues.withInsurance,
  ]);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedShippingOptions) {
      newErrors.shippingOption = "Ekspedisi wajib dipilih";
    }

    setDeliveryEvidenceFormErrors(newErrors);
    // Return validateForm is valid if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    // Validasi form
    const isLocationFormValid = validateLayananTambahan();
    const isFormValid = validateForm();
    if (!isFormValid || !isLocationFormValid) return;

    const sendDeliveryEvidenceService = additionalServicesOptions.find(
      (item) => item.withShipping
    );
    const newAdditionalService = {
      serviceId: sendDeliveryEvidenceService.additionalServiceId,
      withShipping: sendDeliveryEvidenceService.withShipping,
      shippingCost: Number(selectedShippingOptions?.expedition?.originalCost),
      shippingDetails: {
        ...deliveryEvidenceFormValues,
        ...(deliveryEvidenceFormValues.withInsurance && {
          insuranceCost:
            selectedShippingOptions?.expedition.originalInsurance || 0,
        }),
        recipientName: locationFormValues.namaPIC,
        recipientPhone: locationFormValues.noHPPIC,
        destinationAddress: dataLokasi.location.name,
        detailAddress: detailLokasi,
        district: dataLokasi.district.name,
        city: dataLokasi.city.name,
        province: dataLokasi.province.name,
        postalCode: dataLokasi.postalCode.name,
        latitude: dataLokasi.coordinates.latitude,
        longitude: dataLokasi.coordinates.longitude,
      },
    };
    const existingIndex = additionalServices.findIndex(
      (service) => service.serviceId === newAdditionalService.serviceId
    );

    if (existingIndex !== -1) {
      // Update existing service
      const updatedServices = [...additionalServices];
      updatedServices[existingIndex] = newAdditionalService;
      setField("additionalServices", updatedServices);
    } else {
      // Add new service
      setField("additionalServices", [
        newAdditionalService,
        ...additionalServices,
      ]);
    }
    setField("shippingDetailsLocation", locationFormValues);

    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) resetLocationForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onOpenChange={(value) => {
        if (modalType === "create") {
          setField(
            "additionalServices",
            additionalServices.filter((item) => !item.withShipping)
          );
        }
        setIsOpen(value);
      }}
      closeOnOutsideClick
    >
      <ModalContent className="max-h-[598px] overflow-y-auto" type="muatmuat">
        {/* Modal Header */}
        <div className="flex w-[472px] flex-col items-center gap-4 px-6 py-8">
          <h2 className="text-center text-[16px] font-bold leading-[19.2px] text-neutral-900">
            Kirim Bukti Fisik Penerimaan Barang
          </h2>

          {/* Form Container */}
          <div className="relative mr-[-16px] max-h-[361px] w-[424px] overflow-y-auto pr-[11px]">
            <div className="grid grid-cols-1 gap-y-3">
              {/* Nama Penerima Field */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Nama Penerima*
              </label>
              <Input
                name="namaPIC"
                placeholder="Masukkan Nama Penerima"
                value={locationFormValues.namaPIC}
                onChange={(e) => setLocationField("namaPIC", e.target.value)}
                errorMessage={locationFormErrors.namaPIC}
                className="w-full"
              />

              {/* Nomor Handphone Field */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Nomor Handphone Penerima*
              </label>
              <Input
                name="noHPPIC"
                placeholder="Contoh: 08xxxxxxxx"
                type="tel"
                value={locationFormValues.noHPPIC}
                onChange={(e) => setLocationField("noHPPIC", e.target.value)}
                errorMessage={locationFormErrors.noHPPIC}
                className="w-full"
              />
              {/* Alamat Tujuan Field */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Alamat Tujuan*
              </label>

              <InputLocationManagementDropdown
                errorMessage={locationFormErrors.dataLokasi}
              />

              {/* Detail Alamat Field */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Detail Alamat Tujuan*
              </label>
              <TextArea
                name="detailLokasi"
                placeholder="Masukkan Detail Alamat Tujuan"
                value={locationFormValues.detailLokasi}
                onChange={(e) =>
                  setLocationField("detailLokasi", e.target.value)
                }
                maxLength={500}
                height={80}
                hasCharCount={true}
                status={locationFormErrors.detailLokasi ? "error" : null}
                supportiveText={{
                  title: locationFormErrors.detailLokasi || "",
                  desc: "",
                }}
                className="w-full"
              />

              {/* Kecamatan Dropdown */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Kecamatan*
              </label>

              <Select
                placeholder="Pilih Kecamatan Tujuan"
                options={
                  dataLokasi?.kecamatanList &&
                  dataLokasi?.kecamatanList.length > 0
                    ? dataLokasi?.kecamatanList.map((item) => ({
                        label: item.name,
                        value: item.value,
                      }))
                    : []
                }
                value={locationFormValues?.dataLokasi?.district?.value}
                onChange={(selectedValue) => {
                  const kecamatanFound = dataLokasi?.kecamatanList.find(
                    (item) => item.value === selectedValue
                  );
                  setLocationPartial({
                    district: {
                      name: kecamatanFound.name,
                      value: kecamatanFound.value,
                    },
                  });
                }}
                errorMessage={locationFormErrors.district}
              />

              {/* Kota & Provinsi Display */}

              <span className="text-[12px] font-medium text-neutral-600">
                Kota
              </span>
              <span className="text-[12px] font-medium text-neutral-900">
                {dataLokasi?.city?.name || "-"}
              </span>

              <span className="text-[12px] font-medium text-neutral-600">
                Provinsi
              </span>
              <span className="text-[12px] font-medium text-neutral-900">
                {dataLokasi?.province?.name || "-"}
              </span>

              {/* Kode Pos Dropdown */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Kode Pos*
              </label>

              <Select
                placeholder="Pilih Kode Pos"
                options={
                  dataLokasi?.postalCodeList &&
                  dataLokasi?.postalCodeList.length > 0
                    ? dataLokasi?.postalCodeList.map((item) => ({
                        label: item.name,
                        value: item.value,
                      }))
                    : []
                }
                value={locationFormValues?.dataLokasi?.postalCode?.value}
                onChange={(selectedValue) => {
                  const postalCodeFound = dataLokasi?.postalCodeList.find(
                    (item) => item.value === selectedValue
                  );
                  setLocationPartial({
                    postalCode: {
                      name: postalCodeFound.name,
                      value: postalCodeFound.value,
                    },
                  });
                }}
                errorMessage={locationFormErrors.postalCode}
              />

              {/* Ekspedisi Dropdown */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Pilih Ekspedisi*
              </label>
              <DropdownJasaPengiriman
                shippingOptions={shippingOptions}
                value={selectedShippingOptions}
                onChange={({ expedition, hasInsurance }) => {
                  setDeliveryEvidenceFormValues((prev) => ({
                    ...prev,
                    shippingOptionId: expedition.id,
                    withInsurance: hasInsurance,
                  }));
                  setDeliveryEvidenceFormErrors((prevState) => ({
                    ...prevState,
                    shippingOption: undefined,
                  }));
                }}
                placeholder="Pilih Ekspedisi"
                insuranceText="Pakai Asuransi Pengiriman"
                errorMessage={deliveryEvidenceFormErrors.shippingOption}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            variant="muatparts-primary"
            className="h-8 w-[112px]"
            onClick={handleSubmit}
          >
            Simpan
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default DeliveryEvidenceModal;
