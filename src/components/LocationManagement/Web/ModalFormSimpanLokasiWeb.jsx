import { ChevronDown, MapPin } from "lucide-react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import Input from "@/components/Form/Input";
import { Modal, ModalContent } from "@/components/Modal/Modal";
import { cn } from "@/lib/utils";
import { useLocationFormStore } from "@/store/forms/locationFormStore";

const errors = {};
const ModalFormSimpanLokasiWeb = ({
  open,
  mode = "add",
  title = "Detail Alamat",
  onOpenChange,
  defaultValues,
}) => {
  console.log("🚀 ~ defaultValues:", defaultValues);
  const { formValues, formErrors, setField, reset, validateSimpanLokasi } =
    useLocationFormStore();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      withCloseButton
      closeOnOutsideClick={false}
    >
      <ModalContent>
        <div className="relative grid h-[479px] w-[398px] grid-cols-1 gap-6 overflow-hidden p-6">
          <h2 className="text-base font-bold leading-[1] text-[#1B1B1B]">
            {title}
          </h2>

          <div className="flex h-full flex-col gap-3 overflow-y-auto">
            {/* Label Alamat */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold leading-[12px] text-[#868686]">
                Label Alamat*
              </label>

              <Input
                placeholder="Masukkan label alamat"
                value={formValues.namaLokasi}
                onChange={(e) => {
                  setField("namaLokasi", e.currentTarget.value);
                }}
                errorMessage={formErrors.namaLokasi}
              />
            </div>

            {/* Lokasi */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold leading-[12px] text-[#868686]">
                Lokasi
              </label>
              <div className="flex h-[42px] w-full items-center gap-3 px-1.5">
                <div className="h-6 w-[19.2px] flex-shrink-0">
                  <MapPin className="h-full w-full fill-current text-[#FFC217]" />
                </div>
                <span className="line-clamp-3 flex-1 text-[12px] font-semibold leading-[14px] text-[#1B1B1B]">
                  {formValues.dataLokasi?.location?.name ||
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, quasi?"}
                </span>
              </div>
            </div>

            {/* Alamat */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold leading-[12px] text-[#868686]">
                Alamat
              </label>
              <textarea
                value={formValues.detailLokasi}
                onChange={(e) => {
                  setField("detailLokasi", e.currentTarget.value);
                }}
                placeholder="Masukkan alamat lengkap dengan detail. Contoh : Nama Jalan (bila tidak ditemukan), Gedung, No. Rumah/Patokan, Blok/Unit"
                rows={4}
                className={cn(
                  "w-full resize-none rounded-md border border-[#868686] bg-white px-2 py-2.5 text-[12px] font-medium leading-[14px] text-[#1B1B1B] outline-none placeholder:text-[#868686] hover:border-primary-700 focus:border-primary-700 focus:outline-none",
                  formErrors.detailLokasi && "border-red-500"
                )}
              />
              {formErrors.detailLokasi && (
                <span className="text-[10px] text-red-500">
                  {formErrors.detailLokasi}
                </span>
              )}
            </div>

            {/* Kecamatan */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold leading-[12px] text-[#868686]">
                Kecamatan
              </label>
              <span className="text-[12px] font-semibold leading-[14px] text-[#1B1B1B]">
                {defaultValues?.district?.name}
              </span>
            </div>

            {/* Kota */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold leading-[12px] text-[#868686]">
                Kota
              </label>
              <span className="text-[12px] font-semibold leading-[14px] text-[#1B1B1B]">
                {defaultValues?.city?.name}
              </span>
            </div>

            {/* Provinsi */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold leading-[12px] text-[#868686]">
                Provinsi
              </label>
              <span className="text-[12px] font-semibold leading-[14px] text-[#1B1B1B]">
                {defaultValues?.province?.name}
              </span>
            </div>

            {/* Kode Pos */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold leading-[12px] text-[#868686]">
                Kode Pos*
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={""}
                  onChange={(e) => {}}
                  placeholder="Masukkan kode pos"
                  className={`h-8 w-full rounded-md border bg-white px-3 py-3 pr-10 text-[12px] font-medium leading-[120%] text-black placeholder:text-[#868686] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#176CF7] ${
                    errors.kodePos ? "border-red-500" : "border-[#7B7B7B]"
                  }`}
                />
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#555555]" />
              </div>
              {errors.kodePos && (
                <span className="text-[10px] text-red-500">
                  {errors.kodePos}
                </span>
              )}
            </div>

            {/* Nama PIC */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold leading-[12px] text-[#868686]">
                Nama PIC*
              </label>

              <Input
                placeholder="Masukkan nama PIC"
                value={formValues.namaPIC}
                onChange={(e) => {
                  setField("namaPIC", e.currentTarget.value);
                }}
                errorMessage={formErrors.namaPIC}
              />
            </div>

            {/* No. HP PIC */}
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-semibold leading-[12px] text-[#868686]">
                No. HP PIC*
              </label>
              <Input
                placeholder="Masukkan no. HP PIC"
                value={formValues.noHPPIC}
                onChange={(e) => {
                  setField("noHPPIC", e.currentTarget.value);
                }}
                errorMessage={formErrors.noHPPIC}
              />
            </div>

            {/* Checkbox */}
            <Checkbox
              label="Jadikan alamat sebagai alamat utama"
              checked={formValues.isMainAddress}
              onChange={(e) => {
                setField("isMainAddress", e.checked);
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex w-full items-center justify-center gap-3">
            <Button
              variant="muatparts-primary-secondary"
              onClick={onOpenChange}
              type="button"
            >
              Batalkan
            </Button>
            <Button
              variant="muatparts-primary"
              onClick={() => {}}
              type="button"
            >
              Simpan
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ModalFormSimpanLokasiWeb;
