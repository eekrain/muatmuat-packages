import { MapPin } from "lucide-react";

import Button from "@/components/Button/Button";
import Checkbox from "@/components/Form/Checkbox";
import Input from "@/components/Form/Input";
import { Select } from "@/components/Form/Select";
import { MyTextArea } from "@/components/Form/TextArea";
import { Modal, ModalContent } from "@/components/Modal/Modal";

import { normalizeUserSavedLocation } from "@/hooks/use-location/normalizer";
import { useLocationContext } from "@/hooks/use-location/use-location";
import { useShallowCompareEffect } from "@/hooks/use-shallow-effect";
import { useTranslation } from "@/hooks/use-translation";

import { useLocationFormStore } from "@/store/Shipper/forms/locationFormStore";

const errors = {};
export const ModalFormSimpanLokasiWeb = ({
  open,
  mode = "add",
  title = "Detail Alamat",
  onOpenChange,
  defaultValues,
}) => {
  const { t } = useTranslation();

  // Use translated title if default is used, otherwise use the passed title
  const translatedTitle =
    title === "Detail Alamat"
      ? t("ModalFormSimpanLokasiWeb.title", {}, "Detail Alamat")
      : title;
  const {
    formValues,
    formErrors,
    setField,
    validateSimpanLokasi,
    setLocationPartial,
    reset,
  } = useLocationFormStore();

  const { handleSaveLocation, handleUpdateLocation } = useLocationContext();

  useShallowCompareEffect(() => {
    if (mode === "edit" && defaultValues) {
      setLocationPartial(normalizeUserSavedLocation(defaultValues));
      setField("namaLokasi", defaultValues.Name);
      setField("detailLokasi", defaultValues.AddressDetail);
      setField("namaPIC", defaultValues.PicName);
      setField("noHPPIC", defaultValues.PicNoTelp);
      setField("isMainAddress", Boolean(defaultValues.IsMainAddress));
    }
  }, [defaultValues, mode]);

  const handleSave = () => {
    const isValid = validateSimpanLokasi();
    console.log(
      "🚀 ~ file: ModalFormSimpanLokasiWeb.jsx:45 ~ isValid:",
      isValid
    );
    if (!isValid) return;

    if (mode === "add") {
      handleSaveLocation(formValues).then((res) => {
        reset();
        onOpenChange();
      });
    } else if (mode === "edit") {
      handleUpdateLocation(formValues, defaultValues.ID).then((res) => {
        reset();
        onOpenChange();
      });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      withCloseButton
      closeOnOutsideClick={false}
    >
      <ModalContent type="muatmuat">
        <div className="relative grid h-[510px] w-[398px] grid-cols-1 gap-6 overflow-hidden p-6">
          <h2 className="text-base font-bold leading-[1] text-[#1B1B1B]">
            {translatedTitle}
          </h2>

          <div className="flex h-full flex-col gap-3 overflow-y-auto">
            {/* Label Alamat */}
            <div className="flex flex-col gap-0.5">
              <label className="text-xxs font-semibold leading-[12px] text-[#868686]">
                {t(
                  "ModalFormSimpanLokasiWeb.addressLabel",
                  {},
                  "Label Alamat*"
                )}
              </label>

              <Input
                placeholder={t(
                  "ModalFormSimpanLokasiWeb.addressLabelPlaceholder",
                  {},
                  "Masukkan label alamat"
                )}
                value={formValues.namaLokasi}
                onChange={(e) => {
                  setField("namaLokasi", e.currentTarget.value);
                }}
                errorMessage={formErrors.namaLokasi}
              />
            </div>

            {/* Lokasi */}
            <div className="flex flex-col gap-0.5">
              <label className="text-xxs font-semibold leading-[12px] text-[#868686]">
                {t("ModalFormSimpanLokasiWeb.locationLabel", {}, "Lokasi")}
              </label>
              <div className="flex h-[42px] w-full items-center gap-3 px-1.5">
                <div className="h-6 w-[19.2px] flex-shrink-0">
                  <MapPin className="h-full w-full fill-current text-[#FFC217]" />
                </div>
                <span className="line-clamp-3 flex-1 text-xs font-semibold leading-[14px] text-[#1B1B1B]">
                  {formValues.dataLokasi?.location?.name ||
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, quasi?"}
                </span>
              </div>
            </div>

            {/* Alamat */}
            <div className="flex flex-col gap-0.5">
              <label className="text-xxs font-semibold leading-[12px] text-[#868686]">
                {t("ModalFormSimpanLokasiWeb.addressDetailLabel", {}, "Alamat")}
              </label>

              <MyTextArea
                value={formValues.detailLokasi}
                onChange={(e) => setField("detailLokasi", e.target.value)}
                placeholder={t(
                  "ModalFormSimpanLokasiWeb.addressDetailPlaceholder",
                  {},
                  "Masukkan Detail Lokasi"
                )}
                maxLength={500}
                errorMessage={formErrors?.detailLokasi}
                appearance={{
                  inputClassName: "resize-none h-[80px]",
                }}
                withCharCount
              />
            </div>

            {/* Kecamatan */}
            <div className="flex flex-col gap-0.5">
              <label className="text-xxs font-semibold leading-[12px] text-[#868686]">
                {t("ModalFormSimpanLokasiWeb.districtLabel", {}, "Kecamatan")}
              </label>
              <span className="text-xs font-semibold leading-[14px] text-[#1B1B1B]">
                {formValues?.dataLokasi?.district?.name}
              </span>
            </div>

            {/* Kota */}
            <div className="flex flex-col gap-0.5">
              <label className="text-xxs font-semibold leading-[12px] text-[#868686]">
                {t("ModalFormSimpanLokasiWeb.cityLabel", {}, "Kota")}
              </label>
              <span className="text-xs font-semibold leading-[14px] text-[#1B1B1B]">
                {formValues?.dataLokasi?.city?.name}
              </span>
            </div>

            {/* Provinsi */}
            <div className="flex flex-col gap-0.5">
              <label className="text-xxs font-semibold leading-[12px] text-[#868686]">
                {t("ModalFormSimpanLokasiWeb.provinceLabel", {}, "Provinsi")}
              </label>
              <span className="text-xs font-semibold leading-[14px] text-[#1B1B1B]">
                {formValues?.dataLokasi?.province?.name}
              </span>
            </div>

            {/* Kode Pos */}
            <div className="flex flex-col gap-0.5">
              <label className="text-xxs font-semibold leading-[12px] text-[#868686]">
                {t("ModalFormSimpanLokasiWeb.postalCodeLabel", {}, "Kode Pos*")}
              </label>
              <Select
                placeholder={t(
                  "ModalFormSimpanLokasiWeb.postalCodePlaceholder",
                  {},
                  "Masukkan kode pos"
                )}
                options={
                  formValues?.dataLokasi?.postalCodeList &&
                  formValues?.dataLokasi?.postalCodeList.length > 0
                    ? formValues?.dataLokasi?.postalCodeList.map((item) => ({
                        label: item.name,
                        value: item.value,
                      }))
                    : []
                }
                value={formValues?.dataLokasi?.postalCode?.value}
                onChange={(selectedValue) => {
                  const postalCodeFound =
                    formValues?.dataLokasi?.postalCodeList.find(
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
              {errors.kodePos && (
                <span className="text-xxs text-red-500">{errors.kodePos}</span>
              )}
            </div>

            {/* Nama PIC */}
            <div className="flex flex-col gap-0.5">
              <label className="text-xxs font-semibold leading-[12px] text-[#868686]">
                {t("ModalFormSimpanLokasiWeb.picNameLabel", {}, "Nama PIC*")}
              </label>

              <Input
                placeholder={t(
                  "ModalFormSimpanLokasiWeb.picNamePlaceholder",
                  {},
                  "Masukkan nama PIC"
                )}
                value={formValues.namaPIC}
                onChange={(e) => {
                  setField("namaPIC", e.currentTarget.value);
                }}
                errorMessage={formErrors.namaPIC}
              />
            </div>

            {/* No. HP PIC */}
            <div className="flex flex-col gap-0.5">
              <label className="text-xxs font-semibold leading-[12px] text-[#868686]">
                {t("ModalFormSimpanLokasiWeb.picPhoneLabel", {}, "No. HP PIC*")}
              </label>
              <Input
                placeholder={t(
                  "ModalFormSimpanLokasiWeb.picPhonePlaceholder",
                  {},
                  "Masukkan no. HP PIC"
                )}
                value={formValues.noHPPIC}
                onChange={(e) => {
                  setField("noHPPIC", e.currentTarget.value);
                }}
                errorMessage={formErrors.noHPPIC}
              />
            </div>

            {/* Checkbox */}
            <Checkbox
              label={t(
                "ModalFormSimpanLokasiWeb.mainAddressLabel",
                {},
                "Jadikan alamat sebagai alamat utama"
              )}
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
              {t("ModalFormSimpanLokasiWeb.cancelButton", {}, "Batalkan")}
            </Button>
            <Button
              variant="muatparts-primary"
              onClick={handleSave}
              type="button"
            >
              {t("ModalFormSimpanLokasiWeb.saveButton", {}, "Simpan")}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};
