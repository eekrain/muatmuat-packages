import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import { InputLocationManagementDropdown } from "@/components/LocationManagement/Web/InputLocationManagementDropdown/InputLocationManagementDropdown";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import TextArea from "@/components/TextArea/TextArea";
import { LocationProvider } from "@/hooks/use-location/use-location";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

const DeliveryEvidenceModal = ({ isOpen, setIsOpen }) => {
  const [layananTambahanFormValues, setLayananTambahanFormValues] = useState({
    recipientName: "",
    recipientPhone: "",
  });
  const [layananTambahanFormErrors, setLayananTambahanFormErrors] = useState(
    {}
  );

  const {
    formValues: locationFormValues,
    formErrors: locationFormErrors,
    setField: setLocationField,
    validateLayananTambahan,
    setLocationPartial,
    reset: resetLocationForm,
  } = useLocationFormStore();

  const handleChangeFormValues = ({ target: { name, value } }) => {
    setLayananTambahanFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setLayananTambahanFormErrors((prevState) => ({
      ...prevState,
      [name]: undefined,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    const { recipientName, recipientPhone } = layananTambahanFormValues;

    if (!recipientName) {
      newErrors.recipientName = "Nama penerima wajib diisi";
    } else if (recipientName.length < 3) {
      newErrors.recipientName = "Nama penerima minimal 3 karakter";
    } else if (/[^a-zA-Z]/.test(recipientName)) {
      newErrors.recipientName = "Penulisan nama penerima tidak valid";
    }

    if (!recipientPhone) {
      newErrors.recipientPhone = "Nomor handphone penerima wajib diisi";
    } else if (recipientPhone.length < 8) {
      newErrors.recipientPhone = "Nomor handphone penerima minimal 8 digit";
    } else if (/[^0-9]/.test(recipientPhone)) {
      newErrors.recipientPhone = "Nomor handphone penerima tidak valid";
    }

    setLayananTambahanFormErrors(newErrors);
    // return validateForm is valid if all errors are undefined
    return Object.values(errors).every((error) => error === undefined);
  };

  const handleSubmit = () => {
    // Bikin validasi sendiri, soalnya validateSimpanLokasi ga ada validasi kodepos & kecamatan karena ga ada user selection
    const isLocationFormValid = validateLayananTambahan();
    const isFormValid = validateForm();
    if (!isFormValid || !isLocationFormValid) return;

    // Baru handle disini
    console.log("🚀 ~ handleSubmit ~ locationFormValues:", locationFormValues);

    setIsOpen(false);
    resetLocationForm();
  };

  const dataLokasi = useLocationFormStore((s) => s.formValues.dataLokasi);

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen} closeOnOutsideClick={false}>
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
                value={layananTambahanFormValues.recipientName}
                onChange={handleChangeFormValues}
                errorMessage={layananTambahanFormErrors.recipientName}
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
                value={layananTambahanFormValues.recipientPhone}
                onChange={handleChangeFormValues}
                errorMessage={layananTambahanFormErrors.recipientPhone}
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

              {/* Kode Pos Dropdown */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Pilih Ekspedisi*
              </label>
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
