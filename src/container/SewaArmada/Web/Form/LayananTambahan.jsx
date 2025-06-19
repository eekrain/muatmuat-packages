import { useState } from "react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import IconComponent from "@/components/IconComponent/IconComponent";
import { InputLocationManagementDropdown } from "@/components/LocationManagement/Web/InputLocationManagementDropdown/InputLocationManagementDropdown";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import TextArea from "@/components/TextArea/TextArea";
import { LocationProvider } from "@/hooks/use-location/use-location";
import { useLocationFormStore } from "@/store/forms/locationFormStore";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const LayananTambahan = () => {
  const [isOpen, setIsOpen] = useState(false);

  const kirimBuktiFisik = useSewaArmadaStore(
    (s) => s.formValues.kirimBuktiFisik
  );
  const bantuanTambahan = useSewaArmadaStore(
    (s) => s.formValues.bantuanTambahan
  );
  const { setField: setSewaArmadaField } = useSewaArmadaActions();
  const {
    formValues: locationFormValues,
    formErrors: locationFormErrors,
    setField: setLocationField,
    validateLayananTambahan,
    setLocationPartial,
    reset: resetLocationForm,
  } = useLocationFormStore();

  // Fetch layanan tambahan dari API
  // Nanti dulu belum ada data
  // https://claude.ai/chat/ef9b6ad4-0d1c-46f3-b8f9-e63d29cc0db1
  // const { data: additionalServices, error } = useSWRHook(
  //   "v1/orders/additional-services"
  // );

  const handleSubmit = () => {
    // Bikin validasi sendiri, soalnya validateSimpanLokasi ga ada validasi kodepos & kecamatan karena ga ada user selection
    const isFormValid = validateLayananTambahan();
    if (!isFormValid) return;

    // Baru handle disini
    console.log("🚀 ~ handleSubmit ~ locationFormValues:", locationFormValues);

    setIsOpen(false);
    resetLocationForm();
  };

  const dataLokasi = useLocationFormStore((s) => s.formValues.dataLokasi);

  return (
    <>
      <FormContainer>
        {/* Label Bagian */}
        <FormLabel variant="small">Layanan Tambahan</FormLabel>

        {/* Container Opsi Layanan */}
        <div className="flex-grow-1 flex h-[44px] w-[576px] flex-col gap-[12px]">
          {/* Opsi Layanan 1 - Kirim Bukti Fisik */}
          <div className="flex h-[16px] w-full flex-row items-center justify-between gap-[4px]">
            {/* Container Checkbox dan Label */}
            <div className="flex h-[16px] flex-row items-center gap-[4px]">
              <Checkbox
                onChange={(e) => {
                  setIsOpen(true);
                  setSewaArmadaField("kirimBuktiFisik", e.checked);
                }}
                label="Kirim Bukti Fisik Penerimaan Barang"
                checked={kirimBuktiFisik}
                value="kirim_bukti_fisik"
              />
              <IconComponent src="/icons/info16.svg" width={16} height={16} />
            </div>

            {/* Harga Opsi 1 */}
            <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
              Rp-
            </span>
          </div>

          {/* Opsi Layanan 2 - Bantuan Tambahan */}
          <div className="flex h-[16px] w-full flex-row items-center justify-between gap-[4px]">
            {/* Container Checkbox dan Label */}
            <div className="flex h-[16px] flex-row items-center gap-[4px]">
              <Checkbox
                onChange={(e) =>
                  setSewaArmadaField("bantuanTambahan", e.checked)
                }
                label="Bantuan Tambahan"
                checked={bantuanTambahan}
                value="bantuan_tambahan"
              />
              <IconComponent src="/icons/info16.svg" width={16} height={16} />
            </div>

            {/* Harga Opsi 2 */}
            <span className="text-[12px] font-medium leading-[14.4px] text-neutral-900">
              Rp105.000
            </span>
          </div>
        </div>
      </FormContainer>

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
                  name="namaPIC"
                  placeholder="Masukkan Nama Penerima"
                  type="text"
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
    </>
  );
};
