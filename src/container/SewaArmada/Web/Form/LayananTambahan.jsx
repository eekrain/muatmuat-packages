import { useState } from "react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import Dropdown from "@/components/Dropdown/Dropdown";
import { FormContainer, FormLabel } from "@/components/Form/Form";
import Input from "@/components/Form/Input";
import IconComponent from "@/components/IconComponent/IconComponent";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import TextArea from "@/components/TextArea/TextArea";
import {
  useSewaArmadaActions,
  useSewaArmadaStore,
} from "@/store/forms/sewaArmadaStore";

export const LayananTambahan = () => {
  const kirimBuktiFisik = useSewaArmadaStore(
    (state) => state.formValues.kirimBuktiFisik
  );
  const bantuanTambahan = useSewaArmadaStore(
    (state) => state.formValues.bantuanTambahan
  );
  const { setField } = useSewaArmadaActions();

  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    namaPenerima: "",
    nomorHandphone: "",
    alamatTujuan: "",
    detailAlamat: "",
    kecamatan: "",
    kota: "",
    provinsi: "",
    kodePos: "",
  });

  const [errors, setErrors] = useState({});
  const [isKecamatanDropdownOpen, setIsKecamatanDropdownOpen] = useState(false);
  const [isKodePosDropdownOpen, setIsKodePosDropdownOpen] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Auto-populate kota and provinsi when kecamatan is selected
    if (field === "kecamatan" && value) {
      const location = locationMapping[value];
      if (location) {
        setFormData((prev) => ({
          ...prev,
          kecamatan: value,
          kota: location.kota,
          provinsi: location.provinsi,
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.namaPenerima.trim()) {
      newErrors.namaPenerima = "Nama penerima wajib diisi";
    }

    if (!formData.nomorHandphone.trim()) {
      newErrors.nomorHandphone = "Nomor handphone wajib diisi";
    } else if (!/^08\d{8,12}$/.test(formData.nomorHandphone)) {
      newErrors.nomorHandphone = "Format nomor handphone tidak valid";
    }

    if (!formData.alamatTujuan.trim()) {
      newErrors.alamatTujuan = "Alamat tujuan wajib diisi";
    }

    if (!formData.detailAlamat.trim()) {
      newErrors.detailAlamat = "Detail alamat tujuan wajib diisi";
    }

    if (!formData.kecamatan) {
      newErrors.kecamatan = "Kecamatan wajib dipilih";
    }

    if (!formData.kodePos) {
      newErrors.kodePos = "Kode pos wajib dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleKecamatanSelect = (value, label) => {
    handleInputChange("kecamatan", value);
    setIsKecamatanDropdownOpen(false);
  };

  const handleKodePosSelect = (value, label) => {
    handleInputChange("kodePos", value);
    setIsKodePosDropdownOpen(false);
  };

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
                  setField("kirimBuktiFisik", e.checked);
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
                onChange={(e) => setField("bantuanTambahan", e.checked)}
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
            <div className="mr-[-16px] flex max-h-[361px] w-[424px] flex-col gap-y-3 overflow-y-auto pr-[11px]">
              {/* Nama Penerima Field */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Nama Penerima*
              </label>
              <Input
                name="namaPenerima"
                placeholder="Masukkan Nama Penerima"
                type="text"
                value={formData.namaPenerima}
                onChange={(e) =>
                  handleInputChange("namaPenerima", e.target.value)
                }
                errorMessage={errors.namaPenerima}
                className="w-full"
              />

              {/* Nomor Handphone Field */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Nomor Handphone Penerima*
              </label>
              <Input
                name="nomorHandphone"
                placeholder="Contoh: 08xxxxxxxx"
                type="tel"
                value={formData.nomorHandphone}
                onChange={(e) =>
                  handleInputChange("nomorHandphone", e.target.value)
                }
                errorMessage={errors.nomorHandphone}
                className="w-full"
              />

              {/* Alamat Tujuan Field */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Alamat Tujuan*
              </label>
              <Input
                name="alamatTujuan"
                placeholder="Masukkan Alamat Tujuan"
                type="text"
                value={formData.alamatTujuan}
                onChange={(e) =>
                  handleInputChange("alamatTujuan", e.target.value)
                }
                icon={{ left: "/icons/marker-lokasi-muat.svg" }}
                errorMessage={errors.alamatTujuan}
                className="w-full"
              />

              {/* Detail Alamat Field */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Detail Alamat Tujuan*
              </label>
              <TextArea
                name="detailAlamat"
                placeholder="Masukkan Detail Alamat Tujuan"
                value={formData.detailAlamat}
                onChange={(e) =>
                  handleInputChange("detailAlamat", e.target.value)
                }
                maxLength={500}
                height={80}
                hasCharCount={true}
                status={errors.detailAlamat ? "error" : null}
                supportiveText={{
                  title: errors.detailAlamat || "",
                  desc: "",
                }}
                className="w-full"
              />

              {/* Kecamatan Dropdown */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Kecamatan*
              </label>
              <Dropdown
                options={[
                  { name: "Red", value: "red" },
                  { name: "Blue", value: "blue" },
                  { name: "Green", value: "green" },
                  { name: "Yellow", value: "yellow" },
                ]}
                placeholder="Select colors"
                isMultipleSelected={true}
                onSelected={(selected) => console.log("Selected:", selected)}
              />

              {/* Kota & Provinsi Display */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-neutral-600">
                    Kota
                  </span>
                  <span className="text-[12px] font-medium text-neutral-900">
                    {formData.kota || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-medium text-neutral-600">
                    Provinsi
                  </span>
                  <span className="text-[12px] font-medium text-neutral-900">
                    {formData.provinsi || "-"}
                  </span>
                </div>
              </div>

              {/* Kode Pos Dropdown */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Kode Pos*
              </label>

              {/* Kode Pos Dropdown */}
              <label className="text-[12px] font-medium leading-[14.4px] text-neutral-600">
                Pilih Ekspedisi*
              </label>
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
