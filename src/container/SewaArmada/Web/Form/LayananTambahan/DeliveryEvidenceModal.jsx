import { useState } from "react";

import Button from "@/components/Button/Button";
import { DropdownJasaPengiriman } from "@/components/Dropdown/DropdownJasaPengiriman";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import { InputLocationManagementDropdown } from "@/components/LocationManagement/Web/InputLocationManagementDropdown/InputLocationManagementDropdown";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import TextArea from "@/components/TextArea/TextArea";
import { LocationProvider } from "@/hooks/use-location/use-location";
import { useShallowMemo } from "@/hooks/use-shallow-memo";
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
  shippingOptions,
}) => {
  const [deliveryEvidenceFormValues, setDeliveryEvidenceFormValues] = useState({
    recipientName: "",
    recipientPhone: "",
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

  const handleChangeFormValues = ({ target: { name, value } }) => {
    setDeliveryEvidenceFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setDeliveryEvidenceFormErrors((prevState) => ({
      ...prevState,
      [name]: undefined,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    const { recipientName, recipientPhone } = deliveryEvidenceFormValues;

    if (!recipientName) {
      newErrors.recipientName = "Nama penerima wajib diisi";
    } else if (recipientName.length < 3) {
      newErrors.recipientName = "Nama penerima minimal 3 karakter";
    } else if (/[^a-zA-Z\s]/.test(recipientName)) {
      newErrors.recipientName = "Penulisan nama penerima tidak valid";
    }

    if (!recipientPhone) {
      newErrors.recipientPhone = "Nomor handphone penerima wajib diisi";
    } else if (recipientPhone.length < 8) {
      newErrors.recipientPhone = "Nomor handphone penerima minimal 8 digit";
    } else if (/[^0-9]/.test(recipientPhone)) {
      newErrors.recipientPhone = "Nomor handphone penerima tidak valid";
    }

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
      shippingDetails: {
        ...deliveryEvidenceFormValues,
        destinationAddress: dataLokasi.location.name,
        detailAddress: detailLokasi,
        district: dataLokasi.district.name,
        city: dataLokasi.city.name,
        province: dataLokasi.province.name,
        postalCode: dataLokasi.postalCode.name,
      },
    };
    setField("additionalServices", [
      newAdditionalService,
      ...additionalServices,
    ]);

    setIsOpen(false);
    resetLocationForm();
  };

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
      closeOnOutsideClick={false}
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
                name="recipientName"
                placeholder="Masukkan Nama Penerima"
                value={deliveryEvidenceFormValues.recipientName}
                onChange={handleChangeFormValues}
                errorMessage={deliveryEvidenceFormErrors.recipientName}
                className="w-full"
              />

              {/* Nomor Handphone Field */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Nomor Handphone Penerima*
              </label>
              <Input
                name="recipientPhone"
                placeholder="Contoh: 08xxxxxxxx"
                type="tel"
                value={deliveryEvidenceFormValues.recipientPhone}
                onChange={handleChangeFormValues}
                errorMessage={deliveryEvidenceFormErrors.recipientPhone}
                className="w-full"
              />

              {/* Alamat Tujuan Field */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Alamat Tujuan*
              </label>

              <LocationProvider>
                <InputLocationManagementDropdown
                  hideDropdownWhenTopIsLessThan={1225}
                />
              </LocationProvider>

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
